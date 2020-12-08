export const NMDataTemplate = {
  tactics: [
    {
      type: "BenjaminGraham_v1",
      abbr: "BG",
      color: {
        main: { backgroundColor: '#f44336', color: '#fff' },     // Shade: 500
        avatar: { backgroundColor: '#d32f2f', color: '#fff' },   // Shade: 700
      },
      enable: true
    },
    {
      type: "HarryBurnIII_v1",
      abbr: "HB",
      color: {
        main: { backgroundColor: '#2196f3', color: '#fff' },
        avatar: { backgroundColor: '#1976d2', color: '#fff' },
      },
      enable: true
    },
    {
      type: "JamesPOshaughnessy_v1",
      abbr: "JS",
      color: {
        main: { backgroundColor: '#8bc34a', color: '#000' },
        avatar: { backgroundColor: '#689f38', color: '#fff' },
      },
      enable: true
    },
    {
      type: "JohnNeff_v1",
      abbr: "JN",
      color: {
        main: { backgroundColor: '#ff5722', color: '#fff' },
        avatar: { backgroundColor: '#e64a19', color: '#fff' },
      },
      enable: true
    },
    {
      type: "MichaelBerry_v1",
      abbr: "MB",
      color: {
        main: { backgroundColor: '#673ab7', color: '#fff' },
        avatar: { backgroundColor: '#512da8', color: '#fff' },
      },
      enable: true
    },
    {
      type: "MichaelPrice_v1",
      abbr: "MP",
      color: {
        main: { backgroundColor: '#03a9f4', color: '#000' },
        avatar: { backgroundColor: '#0288d1', color: '#fff' },
      },
      enable: true
    },
    {
      type: "PeterLynch_v1",
      abbr: "PL",
      color: {
        main: { backgroundColor: '#4caf50', color: '#000' },
        avatar: { backgroundColor: '#388e3c', color: '#fff' },
      },
      enable: true
    },
    {
      type: "RichardBuchwald_MarvinKline_v1",
      abbr: "RM",
      color: {
        main: { backgroundColor: '#ffeb3b', color: '#000' },
        avatar: { backgroundColor: '#fbc02d', color: '#000' },
      },
      enable: true
    },
    {
      type: "RobertSanborn_v1",
      abbr: "RS",
      color: {
        main: { backgroundColor: '#e91e63', color: '#fff' },
        avatar: { backgroundColor: '#c2185b', color: '#fff' },
      },
      enable: true
    },
    {
      type: "Stasistw_v1",
      abbr: "S",
      color: {
        main: { backgroundColor: '#cddc39', color: '#000' },
        avatar: { backgroundColor: '#afb42b', color: '#000' },
      },
      enable: true
    },
    {
      type: "StevenCLeuthold_v1",
      abbr: "SL",
      color: {
        main: { backgroundColor: '#00bcd4', color: '#fff' },
        avatar: { backgroundColor: '#0097a7', color: '#000' },
      },
      enable: true
    },
    {
      type: "TrinityInvestmentManagement_v1",
      abbr: "TI",
      color: {
        main: { backgroundColor: '#ffc107', color: '#000' },
        avatar: { backgroundColor: '#ffa000', color: '#000' },
      },
      enable: true
    },
    {
      type: "WarrenEBuffett_v1",
      abbr: "WB",
      color: {
        main: { backgroundColor: '#3f51b5', color: '#fff' },
        avatar: { backgroundColor: '#303f9f', color: '#fff' },
      },
      enable: true
    },
    {
      type: "zmcx16_v1",
      abbr: "Z",
      color: {
        main: { backgroundColor: '#009688', color: '#fff' },
        avatar: { backgroundColor: '#00796b', color: '#fff' },
      },
      enable: true
    },
  ],
  args_items: ["Any", "< 20", "< 40", "< 60", "< 80", "> 0", "> 20", "> 40", "> 60", "> 80"],
  default_index: 3
}

export const FinvizUrl = "https://finviz.com/"
export const YahooFinanceEnUrl = "https://finance.yahoo.com/"
export const YahooFinanceZhUrl = "https://hk.finance.yahoo.com/"
export const NMUrl = "https://norn-minehunter.zmcx16.moe/"
export const NMNote = `
Do you want to know the stocks which you hold are Treasure or Bomb?\n
Norn-Minehunter can help you to scan the stock financial & technical data to inspect the company's financial health & trend.\n
[The avg score is the lower the better.]\n
`
export const FCDataTemplate = [
  {
    name: "Market Cap",
    display_name: "Market Cap",
    tooltip: "market capitalization",
    args_items: ["Any (> $50 mln)", "$50 mln - $300 mln", "$300 mln - $2 bln", "$2 bln - $10 bln", "$10 bln - $200 bln", "> $300 mln", "> $2 bln", "> $10 bln", "> $200 bln", "< $300 mln", "< $2 bln", "< $10 bln", "< $200 bln"],
    default_index: 5
  },
  {
    name: "Dividend %",
    display_name: "Dividend (%)",
    tooltip: "Dividend yield (annual)",
    args_items: ["Any", "0%", "> 1%", "> 2%", "> 3%", "> 4%", "> 5%", "> 6%", "> 7%", "> 8%", "> 9%", "> 10%"],
    default_index: 6
  },
  {
    name: "P/E",
    display_name: "P/E Ratio",
    tooltip: "Price to Earnings (ttm)",
    args_items: ["Any", "< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
    default_index: 3
  },
  {
    name: "Forward P/E",
    display_name: "Forward P/E",
    tooltip: "Forward Price to Earnings (next fiscal year)",
    args_items: ["Any", "< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
    default_index: 3
  },
  {
    name: "PEG",
    display_name: "PEG Ratio",
    tooltip: "Price to Earnings to Growth",
    args_items: ["Any", "< 1", "< 2", "< 3", "> 1", "> 2", "> 3"],
    default_index: 1
  },
  {
    name: "P/S",
    display_name: "P/S Ratio",
    tooltip: "Price to Sales (ttm)",
    args_items: ["Any", "< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
    default_index: 1
  },
  {
    name: "P/B",
    display_name: "P/B Ratio",
    tooltip: "Price to Book (mrq)",
    args_items: ["Any", "< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
    default_index: 1
  },
  {
    name: "P/C",
    display_name: "P/C Ratio",
    tooltip: "Price to Cash per share (mrq)",
    args_items: ["Any", "< 1", "< 2", "< 3", "< 4", "< 5", "> 1", "> 2", "> 3", "> 4", "> 5"],
    default_index: 3
  },
  {
    name: "P/FCF",
    display_name: "P/FCF",
    tooltip: "Price to Free Cash Flow (ttm)",
    args_items: ["Any", "< 5", "< 10", "< 15", "< 20", "< 25", "< 30", "< 40", "< 50", "> 5", "> 10", "> 15", "> 20", "> 25", "> 30", "> 40", "> 50"],
    default_index: 3
  },
]

export const StockSectorDict = {
  '-1': 'Nan',
  '0': 'Consumer Cyclical'
}

export const StockIndustryDict = {
  '-1': 'Nan',
  '0': 'Furnishings, Fixtures & Appliances',
}