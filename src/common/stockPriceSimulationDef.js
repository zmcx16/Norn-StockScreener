
export const Query_Def = {
    parameters: [
      {
        name: "symbol",
        display_name: "Symbol",
        val: "THO",
        gridsm: 1,
      },
      {
        name: "days",
        display_name: "Simulation Days",
        val: "30",
        min: 1,
        max: 252,
        gridsm: 1,
      },
      {
        name: "iteration",
        display_name: "Iteration",
        val: "50",
        min: 1,
        max: 100,
        gridsm: 1,
      },
      {
        name: "ewma_his_vol_period",
        display_name: "EWMA History Volatility Period",
        val: "21",
        gridsm: 2,
      },
      {
        name: "ewma_his_vol_lambda",
        display_name: "EWMA History Volatility Lambda",
        val: "0.94",
        gridsm: 2,
      },
      {
        name: "mu",
        display_name: "Expected Return (default: 1yr data)",
        val: "",
        gridsm: 2,
      },
      {
        name: "vol",
        display_name: "Volatility (default: EWMA Vol data)",
        val: "",
        gridsm: 2,
      },
    ]
  }
  