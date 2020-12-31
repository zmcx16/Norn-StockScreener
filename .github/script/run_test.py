import os
import sys
import json
import requests
import time


def send_get_json(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: ex'.format(ex=ex))
        return -1, exc

    return 0, res.json()


if __name__ == "__main__":

    NORN_SCREENER_LAST_UPDATE_TIME_URL = "https://zmcx16.moe/stock-minehunter/api/task/get-norn-screen-last-update-time"

    LAST_UPDATE_TIME_SEC_THRESHOLD = 86400
    LAST_UPDATE_TIME_CNT_THRESHOLD = 3000

    ret, resp = send_get_json(NORN_SCREENER_LAST_UPDATE_TIME_URL)
    if ret == 0:
        try:
            time_threshold = time.time() - LAST_UPDATE_TIME_SEC_THRESHOLD

            pass_count = 0
            max_sec = 0
            for symbol in resp:
                if time_threshold < resp[symbol]:
                    pass_count += 1

                max_sec = max(max_sec, resp[symbol])

            print(f"pass count: {pass_count}/{len(resp)}, max_sec: {max_sec}")

            if pass_count < LAST_UPDATE_TIME_CNT_THRESHOLD or max_sec < LAST_UPDATE_TIME_SEC_THRESHOLD:
                sys.exit(-2)
            else:
                sys.exit(0)

        except Exception as ex:
            print('Generated an exception: {ex}, try next target.'.format(ex=ex))

    sys.exit(-1)
