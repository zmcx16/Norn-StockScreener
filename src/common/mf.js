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
    },
    {
      name: "InsiderOwn_w",
      display_name: "Insider Own weight",
      val: "0.2"
    },
    {
      name: "InsiderTrans_w",
      display_name: "Insider Trans weight",
      val: "0.2"
    },
    {
      name: "InstOwn_w",
      display_name: "Inst Own weight",
      val: "0.2"
    },
    {
      name: "InstTrans_w",
      display_name: "Inst Trans weight",
      val: "0.2"
    },
    {
      name: "TgtPrice_w",
      display_name: "Target Price weight",
      val: "0.5"
    },
    {
      name: "ShortFloat_w",
      display_name: "Short Float weight",
      val: "0"
    },
    {
      name: "ShortRatio_w",
      display_name: "Short Ratio weight",
      val: "0"
    }     
  ]      
}

export const MFUrl = "https://project.zmcx16.moe/?page=investment-formula"
export const MFNote = `
Ranked the stocks by multiple factors simulatneously: \n
Value factor:  Earnings / Price, Book / Price, Sales / Price\n
Growth factor: ROE, ROA, ROI\n
Other factor:  Dividend (%), Insider ownership, Insider transcations,\n
               Institution ownership, Institution transcations\n
               Difference Target Price and Current Price\n
`