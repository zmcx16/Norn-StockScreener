import os
import sys
import pathlib
import json
import time
import requests
from urllib.parse import urlencode
from datetime import datetime, timedelta


base_url = os.environ.get(
    "MARKET_URL", "")
token = os.environ.get(
    "MARKET_TOKEN", "")

DELAY_TIME_SEC = 1

def send_request(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.text


def get_managers_list():

    param = {
        'code': token,
        'api': 'get-managers-list'
    }
    encoded_args = urlencode(param)
    query_url = base_url + '?' + encoded_args

    try:
        ret, content = send_request(query_url)
        if ret == 0:
            resp = json.loads(content)
            if resp["ret"] == 0:
                print('get_managers_list done')
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


def get_gurus(gurus_folder_path):

    managers_list = get_managers_list()
    if len(managers_list) == 0:
        print('get_managers_list failed')
        sys.exit(1)
    
    output_table = {'update_time': str(datetime.now()), "manager_list": [], "data": {}}

    for manager in managers_list:
        print('get portfolio', manager['id'])
        output_table["manager_list"].append({'name': manager["name"], 'link': manager["link"]})
        param = {
            'code': token,
            'api': 'get-portfolio',
            'id': manager['id']
        }
        encoded_args = urlencode(param)
        query_url = base_url + '?' + encoded_args

        try:
            ret, content = send_request(query_url)
            if ret == 0:
                resp = json.loads(content)
                if resp["ret"] == 0:
                    for holding in resp["data"]["holdings"]:
                        symbol = holding["symbol"]
                        if symbol not in output_table["data"]:
                            output_table["data"][symbol] = []
                        output_table["data"][symbol].append({"name": manager["name"], "value": holding["value"]})

                else:
                    print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
                    sys.exit(1)
            else:
                print('send_request failed: {ret}'.format(ret=ret))
                sys.exit(1)

        except Exception as ex:
            print('Generated an exception: {ex}'.format(ex=ex))
            sys.exit(1)

        time.sleep(DELAY_TIME_SEC)

    with open(gurus_folder_path / 'gurus-table.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(output_table, separators=(',', ':')))

    print('get_gurus done')


def main():

    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    gurus_folder_path = norn_data_folder_path / 'gurus'
    if not os.path.exists(gurus_folder_path):
        os.makedirs(gurus_folder_path)

    get_gurus(gurus_folder_path)
    print('all task done')


if __name__ == "__main__":
    main()
