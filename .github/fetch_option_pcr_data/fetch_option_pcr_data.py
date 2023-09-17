import os
import sys
import pathlib
import logging
import json
import time
import re
from datetime import datetime
import requests
from urllib.parse import urlencode
from datetime import datetime, timedelta, date


RETRY_CNT = 5
RETRY_FAILED_DELAY = 20


def send_request(url):
    for r in range(RETRY_CNT):
        try:
            res = requests.get(url)
            res.raise_for_status()
        except Exception as ex:
            logging.error('Generated an exception: {ex}'.format(ex=ex))

        if res.status_code == 200:
            return 0, res.text

        time.sleep(RETRY_FAILED_DELAY)

    return -2, "exceed retry cnt"


def calc_summary(all_data):
    latest_date =  datetime.strptime(all_data[0]['update_time'], '%Y-%m-%d')
    latest_pcr = {
        'PCR_OpenInterest': all_data[0]['data']['PCR_OpenInterest'],
        'PCR_Volume': all_data[0]['data']['PCR_Volume']
    }
    output = {
        'PCR_OpenInterest_Latest': latest_pcr['PCR_OpenInterest'],
        'PCR_Volume_Latest': latest_pcr['PCR_Volume'],
        'PCR_OpenInterest_Week': 0,
        'PCR_Volume_Week': 0,
        'PCR_OpenInterest_Month': 0,
        'PCR_Volume_Month': 0
    }

    for i in range(1, len(all_data)):
        data = all_data[i]
        cur_date = datetime.strptime(data['update_time'], '%Y-%m-%d')
        cur_pcr = {
            'PCR_OpenInterest': data['data']['PCR_OpenInterest'],
            'PCR_Volume': data['data']['PCR_Volume']
        }

        def calc(key):
            if cur_date >= latest_date - timedelta(days=7) and cur_pcr[key] != 0:
                output[key + '_Week'] = (latest_pcr[key] - cur_pcr[key]) * 1.0 / cur_pcr[key]
            if cur_date >= latest_date - timedelta(days=30) and cur_pcr[key] != 0:
                output[key + '_Month'] = (latest_pcr[key] - cur_pcr[key]) * 1.0 / cur_pcr[key]

        calc('PCR_OpenInterest')
        calc('PCR_Volume')

    return output


def main():
    logging.basicConfig(level="INFO")

    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    options_path = norn_data_folder_path / 'options'
    pcr_path = options_path / 'pcr'
    pcr_historical_day_path = pcr_path / 'historical-by-day'
    pcr_historical_symbol_path = pcr_path / 'historical-by-symbol'

    if not os.path.exists(pcr_historical_day_path):
        os.makedirs(pcr_historical_day_path)
    if not os.path.exists(pcr_historical_symbol_path):
        os.makedirs(pcr_historical_symbol_path)

    # get pcr data
    pcr_data = {}
    pcr_data_url = 'https://raw.githubusercontent.com/zmcx16/Norn-Finance-API-Server/data/data-output/put-call-ratio.json'
    ret, content = send_request(pcr_data_url)
    if ret == 0:
        pcr_data = json.loads(content)
    else:
        logging.error('send_request failed: {ret}'.format(ret=ret))
        sys.exit(1)

    # adjust data by day
    if os.path.exists(pcr_historical_day_path / 'latest.json'):
        with open(pcr_historical_day_path / 'latest.json', 'r', encoding='utf-8') as f:
            pcr_data_old = json.loads(f.read())
            # new_file_name = datetime.now().strftime('%Y-%m-%d') + '.json'
            new_file_name = pcr_data_old['update_time'].split(' ')[0] + '.json'
            with open(pcr_historical_day_path / new_file_name, 'w', encoding='utf-8') as f:
                f.write(json.dumps(pcr_data_old, separators=(',', ':')))

    # save latest data
    with open(pcr_historical_day_path / 'latest.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(pcr_data, separators=(',', ':')))

    # read all data by day
    all_pcr_data = {}
    file_list = os.listdir(pcr_historical_day_path)
    for file_name in file_list:
        with open(pcr_historical_day_path / file_name, 'r', encoding='utf-8') as f:
            pcr_data = json.loads(f.read())
            update_time_yyyymmdd = pcr_data['update_time'].split(' ')[0]
            if update_time_yyyymmdd not in all_pcr_data or 'latest.json' in file_name:
                all_pcr_data[update_time_yyyymmdd] = pcr_data
                all_pcr_data[update_time_yyyymmdd]['update_time'] = update_time_yyyymmdd

    # sort by update_time and output  array of values
    all_pcr_data = sorted(all_pcr_data.values(), key=lambda x: x['update_time'], reverse=True)
    logging.info('all_pcr_data: {all_pcr_data}'.format(all_pcr_data=all_pcr_data))
    data_by_symbol = {}
    for data in all_pcr_data:
        update_time = data['update_time']
        for symbol in data['data']:
            if symbol not in data_by_symbol:
                data_by_symbol[symbol] = []
            data_by_symbol[symbol].append({
                'update_time': update_time,
                'data': data['data'][symbol]
            })

    # save data by symbol
    for symbol in data_by_symbol:
        with open(pcr_historical_symbol_path / (symbol + '.json'), 'w', encoding='utf-8') as f:
            f.write(json.dumps(data_by_symbol[symbol], separators=(',', ':')))

    stat_output = {"update_time": all_pcr_data[0]['update_time'], "data": {}}
    for symbol in data_by_symbol:
        stat_output['data'][symbol] = calc_summary(data_by_symbol[symbol])

    logging.info('stat_output: {stat_output}'.format(stat_output=stat_output))

    # save stat data
    with open(pcr_path / 'stat.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(stat_output, separators=(',', ':')))

    logging.info('all task done')


if __name__ == "__main__":
    main()
