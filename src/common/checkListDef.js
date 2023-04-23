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
            "args_items": ["< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
            "default_index": 3
        }
    },
    "eps_analysis":{
        "name": "EPS Analysis",
        "type": "tags",
        "description": "EPS data from the Analysis",
        "checkpoint": true,
        "checkpoint_comp": {
            "args_items": ["all_positive", "keep_growth"],
            "default_selects": ["all_positive"]
        }
    },
    "eps_financials":{
        "name": "EPS Financials",
        "type": "tags",
        "description": "EPS data from the Financial Statements",
        "checkpoint": true,
        "checkpoint_comp": {
            "args_items": ["all_positive", "keep_growth"],
            "default_selects": ["all_positive", "keep_growth"]
        }
    }
}

export const CheckpointsKeyList = Object.keys(ChecklistKey_Def).reduce((acc, key, index) => {
    if (ChecklistKey_Def[key].checkpoint) {
      acc.push(key)
    }
    return acc
}, [])

export const ChecklistTooltips = "This is a tooltip"