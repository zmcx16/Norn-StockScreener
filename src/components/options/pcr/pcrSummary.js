
import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import useFetch from 'use-http'
import moment from 'moment'

import StockAndPCRDataChart from './stockAndPCRDataChart'
import ModalWindow from '../../modalWindow'
import DefaultDataGridTable from '../../defaultDataGridTable'
import SearchGridToolbar from '../../searchGridToolbar'
import { YahooFinanceEnUrl, PCRTooltip } from '../../../common/common'
import { SymbolNameField, PriceField, PureFieldWithValueCheck, PercentField, ColorPercentField, KMBTField } from '../../../common/dataGridUtil'

import pcrSummaryStyle from './pcrSummary.module.scss'
import '../../muiTablePagination.css'

const PCRSummary = ({ loadingAnimeRef }) => {

  const [hideColState, setHideColState] = useState({})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const tableColList = {
    Close: { hide: false, text: 'Price' },
    PCR_OpenInterest_Latest: { hide: false, text: 'PCR (OI)' },
    PCR_OpenInterest_Week: { hide: false, text: 'OI-1W(%)' },
    PCR_OpenInterest_Month: { hide: false, text: 'OI-1M(%)' },
    Calls_LatestTotalOI: { hide: false, text: 'Calls OI' },
    Puts_LatestTotalOI: { hide: false, text: 'Puts OI' },
    PCR_Volume_Latest: { hide: false, text: 'PCR (Vol)' },
    PCR_Volume_Week: { hide: false, text: 'Vol-1W(%)' },
    PCR_Volume_Month: { hide: false, text: 'Vol-1M(%)' },
    Calls_LatestTotalVol: { hide: false, text: 'Calls Vol' },
    Puts_LatestTotalVol: { hide: false, text: 'Puts Vol' },
    PE: { hide: false, text: 'P/E' },
    PB: { hide: false, text: 'P/B' },
    Dividend: { hide: false, text: 'Dividend %' },
    High52: { hide: false, text: '52W High' },
    Low52: { hide: false, text: '52W Low' },
    PerfWeek: { hide: false, text: 'Perf Week' },
    PerfMonth: { hide: false, text: 'Perf Month' },
    PerfQuarter: { hide: false, text: 'Perf Quarter' },
    PerfHalfY: { hide: false, text: 'Perf Half Y' },
    PerfYear: { hide: false, text: 'Perf Year' },
    PerfYTD: { hide: false, text: 'Perf YTD' },
    Chart: { hide: false, text: 'Chart' },
  }

  const getData = async (url, fetchObj) => {
    const resp_data = await fetchObj.get(url)
    if (fetchObj.response.ok && resp_data) {
      return resp_data
    }
    else {
      return null
    }
  }

  const renderShowChart = (symbol)=> {
    console.log(symbol)
    Promise.all([
      getData("/norn-data/stock/historical-quotes/" + symbol+".json", fetchStockData),
      getData("/norn-data/options/pcr/historical-by-symbol/" + symbol+".json", fetchPCRData),
    ]).then((allResponses) => {
      console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {
        let startDate = new Date(Date.now() - 365*24*60*60*1000)
        if (allResponses[1].length > 0) {
          startDate = new Date(allResponses[1][allResponses[1].length-1]["update_time"])
        }

        let allDateByKey = {}
        const convertData2DictByDate = (data, dateKey, key, valueKey1, valueKey2=null, valueKey3=null) => {
          if (data && !Array.isArray(data)) {
            console.log("data is not array")
            return
          }

          allResponses[1].forEach((val) => {
            val["data"]["PCR_OpenInterest"] = parseInt( val["data"]["PCR_OpenInterest"] * 100, 10) / 100.0
            val["data"]["PCR_Volume"] = parseInt( val["data"]["PCR_Volume"] * 100, 10) / 100.0
          })

          data.forEach((val) => {
            let date = Date.parse(new Date(Date.parse(val[dateKey])).toLocaleDateString()) // align timezone
            if (date < startDate) {
              return
            }
            if (!(date in allDateByKey)) {
              allDateByKey[date] = {}
            }
            if (valueKey2 === null) {
              allDateByKey[date][key] = val[valueKey1]
            } else if (valueKey3 === null) {
              allDateByKey[date][key] = val[valueKey1][valueKey2]
            } else {
              allDateByKey[date][key] = val[valueKey1][valueKey2][valueKey3]
            }
          })
        }
        convertData2DictByDate(allResponses[0], "Date", "close", "Close")
        convertData2DictByDate(allResponses[0], "Date", "volume", "Volume")
        convertData2DictByDate(allResponses[1], "update_time", "PCR_OpenInterest", "data", "PCR_OpenInterest")
        convertData2DictByDate(allResponses[1], "update_time", "PCR_Volume", "data", "PCR_Volume")
        convertData2DictByDate(allResponses[1], "update_time", "Calls_TotalOI", "data", "calls", "totalOpenInterest")
        convertData2DictByDate(allResponses[1], "update_time", "Calls_TotalVol", "data", "calls", "totalVolume")
        convertData2DictByDate(allResponses[1], "update_time", "Puts_TotalOI", "data", "puts", "totalOpenInterest")
        convertData2DictByDate(allResponses[1], "update_time", "Puts_TotalVol", "data", "puts", "totalVolume")
        console.log(allDateByKey)
        let allDataArray = []
        let targetKeys = ["close", "volume", "PCR_OpenInterest", "PCR_Volume", "Calls_TotalOI", "Calls_TotalVol", "Puts_TotalOI", "Puts_TotalVol"]
        Object.keys(allDateByKey).sort().forEach((key) => {
          let o = { Date: moment(parseInt(key)).format('MM/DD/YYYY') }
          targetKeys.forEach((val) => {
            if (val in allDateByKey[key]) {
              o[val] = allDateByKey[key][val]
            }
          })
          allDataArray.push(o)
        })
        console.log(allDataArray)
        const title = `${symbol} Chart`
        modalWindowRef.current.popModalWindow(<StockAndPCRDataChart title={title} data={allDataArray} />)
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
    }).catch(() => {
      modalWindowRef.current.popModalWindow(<div>Can't draw stock price & pcr chart</div>)
    })
  }

  function PCRField(field, headerName, width, valueFixed, hide, description = null){
    let output = {
      field: field,
      headerName: headerName,
      width: width,
      type: 'number',
      renderCell: (params) => (
        params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
          <span>-</span> :
          <span style={{ fontWeight: 500, color: parseFloat(params.value) <= 0.7 ? 'green' : parseFloat(params.value) >= 1 ? 'red' : '' }}>{params.value.toFixed(valueFixed)}</span>
      ),
      hide: hide
    }
    
    if (description != null) {
      output['description'] = description
    }
    return output
  }

  const genTableColTemplate = () => {
    return [
      SymbolNameField('Symbol', 130, 'symbol' in hideColState ? hideColState['symbol'] : false),
      PriceField('close', tableColList.Close.text, 110, 'close' in hideColState ? hideColState['close'] : tableColList['Close'].hide, null, "yahoo"),
      PCRField("PCR_OpenInterest_Latest", tableColList.PCR_OpenInterest_Latest.text, 110, 2, "PCR_OpenInterest_Latest" in hideColState ? hideColState["PCR_OpenInterest_Latest"] : tableColList['PCR_OpenInterest_Latest'].hide, "Put-Call Ratio (Open Interest)"),
      PercentField("PCR_OpenInterest_Week", tableColList.PCR_OpenInterest_Week.text, 110, "PCR_OpenInterest_Week" in hideColState ? hideColState["PCR_OpenInterest_Week"] : tableColList['PCR_OpenInterest_Week'].hide, 'Put-Call Ratio (Open Interest) 1 Week Changed (%)'),
      PercentField("PCR_OpenInterest_Month", tableColList.PCR_OpenInterest_Month.text, 110, "PCR_OpenInterest_Week" in hideColState ? hideColState["PCR_OpenInterest_Month"] : tableColList['PCR_OpenInterest_Month'].hide, 'Put-Call Ratio (Open Interest) 1 Month Changed (%)'),
      KMBTField("Calls_LatestTotalOI", tableColList.Calls_LatestTotalOI.text, 110, 2, "Calls_LatestTotalOI" in hideColState ? hideColState["Calls_LatestTotalOI"] : tableColList['Calls_LatestTotalOI'].hide, "Calls Total Open Interest"),
      KMBTField("Puts_LatestTotalOI", tableColList.Puts_LatestTotalOI.text, 110, 2, "Puts_LatestTotalOI" in hideColState ? hideColState["Puts_LatestTotalOI"] : tableColList['Puts_LatestTotalOI'].hide, "Puts Open Total Interest"),
      PCRField("PCR_Volume_Latest", tableColList.PCR_Volume_Latest.text, 110, 2, "PCR_Volume_Latest" in hideColState ? hideColState["PCR_Volume_Latest"] : tableColList['PCR_Volume_Latest'].hide, "Put-Call Ratio (Volume)"),
      PercentField("PCR_Volume_Week", tableColList.PCR_Volume_Week.text, 110, "PCR_Volume_Week" in hideColState ? hideColState["PCR_Volume_Week"] : tableColList['PCR_Volume_Week'].hide, 'Put-Call Ratio (Volume) 1 Week Changed (%)'),
      PercentField("PCR_Volume_Month", tableColList.PCR_Volume_Month.text, 110, "PCR_Volume_Month" in hideColState ? hideColState["PCR_Volume_Month"] : tableColList['PCR_Volume_Month'].hide, 'Put-Call Ratio (Volume) 1 Month Changed (%)'),
      KMBTField("Calls_LatestTotalVol", tableColList.Calls_LatestTotalVol.text, 110, 2, "Calls_LatestTotalVol" in hideColState ? hideColState["Calls_LatestTotalVol"] : tableColList['Calls_LatestTotalVol'].hide, "Calls Total Volume"),
      KMBTField("Puts_LatestTotalVol", tableColList.Puts_LatestTotalVol.text, 110, 2, "Puts_LatestTotalVol" in hideColState ? hideColState["Puts_LatestTotalVol"] : tableColList['Puts_LatestTotalVol'].hide, "Puts Total Volume"),
      PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, "PE" in hideColState ? hideColState["PE"] : tableColList['PE'].hide),
      PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, "PB" in hideColState ? hideColState["PB"] : tableColList['PB'].hide),
      PercentField("dividend", tableColList.Dividend.text, 150, "dividend" in hideColState ? hideColState["dividend"] : tableColList['Dividend'].hide),
      PercentField("high52", tableColList.High52.text, 150, "high52" in hideColState ? hideColState["high52"] : tableColList['High52'].hide),
      PercentField("low52", tableColList.Low52.text, 150, "low52" in hideColState ? hideColState["low52"] : tableColList['Low52'].hide),
      ColorPercentField("perfWeek", tableColList.PerfWeek.text, 150, 2, "perfWeek" in hideColState ? hideColState["perfWeek"] : tableColList['PerfWeek'].hide, 500),
      ColorPercentField("perfMonth", tableColList.PerfMonth.text, 150, 2, "perfMonth" in hideColState ? hideColState["perfMonth"] : tableColList['PerfMonth'].hide, 500),
      ColorPercentField("perfQuarter", tableColList.PerfQuarter.text, 150, 2, "perfQuarter" in hideColState ? hideColState["perfQuarter"] : tableColList['PerfQuarter'].hide, 500),
      ColorPercentField("perfHalfY", tableColList.PerfHalfY.text, 150, 2, "perfHalfY" in hideColState ? hideColState["perfHalfY"] : tableColList['PerfHalfY'].hide, 500),
      ColorPercentField("perfYear", tableColList.PerfYear.text, 150, 2, "perfYear" in hideColState ? hideColState["perfYear"] : tableColList['PerfYear'].hide, 500),
      ColorPercentField("perfYTD", tableColList.PerfYTD.text, 150, 2, "perfYTD" in hideColState ? hideColState["perfYTD"] : tableColList['PerfYTD'].hide, 500),
      {
        field: 'Chart',
        headerName: tableColList.Chart.text,
        width: 130,
        renderCell: (params) => (
          <IconButton
            size="small"
            aria-haspopup="true"
            onClick={()=>{
              renderShowChart(params.row["symbol"])
            }}
          >
            <BarChartSharpIcon color="primary" style={{ fontSize: 40 }} />
          </IconButton>
        ),
        hide: 'Chart' in hideColState ? hideColState['Chart'] : tableColList['Chart'].hide
      },
    ]
  }

  const fetchStockData = useFetch({ cachePolicy: 'no-cache' })
  const fetchPCRData = useFetch({ cachePolicy: 'no-cache' })
  const renderShortStocksTable = (config, showChart)=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/options/pcr/stat.json', fetchPCRData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {      
        let output = Object.keys(allResponses[1]["data"]).reduce((result, symbol, index) => {
          let stockInfo = allResponses[0][symbol]
          let value = allResponses[1]["data"][symbol]
          let o = {
            id: index,
            symbol: symbol,
            close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
            PCR_OpenInterest_Latest: value['PCR_OpenInterest_Latest'] !== '-' ? value['PCR_OpenInterest_Latest'] : -Number.MAX_VALUE,
            PCR_OpenInterest_Week: value['PCR_OpenInterest_Week'] !== '-' ? value['PCR_OpenInterest_Week'] : -Number.MAX_VALUE,
            PCR_OpenInterest_Month: value['PCR_OpenInterest_Month'] !== '-' ? value['PCR_OpenInterest_Month'] : -Number.MAX_VALUE,
            PCR_Volume_Latest: value['PCR_Volume_Latest'] !== '-' ? value['PCR_Volume_Latest'] : -Number.MAX_VALUE,
            PCR_Volume_Week: value['PCR_Volume_Week'] !== '-' ? value['PCR_Volume_Week'] : -Number.MAX_VALUE,
            PCR_Volume_Month: value['PCR_Volume_Month'] !== '-' ? value['PCR_Volume_Month'] : -Number.MAX_VALUE,
            Calls_LatestTotalOI: value['Calls_LatestTotalOI'] !== '-' ? value['Calls_LatestTotalOI'] : -Number.MAX_VALUE,
            Calls_LatestTotalVol: value['Calls_LatestTotalVol'] !== '-' ? value['Calls_LatestTotalVol'] : -Number.MAX_VALUE,
            Puts_LatestTotalOI: value['Puts_LatestTotalOI'] !== '-' ? value['Puts_LatestTotalOI'] : -Number.MAX_VALUE,
            Puts_LatestTotalVol: value['Puts_LatestTotalVol'] !== '-' ? value['Puts_LatestTotalVol'] : -Number.MAX_VALUE,
            PE: stockInfo !== undefined && stockInfo !== null && stockInfo['P/E'] !== '-' ? stockInfo['P/E'] : Number.MAX_VALUE,
            PB: stockInfo !== undefined && stockInfo !== null && stockInfo['P/B'] !== '-' ? stockInfo['P/B'] : Number.MAX_VALUE,
            dividend: stockInfo !== undefined && stockInfo !== null && stockInfo['Dividend %'] !== '-' ? stockInfo['Dividend %'] : -Number.MAX_VALUE,
            high52: stockInfo !== undefined && stockInfo !== null && stockInfo['52W High'] !== '-' ? stockInfo['52W High'] : -Number.MAX_VALUE,
            low52: stockInfo !== undefined && stockInfo !== null && stockInfo['52W Low'] !== '-' ? stockInfo['52W Low'] : -Number.MAX_VALUE,
            perfWeek: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Week'] !== '-' ? stockInfo['Perf Week'] : -Number.MAX_VALUE,
            perfMonth: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Month'] !== '-' ? stockInfo['Perf Month'] : -Number.MAX_VALUE,
            perfQuarter: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Quarter'] !== '-' ? stockInfo['Perf Quarter'] : -Number.MAX_VALUE,
            perfHalfY: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Half Y'] !== '-' ? stockInfo['Perf Half Y'] : -Number.MAX_VALUE,
            perfYear: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Year'] !== '-' ? stockInfo['Perf Year'] : -Number.MAX_VALUE,
            perfYTD: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf YTD'] !== '-' ? stockInfo['Perf YTD'] : -Number.MAX_VALUE,
          }

          if(config.filter_symbols.length === 0 || config.filter_symbols.includes(symbol)) {
            result.push(o)
          }
          return result
        }, [])
        console.log(output)
        setRowData(output)
        if (showChart) {
          renderShowChart(output[0]["symbol"])
        }
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch(() => {
      modalWindowRef.current.popModalWindow(<div>Can't get data</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  const [rowData, setRowData] = useState([])
  const [searchVal, setSearchVal] = useState("")
  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    let config = {filter_symbols: []}
    let showChart = false
    if (typeof window !== 'undefined') {
      const queryParameters = new URLSearchParams(window.location.search)
      let symbol = queryParameters.get("symbol")
      if (symbol) {
        config = {filter_symbols: [symbol]}
      }
      showChart = queryParameters.get("showChart") === "true"
    }
    renderShortStocksTable(config, showChart)
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={pcrSummaryStyle.container}>
        <div className={pcrSummaryStyle.table}>
          <DataGrid rows={rowData} columns={genTableColTemplate()} components={{ NoRowsOverlay: DefaultDataGridTable, Toolbar: ()=>{
            return <SearchGridToolbar searchVal={searchVal} setSearchVal={setSearchVal} clickCallback={(config)=>{
              renderShortStocksTable(config, false)
            }} 
              info={{
                placeholder: 'Filter symbols: AAPL, BAC, KSS, ...',
                tooltip: {
                  text: PCRTooltip,
                  link: YahooFinanceEnUrl
                }
              }}
            />
          }}} disableSelectionOnClick onColumnVisibilityChange={(param) => {
            let tempHideColState = hideColState
            tempHideColState[param['field']] = !param['isVisible']
            setHideColState(tempHideColState)
          }}
          />
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default PCRSummary
