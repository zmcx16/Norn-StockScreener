import os
import sys
import base64
import pathlib
import json
import requests
from datetime import datetime


def send_request(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as exc:
        print('Generated an exception: %s' % exc)
        return -1, exc

    return 0, res.text


def update_get_market(norn_data_folder_path, config):

    base_url = os.environ.get("MARKET_URL", "")

    for industry in config['markets']:
        try:
            print('update industry market: ' + industry)
            query_url = base_url + requests.utils.quote('&api=update-get-market&industry='+ industry)
            ret, content = send_request(query_url)
            if ret == 0:
                resp = json.loads(content)
                if resp["ret"] == 0:
                    data = resp["data"]
                    for item in data:
                        output = {'update_time': str(datetime.now()), 'industry': item['industry'], 'symbol': item['symbol'],
                                  'src': item['src'], 'data': item['data']}

                        base64_file_name = base64.b64encode(item['id'].encode('ascii')).decode('ascii')
                        with open(norn_data_folder_path / 'market-industry' / 'market' / (base64_file_name + '.json'), 'w', encoding='utf-8') as f:
                            f.write(json.dumps(output, separators=(',', ':')))

                else:
                    print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
            else:
                print('send_request failed: {ret}'.format(ret=ret))

        except Exception as exc:
            print('Generated an exception: %s' % exc)

    print('update_get_market done')


def get_market_industry():

    base_url = os.environ.get("MARKET_URL", "")
    query_url = base_url + '&api=get-market-industry'

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

    except Exception as exc:
        print('Generated an exception: %s' % exc)
        sys.exit(1)

    print('get_market_industry done')

if __name__ == "__main__":
    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"

    market_folder_path = norn_data_folder_path / 'market-industry' / 'market'
    if not os.path.exists(market_folder_path):
        os.makedirs(market_folder_path)

    config_path = root / "config.json"
    config = {}
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.loads(f.read())

    update_get_market(norn_data_folder_path, config)
    get_market_industry()
    print('all task done')

