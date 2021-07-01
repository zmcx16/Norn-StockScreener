import os
import sys
import base64
import pathlib
import json
import requests
from urllib.parse import urlencode
from datetime import datetime


def send_request(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.text

def get_config():

    base_url = os.environ.get("MARKET_URL", "")
    token = os.environ.get("MARKET_TOKEN", "")

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


def update_get_market(norn_data_folder_path, config):

    base_url = os.environ.get("MARKET_URL", "")
    token = os.environ.get("MARKET_TOKEN", "")

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

                        base64_file_name = base64.b64encode(item['id'].encode('ascii')).decode('ascii')
                        with open(norn_data_folder_path / 'markets' / (base64_file_name + '.json'), 'w', encoding='utf-8') as f:
                            f.write(json.dumps(output, separators=(',', ':')))

                else:
                    print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
            else:
                print('send_request failed: {ret}'.format(ret=ret))

        except Exception as ex:
            print('Generated an exception: {ex}'.format(ex=ex))

    print('update_get_market done')


def get_market_industry():

    base_url = os.environ.get("MARKET_URL", "")
    token = os.environ.get("MARKET_TOKEN", "")

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
                with open(norn_data_folder_path / 'market-industry' / 'indusrty-table.json', 'w',
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

if __name__ == "__main__":
    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    market_folder_path = norn_data_folder_path / 'markets'
    if not os.path.exists(market_folder_path):
        os.makedirs(market_folder_path)

    config = get_config()
    update_get_market(norn_data_folder_path, config)
    get_market_industry()
    print('all task done')

