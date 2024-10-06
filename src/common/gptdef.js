export const CompanyAnalysisAPI = "/stock-minehunter/api/task/do-ai-company-analysis"

export const GPTModelSelectDef = ['gpt-4o', 'gpt-3.5-turbo']
export const AnalysisSelectDef = [
  {
    name: 'CompanyAnalysis',
    display_name: 'Company Analysis',
    description: `Using GPT models to analyze company data and provide insights on valuation, performance, growth, dividends, balance sheet, analyst sentiment, and more.`,
  }, 
]

export const CompanyAnalysisFiltersDef = [
  {
    name: 'P/E',
    display_name: 'P/E',
    default: true,
  }, 
  {
    name: 'EPS (ttm)',
    display_name: 'EPS (ttm)',
    default: false,
  }, 
]

export const CompanyAnalysisGurusDef = [
  {
    name: 'Warren Buffett',
    default: true,
  },
  {
    name: 'Peter Lynch',
    default: true,
  },
  {
    name: 'Ray Dalio',
    default: true,
  },
  {
    name: 'Jim Simons',
    default: true,
  },
  {
    name: 'Philip Fisher',
    default: true,
  },
  {
    name: 'George Soros',
    default: true,
  },
  {
    name: 'Carl Icahn',
    default: false,
  },
  {
    name: 'Bill Ackman',
    default: false,
  },
  {
    name: 'David Tepper',
    default: false,
  },
  {
    name: 'Michael Burry',
    default: false,
  },
  {
    name: 'Mohnish Pabrai',
    default: false,
  },
]

export const CompanyAnalysisGPTResponseExample = `## Company Analysis Sample Data
___

The stock analysis for HPE (Hewlett Packard Enterprise) based on the provided data can be broken down into several key metrics and insights:

### Valuation:
- **P/E (Price-to-Earnings) Ratio:** 14.62 (current) and 9.70 (forward)  
  This suggests that the company is currently valued at 14.62 times its earnings but is expected to be cheaper in the future (lower P/E forward), indicating potential for earnings growth.
  
- **PEG (Price/Earnings to Growth):** 4.57  
  This metric is relatively high, which indicates that even though the stock has a decent P/E ratio, it may not be growing fast enough to justify its valuation. This could signal overvaluation based on growth expectations.

- **P/B (Price-to-Book):** 1.21  
  This shows that the market price is only slightly above the book value, which may imply that the stock is reasonably priced relative to its assets.

- **P/S (Price-to-Sales):** 0.92  
  This is quite low, suggesting the company is valued at less than 1x its annual sales, which is a positive sign for undervaluation.

### Performance & Momentum:
- **Recent Performance:**  
  - Weekly performance: +3.40%  
  - Monthly performance: +7.69%  
  - Quarterly performance: -0.70%  
  - Year-to-date (YTD) performance: +20.88%  
  - Yearly performance: +17.69%  
  
  The stock has performed well in the short term and year-to-date, but there's been slight underperformance over the quarter. Overall, the stock has shown strong momentum recently.

- **52-Week Range:**  
  The stock is currently trading at $20.52, with a 52-week low of $14.47 and a high of $22.82. The current price is closer to its high, but still down by 10.06% from the peak.

- **SMA (Simple Moving Averages):**  
  - 20-day: 11.58%  
  - 50-day: 10.56%  
  - 200-day: 14.62%  
  
  These figures show that the stock has been performing well above its moving averages, indicating bullish momentum.

### Earnings & Growth:
- **EPS (Earnings Per Share):**  
  - TTM (Trailing Twelve Months): 1.40  
  - Next quarter expected: 0.56  
  - Next year EPS: 2.12 (expected 7.98% growth)

  The EPS growth rate shows modest expected growth, but historical EPS this year has dropped by 8.89%. However, EPS over the past 5 years has grown by 4.61%.

- **Income:** $1.85B  
  - Profit margin: 6.41%, indicating solid profitability relative to revenue.
  
- **Sales:** $28.92B  
  - Operating margin: 7.51%  
  This operating margin, while not extremely high, is reasonable, especially in the tech hardware industry.

### Dividends & Payout:
- **Dividend Yield:** 2.53%  
  This is a decent dividend yield, and the payout ratio of 31.19% suggests that the company is retaining a good portion of its earnings for growth or other initiatives.

### Balance Sheet:
- **Debt/Equity Ratio:** 0.53  
  - LT Debt/Equity: 0.36  
  This indicates a moderate level of debt, which should be manageable given the company’s profitability and cash flow.

- **Cash per Share:** $3.01  
  This represents a healthy liquidity position.

- **Current Ratio:** 0.94  
  A current ratio below 1 indicates potential liquidity concerns, though this might not be alarming given the company’s large scale and assets.

### Analyst Sentiment:
- **Recommendation:** 2.33 (between Buy and Hold)  
  This indicates a moderate consensus towards buying the stock.

- **Target Price:** $21.15  
  The stock currently trades near this target price, implying limited short-term upside based on analyst expectations.

### Institutional & Insider Ownership:
- **Institutional Ownership:** 82.72%  
  This high institutional ownership reflects confidence from large investors.

- **Insider Ownership:** 0.47%  
  While insider ownership is small, recent insider transactions show a decrease (-11.63%), which might suggest caution among executives.

### Volatility & Risk:
- **Beta:** 1.20  
  This indicates that HPE is slightly more volatile than the overall market.

- **Volatility:** 2.51% (weekly) and 2.83% (monthly)  
  These volatility figures suggest that the stock experiences moderate price swings, typical of tech stocks.

### Overall Analysis:
HPE is trading at a reasonable valuation with a P/E below the market average, indicating it's not overpriced. Its growth prospects, while modest, seem steady with consistent sales and earnings. The company’s strong institutional backing, solid balance sheet, and decent dividend yield make it attractive for value and income investors. However, the low growth rate and high PEG ratio could indicate limited upside potential. The company is performing well compared to its moving averages, reflecting current bullish momentum, but long-term growth could be a bit constrained.`