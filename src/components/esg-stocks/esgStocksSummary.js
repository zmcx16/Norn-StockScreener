
import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import useFetch from 'use-http'
import moment from 'moment'

import { ESGLink, ESGTooltip } from '../../common/common'
import StockAndESGDataChart from './stockAndESGDataChart'
import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import SearchGridToolbar from '../searchGridToolbar'
import { SymbolNameField, PriceField, PureFieldWithValueCheck, PercentField, ColorPercentField, ShortFloatLinkWithShowChartField, YahooFinanceUrl } from '../../common/dataGridUtil'

import esgStocksSummaryStyle from './esgStocksSummary.module.scss'
import '../muiTablePagination.css'


const ESGStocksSummary = ({ loadingAnimeRef }) => {

  const [hideColState, setHideColState] = useState({})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const tableColList = {
    Close: { hide: false, text: 'Price' },
    PeerGroup: { hide: true, text: 'Type' },
    ESGLatest: { hide: false, text: 'ESG Latest' },
    ESGAvg1Yr: { hide: false, text: 'ESG Avg 1Yr' },
    ESGAvg3Yr: { hide: false, text: 'ESG Avg 3Yr' },
    ESGAvg5Yr: { hide: false, text: 'ESG Avg 5Yr' },
    ESGPeerLatest: { hide: false, text: 'Peer Latest' },
    ESGPeerAvg1Yr: { hide: false, text: 'Peer Avg 1Yr' },
    ESGPeerAvg3Yr: { hide: false, text: 'Peer Avg 3Yr' },
    ESGPeerAvg5Yr: { hide: false, text: 'Peer Avg 5Yr' },
    RatioLatest: { hide: false, text: 'Ratio Latest' },
    RatioAvg1Yr: { hide: false, text: 'Ratio Avg 1Yr' },
    RatioAvg3Yr: { hide: false, text: 'Ratio Avg 3Yr' },
    RatioAvg5Yr: { hide: false, text: 'Ratio Avg 5Yr' },
    PE: { hide: false, text: 'P/E' },
    PB: { hide: false, text: 'P/B' },
    ShortFloat: { hide: false, text: 'Short Float' },
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
      getData("/norn-data/esg/data/esgChart/" + symbol+".json", fetchESGData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {
        modalWindowRef.current.popModalWindow(<StockAndESGDataChart title={""} data={[]} />)
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
    }).catch(() => {
      modalWindowRef.current.popModalWindow(<div>Can't draw stock price & esg chart</div>)
    })
  }

  const ESGRatioField = (field, headerName, width, hide, description = null) => {
    let output = {
      field: field,
      headerName: headerName,
      width: width,
      type: 'number',
      renderCell: (params) => (
        params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
          <span>-</span> :
          <span style={{ fontWeight: 500, color: parseFloat(params.value) < 1 ? 'green' : parseFloat(params.value) >= -1 ? 'red' : '' }}>{params.value}</span>
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
      { field: 'peerGroup', headerName: 'PeerGroup', width: 155, hide: 'peerGroup' in hideColState ? hideColState['peerGroup'] : tableColList['PeerGroup'].hide },
      {
        field: "ESGLatest",
        headerName: tableColList.ESGLatest.text,
        width: 110,
        type: 'number',
        renderCell: (params) => (
          params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
            <span>-</span> :
            <Link href={ YahooFinanceUrl + 'quote/' + params.row["symbol"] + '/sustainability'} target="_blank" rel="noreferrer noopener">
              <span>{params.value.toFixed(2)}</span>
            </Link>
        ),
        hide: "ESGLatest" in hideColState ? hideColState["ESGLatest"] : tableColList['ESGLatest'].hide
      },
      PureFieldWithValueCheck("ESGAvg1Yr", tableColList.ESGAvg1Yr.text, 110, 2, "ESGAvg1Yr" in hideColState ? hideColState["ESGAvg1Yr"] : tableColList['ESGAvg1Yr'].hide),
      PureFieldWithValueCheck("ESGAvg3Yr", tableColList.ESGAvg3Yr.text, 110, 2, "ESGAvg3Yr" in hideColState ? hideColState["ESGAvg3Yr"] : tableColList['ESGAvg3Yr'].hide),
      PureFieldWithValueCheck("ESGAvg5Yr", tableColList.ESGAvg5Yr.text, 110, 2, "ESGAvg5Yr" in hideColState ? hideColState["ESGLatest"] : tableColList['ESGAvg5Yr'].hide),
      PureFieldWithValueCheck("ESGPeerLatest", tableColList.ESGPeerLatest.text, 110, 2, "ESGPeerLatest" in hideColState ? hideColState["ESGPeerLatest"] : tableColList['ESGPeerLatest'].hide),
      PureFieldWithValueCheck("ESGPeerAvg1Yr", tableColList.ESGPeerAvg1Yr.text, 110, 2, "ESGPeerAvg1Yr" in hideColState ? hideColState["ESGPeerAvg1Yr"] : tableColList['ESGPeerAvg1Yr'].hide),
      PureFieldWithValueCheck("ESGPeerAvg3Yr", tableColList.ESGPeerAvg3Yr.text, 110, 2, "ESGPeerAvg3Yr" in hideColState ? hideColState["ESGPeerAvg3Yr"] : tableColList['ESGPeerAvg3Yr'].hide),
      PureFieldWithValueCheck("ESGPeerAvg5Yr", tableColList.ESGPeerAvg5Yr.text, 110, 2, "ESGPeerAvg5Yr" in hideColState ? hideColState["ESGPeerAvg5Yr"] : tableColList['ESGPeerAvg5Yr'].hide),
      ESGRatioField("ratioLatest", tableColList.RatioLatest.text, 110, "ratioLatest" in hideColState ? hideColState["ratioLatest"] : tableColList['RatioLatest'].hide, "ESG Ratio Latest (ESG Latest / ESG Peer Latest)"),
      ESGRatioField("ratioAvg1Yr", tableColList.RatioAvg1Yr.text, 110, "ratioAvg1Yr" in hideColState ? hideColState["ratioAvg1Yr"] : tableColList['RatioAvg1Yr'].hide, "ESG Ratio Avg 1Yr (ESG Avg 1Yr / ESG Peer Avg 1Yr)"),
      ESGRatioField("ratioAvg3Yr", tableColList.RatioAvg3Yr.text, 110, "ratioAvg3Yr" in hideColState ? hideColState["ratioAvg3Yr"] : tableColList['RatioAvg3Yr'].hide, "ESG Ratio Avg 3Yr (ESG Avg 3Yr / ESG Peer Avg 3Yr)"),
      ESGRatioField("ratioAvg5Yr", tableColList.RatioAvg5Yr.text, 110, "ratioAvg5Yr" in hideColState ? hideColState["ratioAvg5Yr"] : tableColList['RatioAvg5Yr'].hide, "ESG Ratio Avg 5Yr (ESG Avg 5Yr / ESG Peer Avg 5Yr)"),
      PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, "PE" in hideColState ? hideColState["PE"] : tableColList['PE'].hide),
      PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, "PB" in hideColState ? hideColState["PB"] : tableColList['PB'].hide),
      ShortFloatLinkWithShowChartField("shortFloat", tableColList.ShortFloat.text, 150, "shortFloat" in hideColState ? hideColState["shortFloat"] : tableColList['ShortFloat'].hide),
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
  const fetchESGData = useFetch({ cachePolicy: 'no-cache' })
  const renderESGStocksTable = (config, showChart)=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/esg/stat.json', fetchESGData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {      
        let output = allResponses[1]["data"].reduce((result, value, index) => {
          let symbol = value["symbol"]
          let stockInfo = allResponses[0][symbol]
          let o = {
            id: index,
            symbol: symbol,
            close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
            peerGroup: 'peerGroup' in value && value['peerGroup'] !== '-' ? value['peerGroup'] : '-',
            ESGLatest: 'esg-latest' in value && value['esg-latest'] !== '-' ? value['esg-latest'] : -Number.MAX_VALUE,
            ESGAvg1Yr: 'esg-avg-1yr' in value && value['esg-avg-1yr'] !== '-' ? value['esg-avg-1yr'] : -Number.MAX_VALUE,
            ESGAvg3Yr: 'esg-avg-3yr' in value && value['esg-avg-3yr'] !== '-' ? value['esg-avg-3yr'] : -Number.MAX_VALUE,
            ESGAvg5Yr: 'esg-avg-5yr' in value && value['esg-avg-5yr'] !== '-' ? value['esg-avg-5yr'] : -Number.MAX_VALUE,
            ESGPeerLatest: 'esg-peer-latest' in value && value['esg-peer-latest'] !== '-' ? value['esg-peer-latest'] : -Number.MAX_VALUE,
            ESGPeerAvg1Yr: 'esg-peer-avg-1yr' in value && value['esg-peer-avg-1yr'] !== '-' ? value['esg-peer-avg-1yr'] : -Number.MAX_VALUE,
            ESGPeerAvg3Yr: 'esg-peer-avg-3yr' in value && value['esg-peer-avg-3yr'] !== '-' ? value['esg-peer-avg-3yr'] : -Number.MAX_VALUE,
            ESGPeerAvg5Yr: 'esg-peer-avg-5yr' in value && value['esg-peer-avg-5yr'] !== '-' ? value['esg-peer-avg-5yr'] : -Number.MAX_VALUE,
            ratioLatest: 'ratio-latest' in value && value['ratio-latest'] !== '-' ? value['ratio-latest'] : -Number.MAX_VALUE,
            ratioAvg1Yr: 'ratio-avg-1yr' in value && value['ratio-avg-1yr'] !== '-' ? value['ratio-avg-1yr'] : -Number.MAX_VALUE,
            ratioAvg3Yr: 'ratio-avg-3yr' in value && value['ratio-avg-3yr'] !== '-' ? value['ratio-avg-3yr'] : -Number.MAX_VALUE,
            ratioAvg5Yr: 'ratio-avg-5yr' in value && value['ratio-avg-5yr'] !== '-' ? value['ratio-avg-5yr'] : -Number.MAX_VALUE,
            PE: stockInfo !== undefined && stockInfo !== null && stockInfo['P/E'] !== '-' ? stockInfo['P/E'] : Number.MAX_VALUE,
            PB: stockInfo !== undefined && stockInfo !== null && stockInfo['P/B'] !== '-' ? stockInfo['P/B'] : Number.MAX_VALUE,
            shortFloat: stockInfo !== undefined && stockInfo !== null && stockInfo['Short Float'] !== '-' ? stockInfo['Short Float'] : -Number.MAX_VALUE,
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
    renderESGStocksTable(config, showChart)
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={esgStocksSummaryStyle.container}>
        <div className={esgStocksSummaryStyle.table}>
          <DataGrid rows={rowData} columns={genTableColTemplate()} components={{ NoRowsOverlay: DefaultDataGridTable, Toolbar: ()=>{
            return <SearchGridToolbar searchVal={searchVal} setSearchVal={setSearchVal} clickCallback={(config)=>{
              renderESGStocksTable(config, false)
            }} 
              info={{
                placeholder: 'Filter symbols: AAPL, BAC, KSS, ...',
                tooltip: {
                  text: ESGTooltip,
                  link: ESGLink
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

export default ESGStocksSummary
