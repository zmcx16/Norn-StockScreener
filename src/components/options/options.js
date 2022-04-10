import React, { useState, useEffect, useRef, createRef } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import InfoIcon from '@mui/icons-material/Info'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import { blue } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/styles'
import shortid from 'shortid'
import useFetch from 'use-http'
import moment from 'moment'
import { isMobile } from 'react-device-detect'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'

import { NornFinanceAPIServerDomain, QueryNote, NornFinanceAPIServerGithub } from '../../common/common'
import { getRedLevel, getBlueLevel, workdayCount } from '../../common/utils'
import { useInterval, GetDataByFetchObj, SymbolNameField, PureFieldWithValueCheck, PercentField, ColorPercentField, ColorPosGreenNegRedField, NoMaxWidthTooltip } from '../../common/reactUtils'
import { Options_Def, SelfQuery_Def } from '../../common/optionsDef'
import MonteCarloChart from '../monteCarloChart'

import commonStyle from '../common.module.scss'
import optionsStyle from './options.module.scss'


// query parameter
const genParameterField = (inputRef, name, value, display_name, gridsm) => {
  // add key to force re-render component
  return (
    <Grid item md={gridsm} xs={12} key={shortid.generate()}>
      <form noValidate autoComplete="off">
        <TextField id={name} className={optionsStyle.valueText} label={display_name} variant="outlined" defaultValue={value} size="small" inputRef={inputRef} />
      </form>
    </Grid>
  )
}

const ParameterNodesField = ({ queryParameterRef, queryParameterCurrentRef }) => {
  return SelfQuery_Def.parameters.map((value, index) => {
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

const Options = ({loadingAnimeRef}) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })
  
  const FetchNornFinanceAPIServerRef = useRef({
    server: null
  })

  const tableColList = {
    Symbol: { hide: false, text: 'Symbol' },
    StockPrice: { hide: false, text: 'Price (Stock)' },
    ExpiryDate: { hide: false, text: 'Expiry' },
    Strike: { hide: false, text: 'Strike' },
    LastPrice: { hide: false, text: 'Last Price' },
    AvgEWMA: { hide: false, text: 'Valuation (Avg)'},
    PriceBias: { hide: false, text: 'Bias (Price)', description: '| Last Price - Valuation (Avg) | / Last Price' },
    VolBias: { hide: false, text: 'Bias (Vol.)' },
    PriceStrikeRatio: { hide: false, text: 'P/S (%)', description: 'Last Price / Strike' },
    PriceStrikeYearRatio: { hide: false, text: 'P/S (Y%)', description: 'Last Price / Strike (Year)' },
    DistanceRatio: { hide: false, text: 'Dist (%)', description: '| Price (Stock) - Strike | / Strike' },
    KellyCriterion_buy: { hide: true, text: 'Kelly (Buy)', description: 'Kelly Criterion' },
    KellyCriterion_sell: { hide: true, text: 'Kelly (Sell)', description: 'Kelly Criterion' },
    KellyCriterion_MU_0_buy: { hide: false, text: 'Kelly (Buy, MU0)', description: 'Kelly Criterion, MU=0' },
    KellyCriterion_MU_0_sell: { hide: false, text: 'Kelly (Sell, MU0)', description: 'Kelly Criterion, MU=0' },
    Delta: { hide: false, text: 'δ (Delta)' },
    Gamma: { hide: false, text: 'γ (Gamma)' },
    Rho: { hide: false, text: 'ρ (Rho)' },
    Theta: { hide: false, text: 'θ (Theta)' },
    Vega: { hide: false, text: 'ν (Vega)' },
    LastTradeDate: { hide: false, text: 'Last Trade Date' },
    Bid: { hide: false, text: 'Bid' },
    Ask: { hide: false, text: 'Ask' },
    Change: { hide: true, text: 'Change' },
    PercentChange: { hide: false, text: 'Change (%)' },
    Volume: { hide: false, text: 'Volume' },
    OpenInterest: { hide: false, text: 'Open Interest' },
    ImpliedVolatility: { hide: false, text: 'Implied Volatility' },
    EWMAHisVol: { hide: false, text: 'EWMA Historical Volatility' },
    BSM_EWMAHisVol: { hide: false, text: 'Black Scholes Merton' },
    MC_EWMAHisVol: { hide: false, text: 'Monte Carlo' },
    BT_EWMAHisVol: { hide: false, text: 'Binomial Tree' },
    MCChart: { hide: false, text: 'MC Chart' },
  }

  const genTableColTemplate = () => {
    return [
      SymbolNameField('symbol', 'Symbol', 115, 'symbol' in hideColState ? hideColState['symbol'] : false),
      PureFieldWithValueCheck("stockPrice", tableColList.StockPrice.text, 125, 2, "stockPrice" in hideColState ? hideColState["stockPrice"] : tableColList['StockPrice'].hide),
      {
        field: 'expiryDate',
        headerName: tableColList.ExpiryDate.text,
        width: 120,
        type: 'date',
        renderCell: (params) => (
          <span>{moment(params.row['expiryDate']).format('YYYY-MM-DD')}</span>
        ),
        hide: 'expiryDate' in hideColState ? hideColState['expiryDate'] : tableColList['ExpiryDate'].hide
      },
      PureFieldWithValueCheck("strike", tableColList.Strike.text, 110, 2, "strike" in hideColState ? hideColState["strike"] : tableColList['Strike'].hide),
      PureFieldWithValueCheck("lastPrice", tableColList.LastPrice.text, 140, 2, "lastPrice" in hideColState ? hideColState["lastPrice"] : tableColList['LastPrice'].hide),
      PureFieldWithValueCheck("avgEWMA", tableColList.AvgEWMA.text, 140, 2, "avgEWMA" in hideColState ? hideColState["avgEWMA"] : tableColList['AvgEWMA'].hide),
      {
        field: "priceBias",
        headerName: tableColList.PriceBias.text,
        width: 120,
        type: 'number',
        description: tableColList.PriceBias.description,
        renderCell: (params) => (
          params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
            <span>-</span> :
            <span style={{ fontWeight: 500, color: params.row['lastPrice'] > params.row['avgEWMA'] ? getRedLevel(params.value) : params.row['lastPrice'] < params.row['avgEWMA'] ? getBlueLevel(params.value) : '' }}>{params.value.toFixed(2)}</span>
        ),
        hide: "priceBias" in hideColState ? hideColState["priceBias"] : tableColList['PriceBias'].hide
      },
      PercentField("priceStrikeRatio", tableColList.PriceStrikeRatio.text, 90, "priceStrikeRatio" in hideColState ? hideColState["priceStrikeRatio"] : tableColList['PriceStrikeRatio'].hide, tableColList.PriceStrikeRatio.description),
      PercentField("priceStrikeYearRatio", tableColList.PriceStrikeYearRatio.text, 90, "priceStrikeYearRatio" in hideColState ? hideColState["priceStrikeRatio"] : tableColList['PriceStrikeYearRatio'].hide, tableColList.PriceStrikeYearRatio.description),
      PercentField("distanceRatio", tableColList.DistanceRatio.text, 90, "distanceRatio" in hideColState ? hideColState["distanceRatio"] : tableColList['DistanceRatio'].hide, tableColList.DistanceRatio.description),
      ColorPercentField("KellyCriterion_buy", tableColList.KellyCriterion_buy.text, 130, 2, "KellyCriterion_buy" in hideColState ? hideColState["KellyCriterion_buy"] : tableColList['KellyCriterion_buy'].hide, 500, tableColList.KellyCriterion_buy.description),
      ColorPercentField("KellyCriterion_sell", tableColList.KellyCriterion_sell.text, 130, 2, "KellyCriterion_sell" in hideColState ? hideColState["KellyCriterion_sell"] : tableColList['KellyCriterion_sell'].hide, 500, tableColList.KellyCriterion_sell.description),
      ColorPercentField("KellyCriterion_MU_0_buy", tableColList.KellyCriterion_MU_0_buy.text, 130, 2, "KellyCriterion_MU_0_buy" in hideColState ? hideColState["kellyCriterion_MU_0_buy"] : tableColList['KellyCriterion_MU_0_buy'].hide, 500, tableColList.KellyCriterion_MU_0_buy.description),
      ColorPercentField("KellyCriterion_MU_0_sell", tableColList.KellyCriterion_MU_0_sell.text, 130, 2, "KellyCriterion_MU_0_sell" in hideColState ? hideColState["KellyCriterion_MU_0_sell"] : tableColList['KellyCriterion_MU_0_sell'].hide, 500, tableColList.KellyCriterion_MU_0_sell.description),
      PureFieldWithValueCheck("delta", tableColList.Delta.text, 90, 2, "delta" in hideColState ? hideColState["delta"] : tableColList['Delta'].hide),
      PureFieldWithValueCheck("gamma", tableColList.Gamma.text, 90, 2, "gamma" in hideColState ? hideColState["gamma"] : tableColList['Gamma'].hide),
      PureFieldWithValueCheck("rho", tableColList.Rho.text, 90, 2, "rho" in hideColState ? hideColState["rho"] : tableColList['Rho'].hide),
      PureFieldWithValueCheck("theta", tableColList.Theta.text, 90, 2, "theta" in hideColState ? hideColState["theta"] : tableColList['Theta'].hide),
      PureFieldWithValueCheck("vega", tableColList.Vega.text, 90, 2, "vega" in hideColState ? hideColState["vega"] : tableColList['Vega'].hide),
      {
        field: 'lastTradeDate',
        headerName: tableColList.LastTradeDate.text,
        width: 145,
        type: 'date',
        renderCell: (params) => (
          <span>{moment(params.row['lastTradeDate']).format('YYYY-MM-DD')}</span>
        ),
        hide: 'lastTradeDate' in hideColState ? hideColState['lastTradeDate'] : tableColList['LastTradeDate'].hide
      },
      PureFieldWithValueCheck("bid", tableColList.Bid.text, 105, 2, "bid" in hideColState ? hideColState["bid"] : tableColList['Bid'].hide),
      PureFieldWithValueCheck("ask", tableColList.Ask.text, 105, 2, "ask" in hideColState ? hideColState["ask"] : tableColList['Ask'].hide),
      ColorPosGreenNegRedField("change", tableColList.Change.text, 130, "change" in hideColState ? hideColState["change"] : tableColList['Change'].hide, 500),
      ColorPercentField("percentChange", tableColList.PercentChange.text, 140, 2, "percentChange" in hideColState ? hideColState["percentChange"] : tableColList['PercentChange'].hide, 500),
      PureFieldWithValueCheck("volume", tableColList.Volume.text, 140, 0, "volume" in hideColState ? hideColState["volume"] : tableColList['Volume'].hide),
      PureFieldWithValueCheck("openInterest", tableColList.OpenInterest.text, 140, 0, "openInterest" in hideColState ? hideColState["openInterest"] : tableColList['OpenInterest'].hide),
      PercentField("impliedVolatility", tableColList.ImpliedVolatility.text, 140, "impliedVolatility" in hideColState ? hideColState["impliedVolatility"] : tableColList['ImpliedVolatility'].hide),
      PercentField("EWMAHisVol", tableColList.EWMAHisVol.text, 140, "EWMAHisVol" in hideColState ? hideColState["EWMAHisVol"] : tableColList['EWMAHisVol'].hide),
      PureFieldWithValueCheck("BSM_EWMAHisVol", tableColList.BSM_EWMAHisVol.text, 140, 2, "BSM_EWMAHisVol" in hideColState ? hideColState["BSM_EWMAHisVol"] : tableColList['BSM_EWMAHisVol'].hide),
      PureFieldWithValueCheck("MC_EWMAHisVol", tableColList.MC_EWMAHisVol.text, 140, 2, "MC_EWMAHisVol" in hideColState ? hideColState["MC_EWMAHisVol"] : tableColList['MC_EWMAHisVol'].hide),
      PureFieldWithValueCheck("BT_EWMAHisVol", tableColList.BT_EWMAHisVol.text, 140, 2, "BT_EWMAHisVol" in hideColState ? hideColState["BT_EWMAHisVol"] : tableColList['BT_EWMAHisVol'].hide),
      {
        field: 'MCChart',
        headerName: tableColList.MCChart.text,
        width: 120,
        renderCell: (params) => (
          <IconButton
            size="small"
            aria-haspopup="true"
            onClick={() => {
              loadingAnimeRef.current.setLoading(true)
              let iteration = 50
              const query_string = '/stock/price-simulation-by-mc?symbol=' + params.row['symbol'] + '&iteration=' + iteration + '&mu=0&vol=' + 
              params.row['EWMAHisVol'] + '&days=' + workdayCount(moment(new Date().toISOString().split('T')[0]), moment(params.row['expiryDate']))
              Promise.all([
                GetDataByFetchObj(query_string, FetchNornFinanceAPIServerRef.current.server),
              ]).then((allResponses) => {
                console.log(allResponses)
                if (allResponses.length === 1 && allResponses[0] !== null) {
                  let chartData = []
                  let cost = params.row['kind'] === 1 ? params.row['strike'] + params.row['lastPrice'] : params.row['strike'] - params.row['lastPrice']
                  let info = {'symbol': params.row['symbol'], 'strike': params.row['strike'], 'cost': cost}
                  allResponses[0]['mean'].forEach((mean_point, mean_index) => {
                    let d = {'Mean': parseInt(mean_point * 100, 10) / 100.0, 'Name': 'Day' + mean_index}
                    allResponses[0]['data'].forEach((data_points, data_i) => {
                      d['Path-'+String(data_i).padStart(2, '0')] =  parseInt(data_points[mean_index] * 100, 10) / 100.0
                    })
                    chartData.push(d)
                  })
                  console.log(chartData)
                  modalWindowRef.current.popModalWindow(<MonteCarloChart data={chartData} iteration={iteration} info={info}/>)
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
            }}
          >
            <BarChartSharpIcon color="primary" style={{ fontSize: 40 }} />
          </IconButton>
        ),
        hide: 'MCChart' in  hideColState? hideColState['MCChart'] : tableColList['MCChart'].hide
      },
    ]
  }


  const fetchOptionsData = useFetch({ cachePolicy: 'no-cache' })

  const renderTable = (resp) => {
    // [{"symbol":"A","stockPrice":149.50999450683594,"EWMA_historicalVolatility":0.2519420533670158,"contracts":[{"expiryDate":"2022-01-21","calls":[{"lastTradeDate":"2022-01-12","strike":155.0,"lastPrice":0.32,"bid":0.35,"ask":0.5,"change":0.049999982,"percentChange":18.51851,"volume":30,"openInterest":721,"impliedVolatility":0.22461712890624996,"valuationData":{"BSM_EWMAHisVol":0.7042894690005248,"MC_EWMAHisVol":0.70279983534146,"BT_EWMAHisVol":0.7046023394736802}}],"puts":[]}]}
    var calls = []
    var puts = []
    resp.forEach((data) => {
      let symbol = data["symbol"]
      let stock_price = data["stockPrice"]
      let ewma_his_vol = data["EWMA_historicalVolatility"]
      data["contracts"].forEach((contracts) => {
        let expiry_date = contracts["expiryDate"]
        let extra_data_func = (calls_puts, kind) => {
          let output = calls_puts.map((cp, index) => {
            let v = cp["valuationData"]
            let o = {
              id: index,
              symbol: symbol,
              stockPrice: stock_price,
              EWMAHisVol: ewma_his_vol,
              kind: kind,
              expiryDate: expiry_date,
              lastTradeDate: cp["lastTradeDate"] !== undefined && cp["lastTradeDate"] !== null && cp["lastTradeDate"] !== '-' ? cp["lastTradeDate"] : 0,
              strike: cp["strike"] !== undefined && cp["strike"] !== null && cp["strike"] !== '-' ? cp["strike"] : -Number.MAX_VALUE,
              lastPrice: cp["lastPrice"] !== undefined && cp["lastPrice"] !== null && cp["lastPrice"] !== '-' ? cp["lastPrice"] : -Number.MAX_VALUE,
              bid: cp["bid"] !== undefined && cp["bid"] !== null && cp["bid"] !== '-' ? cp["bid"] : -Number.MAX_VALUE,
              ask: cp["ask"] !== undefined && cp["ask"] !== null && cp["ask"] !== '-' ? cp["ask"] : -Number.MAX_VALUE,
              change: cp["change"] !== undefined && cp["change"] !== null && cp["change"] !== '-' ? cp["change"] : -Number.MAX_VALUE,
              percentChange: cp["percentChange"] !== undefined && cp["percentChange"] !== null && cp["percentChange"] !== '-' ? cp["percentChange"] / 100.0 : -Number.MAX_VALUE,
              volume: cp["volume"] !== undefined && cp["volume"] !== null && cp["volume"] !== '-' ? cp["volume"] : -Number.MAX_VALUE,
              openInterest: cp["openInterest"] !== undefined && cp["openInterest"] !== null && cp["openInterest"] !== '-' ? cp["openInterest"] : -Number.MAX_VALUE,
              impliedVolatility: cp["impliedVolatility"] !== undefined && cp["impliedVolatility"] !== null && cp["impliedVolatility"] !== '-' ? cp["impliedVolatility"] : -Number.MAX_VALUE,
              BSM_EWMAHisVol: v["BSM_EWMAHisVol"] !== undefined && v["BSM_EWMAHisVol"] !== null && v["BSM_EWMAHisVol"] > 0 ? v["BSM_EWMAHisVol"] : -Number.MAX_VALUE,
              MC_EWMAHisVol: v["MC_EWMAHisVol"] !== undefined && v["MC_EWMAHisVol"] !== null && v["MC_EWMAHisVol"] > 0 ? v["MC_EWMAHisVol"] : -Number.MAX_VALUE,
              BT_EWMAHisVol: v["BT_EWMAHisVol"] !== undefined && v["BT_EWMAHisVol"] !== null && v["BT_EWMAHisVol"] > 0 ? v["BT_EWMAHisVol"] : -Number.MAX_VALUE,
              delta: v["delta"] !== undefined && v["delta"] !== null ? v["delta"] : -Number.MAX_VALUE,
              gamma: v["gamma"] !== undefined && v["gamma"] !== null ? v["gamma"] : -Number.MAX_VALUE,
              rho: v["rho"] !== undefined && v["rho"] !== null ? v["rho"] : -Number.MAX_VALUE,
              theta: v["theta"] !== undefined && v["theta"] !== null ? v["theta"] : -Number.MAX_VALUE,
              vega: v["vega"] !== undefined && v["vega"] !== null ? v["vega"] : -Number.MAX_VALUE,
              KellyCriterion_buy: v["KellyCriterion_buy"] !== undefined && v["KellyCriterion_buy"] !== null ? v["KellyCriterion_buy"] : -Number.MAX_VALUE,
              KellyCriterion_sell: v["KellyCriterion_sell"] !== undefined && v["KellyCriterion_sell"] !== null ? v["KellyCriterion_sell"] : -Number.MAX_VALUE,
              KellyCriterion_MU_0_buy: v["KellyCriterion_MU_0_buy"] !== undefined && v["KellyCriterion_MU_0_buy"] !== null ? v["KellyCriterion_MU_0_buy"] : -Number.MAX_VALUE,
              KellyCriterion_MU_0_sell: v["KellyCriterion_MU_0_sell"] !== undefined && v["KellyCriterion_MU_0_sell"] !== null ? v["KellyCriterion_MU_0_sell"] : -Number.MAX_VALUE,
            }
            let cnt = 0
            let sum = 0
            if (o.BSM_EWMAHisVol > 0) {
              cnt += 1
              sum += o.BSM_EWMAHisVol
            }
            if (o.MC_EWMAHisVol > 0) {
              cnt += 1
              sum += o.MC_EWMAHisVol
            }
            if (o.BT_EWMAHisVol > 0) {
              cnt += 1
              sum += o.BT_EWMAHisVol
            }
            o["avgEWMA"] = sum / cnt

            o["priceBias"] = -Number.MAX_VALUE
            if (o.lastPrice != -Number.MAX_VALUE) {
              o["priceBias"] = Math.abs(o.lastPrice - o["avgEWMA"]) / o.lastPrice
            }

            o["priceStrikeRatio"] = -Number.MAX_VALUE
            if (o.strike != -Number.MAX_VALUE && o.lastPrice != -Number.MAX_VALUE) {
              o["priceStrikeRatio"] = o.lastPrice / o.strike
            }

            o["priceStrikeYearRatio"] = -Number.MAX_VALUE
            if (o["priceStrikeRatio"] != -Number.MAX_VALUE) {
              let day_diff = Math.floor((Date.parse(expiry_date) - Date.parse(new Date().toISOString().slice(0, 10))) / 86400000)
              o["priceStrikeYearRatio"] = o["priceStrikeRatio"] * 365.0 / day_diff
            }

            o["distanceRatio"] = -Number.MAX_VALUE
            if (o.strike != -Number.MAX_VALUE && o.stockPrice != -Number.MAX_VALUE) {
              o["distanceRatio"] = Math.abs(o.stockPrice - o.strike) / o.stockPrice
            }

            return o
          })
          return output
        }
        calls = calls.concat(extra_data_func(contracts["calls"], 1))
        puts = puts.concat(extra_data_func(contracts["puts"], -1))
      })
    })

    // reset id
    calls.forEach((d, i) => {
      calls[i].id = i
    });
    puts.forEach((d, i) => {
      puts[i].id = i
    });

    console.log(calls)
    setCallsData(calls)
    console.log(puts)
    setPutsData(puts)
  }

  const renderOptionsData = (file_name) => {
    loadingAnimeRef.current.setLoading(true)
    Promise.all([
      GetDataByFetchObj('/norn-data/options/' + file_name + '.json', fetchOptionsData),
    ]).then((allResponses) => {
      console.log(allResponses)
      if (allResponses.length === 1 && allResponses[0] !== null) {
        renderTable(allResponses[0])
      } else {
        console.error("renderOptionsData some data failed")
        modalWindowRef.current.popModalWindow(<div>Get some data failed...</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch(() => {
      console.error("renderOptionsData failed")
      modalWindowRef.current.popModalWindow(<div>Get data failed...</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  const refreshData = (name) => {
    if (name.startsWith('self_query')) {
      setDisplayQuery(true)
      setCallsData([])
      setPutsData([])
      loadingAnimeRef.current.setLoading(false)
    } else {
      setDisplayQuery(false)
      renderOptionsData(name)
    }
  }
  const [callsData, setCallsData] = useState([])
  const [putsData, setPutsData] = useState([])
  const [hideColState, setHideColState] = useState({})
  const [arg, setArg] = useState(0)
  const [displayQuery, setDisplayQuery] = useState(false)
  const [ws, setWs] = useState(null)



  const queryParameterRef = useRef([])
  SelfQuery_Def.parameters.forEach((value, index) => {
    queryParameterRef.current[index] = createRef()
    queryParameterRef.current[index].current = { value: value.val }
  })
  const queryParameterCurrentRef = useRef(null)

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    refreshData(Options_Def[0].name)

    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  useInterval(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send("") // heartbeat
      console.log("heartbeat")
    }
  }, ws ? 3000 : null)

  useEffect(() => {
    if (ws) {
      ws.onopen = () => {
        loadingAnimeRef.current.setLoading(true)
        console.log('WebSocket Connected')
      }
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data)
        console.log(message)
        renderTable([message])
        loadingAnimeRef.current.setLoading(false)
        setWs(null)
      }
    }
    return () => {
    }
  }, [ws])
  
  return (
    <div className={commonStyle.defaultFont + ' ' + optionsStyle.container}>
      <div key={shortid.generate()} >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl size="small" variant="outlined" className={optionsStyle.optionsTableSelect}>
              <InputLabel htmlFor="arg-select">{'Options Valuation'}</InputLabel>
              <Select
                native
                value={arg}
                displayEmpty
                onChange={(event) => {
                  setArg(event.target.value)
                  refreshData(Options_Def[event.target.value].name)
                }}
                label={'Options Valuation'}
              >
                {
                  Options_Def.map((value, index) => {
                    return <option key={shortid.generate()} index={index} value={index}>{value.display_name}</option>
                  })
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div className={optionsStyle.queryPannel} style={{ display: displayQuery ? 'block' : 'none' }}>
          <div className={optionsStyle.parameterTitle}>
            <Typography variant="h6" gutterBottom component="div">
              {'Query Parameters'}
              <NoMaxWidthTooltip arrow title={<span style={{ whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{QueryNote}</span>} >
                <IconButton onClick={() => window.open(NornFinanceAPIServerGithub, "_blank")}>
                  <InfoIcon color="action"/>
                </IconButton>
              </NoMaxWidthTooltip>
            </Typography>
          </div>
          <div className={optionsStyle.parameterBlock}>
            <Grid container spacing={2}>
              <ParameterNodesField queryParameterRef={queryParameterRef} queryParameterCurrentRef={queryParameterCurrentRef}/>
              <Grid item md={2} xs={12} >
                <Box display="flex" justifyContent="flex-end">
                  <ThemeProvider theme={createTheme({ palette: { primary: blue } })}>
                    <Button className={isMobile ? optionsStyle.queryBtnMobile : optionsStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                      queryParameterCurrentRef.current = []
                      let args = SelfQuery_Def.parameters.reduce((accumulator, currentValue, currentIndex) => {
                        accumulator[currentValue.name] = queryParameterRef.current[currentIndex].current.value
                        queryParameterCurrentRef.current.push(accumulator[currentValue.name])
                        return accumulator
                      }, {})
                      console.log(args)
                      let query_string = "/ws/option/quote-valuation?" + Object.keys(args).map(function (key) { return key + "=" + args[key] }).join("&")
                      setWs(new WebSocket("wss://" + NornFinanceAPIServerDomain + query_string))
                    }}>{'Query Now'}</Button>
                  </ThemeProvider>
                </Box>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className={optionsStyle.table}>
          <DataGrid rows={callsData} columns={genTableColTemplate()} rowsPerPageOptions={[]} autoPageSize={true} components={{ NoRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick onColumnVisibilityChange={(param) => {
            let tempHideColState = hideColState
            tempHideColState[param['field']] = !param['isVisible']
            setHideColState(tempHideColState)
          }} initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'lastPrice', operatorValue: '>', value: 0.1 }],
              },
            },
            sorting: {
              sortModel: [{ field: 'priceBias', sort: 'desc' }],
            },
          }}/>
        </div>
        <div className={optionsStyle.table}>
          <DataGrid rows={putsData} columns={genTableColTemplate()} rowsPerPageOptions={[]} autoPageSize={true} components={{ NoRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick onColumnVisibilityChange={(param) => {
            let tempHideColState = hideColState
            tempHideColState[param['field']] = !param['isVisible']
            setHideColState(tempHideColState)
          }} initialState={{
            filter: {
              filterModel: {
                items: [{ columnField: 'lastPrice', operatorValue: '>', value: 0.1 }],
              },
            },
            sorting: {
              sortModel: [{ field: 'priceBias', sort: 'desc' }],
            },
          }}/>
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
      <FetchNornFinanceAPIServer FetchNornFinanceAPIServerRef={FetchNornFinanceAPIServerRef}/>
    </div>
  )
}

export default Options
