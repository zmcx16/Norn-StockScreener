import os
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

    # os.environ.get("update_get_market_url", "")
    base_url = 'https://stockminehunterfuncmarket0.azurewebsites.net/api/StockMineHunterFunc?api=update-get-market&code=3VMxGpc18wAetwJtn1RpRZG37xa1RyT8yNIh3a3dWpBuWQat1MIc3g=='

    for industry in config['markets']:
        try:
            query_url = base_url + '&industry='+industry
            ret, content = send_request(query_url)
            if ret == 0:
                resp = json.loads(content)
                if resp["ret"] == 0:
                    data = resp["data"]
                    for item in data:
                        output = {'update_time': str(datetime.now()), 'industry': item['industry'], 'symbol': item['symbol'],
                                  'src': item['src'], 'data': item['data']}

                        with open(norn_data_folder_path / 'market-industry' / 'market' / (item['id'] + '.json'), 'w', encoding='utf-8') as f:
                            f.write(str(output))

                else:
                    print('server err = {err}, msg = {msg}'.format(err=resp["ret"], msg=resp["err_msg"]))
            else:
                print('send_request failed: {ret}'.format(ret=ret))

        except Exception as exc:
            print('Generated an exception: %s' % exc)


if __name__ == "__main__":
    root = pathlib.Path(__file__).parent.resolve()
    norn_data_folder_path = root / ".." / "norn-data"
    config_path = norn_data_folder_path / "market-industry" / "config.json"
    config = {}
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.loads(f.read())

    update_get_market(norn_data_folder_path, config)
    print('update_get_market done')

