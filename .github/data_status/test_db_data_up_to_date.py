import sys
import requests
import time


def send_get_json(url):
    try:
        res = requests.get(url)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.json()


def send_post_json(url, payload):
    try:
        headers = {'Content-Type': 'application/json'}
        res = requests.post(url, headers=headers, json=payload)
        res.raise_for_status()
    except Exception as ex:
        print('Generated an exception: {ex}'.format(ex=ex))
        return -1, ex

    return 0, res.json()


if __name__ == "__main__":

    NORN_SCREENER_LAST_UPDATE_TIME_URL = "https://zmcx16.moe/stock-minehunter/api/task/get-norn-screen-last-update-time"
    NORN_SCREENER_REPORT_STATUS_URL = "https://zmcx16.moe/stock-minehunter/api/task/get-norn-screen-report-status"
    NORN_SCREENER_DO_SCREEN_URL = "https://zmcx16.moe/stock-minehunter/api/task/do-norn-screen"

    LAST_UPDATE_TIME_SEC_THRESHOLD = 86400
    LAST_UPDATE_TIME_CNT_THRESHOLD = 2500
    REPORT_STATUS_THRESHOLD = 2500

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

            print(f"[Last Update Time] pass count: {pass_count}/{len(resp)}, max_sec: {max_sec}")

            if pass_count < LAST_UPDATE_TIME_CNT_THRESHOLD or max_sec < LAST_UPDATE_TIME_SEC_THRESHOLD:
                print(f"[Last Update Time] Failed, pass count: {pass_count} < {LAST_UPDATE_TIME_CNT_THRESHOLD} or max_sec: {max_sec} < {time_threshold}")
                sys.exit(-2)

        except Exception as ex:
            print('Generated an exception: {ex}, try next target.'.format(ex=ex))

    # test do-norn-screen POST API
    do_screen_payload = {
        "data": {
            "baseArg": [{"name": name, "type": 0, "from": "", "end": ""} for name in [
                "Market Cap", "Dividend %", "ROA", "ROE", "ROI", "P/E", "Forward P/E", "EPS this Y", "EPS next Y",
                "EPS next 5Y", "EPS past 5Y", "Sales past 5Y", "PEG", "P/S", "P/B", "P/C", "P/FCF", "Quick Ratio",
                "Current Ratio", "Debt/Eq", "LT Debt/Eq", "Insider Own", "Insider Trans", "Inst Own", "Inst Trans",
                "Gross Margin", "Oper. Margin", "Profit Margin", "Payout", "Short Float", "Short Ratio", "52W High",
                "52W Low", "RSI (14)", "Perf Week", "Perf Month", "Perf Quarter", "Perf Half Y", "Perf Year", "Perf YTD",
                "Beta", "ATR", "SMA20", "SMA50", "SMA200"
            ]],
            "advArg": [{"name": name, "type": 1, "from": "", "end": ""} for name in [
                "EPS last 1Q", "EPS last 2Q", "Beneish Model", "HL_PV_PH", "HL_PV_PL", "HL_PV_VH",
                "ShareOutstandingHalfYear", "ShareOutstandingOneYear", "ESG_TotalEsg", "ESG_EnvironmentScore",
                "ESG_SocialScore", "ESG_GovernanceScore", "ESG_Percentile"
            ]] + [{
                "name": "Recomm_RecommendationMean", "type": 1, "from": "1", "end": "2"
            }],
            "NornMinehunter": {
                "tactics": {tactic: True for tactic in TACTIC_LIST},
                "from": "",
                "end": ""
            },
            "Factor_Intersectional_v1": {
                "args": {
                    "E/P_w": "1.0", "B/P_w": "1.0", "S/P_w": "1.0", "FCF/P_w": "0.5", "ROA_w": "1.0",
                    "ROE_w": "1.0", "ROI_w": "1.0", "DIV_w": "0.5", "InsiderOwn_w": "0.2", "InsiderTrans_w": "0.2",
                    "InstOwn_w": "0.2", "InstTrans_w": "0.2", "TgtPrice_w": "0.5", "ShortFloat_w": "0",
                    "ShortRatio_w": "0", "E_Q/P_w": "1.0", "Range52W_w": "0.2", "ShareOutstandingHalfYear_w": "0",
                    "ShareOutstandingOneYear_w": "0"
                }
            },
            "sector_industries": {
                "sectors": [],
                "industries": []
            }
        }
    }

    ret, resp = send_post_json(NORN_SCREENER_DO_SCREEN_URL, do_screen_payload)
    if ret == 0:
        try:
            if not isinstance(resp, dict) or "data" not in resp or len(resp["data"]) == 0:
                print("[do-norn-screen] No results found.")
                sys.exit(-4)
            else:
                print(f"[do-norn-screen] Received {len(resp['data'])} results.")
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
