# Norn-StockScreener
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1555e97f268e47e6a298a6253ff1ed8f)](https://app.codacy.com/gh/zmcx16/Norn-StockScreener?utm_source=github.com&utm_medium=referral&utm_content=zmcx16/Norn-StockScreener&utm_campaign=Badge_Grade_Settings)
[![Build Status](https://zmcx16.visualstudio.com/stock-minehunter-server/_apis/build/status/zmcx16.stock-minehunter-server?branchName=master)](https://zmcx16.visualstudio.com/stock-minehunter-server/_build/latest?definitionId=4&branchName=master)
![Build Badge](https://github.com/zmcx16/Norn-StockScreener/workflows/DataStatus/badge.svg)
![Build Badge](https://github.com/zmcx16/Norn-StockScreener/workflows/FetchNornData/badge.svg)
![Build Badge](https://github.com/zmcx16/Norn-StockScreener/workflows/FetchStockData/badge.svg)
![Build Badge](https://github.com/zmcx16/Norn-StockScreener/workflows/FetchInsidersdData/badge.svg)
![Build Badge](https://github.com/zmcx16/Norn-StockScreener/workflows/FetchGoogleTrendData/badge.svg)
![Build Badge](https://github.com/zmcx16/Norn-StockScreener/workflows/FetchGurusData/badge.svg)
![Build Badge](https://github.com/zmcx16/Norn-StockScreener/workflows/ParseESGData/badge.svg)

Norn-StockScreener is a powerful U.S. stock screening tool that helps investors filter stocks based on key fundamentals, expert strategies, and advanced analytics. It features earnings manipulation detection, sector analysis, ESG rankings, insider trading insights, and options valuation. Available via web and Android, it’s a comprehensive resource for smarter investing.

Website: https://norn-stockscreener.zmcx16.moe

Android APP (TWA): https://play.google.com/store/apps/details?id=moe.zmcx16.norn_stockscreener

# Demo

![image](https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo.png)

![image](https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-dark.png)

# Base Argument Filter
  * Market Cap
  * Dividend %
  * ROA
  * ROE
  * ROI
  * P/E
  * Forward P/E
  * EPS this Y
  * EPS next Y
  * EPS next 5Y
  * EPS past 5Y
  * Sales past 5Y
  * PEG
  * P/S
  * P/B
  * P/C
  * P/FCF
  * Quick Ratio
  * Current Ratio
  * Debt/Eq
  * LT Debt/Eq
  * Insider Own
  * Insider Trans
  * Inst Own
  * Inst Trans
  * Gross Margin
  * Oper. Margin
  * Profit Margin
  * Payout
  * Short Float
  * Short Ratio
  * 52W High
  * 52W Low
  * RSI (14)
  * Perf Week
  * Perf Month
  * Perf Quarter
  * Perf Half Y
  * Perf Year
  * Perf YTD
  * Beta
  * ATR
  * SMA20
  * SMA50
  * SMA200

# Advanced Argument Filter
  * Beneish Model
  * N-Day Price High
  * N-Day Price Low
  * N-Day Vol High
  * Share Change(6M)
  * Share Change(1Y)
  * Sectors
  * Industries
  * ESG (Environment, Social, Governance, Percentile, Total)
  
# Investment Master's Tactics
  * Benjamin Graham strategy
  * Harry Burn III strategy
  * James P. O’shaughnessy strategy
  * John Neff strategy
  * Michael Berry strategy
  * Michael Price strategy
  * Peter Lynch strategy
  * Richard Buchwald & Marvin Kline strategy
  * Robert Sanborn strategy
  * stasistw strategy
  * Steven C. Leuthold strategy
  * Trinity Investment Management strategy
  * Warren E. Buffett strategy
  * zmcx16 strategy

# Multi-Factor Intersectional Model
##### Value factor
  * Earnings / Price
  * Earnings / Price (Last Q)
  * Book / Price
  * Sales / Price
  
##### Growth factor
  * ROE
  * ROA
  * ROI
  
##### Other factor
  * Dividend (%)
  * Insider ownership, Insider transcations
  * Institution ownership, Institution transcations
  * Target Price
  * Shoart Float, Short Ratio
  * 52W Price Range
  * Share Change(6M), Share Change(1Y)

# Sub Page
  <details><summary>Investment Checklist (https://norn-stockscreener.zmcx16.moe/checklist/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-checklist1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-checklist2.png">
  </blockquote></details>
  <details><summary>Industry Market (https://norn-stockscreener.zmcx16.moe/industry-market/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-industry-market.png">
  </blockquote></details>
  <details><summary>Industry Insiders (https://norn-stockscreener.zmcx16.moe/industry-insiders/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-industry-insiders1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-industry-insiders2.png">
  </blockquote></details>
  <details><summary>Options Valuation (https://norn-stockscreener.zmcx16.moe/options-valuation/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-options1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-options2.png">
  </blockquote></details>
  <details><summary>Options Put-Call Ratio (https://norn-stockscreener.zmcx16.moe/options-pcr/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-options-pcr1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-options-pcr2.png">
  </blockquote></details>
  <details><summary>Ranking Indicators (https://norn-stockscreener.zmcx16.moe/ranking/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-ranking.png">
  </blockquote></details>
  <details><summary>Google Trend Stocks (https://norn-stockscreener.zmcx16.moe/google-trend-stocks/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-google-trend-stocks.png">
  </blockquote></details>
  <details><summary>Investment Gurus (https://norn-stockscreener.zmcx16.moe/investment-gurus/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-investment-gurus.png">
  </blockquote></details>
  <details><summary>Google Trend Stocks (https://norn-stockscreener.zmcx16.moe/google-trend-stocks/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-google-trend-stocks.png">
  </blockquote></details>
  <details><summary>Short Stocks Summary (https://norn-stockscreener.zmcx16.moe/short-stocks-summary/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-short-stock1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-short-stock2.png">
  </blockquote></details>
  <details><summary>Dividend Champions (https://norn-stockscreener.zmcx16.moe/dividend-champions/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-dividend1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-dividend2.png">
  </blockquote></details>
  <details><summary>ESG Stocks Summary (https://norn-stockscreener.zmcx16.moe/esg-stocks-summary/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-esg1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-esg2.png">
  </blockquote></details>
  <details><summary>Stock Peer Comparison (https://norn-stockscreener.zmcx16.moe/stock-peer-comparison/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-stock-peer-comparison.png">
  </blockquote></details>
  <details><summary>GPT Investing Assistant (https://norn-stockscreener.zmcx16.moe/gpt-investing-assistant/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-gpt-investing-assistant1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-gpt-investing-assistant2.png">
  </blockquote></details>
  <details><summary>Stock Benford's Law (https://norn-stockscreener.zmcx16.moe/stock-benford-law/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-benford-law1.png">
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-benford-law2.png">
  </blockquote></details>
  <details><summary>Stock Price Simulation (https://norn-stockscreener.zmcx16.moe/stock-price-simulation/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-stock-simulation.png">
  </blockquote></details>
  <details><summary>Market Correlation Matrix (https://norn-stockscreener.zmcx16.moe/market-correlation-matrix/)</summary><blockquote>
  <img src="https://github.com/zmcx16/Norn-StockScreener/blob/master/demo/demo-market-correlation-matrix.png">
  </blockquote></details>

# Financial Data Source
  * Finviz (https://finviz.com)
  * Yahoo Finance (https://finance.yahoo.com)
  * MarketWatch (https://www.marketwatch.com/)
  * Investing (https://www.investing.com/)
  * Bloomberg (https://www.bloomberg.com/)
  * FBX Freightos (https://fbx.freightos.com/)
  * Dataroma (https://dataroma.com/)
  * Zacks (https://www.zacks.com/)
  * Insider Monkey (https://www.insidermonkey.com/)
  * Shares Outstanding History (https://sharesoutstandinghistory.com/)
  * Interbrand Best Global Brands (https://interbrand.com/best-global-brands/)
  * Clarivate Top 100 Global Innovators (https://clarivate.com/zh-hant/top-100-innovators/the-top-100/)
  * FINRA (https://www.finra.org/finra-data/browse-catalog/equity-short-interest/data)
  * Moneyzine - Latest Dividend Champions List (https://moneyzine.com/investments/dividend-champions/)
  * Macrotrends - Number of Employees (https://www.macrotrends.net/)
  * Dividend.com - EX-DATE (https://www.dividend.com/)
  * Norn-Minehunter (https://norn-minehunter.zmcx16.moe)

# Terms of Service
  * This site and the data included herein is for general information purposes only and does not constitute a recommendation to buy or sell any security. Furthermore, statements or comments made by this site are merely opinions.

  * Users of this site are advised to conduct their own independent research into individual stocks before making a purchase or sale decision. Additionally, users are advised that past performance of the funds and investment managers tracked by this site are no guarantee of future price appreciation.

  * norn-stockscreener.zmcx16.moe does not guarantee the accuracy, completeness, or usefulness of the information provided on the site. Users of this site are advised to evaluate, and bear all risks associated with, the use of any content herein. norn-stockscreener.zmcx16.moe does not assume any responsibility or liability for any loss that may be incurred as a result of reliance upon the content provided on the site

  * All contents on this website are for personal, education and non-commercial use only, do not use for commercial/profit purpose. If you feel your rights have been violated, please contact me. I will take off the violated resources.
  

# License
This project is licensed under the terms of the MIT license.
