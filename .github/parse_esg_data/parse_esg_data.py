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


def calc_avg_esg(esg_data):
    o_temp = {"latest": "-", "avg-1yr": "-", "avg-3yr": "-", "avg-5yr": "-"}
    if len(esg_data['timestamp']) == 0:
        return o_temp
    o_temp["latest"] = round(esg_data['esgScore'][len(esg_data['esgScore']) - 1], 2)
    now = datetime.now()
    avg_1yr_sum = []
    avg_3yr_sum = []
    avg_5yr_sum = []
    for t_index in range(len(esg_data['timestamp'])):
        pos = datetime.fromtimestamp(esg_data['timestamp'][t_index])
        if esg_data['esgScore'][t_index]:
            if pos > now - timedelta(days=365):
                avg_1yr_sum.append(esg_data['esgScore'][t_index])
            if pos > now - timedelta(days=365 * 3):
                avg_3yr_sum.append(esg_data['esgScore'][t_index])
            if pos > now - timedelta(days=365 * 5):
                avg_5yr_sum.append(esg_data['esgScore'][t_index])

    if len(avg_1yr_sum) > 0:
        o_temp["avg-1yr"] = round(sum(avg_1yr_sum) / len(avg_1yr_sum), 2)
    if len(avg_3yr_sum) > 0:
        o_temp["avg-3yr"] = round(sum(avg_3yr_sum) / len(avg_3yr_sum), 2)
    if len(avg_5yr_sum) > 0:
        o_temp["avg-5yr"] = round(sum(avg_5yr_sum) / len(avg_5yr_sum), 2)
    return o_temp


def main():

    logging.basicConfig(level="INFO")

    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    esg_path = norn_data_folder_path / 'esg'
    esg_chart_path = esg_path / 'data' / 'esgChart'

    # get all esg chart data
    esg_chart_files = os.listdir(esg_chart_path)
    esg_chart_files = [f for f in esg_chart_files if f.endswith('.json')]
    esg_chart_files.sort()
    data = []
    for file in esg_chart_files:
        with open(esg_chart_path / file, 'r') as f:
            s = json.load(f)
            s["symbol"] = file.split('.')[0]
            data.append(s)

    output = {'update_time': str(datetime.now()), 'data': []}
    for d in data:
        # logging.info(f"{d['symbol']}: ({len(d['data']['esgChart']['result'])}){d['data']['esgChart']['result']}")
        symbol = d['symbol']
        d2 = d['data']['esgChart']['result'][0]  # len(d['data']['esgChart']['result']) always 1
        if 'symbolSeries' not in d2 or 'peerSeries' not in d2:
            logging.info(f"{symbol} symbolSeries or peerSeries not exist")
            continue
        # len(d2['symbolSeries']['timestamp']) not always == len(d2['peerSeries']['timestamp']
        # logging.info(f"{symbol} symbolSeries len: {len(d2['symbolSeries']['timestamp'])} | peerSeries len: {len(d2['peerSeries']['timestamp'])}")
        """
        if len(d2['symbolSeries']['timestamp']) == len(d2['peerSeries']['timestamp']):
            for t in d2['symbolSeries']['timestamp']:
                logging.info(f"{symbol} {datetime.fromtimestamp(t)}")
        """

        # latest esg, avg 1yr esg, avg 3yr esg, avg 5yr esg, latest ratio, avg 1yr ratio, avg 3yr ratio, avg 5yr ratio
        o = {"symbol": symbol, "peerGroup": d2['peerGroup'], "esg-latest": "-", "esg-avg-1yr": "-", "esg-avg-3yr": "-", "esg-avg-5yr": "-",
             "esg-peer-latest": "-", "esg-peer-avg-1yr": "-", "esg-peer-avg-3yr": "-", "esg-peer-avg-5yr": "-",
             "ratio-latest": "-", "ratio-avg-1yr": "-", "ratio-avg-3yr": "-", "ratio-avg-5yr": "-"}

        outputs = [calc_avg_esg(d2['symbolSeries']), calc_avg_esg(d2['peerSeries'])]
        key_pattern = ["esg", "esg-peer"]
        time_pattern = ["latest", "avg-1yr", "avg-3yr", "avg-5yr"]
        for k in range(len(key_pattern)):
            for t in range(len(time_pattern)):
                o[key_pattern[k] + "-" + time_pattern[t]] = outputs[k][time_pattern[t]]

        for t in range(len(time_pattern)):
            if o["esg-" + time_pattern[t]] != "-" and o["esg-peer-" + time_pattern[t]] != "-":
                o["ratio-" + time_pattern[t]] = round(o["esg-" + time_pattern[t]] / o["esg-peer-" + time_pattern[t]], 2)

        logging.info(f"{o}")
        output['data'].append(o)

    with open(esg_path / 'stat.json', 'w') as f:
        f.write(json.dumps(output, separators=(',', ':')))

    logging.info('all task done')


if __name__ == "__main__":
    main()
