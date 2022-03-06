import React, { useState, useEffect, useRef, createRef } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { blue } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/styles'
import shortid from 'shortid'
import useFetch from 'use-http'
import { isMobile } from 'react-device-detect'

import ModalWindow from '../modalWindow'

import { NoMaxWidthTooltip, GetDataByFetchObj } from '../../common/reactUtils'
import { Query_Def } from '../../common/stockPriceSimulationDef'
import { NornFinanceAPIServerDomain, QueryNote, NornFinanceAPIServerGithub } from '../../common/common'
import MonteCarloChart from '../monteCarloChart'

import commonStyle from '../common.module.scss'
import StockPriceSimulationStyle from './StockPriceSimulation.module.scss'

// query parameter
const genParameterField = (inputRef, name, value, display_name, gridsm) => {
  // add key to force re-render component
  return (
    <Grid item md={gridsm} xs={12} key={shortid.generate()}>
      <form noValidate autoComplete="off">
        <TextField id={name} className={StockPriceSimulationStyle.valueText} label={display_name} variant="outlined" defaultValue={value} size="small" inputRef={inputRef} />
      </form>
    </Grid>
  )
}

const ParameterNodesField = ({ queryParameterRef, queryParameterCurrentRef }) => {
  return Query_Def.parameters.map((value, index) => {
    return (
      genParameterField(queryParameterRef.current[index], value.name, queryParameterCurrentRef.current === null ? value.val : queryParameterCurrentRef.current[index], value.display_name, value.gridsm)
    )
  })
}

const FetchNornFinanceAPIServer = ({FetchNornFinanceAPIServerRef}) => {
  const useFetchNornFinanceAPIServer = useFetch("https://" + NornFinanceAPIServerDomain, { cachePolicy: 'no-cache' })
  FetchNornFinanceAPIServerRef.current.server = useFetchNornFinanceAPIServer
  return <></>
}

const MonteCarloChartComp = ({MonteCarloChartCompRef}) => {
  const [chart, setChart] = useState(<></>)
  MonteCarloChartCompRef.current.setChart = setChart
  return chart
}

const StockPriceSimulation = ({loadingAnimeRef}) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })
  
  const FetchNornFinanceAPIServerRef = useRef({
    server: null
  })

  const MonteCarloChartCompRef  = useRef({
    setChart: null
  })

  const [arg, setArg] = useState(0)

  const queryParameterRef = useRef([])
  Query_Def.parameters.forEach((value, index) => {
    queryParameterRef.current[index] = createRef()
    queryParameterRef.current[index].current = { value: value.val }
  })
  const queryParameterCurrentRef = useRef(null)
  
  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    loadingAnimeRef.current.setLoading(false)
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <div className={commonStyle.defaultFont + ' ' + StockPriceSimulationStyle.container}>
      <div className={StockPriceSimulationStyle.queryPannel}>
        <div className={StockPriceSimulationStyle.parameterTitle}>
          <Typography variant="h6" gutterBottom component="div">
            {'Query Parameters'}
            <NoMaxWidthTooltip arrow title={<span style={{ whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{QueryNote}</span>} >
              <IconButton onClick={() => window.open(NornFinanceAPIServerGithub, "_blank")}>
                <InfoIcon color="action"/>
              </IconButton>
            </NoMaxWidthTooltip>
          </Typography>
        </div>
        <div className={StockPriceSimulationStyle.parameterBlock}>
          <Grid container spacing={2}>
            <ParameterNodesField queryParameterRef={queryParameterRef} queryParameterCurrentRef={queryParameterCurrentRef}/>
            <Grid item md={1} xs={12} >
              <Box display="flex" justifyContent="flex-end">
                <ThemeProvider theme={createTheme({ palette: { primary: blue } })}>
                  <Button className={isMobile ? StockPriceSimulationStyle.queryBtnMobile : StockPriceSimulationStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
 
                    loadingAnimeRef.current.setLoading(true)
                    queryParameterCurrentRef.current = []
                    let args = Query_Def.parameters.reduce((accumulator, currentValue, currentIndex) => {
                      accumulator[currentValue.name] = queryParameterRef.current[currentIndex].current.value
                      queryParameterCurrentRef.current.push(accumulator[currentValue.name])
                      return accumulator
                    }, {})
                    console.log(args)

                    // check parameter
                    function invalid_min_max(element) {  
                      return ('min' in element && element['min'] > args[element['name']]) || ('max' in element && element['max'] < args[element['name']])
                    } 
                    if (Query_Def.parameters.some(invalid_min_max)) {
                      loadingAnimeRef.current.setLoading(false)
                      modalWindowRef.current.popModalWindow(<div>The query parameter is not valid or overy limit.</div>)
                      return
                    }
                   
                    const query_string = '/stock/price-simulation-by-mc?' + Object.keys(args).map(function (key) { return args[key]!="" ? key + "=" + args[key] : "" }).join("&")
                    Promise.all([
                      GetDataByFetchObj(query_string, FetchNornFinanceAPIServerRef.current.server),
                    ]).then((allResponses) => {
                      console.log(allResponses)
                      if (allResponses.length === 1 && allResponses[0] !== null) {
                        let chartData = []
                        let iteration = allResponses[0]['data'].length
                        let sim_count = allResponses[0]['mean'].length
                        allResponses[0]['mean'].forEach((mean_point, mean_index) => {
                          let d = {'Mean': parseInt(mean_point * 100, 10) / 100.0, 'Name': 'Day' + mean_index}
                          allResponses[0]['data'].forEach((data_points, data_i) => {
                            d['Path-'+String(data_i).padStart(2, '0')] =  parseInt(data_points[mean_index] * 100, 10) / 100.0
                          })
                          chartData.push(d)
                        })
                        MonteCarloChartCompRef.current.setChart(<MonteCarloChart data={chartData} iteration={iteration} info={{}} show_mean_label={sim_count<=40} modal_mode={false}/>)
                      } else {
                        console.error("Call simulation api failed")
                        modalWindowRef.current.popModalWindow(<div>Call simulation api failed</div>)
                      }
                      loadingAnimeRef.current.setLoading(false)
                    }).catch(() => {
                      console.error("Call simulation api failed...")
                      modalWindowRef.current.popModalWindow(<div>Call simulation api failed...</div>)
                      loadingAnimeRef.current.setLoading(false)
                    })
                  }}>{'Simulation'}</Button>
                </ThemeProvider>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={StockPriceSimulationStyle.chart}>
        <MonteCarloChartComp MonteCarloChartCompRef={MonteCarloChartCompRef}/>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
      <FetchNornFinanceAPIServer FetchNornFinanceAPIServerRef={FetchNornFinanceAPIServerRef}/>
    </div>
  )
}

export default StockPriceSimulation
