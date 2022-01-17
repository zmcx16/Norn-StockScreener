// options
export const Options_Def = [
  {
    name: 'output_bias_0.1_1.0_NaN',
    display_name: 'Valuation Bias: last price > 0.1; premium > 100%'
  },
  {
    name: 'output_bias_0.5_NaN_-0.5',
    display_name: 'Valuation Bias: last price > 0.1; discount > 50%'
  },
  {
    name: 'self_query',
    display_name: 'Self Query'
  },
]

export const SelfQuery_Def = {
  parameters: [
    {
      name: "symbol",
      display_name: "Symbol",
      val: "DAC"
    },
    {
      name: "min_next_days",
      display_name: "Min Next Days",
      val: "0"
    },
    {
      name: "max_next_days",
      display_name: "Max Next Days",
      val: "45"
    },
    {
      name: "last_trade_days",
      display_name: "Last Trade Days",
      val: "3"
    },
    {
      name: "ewma_his_vol_period",
      display_name: "EWMA History Vol. Period",
      val: "21"
    },
    {
      name: "ewma_his_vol_lambda",
      display_name: "EWMA History Vol. Lambda",
      val: "0.94"
    },
    {
      name: "proxy",
      display_name: "Proxy",
      val: ""
    },
  ]
}

export const NornFinanceAPIUrl = "wss://norn-finance.zmcx16.moe"