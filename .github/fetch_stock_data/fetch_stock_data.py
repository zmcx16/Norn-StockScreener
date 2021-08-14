import os
import sys
import pathlib
import json
import requests
import csv
import time
from urllib.parse import urlencode
from datetime import datetime, timedelta


afscreener_url = os.environ.get("AF_URL", "")
afscreener_token = os.environ.get("AF_TOKEN", "")
DELAY_TIME_SEC = 1

def is_float(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


def send_request(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.text


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


def get_stock_1y_data_from_marketwatch(symbol):
    now = datetime.now()
    one_year_ago = now - timedelta(days=365)
    end_date = now.strftime("%m/%d/%Y") + "%20" + now.strftime("%H:%M:%S")
    start_date = one_year_ago.strftime("%m/%d/%Y") + "%20" + one_year_ago.strftime("%H:%M:%S")
    query_url = "https://www.marketwatch.com/investing/stock/" + symbol + "/downloaddatapartial?startdate=" + start_date + "&enddate=" + end_date + "&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false"

    try:
        ret, content = send_request(query_url)
        if ret == 0:
            # print(content)
            lines = content.splitlines()
            read_csv = csv.reader(lines)
            headers = next(read_csv)
            output = []
            for row in read_csv:
                d = {}
                for i in range(len(headers)):
                    v = row[i].replace(',', '') # 2,134 -> 2134
                    if is_float(v):
                        v = float(v)
                    d[headers[i]] = v
                output.append(d)

            return output
        else:
            print('send_request failed: {ret}'.format(ret=ret))

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))

    return None


def main():
    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    stock_folder_path = norn_data_folder_path / "stock" / "historical-quotes"
    if not os.path.exists(stock_folder_path):
        os.makedirs(stock_folder_path)

    stock_info = get_stock_info()
    print(stock_info)
    for symbol in stock_info:
        stock_data = get_stock_1y_data_from_marketwatch(symbol)
        if stock_data:
            with open(stock_folder_path / (symbol + '.json'), 'w', encoding='utf-8') as f:
                f.write(json.dumps(stock_data, separators=(',', ':')))
            print('download stock ' + symbol + ' done')
        else:
            print('stock ' + symbol + ' is null')

        time.sleep(DELAY_TIME_SEC)

    print('all task done')


if __name__ == "__main__":
    main()
