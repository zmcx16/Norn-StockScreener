export const ChecklistKey_Def = {
    "symbol":{
        "name": "Symbol",
        "type": "symbol",
        "checkpoint": false,
    },
    "score":{
        "name": "Score",
        "type": "score",
        "checkpoint": false,
    },
    "Close":{
        "name": "Price",
        "type": "price",
        "checkpoint": false,
    },
    "Market Cap":{
        "name": "Market Cap",
        "type": "from_end",
        "description": "Market capitalization",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Market Cap",
            "checkValConvertor": (val) => { return val / 1000000 },
            "display_format": "KMBT",
            "args_items": ["$50 mln ~ $300 mln", "$300 mln ~ $2 bln", "$2 bln ~ $10 bln", "$10 bln ~ $200 bln", "> $300 mln", "> $2 bln", "> $10 bln", "> $200 bln", "< $300 mln", "< $2 bln", "< $10 bln", "< $200 bln"],
            "default_index": 5
        }
    },
    "P/E":{
        "name": "P/E",
        "type": "from_end",
        "description": "Price to Earnings (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "P/E Ratio",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
            "default_index": 2
        }
    },
    "Forward P/E":{
        "name": "Forward P/E",
        "type": "from_end",
        "description": "Forward Price to Earnings (Next fiscal year)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Forward P/E Ratio",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
            "default_index": 2
        }
    },
    "P/B":{
        "name": "P/B",
        "type": "from_end",
        "description": "Price to Book (MRQ)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "P/B Ratio",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 0
        }
    },
    "P/C":{
        "name": "P/C",
        "type": "from_end",
        "description": "Price to Cash per share (MRQ)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "P/C Ratio",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 2
        }
    },
    "P/S":{
        "name": "P/S",
        "type": "from_end",
        "description": "Price to Sales (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "P/S Ratio",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 0
        }
    },
    "PEG":{
        "name": "PEG",
        "type": "from_end",
        "description": "Price to Earnings to Growth",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "PEG",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 1", "< 2", "< 3", "> 1", "> 2", "> 3"],
            "default_index": 0
        }
    },
    "ROE":{
        "name": "ROE",
        "type": "from_end",
        "description": "Return on Equity (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "ROE",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 2
        }
    },
    "ROA":{
        "name": "ROA",
        "type": "from_end",
        "description": "Return on Asserts (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "ROA",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 2
        }
    },
    "ROI":{
        "name": "ROI",
        "type": "from_end",
        "description": "Return on Investment (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "ROI",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 1
        }
    },
    "EPS this Y":{
        "name": "EPS this Y",
        "type": "from_end",
        "description": "EPS growth this year",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "EPS this Y",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 2
        }
    },
    "EPS next Y_%":{
        "name": "EPS next Y",
        "type": "from_end",
        "description": "EPS growth next year",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "EPS next Y",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 2
        }
    },
    "EPS Q/Q":{
        "name": "EPS Q/Q",
        "type": "from_end",
        "description": "Quarterly earnings growth (YoY)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "EPS Q/Q",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 2
        }
    },
    "Sales Q/Q":{
        "name": "Sales Q/Q",
        "type": "from_end",
        "description": "Quarterly revenue growth (YoY)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Sales Q/Q",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 2
        }
    },
    "Debt/Eq":{
        "name": "Debt/Eq",
        "type": "from_end",
        "description": "Total Debt to Equity (MRQ)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Debt/Eq",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 0.2", "< 0.4", "< 0.6", "< 0.8", "< 1", "< 1.2", "< 1.4", "< 1.6", "< 1.8", "< 2", "> 0.2", "> 0.4", "> 0.6", "> 0.8", "> 1", "> 1.2", "> 1.4", "> 1.6", "> 1.8", "> 2"],
            "default_index": 2
        }
    },
    "LT Debt/Eq":{
        "name": "LT Debt/Eq",
        "type": "from_end",
        "description": "Long Term Debt to Equity (MRQ)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "LT Debt/Eq",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 0.2", "< 0.4", "< 0.6", "< 0.8", "< 1", "< 1.2", "< 1.4", "< 1.6", "< 1.8", "< 2", "> 0.2", "> 0.4", "> 0.6", "> 0.8", "> 1", "> 1.2", "> 1.4", "> 1.6", "> 1.8", "> 2"],
            "default_index": 2
        }
    },
    "Quick Ratio":{
        "name": "Quick Ratio",
        "type": "from_end",
        "description": "Quick Ratio (MRQ)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Quick Ratio",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 0.5", "< 1", "< 1.5", "< 2", "< 3", "< 4", "< 5", "> 0.5", "> 1", "> 1.5", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 10
        }
    },
    "Current Ratio":{
        "name": "Current Ratio",
        "type": "from_end",
        "description": "Current Ratio (MRQ)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Current Ratio",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 0.5", "< 1", "< 1.5", "< 2", "< 3", "< 4", "< 5", "> 0.5", "> 1", "> 1.5", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 10
        }
    },
    "Dividend %":{
        "name": "Dividend %",
        "type": "from_end",
        "description": "Dividend yield (Annual)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Dividend %",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 1%", "> 2%", "> 3%", "> 4%", "> 5%", "> 6%", "> 7%", "> 8%", "> 9%", "> 10%"],
            "default_index": 5
        }
    },
    "Gross Margin":{
        "name": "Gross Margin",
        "type": "from_end",
        "description": "Gross Margin (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Gross Margin",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 0
        }
    },
    "Oper. Margin":{
        "name": "Oper. Margin",
        "type": "from_end",
        "description": "Oper. Margin (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Oper. Margin",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 0
        }
    },
    "Profit Margin":{
        "name": "Profit Margin",
        "type": "from_end",
        "description": "Net Profit Margin (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Profit Margin",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 0
        }
    },
    "Insider Trans":{
        "name": "Insider Trans",
        "type": "from_end",
        "description": "Insider transactions (6-month change in Insider Ownership)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Insider Trans",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 0%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 0
        }
    },
    "Inst Trans":{
        "name": "Inst Trans",
        "type": "from_end",
        "description": "Institutional transactions (3-month change in Institutional Ownership)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Inst Trans",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 0%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 0
        }
    },
    "Short Float":{
        "name": "Short Float",
        "type": "from_end",
        "description": "Short interest share",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Short Float",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 6
        }
    },
    "beneish":{
        "name": "Beneish Model",
        "type": "from_end",
        "description": "Using financial ratios and eight variables to identify whether a company has manipulated its earnings",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Beneish Model",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< -2.22", "< -1.78", "> -2.22", "> -1.78", "-2.22 ~ -1.78"],
            "default_index": 0
        }
    },
    "ESG_TotalEsg":{
        "name": "ESG",
        "type": "from_end",
        "description": "Sustainalytics total ESG risk score",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Total ESG Risk",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 10", "< 20", "< 30", "< 40"],
            "default_index": 1
        }
    },
    "Recomm_RecommendationMean":{
        "name": "Recommend",
        "type": "from_end",
        "description": "Yahoo Finance recommendation rating",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Recommendation",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["< 2", "< 3", "< 4"],
            "default_index": 1
        }
    },
    "eps_analysis":{
        "name": "EPS Anal",
        "type": "tags",
        "description": "EPS data from the Analysis",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "EPS Analysis",
            "display_format": "",
            "args_items": ["all_positive", "keep_growth"],
            "default_selects": ["all_positive", "keep_growth"]
        }
    },
    "eps_financials":{
        "name": "EPS Fin",
        "type": "tags",
        "description": "EPS data from the Financial Statements",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "EPS Financials",
            "display_format": "",
            "args_items": ["all_positive", "keep_growth"],
            "default_selects": ["all_positive"]
        }
    },
    "52W High":{
        "name": "52W High",
        "type": "from_end",
        "description": "Distance from 52-Week High",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "52W High",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> -5%", "> -10%", "> -15%", "> -20%", "> -25%", "> -30%", "> -35%", "> -40%", "> -45%", "> -50%", "> -55%", "> -60%"],
            "default_index": 3
        }
    },
    "52W Low":{
        "name": "52W Low",
        "type": "from_end",
        "description": "Distance from 52-Week Low",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "52W Low",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "> 35%", "> 40%", "> 45%", "> 50%", "> 55%", "> 60%"],
            "default_index": 1
        }
    },
    "Perf Week":{
        "name": "Perf Week",
        "type": "from_end",
        "description": "Performance (Week)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Perf Week",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 0%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 0
        }
    },
    "Perf Month":{
        "name": "Perf Month",
        "type": "from_end",
        "description": "Performance (Month)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Perf Month",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
        }
    },
    "Perf Quarter":{
        "name": "Perf Quarter",
        "type": "from_end",
        "description": "Performance (Quarter)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Perf Quarter",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 2
        }
    },
    "Perf Half Y":{
        "name": "Perf Half Y",
        "type": "from_end",
        "description": "Performance (Half Year)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Perf Half Y",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 20%", "> 40%", "> 60%", "> 80%", "> 100%", "> 120%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
        }
    },
    "Perf Year":{
        "name": "Perf Year",
        "type": "from_end",
        "description": "Performance (Year)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Perf Year",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 20%", "> 40%", "> 60%", "> 100%", "> 200%", "> 300%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
        }
    },
    "Perf YTD":{
        "name": "Perf YTD",
        "type": "from_end",
        "description": "Performance (Year To Date)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Perf YTD",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 20%", "> 40%", "> 60%", "> 80%", "> 100%", "> 120%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 0
        }
    },
    "SMA20":{
        "name": "SMA20",
        "type": "from_end",
        "description": "Distance from 20-Day Simple Moving Average",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "SMA20",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 0
        }
    },
    "SMA50":{
        "name": "SMA50",
        "type": "from_end",
        "description": "Distance from 50-Day Simple Moving Average",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "SMA50",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
        }
    },
    "SMA200":{
        "name": "SMA200",
        "type": "from_end",
        "description": "Distance from 200-Day Simple Moving Average",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "SMA200",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "> 70%", "> 80%", "> 90%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%", "< -70%", "< -80%", "< -90%"],
            "default_index": 2
        }
    },
}

export const DefaultGroupChecklist = [
    {
        "name": "Default Checklist",
        "symbols": ["AAPL", "BAC", "WFC", "INTC", "AMZN", "GOOG", "DHI"],
        "list": [
            { 
                "name": "Market Cap", 
                "condition": {"from": "2000", "end": ""}
            },
            { 
                "name": "P/E", 
                "condition": {"from": "", "end": "10"}
            },
            { 
                "name": "P/B", 
                "condition": {"from": "", "end": "1"}
            },
            { 
                "name": "eps_financials", 
                "condition": {"match_all": ["all_positive"]}
            },
            { 
                "name": "eps_analysis", 
                "condition": {"match_all": ["all_positive", "keep_growth"]}
            },
            { 
                "name": "beneish", 
                "condition": {"from": "", "end": "-2.22"}
            },
            { 
                "name": "Insider Trans", 
                "condition": {"from": "0", "end": ""}
            },
            { 
                "name": "Inst Trans", 
                "condition": {"from": "0", "end": ""}
            },
            { 
                "name": "ROE", 
                "condition": {"from": "15", "end": ""}
            },
            { 
                "name": "ROA", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "ROI", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "Debt/Eq", 
                "condition": {"from": "", "end": "0.6"}
            },
            { 
                "name": "LT Debt/Eq", 
                "condition": {"from": "", "end": "0.6"}
            },
            { 
                "name": "ESG_TotalEsg", 
                "condition": {"from": "", "end": "20"}
            },
            { 
                "name": "Recomm_RecommendationMean", 
                "condition": {"from": "", "end": "3"}
            },
        ]
    },
    {
        "name": "Default All Checklist",
        "symbols": ["PYPL", "DIS", "KSS"],
        "list": [
            { 
                "name": "Market Cap", 
                "condition": {"from": "2000", "end": ""}
            },
            { 
                "name": "P/E", 
                "condition": {"from": "", "end": "15"}
            },
            { 
                "name": "Forward P/E", 
                "condition": {"from": "", "end": "15"}
            },
            { 
                "name": "P/B", 
                "condition": {"from": "", "end": "1"}
            },
            { 
                "name": "P/C", 
                "condition": {"from": "", "end": "3"}
            },
            { 
                "name": "P/S", 
                "condition": {"from": "", "end": "1"}
            },
            { 
                "name": "PEG", 
                "condition": {"from": "", "end": "1"}
            },
            { 
                "name": "ROE", 
                "condition": {"from": "15", "end": ""}
            },
            { 
                "name": "ROA", 
                "condition": {"from": "15", "end": ""}
            },
            { 
                "name": "ROI", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "EPS this Y", 
                "condition": {"from": "15", "end": ""}
            },
            { 
                "name": "EPS next Y_%", 
                "condition": {"from": "15", "end": ""}
            },
            { 
                "name": "EPS Q/Q", 
                "condition": {"from": "15", "end": ""}
            },
            { 
                "name": "Sales Q/Q", 
                "condition": {"from": "15", "end": ""}
            },
            { 
                "name": "Debt/Eq", 
                "condition": {"from": "", "end": "0.6"}
            },
            { 
                "name": "LT Debt/Eq", 
                "condition": {"from": "", "end": "0.6"}
            },
            { 
                "name": "Quick Ratio", 
                "condition": {"from": "2", "end": ""}
            },
            { 
                "name": "Current Ratio", 
                "condition": {"from": "2", "end": ""}
            },
            { 
                "name": "Dividend %", 
                "condition": {"from": "5", "end": ""}
            },
            { 
                "name": "Gross Margin", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "Oper. Margin", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "Profit Margin", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "Insider Trans", 
                "condition": {"from": "0", "end": ""}
            },
            { 
                "name": "Inst Trans", 
                "condition": {"from": "0", "end": ""}
            },
            { 
                "name": "Short Float", 
                "condition": {"from": "", "end": "5"}
            },
            { 
                "name": "beneish", 
                "condition": {"from": "", "end": "-2.22"}
            },
            { 
                "name": "ESG_TotalEsg", 
                "condition": {"from": "", "end": "20"}
            },
            { 
                "name": "Recomm_RecommendationMean", 
                "condition": {"from": "", "end": "3"}
            },
            { 
                "name": "eps_analysis", 
                "condition": {"match_all": ["all_positive", "keep_growth"]}
            },
            { 
                "name": "eps_financials", 
                "condition": {"match_all": ["all_positive"]}
            },
            { 
                "name": "52W High", 
                "condition": {"from": "-20", "end": ""}
            },
            { 
                "name": "52W Low", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "Perf Week", 
                "condition": {"from": "0", "end": ""}
            },
            { 
                "name": "Perf Month", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "Perf Quarter", 
                "condition": {"from": "20", "end": ""}
            },
            { 
                "name": "Perf Half Y", 
                "condition": {"from": "20", "end": ""}
            },
            { 
                "name": "Perf Year", 
                "condition": {"from": "20", "end": ""}
            },
            { 
                "name": "Perf YTD", 
                "condition": {"from": "0", "end": ""}
            },
            { 
                "name": "SMA20", 
                "condition": {"from": "0", "end": ""}
            },
            { 
                "name": "SMA50", 
                "condition": {"from": "10", "end": ""}
            },
            { 
                "name": "SMA200", 
                "condition": {"from": "20", "end": ""}
            }
        ]
    }
]

export const CheckpointsKeyList = Object.keys(ChecklistKey_Def).reduce((acc, key, index) => {
    if (ChecklistKey_Def[key].checkpoint) {
      acc.push(key)
    }
    return acc
}, [])

export const LOCALSTORAGE_KEY_CHECKLISTS = "checklists"
export const ChecklistTooltipsUrl = "https://www.process.st/checklist/warren-buffets-investment-checklist/"
export const ChecklistTooltips = 
`Warren Buffet’s Investment Checklist:
1. Record basic details of the company
2. Is the business simple and understandable?
3. Does the business have a consistent operating history?
4. Does the business have favourable long-term prospects?
5. Is the management rational with its capital?
6. Is management candid with the shareholders?
7. Does management resist the institutional imperative?
8. Is the focus on Return On Equity?
9. What is the rate of "owner earnings"?
10. Is there a high profit margin?
11. Has the company created at least one dollar of market value, for every dollar retained?
12. What is the value of the business?
13. Can it be purchased at a significant discount to its value?
`