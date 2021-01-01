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
    NORN_SCREENER_REPORT_STATUS_URL = "https://zmcx16.moe/stock-minehunter/api/task/get-norn-screen-report-status"

    LAST_UPDATE_TIME_SEC_THRESHOLD = 86400
    LAST_UPDATE_TIME_CNT_THRESHOLD = 3000
    REPORT_STATUS_THRESHOLD = 3000

    TACTIC_LIST = ["BenjaminGraham_v1",
                "HarryBurnIII_v1",
                "JamesPOshaughnessy_v1",
                "JohnNeff_v1",
                "MichaelBerry_v1",
                "MichaelPrice_v1",
                "PeterLynch_v1",
                "RichardBuchwald_MarvinKline_v1",
                "RobertSanborn_v1",
                "Stasistw_v1",
                "StevenCLeuthold_v1",
                "TrinityInvestmentManagement_v1",
                "WarrenEBuffett_v1",
                "zmcx16_v1"]

    # test last update time
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

        except Exception as ex:
            print('Generated an exception: {ex}, try next target.'.format(ex=ex))

    # test report status by Azure Pipeline to reduce server memory loading
    """
    # test report status
    ret, resp = send_get_json(NORN_SCREENER_REPORT_STATUS_URL)
    if ret == 0:
        try:
            for tactic in TACTIC_LIST:
                print(f"{tactic}: {resp[tactic]}/{resp['total']}")
                if resp[tactic] < REPORT_STATUS_THRESHOLD:
                    sys.exit(-3)

        except Exception as ex:
            print('Generated an exception: {ex}, try next target.'.format(ex=ex))
    """

    sys.exit(0)
