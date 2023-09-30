export const FinvizUrl = "https://finviz.com/"
export const DataromaUrl = "https://dataroma.com/"
export const ZacksUrl = "https://www.zacks.com/"
export const InsidermonkeyUrl = "https://www.insidermonkey.com/"
export const YahooFinanceEnUrl = "https://finance.yahoo.com/"
export const YahooFinanceZhUrl = "https://hk.finance.yahoo.com/"
export const FINRAShortInterestUrl = "https://www.finra.org/finra-data/browse-catalog/equity-short-interest/data"
export const GoogleTrendsUrl = "https://trends.google.com.tw/trends"
export const NornStockScreenerUrl = "https://github.com/zmcx16/Norn-StockScreener"
export const NornStockScreenerMobileUrl = "https://play.google.com/store/apps/details?id=moe.zmcx16.norn_stockscreener"
export const zmcx16ProjectUrl = "https://project.zmcx16.moe"
export const zmcx16BlogUrl = "https://blog.zmcx16.moe"
export const NSSServerUrl = "https://zmcx16.moe"
export const NSSDoQueryAPI = "/stock-minehunter/api/task/do-norn-screen"
export const NornFinanceAPIServerDomain = "norn-finance.zmcx16.moe"
export const NornFinanceAPIServerGithub = "https://github.com/zmcx16/Norn-Finance-API-Server"
export const ShortSummaryRelLink = "/short-stocks-summary/"
export const ESGLink = 'https://www.sustainalytics.com/esg-ratings'
export const DividendChampionsUrl = "https://moneyzine.com/investments/dividend-champions/"

export const argSetValueBackgroundColor = 'rgba(144,238,144, 0.5)'

export const COOKIE_KEY_DARK_MODE = 'dark_mode'

export const rollingCorrelationWindowDays = 90

export const pageRouterTable = [
  { text: 'Stock Screener', path: '/'},
  { text: 'Investment Checklist', path: '/checklist/' },
  { text: 'Industry Market', path: '/industry-market/' },
  { text: 'Industry Insiders', path: '/industry-insiders/' },
  { text: 'Options Valuation', path: '/options-valuation/' },
  { text: 'Options Put Call Ratio', path: '/options-pcr/' },
  { text: 'Ranking Indicators', path: '/ranking/' },
  { text: 'Google Trend Stocks', path: '/google-trend-stocks/' },
  { text: 'Investment Gurus', path: '/investment-gurus/' },
  { text: 'Short Stocks Summary', path: '/short-stocks-summary/' },
  { text: 'Dividend Champions', path: '/dividend-champions/' },
  { text: 'ESG Stocks Summary', path: '/esg-stocks-summary/' },
  { text: 'Stock Price Simulation', path: '/stock-price-simulation/' },
  { text: 'Market Correlation Matrix', path: '/market-correlation-matrix/' },
]

export const kanbanNote = 
`There is something in this world which no one has ever seen.
It is soft and sweet.
If it is spotted, I'm sure everyone will want to have it,
Which is why no one has ever seen it.
For this world has hidden it quite well, so that it is difficult to obtain.
But, there will come a day when it is discovered by somebody,
And only those who should obtain it will be able to find it.
That is all.
`
export const kanbanText = `Filter, shortlist stock from the market`

export const QueryNote = 
`The Self-Query API server is a free & lightweight server. 
If you need a high-frequency query or occur query failed many times,
try to build your server from Github source code as follow:
` + NornFinanceAPIServerGithub

export const ShortStockDataSourceTooltip = `Short Data Source: FINRA Equity Short Interest Data`
export const GoogleTrendsTooltip = `See how Google Trends is being used across the world, by newsrooms, charities, and more.`
export const ESGTooltip = `ESG Risk Ratings available for sustainability risk management. Identify, understand and manage your environmental, social and governance risks.`
export const DividendChampionsTooltip = 
`Dividend Champions are companies that have increased their dividend every year for the past 25 years.
Contenders have increased their dividend for the past 10 years, and Challengers the past five years.
The idea for the spreadsheet was created in 2008 by Dave Fish (deceased in 2018),
and is now available and updated every Friday afternoon at Dividend Radar.`
export const DividendDRGDescription = 
`Dividend Growth: CAGRs are calculated using trailing twelve months`
export const PCRTooltip = `Put-Call Ratio (PCR) Data Source: Yahoo Finance (Data range: 365 days)`