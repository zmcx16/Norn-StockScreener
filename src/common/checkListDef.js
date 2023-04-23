export const ChecklistKey_Def = {
    "symbol":{
        "name": "Symbol",
        "type": "symbol",
        "checkpoint": false,
    },
    "P/E":{
        "name": "P/E",
        "type": "from_end",
        "description": "Price to Earnings (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "P/E Ratio",
            "display_format": "",
            "args_items": ["< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
            "default_index": 3
        }
    },
    "ROE":{
        "name": "ROE",
        "type": "from_end",
        "description": "Return on Equity (TTM)",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "ROE",
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
            "display_format": "%",
            "args_items": ["Any", "> 5%", "> 10%", "> 15%", "> 20%", "> 25%", "> 30%", "< -5%", "< -10%", "< -15%", "< -20%", "< -25%", "< -30%"],
            "default_index": 2
        }
    },
    "eps_analysis":{
        "name": "EPS Analysis",
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
        "name": "EPS Financials",
        "type": "tags",
        "description": "EPS data from the Financial Statements",
        "checkpoint": true,
        "checkpoint_comp": {
            "display_name": "EPS Financials",
            "display_format": "",
            "args_items": ["all_positive", "keep_growth"],
            "default_selects": ["all_positive"]
        }
    }
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
            "condition": {"from": "0.15", "end": ""}
        },
        { 
            "name": "ROA", 
            "condition": {"from": "0.1", "end": ""}
        },
        { 
            "name": "ROI", 
            "condition": {"from": "0.1", "end": ""}
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

export const ChecklistTooltips = "This is a tooltip"