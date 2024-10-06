import React, { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import { blue } from '@mui/material/colors'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/styles'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete'
import shortid from 'shortid'
import useFetch from 'use-http'
import ReactMarkdown from 'react-markdown'
import { isMobile } from 'react-device-detect'

import ModalWindow from '../modalWindow'

import commonStyle from '../common.module.scss'
import gptInvestingAssistantStyle from './gptInvestingAssistant.module.scss'

const GPTModelSelectDef = ['gpt-4o', 'gpt-3.5-turbo']

const AnalysisSelectDef = [
  {
    name: 'CompanyAnalysis',
    display_name: 'Company Analysis',
    description: `Company Analysis`,
    component: null,
  }, 
]

const CompanyAnalysisParam = ({GPTInvestingAssistantRef}) => {
  const symbolInputRef = useRef(null)
  const [modelArg, setModelArg] = useState(0)
  const renderModelInput = (defaultValue) => {
    return <form noValidate autoComplete="off" style={{paddingLeft:"5px", width: "inherit"}}>
      <TextField className={gptInvestingAssistantStyle.valueText} placeholder='Select or type the model name' label={"GPT Model"} variant="outlined" defaultValue={defaultValue} size="small" inputRef={modelInputRef} />
    </form>
  }
  const modelInputRef = useRef(null)
  const [modelInput, setModelInput] = useState(renderModelInput(GPTModelSelectDef[0]))
  const openAIAPIKeyInputRef = useRef(null)
  return (
    <div className={gptInvestingAssistantStyle.queryPannel}>
      <div className={gptInvestingAssistantStyle.parameterBlock}>
        <Grid container spacing={2}>
          <Grid item md={1} xs={12} key={shortid.generate()}>
            <form noValidate autoComplete="off">
              <TextField className={gptInvestingAssistantStyle.valueText} label={"Symbol"} variant="outlined" defaultValue={"DIS"} size="small" inputRef={symbolInputRef} />
            </form>
          </Grid>
          <Grid item md={4} xs={12} key={shortid.generate()}>
            <div style={{display: "inline-flex", width: "100%"}}>
              <FormControl size="small" variant="outlined" style={{minWidth:"150px"}}>
                <InputLabel htmlFor="modelArg-select">{'Model Select'}</InputLabel>
                <Select
                  native
                  value={modelArg}
                  displayEmpty
                  onChange={(event) => {
                    setModelArg(event.target.value)
                    setModelInput(renderModelInput(GPTModelSelectDef[event.target.value]))
                  }}
                  label={'Model Select'}
                >
                  {
                    GPTModelSelectDef.map((value, index) => {
                      return <option key={shortid.generate()} index={index} value={index}>{value}</option>
                    })
                  }
                </Select>
              </FormControl>
              {modelInput}
            </div>
          </Grid>
          <Grid item md={6} xs={12} key={shortid.generate()}>
            <form noValidate autoComplete="off">
              <TextField className={gptInvestingAssistantStyle.valueText} label={"OpenAI API Key"} variant="outlined" defaultValue={""} size="small" inputRef={openAIAPIKeyInputRef} />
            </form>
          </Grid>
          <Grid item md={1} xs={12} >
            <Box display="flex" justifyContent="flex-end">
              <ThemeProvider theme={createTheme({ palette: { primary: blue } })}>
                <Button className={isMobile ? gptInvestingAssistantStyle.queryBtnMobile : gptInvestingAssistantStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                  GPTInvestingAssistantRef.current.RequestGPTAPI("company-analysis", {symbol: symbolInputRef.current.value})
                }}>{'Analysis'}</Button>
              </ThemeProvider>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

const GPTInvestingAssistant = ({loadingAnimeRef}) => {

  const [gptResponse, setGPTResponse] = useState(<ReactMarkdown>{`The stock analysis for HPE (Hewlett Packard Enterprise) based on the provided data can be broken down into several key metrics and insights:

### Valuation:
- **P/E (Price-to-Earnings) Ratio:** 14.62 (current) and 9.70 (forward)  
  This suggests that the company is currently valued at 14.62 times its earnings but is expected to be cheaper in the future (lower P/E forward), indicating potential for earnings growth.
  
- **PEG (Price/Earnings to Growth):** 4.57  
  This metric is relatively high, which indicates that even though the stock has a decent P/E ratio, it may not be growing fast enough to justify its valuation. This could signal overvaluation based on growth expectations.

- **P/B (Price-to-Book):** 1.21  
  This shows that the market price is only slightly above the book value, which may imply that the stock is reasonably priced relative to its assets.

- **P/S (Price-to-Sales):** 0.92  
  This is quite low, suggesting the company is valued at less than 1x its annual sales, which is a positive sign for undervaluation.

### Performance & Momentum:
- **Recent Performance:**  
  - Weekly performance: +3.40%  
  - Monthly performance: +7.69%  
  - Quarterly performance: -0.70%  
  - Year-to-date (YTD) performance: +20.88%  
  - Yearly performance: +17.69%  
  
  The stock has performed well in the short term and year-to-date, but there's been slight underperformance over the quarter. Overall, the stock has shown strong momentum recently.

- **52-Week Range:**  
  The stock is currently trading at $20.52, with a 52-week low of $14.47 and a high of $22.82. The current price is closer to its high, but still down by 10.06% from the peak.

- **SMA (Simple Moving Averages):**  
  - 20-day: 11.58%  
  - 50-day: 10.56%  
  - 200-day: 14.62%  
  
  These figures show that the stock has been performing well above its moving averages, indicating bullish momentum.

### Earnings & Growth:
- **EPS (Earnings Per Share):**  
  - TTM (Trailing Twelve Months): 1.40  
  - Next quarter expected: 0.56  
  - Next year EPS: 2.12 (expected 7.98% growth)

  The EPS growth rate shows modest expected growth, but historical EPS this year has dropped by 8.89%. However, EPS over the past 5 years has grown by 4.61%.

- **Income:** $1.85B  
  - Profit margin: 6.41%, indicating solid profitability relative to revenue.
  
- **Sales:** $28.92B  
  - Operating margin: 7.51%  
  This operating margin, while not extremely high, is reasonable, especially in the tech hardware industry.

### Dividends & Payout:
- **Dividend Yield:** 2.53%  
  This is a decent dividend yield, and the payout ratio of 31.19% suggests that the company is retaining a good portion of its earnings for growth or other initiatives.

### Balance Sheet:
- **Debt/Equity Ratio:** 0.53  
  - LT Debt/Equity: 0.36  
  This indicates a moderate level of debt, which should be manageable given the company’s profitability and cash flow.

- **Cash per Share:** $3.01  
  This represents a healthy liquidity position.

- **Current Ratio:** 0.94  
  A current ratio below 1 indicates potential liquidity concerns, though this might not be alarming given the company’s large scale and assets.

### Analyst Sentiment:
- **Recommendation:** 2.33 (between Buy and Hold)  
  This indicates a moderate consensus towards buying the stock.

- **Target Price:** $21.15  
  The stock currently trades near this target price, implying limited short-term upside based on analyst expectations.

### Institutional & Insider Ownership:
- **Institutional Ownership:** 82.72%  
  This high institutional ownership reflects confidence from large investors.

- **Insider Ownership:** 0.47%  
  While insider ownership is small, recent insider transactions show a decrease (-11.63%), which might suggest caution among executives.

### Volatility & Risk:
- **Beta:** 1.20  
  This indicates that HPE is slightly more volatile than the overall market.

- **Volatility:** 2.51% (weekly) and 2.83% (monthly)  
  These volatility figures suggest that the stock experiences moderate price swings, typical of tech stocks.

### Overall Analysis:
HPE is trading at a reasonable valuation with a P/E below the market average, indicating it's not overpriced. Its growth prospects, while modest, seem steady with consistent sales and earnings. The company’s strong institutional backing, solid balance sheet, and decent dividend yield make it attractive for value and income investors. However, the low growth rate and high PEG ratio could indicate limited upside potential. The company is performing well compared to its moving averages, reflecting current bullish momentum, but long-term growth could be a bit constrained.`}</ReactMarkdown>)

  const fetchGPTResponseData = useFetch({ cachePolicy: 'no-cache' })
  const GPTInvestingAssistantRef = useRef({
    RequestGPTAPI: (api, body)=>{
      setGPTResponse("-- Loading --")
    }
  })

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })


  const renderPage = (selectIndex) => {
    loadingAnimeRef.current.setLoading(false)
  }

  const [arg, setArg] = useState(0)

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    renderPage(0)

    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <div className={commonStyle.defaultFont + ' ' + gptInvestingAssistantStyle.container}>
      <div key={shortid.generate()} >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl size="small" variant="outlined" className={gptInvestingAssistantStyle.analysisSelect}>
              <InputLabel htmlFor="arg-select">{'GPT Analysis'}</InputLabel>
              <Select
                native
                value={arg}
                displayEmpty
                onChange={(event) => {
                  setArg(event.target.value)
                  renderPage(event.target.value)
                }}
                label={'GPT Analysis'}
              >
                {
                  AnalysisSelectDef.map((value, index) => {
                    return <option key={shortid.generate()} index={index} value={index}>{value.display_name}</option>
                  })
                }
              </Select>
            </FormControl>
            <Tooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{"test"}</span>} >
              <IconButton>
                <InfoIcon color="action"/>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        {<CompanyAnalysisParam GPTInvestingAssistantRef={GPTInvestingAssistantRef} />}
        <div className={gptInvestingAssistantStyle.gptResponse}>
          <Box component="div" sx={{ border: 1, borderColor: 'primary.main', borderRadius: 1, padding: "0px 20px"}}>
            {gptResponse}
          </Box>
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default GPTInvestingAssistant
