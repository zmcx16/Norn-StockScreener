export const CompanyAnalysisAPI = "/stock-minehunter/api/task/do-ai-company-analysis"

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
  {
    name: 'Insider Own',
    display_name: 'Insider Ownership',
    default: true,
  }, 
  {
    name: 'Shs Outstand',
    display_name: 'Shs Outstand',
    default: false,
  }, 
  {
    name: 'Perf Week',
    display_name: 'Perf Week',
    default: true,
  }, 
  {
    name: 'Market Cap',
    display_name: 'Market Cap',
    default: true,
  }, 
  {
    name: 'Forward P/E',
    display_name: 'Forward P/E',
    default: true,
  }, 
  {
    name: 'Insider Trans',
    display_name: 'Insider Transactions',
    default: false,
  },
  {
    name: 'Shs Float',
    display_name: 'Shs Float',
    default: false,
  },
  {
    name: 'Perf Month',
    display_name: 'Perf Month',
    default: true,
  },
  {
    name: 'PEG',
    display_name: 'PEG',
    default: true,
  },
  {
    name: 'EPS next Q',
    display_name: 'EPS next Q',
    default: true,
  },
  {
    name: 'Inst Own',
    display_name: 'Institutional Ownership',
    default: false,
  },
  {
    name: 'Short Float',
    display_name: 'Short Float',
    default: true,
  },
  {
    name: 'Perf Quarter',
    display_name: 'Perf Quarter',
    default: true,
  },
  {
    name: 'P/S',
    display_name: 'P/S',
    default: true,
  },
  {
    name: 'EPS this Y',
    display_name: 'EPS this Y',
    default: true,
  },
  {
    name: 'Inst Trans',
    display_name: 'Institutional Transactions',
    default: false,
  },
  {
    name: 'Short Ratio',
    display_name: 'Short Ratio',
    default: true,
  },
  {
    name: 'Perf Half Y',
    display_name: 'Perf Half Y',
    default: true,
  },
  {
    name: 'Book/sh',
    display_name: 'Book/sh',
    default: true,
  },
  {
    name: 'P/B',
    display_name: 'P/B',
    default: true,
  },
  {
    name: 'EPS next Y_%',
    display_name: 'EPS next Y_%',
    default: true,
  },
  {
    name: 'ROA',
    display_name: 'ROA',
    default: true,
  },
  {
    name: 'Perf Year',
    display_name: 'Perf Year',
    default: true,
  },
  {
    name: 'Cash/sh',
    display_name: 'Cash/sh',
    default: true,
  },
  {
    name: 'P/C',
    display_name: 'P/C',
    default: true,
  },
  {
    name: 'EPS next 5Y',
    display_name: 'EPS next 5Y',
    default: true,
  },
  {
    name: 'ROE',
    display_name: 'ROE',
    default: true,
  },
  {
    name: 'Perf YTD',
    display_name: 'Perf YTD',
    default: true,
  },
  {
    name: 'P/FCF',
    display_name: 'P/FCF',
    default: true,
  },
  {
    name: 'EPS past 5Y',
    display_name: 'EPS past 5Y',
    default: true,
  },
  {
    name: 'ROI',
    display_name: 'ROI',
    default: true,
  },
  {
    name: '52W High',
    display_name: '52W High',
    default: true,
  },
  {
    name: 'Beta',
    display_name: 'Beta',
    default: false,
  },
  {
    name: 'Quick Ratio',
    display_name: 'Quick Ratio',
    default: true,
  },
  {
    name: 'Sales past 5Y',
    display_name: 'Sales past 5Y',
    default: true,
  },
  {
    name: 'Gross Margin',
    display_name: 'Gross Margin',
    default: false,
  },
  {
    name: '52W Low',
    display_name: '52W Low',
    default: true,
  },
  {
    name: 'ATR (14)',
    display_name: 'ATR (14)',
    default: false,
  },
  {
    name: 'Current Ratio',
    display_name: 'Current Ratio',
    default: true,
  },
  {
    name: 'EPS Y/Y TTM',
    display_name: 'EPS Y/Y TTM',
    default: true,
  },
  {
    name: 'Oper. Margin',
    display_name: 'Oper. Margin',
    default: false,
  },
  {
    name: 'RSI (14)',
    display_name: 'RSI (14)',
    default: false,
  },
  {
    name: 'Debt/Eq',
    display_name: 'Debt/Eq',
    default: true,
  },
  {
    name: 'Sales Y/Y TTM',
    display_name: 'Sales Y/Y TTM',
    default: true,
  },
  {
    name: 'Profit Margin',
    display_name: 'Profit Margin',
    default: true,
  },
  {
    name: 'LT Debt/Eq',
    display_name: 'LT Debt/Eq',
    default: true,
  },
  {
    name: 'EPS Q/Q',
    display_name: 'EPS Q/Q',
    default: true,
  },
  {
    name: 'Rel Volume',
    display_name: 'Rel Volume',
    default: false,
  },
  {
    name: 'Sales Q/Q',
    display_name: 'Sales Q/Q',
    default: true,
  },
  {
    name: 'Price',
    display_name: 'Price',
    default: true,
  },
  {
    name: 'SMA20',
    display_name: 'SMA20',
    default: true,
  },
  {
    name: 'SMA50',
    display_name: 'SMA50',
    default: true,
  },
  {
    name: 'SMA200',
    display_name: 'SMA200',
    default: true,
  },
  {
    name: 'Dividend %',
    display_name: 'Dividend %',
    default: true,
  },
  {
    name: 'eps_q_data',
    display_name: 'Quarterly EPS Data',
    default: true,
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
    default: false,
  },
  {
    name: 'George Soros',
    default: false,
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

# Comprehensive Stock Analysis Report

## Overview
This analysis is based on the stock data of a company identified with the DIS. The evaluation covers multiple financial indicators and metrics to provide an insight into the company's performance, value, and future prospects. The aim is to guide investors in making informed decisions.

### **1. Valuation Metrics**

#### Price-Earnings Ratio (P/E)
- **P/E: 36.49**
- **Forward P/E: 18.32**
  
   **Analysis**: 
   - **Current Valuation**: The P/E ratio indicates that the stock is trading at a premium compared to the broader market; investors are willing to pay more for each dollar of earnings.
   - **Projection**: The significantly lower Forward P/E suggests expected growth in earnings or adjustments that will enhance value realization.

#### Price-to-Book Ratio (P/B)
- **P/B: 1.72**
  
   **Analysis**: 
   - This suggests that the company is valued relatively close to its book value, indicating a potentially fair valuation with a tangible financial strength.

#### Price-to-Sales Ratio (P/S)
- **P/S: 1.92**

   **Analysis**:
   - A moderate ratio reflects balanced sales valuation, not overly high.

### **2. Growth Indicators**

#### PEG Ratio
- **PEG: 2.49**
  
   **Analysis**: 
   - A PEG above 1 suggests that the stock might be overvalued relative to its growth, implying slower-than-desired future earnings growth.

#### EPS Growth
- **EPS this Y: 31.34%**
- **EPS next Y %: 5.15%**
- **EPS Q/Q: 669.78%**

   **Analysis**:
   - The substantial quarterly growth in EPS signals significant earnings improvements, though next year's growth projection is lower.

#### Sales Growth
- **Sales Y/Y TTM: 3.88%**
- **Sales past 5Y: 6.74%**

   **Analysis**:
   - Steady sales growth showcases sustained business expansion, although recent growth has decelerated.

### **3. Financial Health**

#### Liquidity
- **Quick Ratio: 0.6**
- **Current Ratio: 0.66**

   **Analysis**:
   - Ratios below 1 suggest a potential short-term liquidity risk; the company might face challenges meeting immediate financial obligations.

#### Leverage
- **Debt/Eq: 0.47**
- **LT Debt/Eq: 0.39**

   **Analysis**:
   - Moderate leverage, suggesting that the company efficiently manages its debt levels relative to equity.

### **4. Profitability Metrics**

#### Return on Assets (ROA) and Return on Equity (ROE)
- **ROA: 2.38%**
- **ROE: 4.82%**

   **Analysis**:
   - Indicating modest profitability; these figures suggest that assets and equity generate moderate returns.

#### Profit Margin
- **Profit Margin: 5.33%**

   **Analysis**:
   - Reflects the percentage of revenue that turns into profit, suggesting decent efficiency in cost management.

### **5. Stock Performance**

#### Performance Indicators
- **Yearly Performance: 19.96%**
- **Performance YTD: 5.38%**

   **Analysis**:
   - Strong yearly performance highlights investor confidence; YTD performance indicates recent growth momentum.

#### Price Movements & Trends
- **52W High: -23.1%**
- **52W Low: +20.85%**
- **SMA20: +2.97%, SMA50: +4.96%, SMA200: -5.54%**

   **Analysis**:
   - Recent price trend analysis (SMA) reveals short-term bullish tendencies but long-term historical pressures.

#### Dividend
- **Dividend %: 0.47%**

   **Analysis**:
   - A low dividend yield may not appeal to income-focused investors, suggesting the company's strategy is more growth-oriented.

### **6. Insider and Institutional Insights**

#### Insider Ownership
- **Insider Own: 0.08%**

   **Analysis**: 
   - Low insider ownership could mean less alignment with shareholders, though it should be evaluated on a case-by-case basis.

#### Short Interest
- **Short Float: 1.2%**
- **Short Ratio: 2.08**

   **Analysis**:
   - Relatively low short interest suggests optimism or neutrality about the company's downside risks.

### **7. Future Projections and Expectations**

#### EPS Forecast and Long-Term Growth
- **EPS next 5Y: 14.67%**

   **Long-Term Analysis**:
   - Expected solid long-term EPS growth, indicating potential for sustained improvement in profitability and value.

## Conclusion and Investment Recommendation

The stock showcases several appealing qualities like reasonable valuation metrics supported by growth indicators, including excellent EPS quarterly improvement and steady sales growth. However, caution may be warranted due to liquidity concerns as indicated by quick and current ratios. The stock's recent performance indicates positive momentum, but the low dividend could be a deterrent for income investors. 

**Warren Buffett Perspective**: The stock should be considered if it aligns with your longer-term horizon and the intrinsic value supports this investment.

**Peter Lynch Perspective**: Given its mixed growth metrics, this stock may not perfectly fit a fast-grower category, yet it rests in a potential rebound category.

**Ray Dalio Perspective**: Balanced risk-taking by considering this stock within a diversified portfolio.

**Jim Simons Perspective**: Quantitative checks suggest short-term positive price trends that could be potentially profitable for trading opportunities.

### Final Thought
After a detailed analysis, this stock represents a mix of growth possibilities with conceivable risks. Investment decisions should always be aligned with individual risk tolerance, investment objectives, and adequate portfolio diversification strategy.`