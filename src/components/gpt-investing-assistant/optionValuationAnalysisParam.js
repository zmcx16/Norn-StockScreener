import React, { useState, useRef } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import { blue } from '@mui/material/colors'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/styles'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import { isMobile } from 'react-device-detect'

import { IsValidDateYYYYDashMMDashDD } from '../../common/utils'
import { OptionValuationAnalysisAPI, OptionValuationAnalysisDef } from '../../common/gpt/optionValuationAnalysisdef'
import { ModelComponent, FiltersComponent, DatePickerComponent } from './commonParam'
import ModalWindow from '../modalWindow'

import gptInvestingAssistantStyle from './gptInvestingAssistant.module.scss'


const CallPutComponent = ({callPutRef}) => {
  const [value, setValue] = useState('call');
  callPutRef.current.getValue = () => {
    return value
  }
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="call-put-buttons-group-label"
        name="call-put-radio-buttons-group"
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
      >
        <FormControlLabel value="call" control={<Radio />} label="Call Option" />
        <FormControlLabel value="put" control={<Radio />} label="Put Option" />
      </RadioGroup>
    </FormControl>
  )
}

const OptionValuationAnalysisParam = ({GPTResponseRef}) => {
  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const symbolInputRef = useRef(null)
  const modelInputRef = useRef(null)
  const callPutRef = useRef({getValue: null})
  const expirationDateRef = useRef({getValue: null})
  const strikePriceRef = useRef(null)
  const valuationDataRef = useRef(OptionValuationAnalysisDef.map((value, index) => {return value.default ? index : -1}).filter((value) => {return value !== -1}))

  const openAIAPIKeyInputRef = useRef(null)

  return (
    <div className={gptInvestingAssistantStyle.queryPannel}>
      <div className={gptInvestingAssistantStyle.parameterBlock}>
        <Grid container spacing={2}>
          <Grid item md={1} xs={12}>
            <form noValidate autoComplete="off">
              <TextField className={gptInvestingAssistantStyle.valueText} label={"Symbol"} variant="outlined" defaultValue={"DIS"} size="small" inputRef={symbolInputRef} />
            </form>
          </Grid>
          <Grid item md={4} xs={12}>
            <ModelComponent modelInputRef={modelInputRef} />
          </Grid>
          <Grid item md={6} xs={12}>
            <form noValidate autoComplete="off">
              <TextField className={gptInvestingAssistantStyle.valueText} label={"OpenAI API Key"} variant="outlined" defaultValue={""} size="small" inputRef={openAIAPIKeyInputRef} />
            </form>
          </Grid>
          <Grid item md={1} xs={12} >
            <Box display="flex" justifyContent="flex-end">
              <ThemeProvider theme={createTheme({ palette: { primary: blue } })}>
                <Button className={isMobile ? gptInvestingAssistantStyle.queryBtnMobile : gptInvestingAssistantStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                  let body = {
                    data: {
                      symbol: symbolInputRef.current.value,
                      model: modelInputRef.current.value,
                      api_key: openAIAPIKeyInputRef.current.value,
                      option_type: callPutRef.current.getValue(),
                      expiration_date: expirationDateRef.current.getValue(),
                      strike_price: strikePriceRef.current.value,
                      filters: valuationDataRef.current.map((value) => {return OptionValuationAnalysisDef[value].name}),
                    }
                  }
                  if (body.data.symbol === '') {
                    modalWindowRef.current.popModalWindow(<h2>[Invalid] Symbol is empty.</h2>)
                    return
                  } else if (body.data.model === '') {
                    modalWindowRef.current.popModalWindow(<h2>[Invalid] Model is empty.</h2>)
                    return
                  } else if (body.data.api_key === '') {
                    modalWindowRef.current.popModalWindow(<h2>[Invalid] OpenAI API Key is empty.</h2>)
                    return
                  } else if (body.data.option_type !== 'put ' && body.data.option_type !== 'call') {
                    modalWindowRef.current.popModalWindow(<h2>[Invalid] Option Type is invalid.</h2>)
                    return
                  } else if (!IsValidDateYYYYDashMMDashDD(body.data.expiration_date)) {
                    modalWindowRef.current.popModalWindow(<h2>[Invalid] Expiration Date is invalid.</h2>)
                    return
                  } else if (isNaN(body.data.strike_price)) {
                    modalWindowRef.current.popModalWindow(<h2>[Invalid] Strike Price is invalid.</h2>)
                    return
                  }
                  GPTResponseRef.current.requestGPTAPI(OptionValuationAnalysisAPI, body)
                }}>{'Analysis'}</Button>
              </ThemeProvider>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>          
            <DatePickerComponent datePickerRef={expirationDateRef} label={"Expiration Date"} />
          </Grid>
          <Grid item md={2} xs={12}>   
            <form noValidate autoComplete="off" style={{paddingLeft:"5px", width: "inherit"}}>
              <TextField className={gptInvestingAssistantStyle.valueText} label={"Strike Price"} variant="outlined" size="small" inputRef={strikePriceRef} />
            </form>
          </Grid>
          <Grid item md={8} xs={12}>
            <CallPutComponent callPutRef={callPutRef} />
          </Grid>
          <Grid item md={12} xs={12}>
            <FiltersComponent filtersRef={valuationDataRef} filterName="Valuation Data" filtersDef={OptionValuationAnalysisDef} />
          </Grid>
        </Grid>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default OptionValuationAnalysisParam