import os
import sys
import pathlib
import time
import json
import requests
import re
import pprint
import numpy as np
from functools import cmp_to_key
from urllib.parse import urlencode
from datetime import datetime, timedelta
from scipy import stats


market_url = os.environ.get("MARKET_URL", "")
market_token = os.environ.get("MARKET_TOKEN", "")
afscreener_url = os.environ.get("AF_URL", "")
afscreener_token = os.environ.get("AF_TOKEN", "")
RETRY_SEND_REQUEST = 3
RETRY_FAILED_DELAY = 20


def send_request(url):
    for r in range(RETRY_SEND_REQUEST):
        try:
            res = requests.get(url)
            res.raise_for_status()
        except Exception as ex:
            print('Generated an exception: {ex}'.format(ex=ex))

        if res.status_code == 200:
            return 0, res.text
        
        time.sleep(RETRY_FAILED_DELAY)

    return -2, "exceed retry cnt"


def get_config():

    try:
        param = {
            'code': market_token,
            'api': 'get-market-industry-config'
        }
        encoded_args = urlencode(param)
        query_url = market_url + '?' + encoded_args
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
                'code': market_token,
                'api': 'update-get-market',
                'industry': industry
            }
            encoded_args = urlencode(param)
            query_url = market_url + '?' + encoded_args
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
        'code': market_token,
        'api': 'get-market-industry'
    }
    encoded_args = urlencode(param)
    query_url = market_url + '?' + encoded_args

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

                data1 = np.array(list(intersection_key_data_val.values())).astype(np.float64)
                data2 = np.array(list(intersection_correlation_key_data_val.values())).astype(np.float64)

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


def get_stock_info():
    try:
        # get stock info
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
                sys.exit(1)
        else:
            print('send_request failed: {ret}'.format(ret=ret))
            sys.exit(1)

    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        sys.exit(1)


def get_esg_data(ranking_folder_path, stock_info):
    try:
        # get esg data
        param = {
            'code': afscreener_token,
            'api': 'get-esg-data'
        }
        encoded_args = urlencode(param)
        query_url = afscreener_url + '?' + encoded_args

        ret, content = send_request(query_url)
        if ret == 0:
            resp = json.loads(content)
            if resp["ret"] == 0:
                output = {'update_time': str(datetime.now()), 'data': []}
                dt = []
                for k in resp["data"]:
                    if resp["data"][k]["totalEsg"] != "-":
                        o = resp["data"][k]
                        o["symbol"] = k
                        dt.append(o)

                dt = sorted(dt, key=lambda d: d['totalEsg'])
                for i in range(len(dt)):
                    symbol = dt[i]["symbol"]
                    esg_data = {
                        "name": symbol,
                        "symbol": symbol,
                        "rank": i+1,
                        "rank_color": '',
                        "extra_info": "",
                        "link": f"https://finance.yahoo.com/quote/{symbol}/sustainability",
                    }
                    if symbol in stock_info:
                        esg_data["name"] = stock_info[symbol][0]

                    esg_data['totalEsg'] = dt[i]['totalEsg']
                    if dt[i]['totalEsg'] < 10:
                        esg_data['rank_color'] = "#00e676"
                    elif dt[i]['totalEsg'] < 20:
                        esg_data['rank_color'] = "#29b6f6"
                    elif dt[i]['totalEsg'] < 30:
                        esg_data['rank_color'] = "#ffca28"
                    else:
                        esg_data['rank_color'] = "#f44336"

                    esg_data["extra_info"] = f"Total ESG: {dt[i]['totalEsg']}\n" \
                                             f"Environment: {dt[i]['environmentScore']}\n" \
                                             f"Social: {dt[i]['socialScore']}\n" \
                                             f"Governance: {dt[i]['governanceScore']}\n" \
                                             f"Percentile: {dt[i]['percentile']}"

                    output["data"].append(esg_data)

                with open(ranking_folder_path / 'esg.json', 'w',
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

    print('get_esg_data done')


def get_recommendation_data(ranking_folder_path, stock_info):
    try:
        # get recommendation data
        param = {
            'code': afscreener_token,
            'api': 'get-recommendation-data'
        }
        encoded_args = urlencode(param)
        query_url = afscreener_url + '?' + encoded_args

        ret, content = send_request(query_url)
        if ret == 0:
            resp = json.loads(content)
            if resp["ret"] == 0:
                output = {'update_time': str(datetime.now()), 'data': []}
                dt = []
                for k in resp["data"]:
                    if resp["data"][k]["recommendationMean"] != "-":
                        o = resp["data"][k]
                        o["symbol"] = k
                        dt.append(o)

                dt = sorted(dt, key=lambda d: d['recommendationMean'])
                for i in range(len(dt)):
                    symbol = dt[i]["symbol"]
                    recomm_data = {
                        "name": symbol,
                        "symbol": symbol,
                        "rank": i+1,
                        "rank_color": '',
                        "extra_info": "",
                        "link": f"https://finance.yahoo.com/quote/{symbol}/analysis",
                    }
                    if symbol in stock_info:
                        recomm_data["name"] = stock_info[symbol][0]

                    recomm_data["recommendationMean"] = dt[i]['recommendationMean']
                    if dt[i]['recommendationMean'] <= 1.5:
                        recomm_data['rank_color'] = "#00e676"
                    elif dt[i]['recommendationMean'] <= 2.5:
                        recomm_data['rank_color'] = "#29b6f6"
                    elif dt[i]['recommendationMean'] <= 3.5:
                        recomm_data['rank_color'] = "#ffca28"
                    else:
                        recomm_data['rank_color'] = "#f44336"

                    if 'recommendationKey' in dt[i]:
                        recomm_data["extra_info"] = f"{dt[i]['recommendationMean']} ({dt[i]['recommendationKey']})"

                    output["data"].append(recomm_data)

                with open(ranking_folder_path / 'recommendation.json', 'w',
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

    print('get_recommendation_data done')


def get_eps_q_data(ranking_folder_path, stock_info, eps_config):
    try:
        # get eps q data
        param = {
            'code': afscreener_token,
            'api': eps_config['api']
        }
        encoded_args = urlencode(param)
        query_url = afscreener_url + '?' + encoded_args

        ret, content = send_request(query_url)
        if ret == 0:
            resp = json.loads(content)
            if resp["ret"] == 0:
                output = {'update_time': str(datetime.now()), 'data': []}
                dt = []
                for k in resp["data"]:
                    eps_type = eps_config['type']
                    if (eps_type == 0 and len(resp["data"][k]) > 0) or (eps_type == 1 and len(resp["data"][k]["quarterly"]) > 0):
                        o = {'eps': resp["data"][k], 'symbol': k, 'neg_count': 0, 'latest_growth': 0, 'avg_growth': 0,
                             'tags': []}
                        neg_count = 0
                        keep_growth = True
                        eps_list = []
                        if eps_type == 0:
                            eps_list = list(o["eps"].values())
                        else:
                            for q in o["eps"]["quarterly"].values():
                                if q["actual"] != "-":
                                    eps_list.append(q["actual"])

                        for i in range(len(eps_list)):
                            if eps_list[i] <= 0:
                                neg_count += 1
                            if i >= 1 and eps_list[i-1] <= eps_list[i]:
                                keep_growth = False

                            if i == 0 and len(eps_list) > 1:
                                if eps_list[i+1] != 0:
                                    o["latest_growth"] = (eps_list[i] - eps_list[i+1]) / abs(eps_list[i+1])
                                avg = 0
                                for j in range(len(eps_list)-1):
                                    if eps_list[j+1] == 0:
                                        avg = 0
                                        break
                                    avg += (eps_list[j] - eps_list[j+1]) / abs(eps_list[j+1])
                                avg /= len(eps_list) - 1

                        # tag
                        if neg_count == 0:
                            o["tags"].append("all_positive")
                        if keep_growth and len(eps_list) >= 2:
                            o["tags"].append("keep_growth")

                        o["neg_count"] = neg_count
                        o["avg_growth"] = avg
                        dt.append(o)

                dt = sorted(dt, key=lambda d: d['latest_growth'], reverse=True)
                for i in range(len(dt)):
                    symbol = dt[i]["symbol"]
                    eps_data = {
                        "name": symbol,
                        "symbol": symbol,
                        "rank": i+1,
                        "rank_color": '',
                        "tags": dt[i]["tags"],
                        "extra_info": "",
                        "link": eps_config['link'].replace("{symbol}", symbol)
                    }
                    if symbol in stock_info:
                        eps_data["name"] = stock_info[symbol][0]

                    if dt[i]['neg_count'] == 0:
                        eps_data['rank_color'] = "#00e676"
                    elif dt[i]['neg_count'] == 1:
                        eps_data['rank_color'] = "#29b6f6"
                    elif dt[i]['neg_count'] == 2:
                        eps_data['rank_color'] = "#ffca28"
                    else:
                        eps_data['rank_color'] = "#f44336"

                    eps_data["extra_info"] = \
                        f"Latest Growth: {dt[i]['latest_growth']:.2%}\n" \
                        f"Avg Growth: {dt[i]['avg_growth']:.2%}\n "

                    if eps_type == 0:
                        eps_data["extra_info"] += str(dt[i]['eps']).replace(',', '\n').replace('{', '').replace('}', '').replace("'", '').rstrip()
                    else:
                        eps_data["extra_info"] += \
                            json.dumps(dt[i]['eps']['quarterly'], indent=2).replace(',', '').replace('{', '').replace('}', '').replace('"', '').rstrip()

                    output["data"].append(eps_data)

                with open(ranking_folder_path /  eps_config['output_name'], 'w',
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

    print('get_eps_q_data done')


def main():

    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    market_folder_path = norn_data_folder_path / 'markets'
    if not os.path.exists(market_folder_path):
        os.makedirs(market_folder_path)
    
    ranking_folder_path = norn_data_folder_path / 'ranking'
    if not os.path.exists(ranking_folder_path):
        os.makedirs(ranking_folder_path)

    config = get_config()
    stock_info = get_stock_info()
    get_esg_data(ranking_folder_path, stock_info)
    get_recommendation_data(ranking_folder_path, stock_info)

    eps_config = [
        {'api': 'get-eps-q-data', 'output_name': 'eps_financials.json', 'type': 0, 'link': 'https://finance.yahoo.com/quote/{symbol}/financials'},
        {'api': 'get-eps-analysis-data', 'output_name': 'eps_analysis.json', 'type': 1, 'link': 'https://finance.yahoo.com/quote/{symbol}/analysis'},
    ]
    get_eps_q_data(ranking_folder_path, stock_info, eps_config[0])
    get_eps_q_data(ranking_folder_path, stock_info, eps_config[1])

    update_get_market(market_folder_path, config)
    get_market_industry(norn_data_folder_path)
    calc_market_correlation(norn_data_folder_path, market_folder_path)

    print('all task done')


if __name__ == "__main__":
    main()
