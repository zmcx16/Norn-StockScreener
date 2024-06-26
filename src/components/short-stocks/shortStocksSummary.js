
import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import useFetch from 'use-http'
import moment from 'moment'

import StockAndShortDataChart from './stockAndShortDataChart'
import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import SearchGridToolbar from '../searchGridToolbar'
import { FINRAShortInterestUrl, ShortStockDataSourceTooltip } from '../../common/common'
import { SymbolNameField, PriceField, PureFieldWithValueCheck, PercentField, ColorPercentField } from '../../common/dataGridUtil'
import { NoMaxWidthTooltip } from '../../common/reactUtils'

import shortStocksSummaryStyle from './shortStocksSummary.module.scss'
import '../muiTablePagination.css'

const ShortStocksSummary = ({ loadingAnimeRef }) => {

  const [hideColState, setHideColState] = useState({})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const tableColList = {
    Close: { hide: false, text: 'Price' },
    ShortFloat: { hide: false, text: 'Short Float' },
    ShortRatio: { hide: false, text: 'Short Ratio' },
    SF0_5m: { hide: false, text: 'SF-15d' },
    SF1m: { hide: false, text: 'SF-30d' },
    SF1_5m: { hide: false, text: 'SF-45d' },
    SF0_5y: { hide: true, text: 'SF-6mo' },
    SF1y: { hide: true, text: 'SF-1yr' },
    SR0_5m: { hide: false, text: 'SR-15d' },
    SR1m: { hide: false, text: 'SR-30d' },
    SR1_5m: { hide: false, text: 'SR-45d' },
    SR0_5y: { hide: true, text: 'SR-6mo' },
    SR1y: { hide: true, text: 'SR-1yr' },
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

  const renderShowChart = (symbol, shsFloat)=> {
    console.log(symbol)
    console.log(shsFloat)
    Promise.all([
      getData("/norn-data/stock/historical-quotes/" + symbol+".json", fetchStockData),
      getData("/norn-data/stock-short/historical-quotes/" + symbol+".json", fetchShortData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {
        let startDate = new Date(Date.now() - 365*24*60*60*1000)
        if (allResponses[0].length > 0) {
          startDate = new Date(allResponses[0][allResponses[0].length-1].Date)
        }
        // add short float & ratio
        allResponses[1].forEach((val) => {
          if (shsFloat != -Number.MAX_VALUE) {
            val['shortFloat'] = parseInt(val['currentShortPositionQuantity'] / shsFloat * 10000, 10) / 100.0
          } 
          
          val['shortRatio'] = parseInt(val['currentShortPositionQuantity'] / val['averageDailyVolumeQuantity'] * 100, 10) / 100.0
        })

        let allDateByKey = {}
        const convertData2DictByDate = (data, dateKey, key, valueKey) => {
          if (data && !Array.isArray(data)) {
            console.log("data is not array")
            return
          }

          data.forEach((val) => {
            let date = Date.parse(new Date(Date.parse(val[dateKey])).toLocaleDateString()) // align timezone
            if (date < startDate) {
              return
            }
            if (!(date in allDateByKey)) {
              allDateByKey[date] = {}
            }
            allDateByKey[date][key] = val[valueKey]
          })
        }
        convertData2DictByDate(allResponses[0], "Date", "close", "Close")
        convertData2DictByDate(allResponses[0], "Date", "volume", "Volume")
        convertData2DictByDate(allResponses[1], "settlementDate", "shortInterest", "currentShortPositionQuantity")
        convertData2DictByDate(allResponses[1], "settlementDate", "avgDailyVolume", "averageDailyVolumeQuantity")
        convertData2DictByDate(allResponses[1], "settlementDate", "shortFloat", "shortFloat")
        convertData2DictByDate(allResponses[1], "settlementDate", "shortRatio", "shortRatio")
        //console.log(allDateByKey)
        let allDataArray = []
        let targetKeys = ["close", "volume", "shortInterest", "avgDailyVolume", "shortFloat", "shortRatio"]
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
        const title = `${symbol} (${allResponses[1][0]["issueName"]}) Chart`
        modalWindowRef.current.popModalWindow(<StockAndShortDataChart title={title} data={allDataArray} />)
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
    }).catch(() => {
      modalWindowRef.current.popModalWindow(<div>Can't draw stock price & short chart</div>)
    })
  }

  const genTableColTemplate = () => {
    return [
      SymbolNameField('Symbol', 130, 'symbol' in hideColState ? hideColState['symbol'] : false),
      PriceField('close', tableColList.Close.text, 110, 'close' in hideColState ? hideColState['close'] : tableColList['Close'].hide, null, "yahoo"),
      {
        field: "shortFloat",
        headerName: 'Short Float',
        width: 110,
        type: 'number',
        renderCell: (params) => (
          params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN'  ?
            <span>-</span> :
            <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{
              (params.row["shortInterest"]) + " / " + (params.row["shsFloat"])
            }</span>} >
              <span>{(params.value * 100).toFixed(2) + "%"}</span>
            </NoMaxWidthTooltip>
        ),
        hide: "shortFloat" in hideColState ? hideColState["shortFloat"] : tableColList['ShortFloat'].hide
      },
      {
        field: "shortRatio",
        headerName: 'Short Ratio',
        width: 110,
        type: 'number',
        renderCell: (params) => (
          params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN'  ?
            <span>-</span> :
            <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{
              (params.row["shortInterest"]) + " / " + (params.row["shsFloat"])
            }</span>} >
              <span>{(params.value).toFixed(2)}</span>
            </NoMaxWidthTooltip>
        ),
        hide: "shortFloat" in hideColState ? hideColState["shortFloat"] : tableColList['ShortFloat'].hide
      },
      ColorPercentField("SF0_5m", tableColList.SF0_5m.text, 150, 2, "SF0_5m" in hideColState ? hideColState["SF0_5m"] : tableColList['SF0_5m'].hide, 500, 'Short Float Latest 15 Days Changed (%)', -1),
      ColorPercentField("SF1m", tableColList.SF1m.text, 150, 2, "SF1m" in hideColState ? hideColState["SF1m"] : tableColList['SF1m'].hide, 500, 'Short Float Latest 30 Days Changed (%)', -1),
      ColorPercentField("SF1_5m", tableColList.SF1_5m.text, 150, 2, "SF1_5m" in hideColState ? hideColState["SF1_5m"] : tableColList['SF1_5m'].hide, 500, 'Short Float Latest 45 Days Changed (%)', -1),
      ColorPercentField("SF0_5y", tableColList.SF0_5y.text, 150, 2, "SF0_5y" in hideColState ? hideColState["SF0_5y"] : tableColList['SF0_5y'].hide, 500, 'Short Float Latest 6 Months Changed (%)', -1),
      ColorPercentField("SF1y", tableColList.SF1y.text, 150, 2, "SF1y" in hideColState ? hideColState["SF1y"] : tableColList['SF1y'].hide, 500, 'Short Float Latest 1 Years Changed (%)', -1),
      ColorPercentField("SR0_5m", tableColList.SR0_5m.text, 150, 2, "SR0_5m" in hideColState ? hideColState["SR0_5m"] : tableColList['SR0_5m'].hide, 500, 'Short Ratio Latest 15 Days Changed (%)', -1),
      ColorPercentField("SR1m", tableColList.SR1m.text, 150, 2, "SR1m" in hideColState ? hideColState["SR1m"] : tableColList['SR1m'].hide, 500, 'Short Ratio Latest 30 Days Changed (%)', -1),
      ColorPercentField("SR1_5m", tableColList.SR1_5m.text, 150, 2, "SR1_5m" in hideColState ? hideColState["SR1_5m"] : tableColList['SR1_5m'].hide, 500, 'Short Ratio Latest 45 Days Changed (%)', -1),
      ColorPercentField("SR0_5y", tableColList.SR0_5y.text, 150, 2, "SR0_5y" in hideColState ? hideColState["SR0_5y"] : tableColList['SR0_5y'].hide, 500, 'Short Ratio Latest 6 Months Changed (%)', -1),
      ColorPercentField("SR1y", tableColList.SR1y.text, 150, 2, "SR1y" in hideColState ? hideColState["SR1y"] : tableColList['SR1y'].hide, 500, 'Short Ratio Latest 1 Years Changed (%)', -1),
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
              renderShowChart(params.row["symbol"], params.row["shsFloat"])
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
  const fetchShortData = useFetch({ cachePolicy: 'no-cache' })
  const renderShortStocksTable = (config, showChart)=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/stock-short/stat.json', fetchShortData),
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
            shsFloat: value['Shs Float'] !== '-' ? value['Shs Float'] : -Number.MAX_VALUE,
            shortInterest: value['Short Interest'] !== '-' ? value['Short Interest'] : -Number.MAX_VALUE,
            shortFloat: value['Short Float'] !== '-' ? value['Short Float'] : -Number.MAX_VALUE,
            shortRatio: value['Short Ratio'] !== '-' ? value['Short Ratio'] : -Number.MAX_VALUE,
            SF0_5m: value['SF-0.5m'] !== '-' ? value['SF-0.5m'] : -Number.MAX_VALUE,
            SF1m: value['SF-1m'] !== '-' ? value['SF-1m'] : -Number.MAX_VALUE,
            SF1_5m: value['SF-1.5m'] !== '-' ? value['SF-1.5m'] : -Number.MAX_VALUE,
            SF0_5y: value['SF-0.5y'] !== '-' ? value['SF-0.5y'] : -Number.MAX_VALUE,
            SF1y: value['SF-1y'] !== '-' ? value['SF-1y'] : -Number.MAX_VALUE,
            SR0_5m: value['SR-0.5m'] !== '-' ? value['SR-0.5m'] : -Number.MAX_VALUE,
            SR1m: value['SR-1m'] !== '-' ? value['SR-1m'] : -Number.MAX_VALUE,
            SR1_5m: value['SR-1.5m'] !== '-' ? value['SR-1.5m'] : -Number.MAX_VALUE,
            SR0_5y: value['SR-0.5y'] !== '-' ? value['SR-0.5y'] : -Number.MAX_VALUE,
            SR1y: value['SR-1y'] !== '-' ? value['SR-1y'] : -Number.MAX_VALUE,
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
          renderShowChart(output[0]["symbol"], output[0]["shsFloat"])
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
      <div className={shortStocksSummaryStyle.container}>
        <div className={shortStocksSummaryStyle.table}>
          <DataGrid rows={rowData} columns={genTableColTemplate()} components={{ NoRowsOverlay: DefaultDataGridTable, Toolbar: ()=>{
            return <SearchGridToolbar searchVal={searchVal} setSearchVal={setSearchVal} clickCallback={(config)=>{
              renderShortStocksTable(config, false)
            }} 
              info={{
                placeholder: 'Filter symbols: AAPL, BAC, KSS, ...',
                tooltip: {
                  text: ShortStockDataSourceTooltip,
                  link: FINRAShortInterestUrl
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

export default ShortStocksSummary
