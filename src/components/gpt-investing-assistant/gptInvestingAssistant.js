import React, { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import shortid from 'shortid'
import useFetch from 'use-http'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import CompanyAnalysisParam from './companyAnalysisParam'
import { AnalysisSelectDef, CompanyAnalysisGPTResponseExample } from '../../common/gptdef'
import { NSSServerUrl } from '../../common/common'
import ModalWindow from '../modalWindow'

import commonStyle from '../common.module.scss'
import gptInvestingAssistantStyle from './gptInvestingAssistant.module.scss'


const GPTResponse = ({GPTResponseRef, loadingAnimeRef}) => {
  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })
  const { post, response } = useFetch(NSSServerUrl)
  const drawGPTResponse = (isExample, data) => {
    return <div className={gptInvestingAssistantStyle.gptResponse}>
      <Box component="div" sx={{ border: 1, borderColor: 'primary.main', borderRadius: 1, padding: "0px 20px"}}>
        <div style={{opacity: isExample ? 0.5 : 1 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data}</ReactMarkdown>
        </div>
      </Box>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>  
  }

  GPTResponseRef.current.RequestGPTAPI = async (api, body) => {
    loadingAnimeRef.current.setLoading(true)
    console.log(api, body)
    const resp_data = await post(api, body)
    if (response.ok) {
      console.log(resp_data)
      if (resp_data['ret'] === 0){
        if ('data' in resp_data && 'contents' in resp_data['data']) {
          setGPTResponse(drawGPTResponse(false, resp_data['data']['contents'].join('\n\n')))
        }
      } else {
        modalWindowRef.current.popModalWindow(<h2>Get GPT Response Failed, ret={resp_data['ret']}</h2>)
      }
    }else {
      modalWindowRef.current.popModalWindow(<h2>Get GPT Response Failed.</h2>)
    }
    loadingAnimeRef.current.setLoading(false)
  }

  const [gptResponse, setGPTResponse] = useState(drawGPTResponse(true, CompanyAnalysisGPTResponseExample))
  return gptResponse
}

const GPTInvestingAssistant = ({loadingAnimeRef}) => {
  const GPTResponseRef = useRef({
    RequestGPTAPI: null,
  })

  const [paramPannel, setParamPannel] = useState(<></>)

  const renderPage = (selectIndex) => {
    loadingAnimeRef.current.setLoading(false)
    switch (selectIndex) {
      case 0:
        setParamPannel(<CompanyAnalysisParam GPTResponseRef={GPTResponseRef} />)
        break
      default:
        break
    }
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
            <Tooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{AnalysisSelectDef[arg].description}</span>} >
              <IconButton>
                <InfoIcon color="action"/>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        {paramPannel}
        <GPTResponse GPTResponseRef={GPTResponseRef} loadingAnimeRef={loadingAnimeRef} />
      </div>
    </div>
  )
}

export default GPTInvestingAssistant
