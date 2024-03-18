import os
import sys
import pathlib
import argparse
import json
import requests
import traceback
import csv
import time
import yfinance as yf
from urllib.parse import urlencode
from datetime import datetime, timedelta


afscreener_url = os.environ.get(
    "AF_URL", "")
afscreener_token = os.environ.get("AF_TOKEN", "")
DELAY_TIME_SEC = 1
RETRY_FAILED_DELAY = 20
RETRY_CNT = 3


def is_float(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


def send_request(url, headers):
    for r in range(RETRY_CNT):
        try:
            res = requests.get(url, headers=headers)
            res.raise_for_status()
        except Exception as ex:
            print('Generated an exception: {ex}'.format(ex=ex))

        if res.status_code == 200:
            return 0, res.text

        time.sleep(RETRY_FAILED_DELAY)

    return -2, "exceed retry cnt"


def send_post_json(url, req_data):
    for r in range(RETRY_CNT):
        try:
            headers = {'content-type': 'application/json'}
            res = requests.post(url, req_data, headers=headers)
            res.raise_for_status()
        except Exception as ex:
            print('Generated an exception: {ex}'.format(ex=ex))

        if res.status_code == 200:
            return 0, res.json()

        time.sleep(RETRY_FAILED_DELAY)

    return -2, {}


def get_stock_info():
    param = {
        'code': afscreener_token,
        'api': 'get-stock-info-from-db'
    }
    encoded_args = urlencode(param)
    query_url = afscreener_url + '?' + encoded_args

    for retry_i in range(RETRY_CNT):
        try:
            ret, content = send_request(query_url, {})
            if ret == 0:
                resp = json.loads(content)
                if resp["ret"] == 0:
                    return resp["data"]
                else:
                    print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
            else:
                print('send_request failed: {ret}'.format(ret=ret))

        except Exception:
            print('Generated an exception: {ex}, try next target.'.format(ex=traceback.format_exc()))

        time.sleep(DELAY_TIME_SEC)

    sys.exit(1)


"""
# marketwatch.com already add bot detection
def get_stock_1y_data_from_marketwatch(symbol):
    now = datetime.now()
    one_year_ago = now - timedelta(days=365)
    end_date = now.strftime("%m/%d/%Y") + "%20" + now.strftime("%H:%M:%S")
    start_date = one_year_ago.strftime("%m/%d/%Y") + "%20" + one_year_ago.strftime("%H:%M:%S")
    query_url = "https://www.marketwatch.com/investing/stock/" + symbol + "/downloaddatapartial?startdate=" + start_date + "&enddate=" + end_date + "&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false"

    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Referer': 'https://www.marketwatch.com/',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.8',
        }
        ret, content = send_request(query_url, headers)
        if ret == 0:
            # print(content)
            lines = content.splitlines()
            read_csv = csv.reader(lines)
            headers = next(read_csv)
            output = []
            for row in read_csv:
                d = {}
                for i in range(len(headers)):
                    v = row[i].replace(',', '')  # 2,134 -> 2134
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
"""

def get_stock_1y_data_from_yahoo(symbol):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1y")
        # convert to [{"Date":"03/05/2024","Open":143.0,"High":146.4,"Low":143.0,"Close":144.35,"Volume":2586730.0}...]
        output = []
        for index, row in hist.iterrows():
            d = {"Date": index.strftime("%m/%d/%Y"), "Open": row["Open"], "High": row["High"], "Low": row["Low"],
                 "Close": row["Close"], "Volume": row["Volume"]}
            output.append(d)

        return output
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))

    return None


def get_stock_base_info():
    print("call get_stock_base_info")
    try:
        param = {
            'code': afscreener_token,
            'api': 'get-stock-report'
        }
        encoded_args = urlencode(param)
        query_url = afscreener_url + '?' + encoded_args
        ret, resp = send_post_json(query_url, str(
            {"baseinfo_v": ["Market Cap", "ROE", "ROA", "ROI", "P/E", "P/C", "P/B", "P/S", "Dividend %", "52W Range", "52W High", "52W Low",
                            "Target Price", "Perf Week", "Perf Month", "Perf Quarter", "Perf Half Y", "Perf Year",
                            "Perf YTD", "Short Float", "Forward P/E", "Insider Trans", "PEG", "EPS this Y", "Inst Trans", "EPS next Y_%",
                            "Quick Ratio", "Gross Margin", "Current Ratio", "Oper. Margin", "Debt/Eq", "EPS Q/Q", "Profit Margin",
                            "LT Debt/Eq", "SMA20", "SMA50", "SMA200", "Sales Q/Q" 
                            ]}))
        if ret == 0:
            if resp["ret"] == 0:
                return resp["data"]
            else:
                print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
        else:
            print('send_post_json failed: {ret}'.format(ret=ret))

        sys.exit(1)

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))


def str2timestamp(d):
    return int(datetime.strptime(d, "%m/%d/%Y").timestamp())


def parse_stock_hl_pv(stock_data):
    print('do get_stock_hl_pv_db')
    # [{"Date":"10/15/2021","Open":153.14,"High":153.89,"Low":152.55,"Close":153.27,"Volume":1386930.0}, ...
    output = {"PH": 0, "PL": 0, "VH": 0}
    max_p = stock_data[0]["Close"]
    min_p = stock_data[0]["Close"]
    max_v = stock_data[0]["Volume"]
    for day_data in stock_data[1:]:
        if day_data["Close"] > max_p:
            max_p = day_data["Close"]
            output["PH"] = str2timestamp(day_data["Date"])
        if day_data["Close"] < min_p:
            min_p = day_data["Close"]
            output["PL"] = str2timestamp(day_data["Date"])
        if day_data["Volume"] > max_v:
            max_v = day_data["Volume"]
            output["VH"] = str2timestamp(day_data["Date"])

    return output


def update_stock_hl_pv_db(data):
    print("call update_stock_hl_pv_db")
    try:
        param = {
            'code': afscreener_token,
            'api': 'update-stock-high-low-price-volume'
        }
        encoded_args = urlencode(param)
        query_url = afscreener_url + '?' + encoded_args
        ret, resp = send_post_json(query_url, str({"data": data}))
        if ret == 0:
            print('update_stock_hl_pv_db done')
            return
        else:
            print('send_post_json failed: {ret}'.format(ret=ret))

        sys.exit(1)

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))


def main():
    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "-input-symbol-list", dest="input", default="")
    args = parser.parse_args()

    stock_folder_path = norn_data_folder_path / "stock"
    stock_historical_folder_path = stock_folder_path / "historical-quotes"
    if not os.path.exists(stock_historical_folder_path):
        os.makedirs(stock_historical_folder_path)

    # get stock info
    if args.input == "":
        stock_info = get_stock_info()
    else:
        stock_info = args.input.split(",")

    print(stock_info)

    # get stock 1y data
    stock_stat = {}
    stock_hl_pv = {}
    for symbol in stock_info:
        # stock_data = get_stock_1y_data_from_marketwatch(symbol)
        stock_data = get_stock_1y_data_from_yahoo(symbol)
        if stock_data and len(stock_data) > 0:
            stock_stat[symbol] = {"Close": stock_data[0]["Close"], "P/E": "-", "P/B": "-", "Dividend %": "-", "52W High": "-", "52W Low": "-",
                                  "Perf Week": "-", "Perf Month": "-", "Perf Quarter": "-", "Perf Half Y": "-", "Perf Year": "-", "Perf YTD": "-"}
            with open(stock_historical_folder_path / (symbol + '.json'), 'w', encoding='utf-8') as f:
                f.write(json.dumps(stock_data, separators=(',', ':')))

            stock_hl_pv[symbol] = parse_stock_hl_pv(stock_data)

            print('download stock ' + symbol + ' done')
        else:
            print('stock ' + symbol + ' is null')

        time.sleep(DELAY_TIME_SEC)

    update_stock_hl_pv_db(stock_hl_pv)

    # get stock base info
    base_info = get_stock_base_info()
    for info in base_info:
        symbol = info["symbol"]
        if symbol in stock_stat:
            for key in info:
                if key != "symbol":
                    stock_stat[symbol][key] = info[key]
    
    with open(stock_folder_path / 'stat.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(stock_stat, separators=(',', ':')))

    print('all task done')


if __name__ == "__main__":
    main()
