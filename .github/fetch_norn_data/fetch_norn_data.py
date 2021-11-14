import os
import sys
import base64
import pathlib
import json
import requests
import re
import numpy as np
from urllib.parse import urlencode
from datetime import datetime, timedelta
from scipy import stats


base_url = os.environ.get("MARKET_URL", "")
token = os.environ.get("MARKET_TOKEN", "")


def send_request(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.text


def get_config():

    try:
        param = {
            'code': token,
            'api': 'get-market-industry-config'
        }
        encoded_args = urlencode(param)
        query_url = base_url + '?' + encoded_args
        ret, content = send_request(query_url)
        if ret == 0:
            resp = json.loads(content)
            if resp["ret"] == 0:
                return resp["data"]
            else:
                print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
        else:
            print('send_request failed: {ret}'.format(ret=ret))

        sys.exit(1)

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))


def update_get_market(market_folder_path, config):

    for industry in config['markets']:
        try:
            print('update industry market: ' + industry)
            param = {
                'code': token,
                'api': 'update-get-market',
                'industry': industry
            }
            encoded_args = urlencode(param)
            query_url = base_url + '?' + encoded_args
            ret, content = send_request(query_url)
            if ret == 0:
                resp = json.loads(content)
                if resp["ret"] == 0:
                    data = resp["data"]
                    for item in data:
                        output = {'update_time': str(datetime.now()), 'symbol': item['symbol'],
                                  'src': item['src'], 'data': item['data']}

                        file_name = "_".join(re.findall("[a-zA-Z0-9]+", item['id']))
                        with open(market_folder_path / (file_name + '.json'), 'w', encoding='utf-8') as f:
                            f.write(json.dumps(output, separators=(',', ':')))

                else:
                    print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
            else:
                print('send_request failed: {ret}'.format(ret=ret))

        except Exception as ex:
            print('Generated an exception: {ex}'.format(ex=ex))

    print('update_get_market done')


def get_market_industry(norn_data_folder_path):

    param = {
        'code': token,
        'api': 'get-market-industry'
    }
    encoded_args = urlencode(param)
    query_url = base_url + '?' + encoded_args

    try:
        ret, content = send_request(query_url)
        if ret == 0:
            resp = json.loads(content)
            if resp["ret"] == 0:
                output = {'update_time': str(datetime.now()), 'data': resp["data"]}
                with open(norn_data_folder_path / 'indusrty-table.json', 'w',
                          encoding='utf-8') as f_it:
                    f_it.write(json.dumps(output, separators=(',', ':')))

            else:
                print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
                sys.exit(1)
        else:
            print('send_request failed: {ret}'.format(ret=ret))
            sys.exit(1)

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        sys.exit(1)

    print('get_market_industry done')


def over_date_interval(d1, d2, days):
    return datetime.strptime(d1, '%m/%d/%Y') - datetime.strptime(d2, '%m/%d/%Y') > timedelta(days=days)


def calc_market_correlation(norn_data_folder_path, market_folder_path):

    market_dict = {}
    table = []
    try:
        # get market dict
        with open(norn_data_folder_path / 'indusrty-table.json', 'r', encoding='utf-8') as f:
            industry_table = json.loads(f.read())

        for industry in industry_table['data']:
            for market in industry['Market']:
                market_dict[market["src"] + "_" + market["symbol"]] = {
                    'symbol': market["symbol"],
                    'src': market["src"],
                    'dataUrl': market["dataUrl"],
                    'correlations': {}
                }
        print(market_dict)

        for key in market_dict:
            for correlation_key in market_dict:
                print('calc {key} and {correlation_key} correlation'.format(key=key, correlation_key=correlation_key))
                with open(
                        market_folder_path /
                    ("_".join(re.findall(
                        "[a-zA-Z0-9]+", key)) + '.json'),
                        'r', encoding='utf-8') as f:
                    key_data = json.loads(f.read())
                with open(
                        market_folder_path /
                    ("_".join(re.findall(
                        "[a-zA-Z0-9]+", correlation_key)) + '.json'),
                        'r', encoding='utf-8') as f:
                    correlation_key_data = json.loads(f.read())

                key_data_is_monthly_intervals = over_date_interval(key_data["data"][0]["Date"],
                                                                   key_data["data"][1]["Date"], 15)
                key_data_val = {}
                for d in key_data["data"]:
                    v = d["Close"]
                    if type(v) is str and "%" in v:
                        v = v.replace("%", "")

                    if key_data_is_monthly_intervals:
                        date_offset = datetime.strptime(d["Date"], '%m/%d/%Y').strftime("%m/01/%Y")
                        key_data_val[date_offset] = v
                    else:
                        key_data_val[d["Date"]] = v

                correlation_key_data_is_monthly_intervals = over_date_interval(correlation_key_data["data"][0]["Date"],
                                                                   correlation_key_data["data"][1]["Date"], 15)
                correlation_key_data_val = {}
                for d in correlation_key_data["data"]:
                    v = d["Close"]
                    if type(v) is str and "%" in v:
                        v = v.replace("%", "")

                    if correlation_key_data_is_monthly_intervals:
                        date_offset = datetime.strptime(d["Date"], '%m/%d/%Y').strftime("%m/01/%Y")
                        correlation_key_data_val[date_offset] = v
                    else:
                        correlation_key_data_val[d["Date"]] = v

                intersection_key_data_val = {x: key_data_val[x] for x in key_data_val if x in correlation_key_data_val}
                intersection_correlation_key_data_val = {x: correlation_key_data_val[x] for x in intersection_key_data_val}

                data1 = np.array(list(intersection_key_data_val.values())).astype(np.float)
                data2 = np.array(list(intersection_correlation_key_data_val.values())).astype(np.float)

                if len(data1) > 2 and len(data2) > 2:
                    val, p_value = stats.pearsonr(data1, data2)
                    market_dict[key]['correlations'][market_dict[correlation_key]['symbol']] = {'value': val,
                                                                                                'p_value': p_value}
                else:
                    market_dict[key]['correlations'][market_dict[correlation_key]['symbol']] = {'value': 'NaN',
                                                                                                'p_value': 'NaN'}

            table.append(market_dict[key])

        output = {'update_time': str(datetime.now()), 'table': table}
        with open(norn_data_folder_path / 'market-correlation-matrix.json', 'w',
                  encoding='utf-8') as f_it:
            f_it.write(json.dumps(output, separators=(',', ':')))

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        sys.exit(1)

    print('calc_market_correlation done')


def main():

    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    market_folder_path = norn_data_folder_path / 'markets'
    if not os.path.exists(market_folder_path):
        os.makedirs(market_folder_path)

    config = get_config()
    update_get_market(market_folder_path, config)
    get_market_industry(norn_data_folder_path)
    calc_market_correlation(norn_data_folder_path, market_folder_path)
    print('all task done')


if __name__ == "__main__":
    main()
