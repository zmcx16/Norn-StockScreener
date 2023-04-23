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
    "Market Cap":{
        "name": "Market Cap",
        "type": "from_end",
        "description": "Market capitalization",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Market Cap",
            "checkValConvertor": (val) => { return val / 1000000 },
            "display_format": "KMBT",
            "args_items": ["Any (> $50 mln)", "$50 mln ~ $300 mln", "$300 mln ~ $2 bln", "$2 bln ~ $10 bln", "$10 bln ~ $200 bln", "> $300 mln", "> $2 bln", "> $10 bln", "> $200 bln", "< $300 mln", "< $2 bln", "< $10 bln", "< $200 bln"],
            "default_index": 6
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
            "default_index": 3
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
            "default_index": 3
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
            "args_items": ["Any", "< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 1
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
            "args_items": ["Any", "< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 3
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
            "args_items": ["Any", "< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 1
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
            "args_items": ["Any", "< 1", "< 2", "< 3", "> 1", "> 2", "> 3"],
            "default_index": 1
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 3
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 3
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 2
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 3
        }
    },
    "EPS next Y_%":{
        "name": "EPS next Y_%",
        "type": "from_end",
        "description": "EPS growth next year",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "EPS next Y",
            "checkValConvertor": (val) => { return val * 100 },
            "display_format": "%",
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 3
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 3
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 3
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
            "args_items": ["Any", "< 0.2", "< 0.4", "< 0.6", "< 0.8", "< 1", "< 1.2", "< 1.4", "< 1.6", "< 1.8", "< 2", "> 0.2", "> 0.4", "> 0.6", "> 0.8", "> 1", "> 1.2", "> 1.4", "> 1.6", "> 1.8", "> 2"],
            "default_index": 3
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
            "args_items": ["Any", "< 0.2", "< 0.4", "< 0.6", "< 0.8", "< 1", "< 1.2", "< 1.4", "< 1.6", "< 1.8", "< 2", "> 0.2", "> 0.4", "> 0.6", "> 0.8", "> 1", "> 1.2", "> 1.4", "> 1.6", "> 1.8", "> 2"],
            "default_index": 3
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
            "args_items": ["Any", "< 0.5", "< 1", "< 1.5", "< 2", "< 3", "< 4", "< 5", "> 0.5", "> 1", "> 1.5", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 11
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
            "args_items": ["Any", "< 0.5", "< 1", "< 1.5", "< 2", "< 3", "< 4", "< 5", "> 0.5", "> 1", "> 1.5", "> 2", "> 3", "> 4", "> 5"],
            "default_index": 11
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
            "args_items": ["Any", "> 0%", "> 1%", "> 2%", "> 3%", "> 4%", "> 5%", "> 6%", "> 7%", "> 8%", "> 9%", "> 10%"],
            "default_index": 6
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
            "args_items": ["Any", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
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
            "args_items": ["Any", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
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
            "args_items": ["Any", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
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
            "args_items": ["Any", "> 0%", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 0%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 1
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
            "args_items": ["Any", "> 0%", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 0%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 1
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 5%", "< 10%", "< 15%", "< 20%", "< 25%", "< 30%"],
            "default_index": 7
        }
    },
    "Beneish Model":{
        "name": "Beneish Model",
        "type": "from_end",
        "description": "Using financial ratios and eight variables to identify whether a company has manipulated its earnings",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Beneish Model",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["Any", "< -2.22", "< -1.78", "> -2.22", "> -1.78", "-2.22 ~ -1.78"],
            "default_index": 1
        }
    },
    "ESG_TotalEsg":{
        "name": "ESG_TotalEsg",
        "type": "from_end",
        "description": "Sustainalytics total ESG risk score",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Total ESG Risk",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["Any", "< 10", "< 20", "< 30", "< 40"],
            "default_index": 1
        }
    },
    "Recomm_RecommendationMean":{
        "name": "Recomm_RecommendationMean",
        "type": "from_end",
        "description": "Yahoo Finance recommendation rating",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "Recommendation",
            "checkValConvertor": (val) => { return val },
            "display_format": "",
            "args_items": ["Any", "< 2", "< 3", "< 4"],
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
            "args_items": ["Any", "> -5%", "> -10%", "> -15%", "> -20%", "> -25%", "> -30%", "> -35%", "> -40%", "> -45%", "> -50%", "> -55%", "> -60%"],
            "default_index": 4
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
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "> 35%", "> 40%", "> 45%", "> 50%", "> 55%", "> 60%"],
            "default_index": 2
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
            "args_items": ["Any", "> 0%", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< 0%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 1
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
            "args_items": ["Any", "> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 2
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
            "args_items": ["Any", "> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 3
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
            "args_items": ["Any", "> 0%", "> 20%", "> 40%", "> 60%", "> 80%", "> 100%", "> 120%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 2
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
            "args_items": ["Any", "> 0%", "> 20%", "> 40%", "> 60%", "> 100%", "> 200%", "> 300%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 2
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
            "args_items": ["Any", "> 0%", "> 20%", "> 40%", "> 60%", "> 80%", "> 100%", "> 120%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
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
            "args_items": ["Any", "> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 1
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
            "args_items": ["Any", "> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%"],
            "default_index": 2
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
            "args_items": ["Any", "> 0%", "> 10%", "> 20%", "> 30%", "> 40%", "> 50%", "> 60%", "> 70%", "> 80%", "> 90%", "< 0%", "< -10%", "< -20%", "< -30%", "< -40%", "< -50%", "< -60%", "< -70%", "< -80%", "< -90%"],
            "default_index": 3
        }
    },
}

export const DefaultGroupChecklist = [
    {
        "name": "Default Checklist",
        "symbols": ["C", "WFC", "BAC", "AA", "CAAP", "ADUS"],
        "list": [
        { 
            "name": "P/E", 
            "condition": {"from": "", "end": "10"}
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
        ]
    }
]

export const CheckpointsKeyList = Object.keys(ChecklistKey_Def).reduce((acc, key, index) => {
    if (ChecklistKey_Def[key].checkpoint) {
      acc.push(key)
    }
    return acc
}, [])

export const COOKIE_KEY_CHECKLISTS = "checklists"
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