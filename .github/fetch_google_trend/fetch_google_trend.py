import os
import sys
import base64
import pathlib
import json
import requests
import csv
import threading
import queue
import time
from urllib.parse import urlencode
from datetime import datetime, timedelta


google_trend_api_list = os.environ.get("GOOGLE_TREND_API_LIST", "")
afscreener_url = os.environ.get("AF_URL", "")
afscreener_token = os.environ.get("AF_TOKEN", "")
DELAY_TIME_SEC = 10
RETRY_THRESHOLD = 5

class GoogleAPIThread(threading.Thread):

    def __init__(self, id, api, output_folder_path, task_queue):
        threading.Thread.__init__(self)
        self.id = id
        self.api = api
        self.output_folder_path = output_folder_path
        self.task_queue = task_queue
        self.statistics_output = []

    def run(self):
        print("Thread", self.id, "start")
        while self.task_queue.qsize() > 0:
            try:
                data = self.task_queue.get()
                symbol = data["symbol"]
                print("Get", symbol, "start")

                api_param_list = {"week": "now 7-d", "month": "today 1-m", "quarter": "today 3-m", "year": "today 12-m"}
                raw = {"symbol": symbol, "keyword": "", "update_time": "", "week": [], "month": [], "quarter": [], "year": []}
                statistics = {
                    "symbol": symbol,
                    "keyword": "",
                    "week-3": 0, "week-avg": 0,
                    "month-3": 0, "month-7": 0, "month-14": 0, "month-avg": 0,
                    "quarter-7": 0, "quarter-14": 0, "quarter-21": 0, "quarter-avg": 0,
                    "year-14": 0, "year-21": 0, "year-avg": 0,
                }

                suggest_keyword = data["company"]
                for key in api_param_list:
                    resp = None
                    retry = 0
                    while True:
                        resp = self.__get_google_trend_data(data["company"], api_param_list[key])
                        if resp or retry >= RETRY_THRESHOLD:
                            break
                        print("call __get_google_trend_data for", data["company"], api_param_list[key], "failed, retry=", retry)
                        retry += 1
                        time.sleep(DELAY_TIME_SEC)

                    if resp:
                        # print(resp)
                        suggest_keyword = resp["keyword"]
                        record, stat = self.__parse_data(resp["data"])
                        if len(record) == 0:
                            print("Get", symbol, "for", key, "failed, use default data")

                        raw[key] = record
                        if key == "week":
                            statistics[key + "-3"] = stat["last_3_days_max"]
                        elif key == "month":
                            statistics[key + "-3"] = stat["last_3_days_max"]
                            statistics[key + "-7"] = stat["last_7_days_max"]
                            statistics[key + "-14"] = stat["last_14_days_max"]
                        elif key == "quarter":
                            statistics[key + "-7"] = stat["last_7_days_max"]
                            statistics[key + "-14"] = stat["last_14_days_max"]
                            statistics[key + "-21"] = stat["last_21_days_max"]
                        elif key == "year":
                            statistics[key + "-14"] = stat["last_14_days_max"]
                            statistics[key + "-21"] = stat["last_21_days_max"]
                        statistics[key + "-avg"] = stat["avg"]
                    else:
                        print("Get", symbol, "failed")

                raw["keyword"] = statistics["keyword"] = suggest_keyword
                raw["update_time"] = str(datetime.now())
                # print(raw)
                # print(statistics)
                self.statistics_output.append(statistics)
                with open(self.output_folder_path / (symbol + '.json'), 'w', encoding='utf-8') as f:
                    f.write(json.dumps(raw, separators=(',', ':')))

                print("Get", data["symbol"], "end, remain:", self.task_queue.qsize())
                time.sleep(DELAY_TIME_SEC)

            except Exception as ex:
                print('Generated an exception: {ex}'.format(ex=ex))

        print("Thread", self.id, "end")

    def __parse_data(self, data):
        record = []
        statistics = {"last_3_days_max": 0, "last_7_days_max": 0, "last_14_days_max": 0, "last_21_days_max": 0, "avg": 0}

        if len(data["index"]) == 0:
            return record, statistics

        now = datetime.now()

        # default use latest data
        statistics["last_3_days_max"] = statistics["last_7_days_max"] = statistics["last_14_days_max"] = statistics["last_21_days_max"] = data["data"][len(data["index"])-1][0]

        total = 0
        for index in range(len(data["index"])):
            ts_d = datetime.fromtimestamp(data["index"][index] / 1000)
            date = ts_d.strftime("%m/%d/%Y %H:%M:%S")
            value = data["data"][index][0]
            total = total + value
            record.append({"Date": date, "Value": value})

            if ts_d > now - timedelta(days=3):
                statistics["last_3_days_max"] = max(value, statistics["last_3_days_max"])
            if ts_d > now - timedelta(days=7):
                statistics["last_7_days_max"] = max(value, statistics["last_7_days_max"])
            if ts_d > now - timedelta(days=14):
                statistics["last_14_days_max"] = max(value, statistics["last_14_days_max"])
            if ts_d > now - timedelta(days=21):
                statistics["last_21_days_max"] = max(value, statistics["last_21_days_max"])

        statistics["avg"] = total / len(data["index"])

        record.reverse()
        # print(record)
        # print(statistics)
        return record, statistics

    def __get_google_trend_data(self, keyword, timeframe):
        try:
            post_body = json.dumps({"keyword": keyword, "timeframe": timeframe})
            ret, resp = send_post_json(self.api + '&api=interest-over-time-with-suggestion', post_body)
            if ret == 0:
                return resp
            else:
                print('send_post_json failed: {ret}'.format(ret=ret))

        except Exception as ex:
            print('Generated an exception: {ex}'.format(ex=ex))

        return None


def send_request(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.text


def send_post_json(url, req_data):
    try:
        headers = {'content-type': 'application/json'}
        res = requests.post(url, req_data, headers=headers)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.json()


def get_stock_info():

    try:
        param = {
            'code': afscreener_token,
            'api': 'get-stock-info-from-db'
        }
        encoded_args = urlencode(param)
        query_url = afscreener_url + '?' + encoded_args
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


def main():
    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    google_trend_folder_path = norn_data_folder_path / "google-trend"
    google_trend_data_folder_path = google_trend_folder_path / "data"
    if not os.path.exists(google_trend_data_folder_path):
        os.makedirs(google_trend_data_folder_path)

    # stock_info = {"A": ["Agilent Technologies, Inc.", "Diagnostics & Research"], "AA":[ "Alcoa Corporation", "Aluminum" ]}
    stock_info = get_stock_info()

    task_queue = queue.Queue()
    for symbol in stock_info:
        data = {"symbol": symbol, "company": stock_info[symbol][0], "industry": stock_info[symbol][1]}
        task_queue.put(data)

    # print(list(task_queue.queue))
    api_list = google_trend_api_list.split('\n')

    work_list = []
    for index in range(len(api_list)):
        work_list.append(GoogleAPIThread(index, api_list[index], google_trend_data_folder_path, task_queue))
        work_list[index].start()

    for worker in work_list:
        worker.join()

    # save statistics_output
    final_statistics_output = []
    for worker in work_list:
        for stat in worker.statistics_output:
            final_statistics_output.append(stat)

    with open(google_trend_folder_path / 'stat.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(final_statistics_output, separators=(',', ':')))

    print('all task done')


if __name__ == "__main__":
    main()
