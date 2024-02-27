
import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import useFetch from 'use-http'
import moment from 'moment'
import Link from '@mui/material/Link'

import StockBenfordLawChart from './stockBenfordLawChart'
import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import SearchGridToolbar from '../searchGridToolbar'
import { BenfordLawTooltip, BenfordLawUrl} from '../../common/common'
import { SymbolNameField, PriceField, PureFieldWithValueCheck, PercentField, ColorPercentField } from '../../common/dataGridUtil'

import stockBenfordLawStyle from './stockBenfordLaw.module.scss'
import '../muiTablePagination.css'

const StockBenfordLaw = ({ loadingAnimeRef }) => {

  const [hideColState, setHideColState] = useState({})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })


  const tableColList = {
    Close: { hide: false, text: 'Price' },
    LastQuarterSSE: { hide: false, text: 'LastQ SSE' },
    LastYearSSE: { hide: false, text: 'LastY SSE' },
    AllQuartersSSE: { hide: false, text: 'AllQ SSE' },
    AllYearsSSE: { hide: false, text: 'AllY SSE' },
    AllQuartersYearsSSE: { hide: false, text: 'AllQY SSE' },
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

  const renderShowChart = (symbol, chartData, SSEData)=> {
    modalWindowRef.current.popModalWindow(<StockBenfordLawChart title={`${symbol} Chart`} chartData={chartData} SSEData={SSEData}/>)
  }

  const genTableColTemplate = () => {
    return [
      SymbolNameField('Symbol', 130, 'symbol' in hideColState ? hideColState['symbol'] : false),
      PriceField('close', tableColList.Close.text, 110, 'close' in hideColState ? hideColState['close'] : tableColList['Close'].hide, null, "yahoo"),
      PureFieldWithValueCheck("lastQuarterSSE", tableColList.LastQuarterSSE.text, 110, 3, "lastQuarterSSE" in hideColState ? hideColState["lastQuarterSSE"] : tableColList['LastQuarterSSE'].hide, "The sum of squares due to error (SSE) for Benford's Law in the last quarter's financial data.", true),
      PureFieldWithValueCheck("lastYearSSE", tableColList.LastYearSSE.text, 110, 3, "lastYearSSE" in hideColState ? hideColState["lastYearSSE"] : tableColList['LastYearSSE'].hide, "The sum of squares due to error (SSE) for Benford's Law in the last year's financial data.", true),
      PureFieldWithValueCheck("allQuartersSSE", tableColList.AllQuartersSSE.text, 110, 3, "allQuartersSSE" in hideColState ? hideColState["allQuartersSSE"] : tableColList['AllQuartersSSE'].hide, "The sum of squares due to error (SSE) for Benford's Law in all quarters' financial data.", true),
      PureFieldWithValueCheck("allYearsSSE", tableColList.AllYearsSSE.text, 110, 3, "allYearsSSE" in hideColState ? hideColState["allYearsSSE"] : tableColList['AllYearsSSE'].hide, "The sum of squares due to error (SSE) for Benford's Law in all years' financial data.", true),
      PureFieldWithValueCheck("allQuartersYearsSSE", tableColList.AllQuartersYearsSSE.text, 110, 3, "allQuartersYearsSSE" in hideColState ? hideColState["allQuartersYearsSSE"] : tableColList['AllQuartersYearsSSE'].hide, "The sum of squares due to error (SSE) for Benford's Law in all quarters and years' financial data.", true),
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
              renderShowChart(params.row["symbol"], params.row["chartData"], params.row["SSEData"])
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
  const fetchBenfordData = useFetch({ cachePolicy: 'no-cache' })
  const renderStockBenfordLawTable = (config, showChart)=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/stock-benford-law.json', fetchBenfordData),
    ]).then((allResponses) => {
      //console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {
        let benfordProbs = allResponses[1]["benfordDigitProbs"]
        let output = Object.keys(allResponses[1]["data"]).reduce((result, symbol, index) => {
          let stockInfo = allResponses[0][symbol]
          let benfordData = allResponses[1]["data"][symbol]["data"]["stockDigitProbsSSE"]
          let lastQuarterSSE = "benfordSSE" in benfordData["lastQuarter"] ? benfordData["lastQuarter"]["benfordSSE"] : undefined
          let lastYearSSE = "benfordSSE" in benfordData["lastYear"] ? benfordData["lastYear"]["benfordSSE"] : undefined
          let allQuartersSSE = "benfordSSE" in benfordData["allQuarters"] ? benfordData["allQuarters"]["benfordSSE"] : undefined
          let allYearsSSE = "benfordSSE" in benfordData["allYears"] ? benfordData["allYears"]["benfordSSE"] : undefined
          let allQuartersYearsSSE = "benfordSSE" in benfordData["allQuartersYears"] ? benfordData["allQuartersYears"]["benfordSSE"] : undefined
          
          const genChartData = (d, valid) => {
            let chartData = []
            for (let i = 0; i < 9; i++) {
              chartData.push({
                name: `${i + 1}`,
                dataProbs: valid ? parseInt(d["prob"][i] * 10000, 10) / 100.0 : 0,
                benfordProbs: parseInt(benfordProbs[i] * 10000, 10) / 100.0
              })
            }
            return chartData
          }    
          const genChartTitle = (title, d, sse) => {
            let n = "No Data"
            let sseText = "N/A"
            if (sse !== undefined) {
              n = d.reduce((a,b)=>a+b)
              sseText = sse.toExponential(3)
            }
            return `[${title}] n=${n}, SSE=${sseText}`
          }

          let chartData = {
            "lastQuarter" : {
              "data": genChartData(benfordData["lastQuarter"], lastQuarterSSE !== undefined),
              "title": genChartTitle("Last Quarter", benfordData["lastQuarter"]["count"], lastQuarterSSE)
            },
            "lastYear": {
              "data": genChartData(benfordData["lastYear"], lastYearSSE !== undefined),
              "title": genChartTitle("Last Year", benfordData["lastYear"]["count"], lastYearSSE)
            },
            "allQuarters": {
              "data": genChartData(benfordData["allQuarters"], allQuartersSSE !== undefined),
              "title": genChartTitle("All Quarters", benfordData["allQuarters"]["count"], allQuartersSSE)
            },
            "allYears": {
              "data": genChartData(benfordData["allYears"], allYearsSSE !== undefined),
              "title": genChartTitle("All Years", benfordData["allYears"]["count"], allYearsSSE)
            },
            "allQuartersYears": {
              "data": genChartData(benfordData["allQuartersYears"], allQuartersYearsSSE !== undefined),
              "title": genChartTitle("All Q & Y", benfordData["allQuartersYears"]["count"], allQuartersYearsSSE)
            },
          }

          let SSEData = [
            {
              "name": "Financial Statement SSE",
              "lastQuarterSSE": lastQuarterSSE !== undefined ? lastQuarterSSE.toExponential(3) : 0,
              "lastYearSSE": lastYearSSE !== undefined ? lastYearSSE.toExponential(3) : 0,
              "allQuartersSSE": allQuartersSSE !== undefined ? allQuartersSSE.toExponential(3) : 0,
              "allYearsSSE": allYearsSSE !== undefined ? allYearsSSE.toExponential(3) : 0,
              "allQuartersYearsSSE": allQuartersYearsSSE !== undefined ? allQuartersYearsSSE.toExponential(3) : 0,
            },
          ]
          console.log(SSEData)
          let o = {
            id: index,
            symbol: symbol,
            close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
            lastQuarterSSE: lastQuarterSSE !== undefined && lastQuarterSSE !== null ? lastQuarterSSE : -Number.MAX_VALUE,
            lastYearSSE: lastYearSSE !== undefined && lastYearSSE !== null ? lastYearSSE : -Number.MAX_VALUE,
            allQuartersSSE: allQuartersSSE !== undefined && allQuartersSSE !== null ? allQuartersSSE : -Number.MAX_VALUE,
            allYearsSSE: allYearsSSE !== undefined && allYearsSSE !== null ? allYearsSSE : -Number.MAX_VALUE,
            allQuartersYearsSSE: allQuartersYearsSSE !== undefined && allQuartersYearsSSE !== null ? allQuartersYearsSSE : -Number.MAX_VALUE,
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
            chartData: chartData,
            SSEData: SSEData,
          }

          if(config.filter_symbols.length === 0 || config.filter_symbols.includes(symbol)) {
            result.push(o)
          }
          return result
        }, [])
        console.log(output)
        setRowData(output)
        if (showChart) {
          renderShowChart(output[0]["symbol"], output[0]["chartData"], output[0]["SSEData"])
        }
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch((error) => {
      console.error(error)
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
    renderStockBenfordLawTable(config, showChart)
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={stockBenfordLawStyle.container}>
        <div className={stockBenfordLawStyle.table}>
          <DataGrid rows={rowData} columns={genTableColTemplate()} components={{ NoRowsOverlay: DefaultDataGridTable, Toolbar: ()=>{
            return <SearchGridToolbar searchVal={searchVal} setSearchVal={setSearchVal} clickCallback={(config)=>{
              renderStockBenfordLawTable(config, false)
              }} 
              info={{
                placeholder: 'Filter symbols: AAPL, BAC, KSS, ...',
                tooltip: {
                  text: BenfordLawTooltip,
                  link: BenfordLawUrl
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

export default StockBenfordLaw
