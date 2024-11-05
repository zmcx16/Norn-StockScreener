import React, { useState, useRef } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { blue } from '@mui/material/colors'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/styles'
import { isMobile } from 'react-device-detect'

import { CompanyAnalysisAPI, CompanyAnalysisFiltersDef, CompanyAnalysisGurusDef } from '../../common/gpt/companyAnalysisdef'
import { ModelComponent, FiltersComponent, MenuProps } from './commonParam'
import ModalWindow from '../modalWindow'

import gptInvestingAssistantStyle from './gptInvestingAssistant.module.scss'


const GurusComponent = ({ gurusRef }) => {
  const [gurusArg, setGurusArg] = useState(CompanyAnalysisGurusDef.map((value, index) => {return value.default ? index : -1}).filter((value) => {return value !== -1}))
  const gurusInputRef = useRef(null)

  gurusRef.current.getAllGurus = () => {
    let gurus = gurusArg.map((value) => {return CompanyAnalysisGurusDef[value].name})
    let more_gurus = gurusInputRef.current.value
    if (more_gurus !== '') {
      gurus = gurus.concat(more_gurus.split(',').map((value) => {return value.trim()}))
    }
    return gurus
  }

  return (
    <div style={{display: "inline-flex", width: "100%"}}>
      <FormControl size="small" variant="outlined" style={{width:"100%"}}>
        <InputLabel htmlFor="gurusArg-select">{'Investment Gurus'}</InputLabel>
        <Select
          value={gurusArg}
          multiple
          onChange={(event) => {
            setGurusArg(event.target.value)
          }}
          label={'Investment Gurus'}
          input={<OutlinedInput label="Investment Gurus" />}
          renderValue={(selected) => selected.map((value) => CompanyAnalysisGurusDef[value].name).join(', ')}
          MenuProps={MenuProps}
        >
          {
            CompanyAnalysisGurusDef.map((value, index) => {
              return (
                <MenuItem key={index} value={index}>
                  <Checkbox checked={gurusArg.includes(index)} />
                  <ListItemText primary={value.name} />
                </MenuItem>)
            })
          }
        </Select>
      </FormControl>
      <form noValidate autoComplete="off" style={{paddingLeft:"5px", width: "inherit"}}>
        <TextField className={gptInvestingAssistantStyle.valueText} placeholder='Add more investment gurus, such as "Ken Fisher, Charlie Munger"' label={"More Investment Gurus"} variant="outlined" size="small" inputRef={gurusInputRef} />
      </form>
    </div>)
}


const CompanyAnalysisParam = ({GPTResponseRef}) => {
  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const symbolInputRef = useRef(null)
  const modelInputRef = useRef(null)

  const statisticsRef = useRef(CompanyAnalysisFiltersDef.map((value, index) => {return value.default ? index : -1}).filter((value) => {return value !== -1}))
  const gurusRef = useRef({
    getAllGurus: null
  })

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
                      filters: statisticsRef.current.map((value) => {return CompanyAnalysisFiltersDef[value].name}),
                      gurus: gurusRef.current.getAllGurus(),
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
                  }
                  GPTResponseRef.current.requestGPTAPI(CompanyAnalysisAPI, body)
                }}>{'Analysis'}</Button>
              </ThemeProvider>
            </Box>
          </Grid>
          <Grid item md={12} xs={12}>
            <FiltersComponent filtersRef={statisticsRef} filterName="Key Statistics" filtersDef={CompanyAnalysisFiltersDef} />
          </Grid>
          <Grid item md={12} xs={12}>
            <GurusComponent gurusRef={gurusRef} />
          </Grid>
        </Grid>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default CompanyAnalysisParam