import os
import sys
import pathlib
import json
import time
import re
from datetime import datetime
import requests
from urllib.parse import urlencode
from datetime import datetime, timedelta, date


base_url = os.environ.get(
    "MARKET_URL", "")
token = os.environ.get(
    "MARKET_TOKEN", "")

DELAY_TIME_SEC = 15
RETRY_THRESHOLD = 5


def send_request(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.text

def get_industry_table():

    param = {
        'code': token,
        'api': 'get-industry-table'
    }
    encoded_args = urlencode(param)
    query_url = base_url + '?' + encoded_args

    try:
        ret, content = send_request(query_url)
        if ret == 0:
            resp = json.loads(content)
            if resp["ret"] == 0:
                print('get-industry-table done')
                return resp["data"]
            else:
                print('server err = {err}, msg = {msg}'.format(
                    err=resp["ret"], msg=resp["err_msg"]))
                sys.exit(1)
        else:
            print('send_request failed: {ret}'.format(ret=ret))
            sys.exit(1)

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        sys.exit(1)

def get_insider_trading():

    param = {
        'code': token,
        'api': 'get-stock-insider-trading'
    }
    encoded_args = urlencode(param)
    query_url = base_url + '?' + encoded_args

    try:
        retry_cnt = 0
        while retry_cnt < RETRY_THRESHOLD:
            ret, content = send_request(query_url)
            if ret == 0:
                resp = json.loads(content)
                if resp["ret"] == 0:
                    print('get-stock-insider-trading done')
                    return resp["data"]
                else:
                    print('server err = {err}, msg = {msg}'.format(
                        err=resp["ret"], msg=resp["err_msg"]))
                    sys.exit(1)
            else:
                print('send_request failed: retry {retry_cnt}'.format(retry_cnt=retry_cnt))
                retry_cnt += 1
                time.sleep(DELAY_TIME_SEC)

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        sys.exit(1)


def calc_trade_summary(industry, trading_data):
    industry['Trade Week'] = 0
    industry['Trade Month'] = 0
    industry['Trade Quart'] = 0
    industry['Trade Half'] = 0
    industry['Trade Year'] = 0
    industry['Trade YTD'] = 0

    now = datetime.now()
    # [{'Date': '09/16/2021', 'Transaction': -1, 'Value': 688917, 'symbol': 'AJG'}, ...]
    total_value = 0.0
    for trade in trading_data:
        trade_date = datetime.strptime(trade['Date'], '%m/%d/%Y')
        value = trade['Value']
        total_value += value
        transaction = trade['Transaction'] # 1: buy, -1: sell, 0: others (e.g. Option Exercise)

        if trade_date >= now - timedelta(days=7):
            industry['Trade Week'] += transaction * value
        if trade_date >= now - timedelta(days=30):
            industry['Trade Month'] += transaction * value
        if trade_date >= now - timedelta(days=91):
            industry['Trade Quart'] += transaction * value
        if trade_date >= now - timedelta(days=182):
            industry['Trade Half'] += transaction * value
        if trade_date >= now - timedelta(days=365):
            industry['Trade Year'] += transaction * value
        if trade_date >= datetime.strptime('01/01/' + str(now.year), '%m/%d/%Y'):
            industry['Trade YTD'] += transaction * value

    # get ratio
    if total_value != 0:
        industry['Trade Week'] /= total_value
        industry['Trade Month'] /= total_value
        industry['Trade Quart'] /= total_value
        industry['Trade Half'] /= total_value
        industry['Trade Year'] /= total_value
        industry['Trade YTD'] /= total_value
        

def get_insiders_summary(insiders_path, insiders_data_path):

    # get industry table
    industry_table = get_industry_table()
    if len(industry_table) == 0:
        print('get industry_table failed')
        sys.exit(1)

    # make industry_trading_list
    insider_trading = get_insider_trading()
    if len(insider_trading) == 0:
        print('get insider_trading failed')
        sys.exit(1)

    industry_trading_dict = {}
    for stock in insider_trading:
        industry = stock['Industry']
        symbol = stock['symbol']
        if industry not in industry_trading_dict:
            industry_trading_dict[industry] = []

        for trade in stock['insider_trans_list']:
            trade['symbol'] = symbol
            industry_trading_dict[industry].append(trade)

    # sort data by date and save
    for key in industry_trading_dict:
        industry_trading_dict[key] = sorted(industry_trading_dict[key],
                                            key=lambda x: time.strptime(x['Date'], "%m/%d/%Y"), reverse=True)

        file_name = "-".join(re.findall("[a-zA-Z]+", key))
        with open(insiders_data_path / (file_name + '.json'), 'w', encoding='utf-8') as f:
            f.write(json.dumps(industry_trading_dict[key], separators=(',', ':')))
        print('sort and save {} done'.format(key))


    # make industry_summary
    industry_summary_output = {'update_time': str(datetime.now()), 'data': []}

    for industry in industry_table:
        industry_name = industry['Industry']
        if industry_name in industry_trading_dict:
            calc_trade_summary(industry, industry_trading_dict[industry_name])
        else:
            industry['Trade Week'] = '-'
            industry['Trade Month'] = '-'
            industry['Trade Quart'] = '-'
            industry['Trade Half'] = '-'
            industry['Trade Year'] = '-'
            industry['Trade YTD'] = '-'

        industry_summary_output['data'].append(industry)

    with open(insiders_path / 'stat.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(industry_summary_output, separators=(',', ':')))

    print('get_insiders_summary done')


def main():

    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    insiders_path = norn_data_folder_path / 'insiders'
    insiders_data_path = insiders_path / "data"
    if not os.path.exists(insiders_data_path):
        os.makedirs(insiders_data_path)

    get_insiders_summary(insiders_path, insiders_data_path)
    print('all task done')


if __name__ == "__main__":
    main()
