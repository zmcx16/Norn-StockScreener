export const MFDataTemplate = {
  weights: [
    {
      name: "E/P_w",
      display_name: "E/P weight",
      val: "1.0"
    },
    {
      name: "B/P_w",
      display_name: "B/P weight",
      val: "1.0"
    },
    {
      name: "S/P_w",
      display_name: "S/P weight",
      val: "1.0"
    },
    {
      name: "FCF/P_w",
      display_name: "FCF/P weight",
      val: "0.5"
    },
    {
      name: "ROA_w",
      display_name: "ROA weight",
      val: "1.0"
    },
    {
      name: "ROE_w",
      display_name: "ROE weight",
      val: "1.0"
    },
    {
      name: "ROI_w",
      display_name: "ROI weight",
      val: "1.0"
    },
    {
      name: "DIV_w",
      display_name: "Dividend % weight",
      val: "0.5"
    }       
  ]      
}

export const MFUrl = "https://project.zmcx16.moe/?page=investment-formula"
export const MFNote = `
Ranked the stocks by multiple factors simulatneously: \n
Value factor: Earnings / Price, Book / Price, Sales / Price \n
Growth factor: ROE, ROA, ROI\n
`