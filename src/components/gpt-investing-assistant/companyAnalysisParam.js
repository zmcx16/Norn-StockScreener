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
import shortid from 'shortid'
import { isMobile } from 'react-device-detect'

import { CompanyAnalysisAPI, GPTModelSelectDef, CompanyAnalysisFiltersDef, CompanyAnalysisGurusDef } from '../../common/gptdef'
import ModalWindow from '../modalWindow'

import gptInvestingAssistantStyle from './gptInvestingAssistant.module.scss'

const CompanyAnalysisParam = ({GPTInvestingAssistantRef}) => {
  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const symbolInputRef = useRef(null)

  const [modelArg, setModelArg] = useState(0)
  const renderModelInput = (defaultValue) => {
    return <form noValidate autoComplete="off" style={{paddingLeft:"5px", width: "inherit"}}>
      <TextField className={gptInvestingAssistantStyle.valueText} placeholder='Select or type the model name' label={"GPT Model"} variant="outlined" defaultValue={defaultValue} size="small" inputRef={modelInputRef} />
    </form>
  }
  const modelInputRef = useRef(null)
  const [modelInput, setModelInput] = useState(renderModelInput(GPTModelSelectDef[0]))

  const [statisticsArg, setStatisticsArg] = useState(CompanyAnalysisFiltersDef.map((value, index) => {return value.default ? index : -1}).filter((value) => {return value !== -1}))
  const [gurusArg, setGurusArg] = useState(CompanyAnalysisGurusDef.map((value, index) => {return value.default ? index : -1}).filter((value) => {return value !== -1}))
  const gurusInputRef = useRef(null)

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

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
                <InputLabel htmlFor="modelArg-select">{'Model Name'}</InputLabel>
                <Select
                  native
                  value={modelArg}
                  displayEmpty
                  onChange={(event) => {
                    setModelArg(event.target.value)
                    setModelInput(renderModelInput(GPTModelSelectDef[event.target.value]))
                  }}
                  label={'Model Name'}
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
                  let gurus = gurusArg.map((value) => {return CompanyAnalysisGurusDef[value].name})
                  let more_gurus = gurusInputRef.current.value
                  if (more_gurus !== '') {
                    gurus = gurus.concat(more_gurus.split(',').map((value) => {return value.trim()}))
                  }
                  
                  let body = {
                    data: {
                      symbol: symbolInputRef.current.value,
                      model: modelInputRef.current.value,
                      api_key: openAIAPIKeyInputRef.current.value,
                      filters: statisticsArg.map((value) => {return CompanyAnalysisFiltersDef[value].name}),
                      gurus: gurus,
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

                  GPTInvestingAssistantRef.current.RequestGPTAPI(CompanyAnalysisAPI, body)
                }}>{'Analysis'}</Button>
              </ThemeProvider>
            </Box>
          </Grid>
          <Grid item md={12} xs={12} key={shortid.generate()}>
            <FormControl size="small" variant="outlined" style={{width:"100%"}}>
              <InputLabel htmlFor="statisticsArg-select">{'Key Statistics'}</InputLabel>
              <Select
                value={statisticsArg}
                multiple
                onChange={(event) => {
                  setStatisticsArg(event.target.value)
                }}
                label={'Key Statistics'}
                input={<OutlinedInput label="Key Statistics" />}
                renderValue={(selected) => selected.map((value) => CompanyAnalysisFiltersDef[value].display_name).join(', ')}
                MenuProps={MenuProps}
              >
                {
                  CompanyAnalysisFiltersDef.map((value, index) => {
                    return (
                      <MenuItem key={shortid.generate()} value={index}>
                        <Checkbox checked={statisticsArg.includes(index)} />
                        <ListItemText primary={value.display_name} />
                      </MenuItem>)
                  })
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12} xs={12} key={shortid.generate()}>
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
                        <MenuItem key={shortid.generate()} value={index}>
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
            </div>
          </Grid>
        </Grid>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default CompanyAnalysisParam