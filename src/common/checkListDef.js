export const ChecklistKey_Def = {
    "symbol":{
        "name": "Symbol",
        "type": "symbol"
    },
    "P/E":{
        "name": "P/E",
        "type": "from_end",
        "default": {
            "args_items": ["< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
            "default_index": 3
        }
    },
    "eps_analysis":{
        "name": "EPS Analysis",
        "type": "tags",
        "default": {
            "args_items": ["all_positive", "keep_growth"],
            "default_selects": ["all_positive"]
        }
    },
    "eps_financials":{
        "name": "EPS Financials",
        "type": "tags",
        "default": {
            "args_items": ["all_positive", "keep_growth"],
            "default_selects": ["all_positive"]
        }
    }
}

export const ChecklistTooltips = "This is a tooltip"