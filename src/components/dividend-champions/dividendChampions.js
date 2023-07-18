
import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import useFetch from 'use-http'
import moment from 'moment'
import Link from '@mui/material/Link'

import DividendChart from './dividendChart'
import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import SearchGridToolbar from '../searchGridToolbar'
import { DividendChampionsUrl, DividendChampionsTooltip, DividendDRGDescription } from '../../common/common'
import { SymbolNameField, PriceField, PureFieldWithValueCheck, PercentField, ColorPercentField } from '../../common/dataGridUtil'

import dividendChampionsStyle from './dividendChampions.module.scss'
import '../muiTablePagination.css'

const DividendChampions = ({ loadingAnimeRef }) => {

  const [hideColState, setHideColState] = useState({})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })


  const tableColList = {
    Close: { hide: false, text: 'Price' },
    PE: { hide: false, text: 'P/E' },
    PB: { hide: false, text: 'P/B' },
    Dividend: { hide: false, text: 'Dividend %' },
    AvgYield5Y: { hide: false, text: 'Dividend %(5Y)' },
    NoYears: { hide: false, text: 'No Years' },
    DGR1Y: { hide: false, text: 'DGR 1Y' },
    DGR3Y: { hide: false, text: 'DGR 3Y' },
    DGR5Y: { hide: false, text: 'DGR 5Y' },
    DGR10Y: { hide: false, text: 'DGR 10Y' },
    ExDividendDate: { hide: false, text: 'Ex-Dividend Date' },
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
      getData("/norn-data/dividend/historical-quotes/" + symbol+".json", fetchShortData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 1 && allResponses[0] !== null) {
        const title = `${symbol} Chart`
        modalWindowRef.current.popModalWindow(<DividendChart title={title} data={[]} />)
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
    }).catch(() => {
      modalWindowRef.current.popModalWindow(<div>Can't draw chart</div>)
    })
  }

  const genTableColTemplate = () => {
    return [
      SymbolNameField('Symbol', 130, 'symbol' in hideColState ? hideColState['symbol'] : false),
      PriceField('close', tableColList.Close.text, 110, 'close' in hideColState ? hideColState['close'] : tableColList['Close'].hide, null, "yahoo"),
      PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, "PE" in hideColState ? hideColState["PE"] : tableColList['PE'].hide),
      PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, "PB" in hideColState ? hideColState["PB"] : tableColList['PB'].hide),
      PercentField("dividend", tableColList.Dividend.text, 150, "dividend" in hideColState ? hideColState["dividend"] : tableColList['Dividend'].hide),
      PercentField("avgYield5Y", tableColList.AvgYield5Y.text, 150, "avgYield5Y" in hideColState ? hideColState["avgYield5Y"] : tableColList['AvgYield5Y'].hide),
      PureFieldWithValueCheck("noYears", tableColList.NoYears.text, 110, 0, "noYears" in hideColState ? hideColState["noYears"] : tableColList['NoYears'].hide),
      ColorPercentField("DGR1Y", tableColList.DGR1Y.text, 150, 2, "DGR1Y" in hideColState ? hideColState["DGR1Y"] : tableColList['DGR1Y'].hide, DividendDRGDescription),
      ColorPercentField("DGR3Y", tableColList.DGR3Y.text, 150, 2, "DGR3Y" in hideColState ? hideColState["DGR3Y"] : tableColList['DGR3Y'].hide, DividendDRGDescription),
      ColorPercentField("DGR5Y", tableColList.DGR5Y.text, 150, 2, "DGR5Y" in hideColState ? hideColState["DGR5Y"] : tableColList['DGR5Y'].hide, DividendDRGDescription),
      ColorPercentField("DGR10Y", tableColList.DGR10Y.text, 150, 2, "DGR10Y" in hideColState ? hideColState["DGR10Y"] : tableColList['DGR10Y'].hide, DividendDRGDescription),
      {
        field: 'exDividendDate',
        headerName: tableColList.ExDividendDate.text,
        width: 130,
        renderCell: (params) => (
          'exDividendLink' in params.row && params.row['exDividendLink'] != "" && params.row['exDividendLink'] != "-" ?       
          <Link href={params.row['exDividendLink']} target="_blank" rel="noreferrer noopener">
            <span style={{color: params.row['exDividendDateColor']}}>{params.value}</span>
          </Link> : <span>{params.value}</span>
        ),
        hide: 'exDividendDate' in hideColState ? hideColState['exDividendDate'] : tableColList['ExDividendDate'].hide
      },
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
  const fetchShortData = useFetch({ cachePolicy: 'no-cache' })
  const renderShortStocksTable = (config, showChart)=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/dividend/champions.json', fetchShortData),
      getData('/norn-data/dividend/all_dividend_date_list.json', fetchShortData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 3 && allResponses[0] !== null && allResponses[1] !== null && allResponses[2] !== null) {        
        let dividendDateMap = Object.assign({}, ...allResponses[2]["data"].map((x) => ({[x.symbol]: x})))
        let output = Object.keys(allResponses[1]["data"]).reduce((result, symbol, index) => {
          let stockInfo = allResponses[0][symbol]
          let championsValue = allResponses[1]["data"][symbol]
          let dividendDate = {"link": "-", "ex_dividend_date": "-"}
          if (symbol in dividendDateMap) {
            dividendDate["link"] = dividendDateMap[symbol]["link"]
            dividendDate["ex_dividend_date"] = dividendDateMap[symbol]["ex_dividend_date"]
          }
          let o = {
            id: index,
            symbol: symbol,
            close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
            PE: stockInfo !== undefined && stockInfo !== null && stockInfo['P/E'] !== '-' ? stockInfo['P/E'] : Number.MAX_VALUE,
            PB: stockInfo !== undefined && stockInfo !== null && stockInfo['P/B'] !== '-' ? stockInfo['P/B'] : Number.MAX_VALUE,
            dividend: championsValue !== undefined && championsValue !== null && championsValue['Div Yield'] !== '-' ? championsValue['Div Yield'] / 100.0 : -Number.MAX_VALUE,
            noYears: championsValue !== undefined && championsValue !== null && championsValue['No Years'] !== '-' ? championsValue['No Years'] : -Number.MAX_VALUE,
            avgYield5Y: championsValue !== undefined && championsValue !== null && championsValue['5Y Avg Yield'] !== '-' ? championsValue['5Y Avg Yield'] / 100.0 : -Number.MAX_VALUE,
            DGR1Y: championsValue !== undefined && championsValue !== null && championsValue['DGR 1Y'] !== '-' ? championsValue['DGR 1Y'] / 100.0 : -Number.MAX_VALUE,
            DGR3Y: championsValue !== undefined && championsValue !== null && championsValue['DGR 3Y'] !== '-' ? championsValue['DGR 3Y'] / 100.0 : -Number.MAX_VALUE,
            DGR5Y: championsValue !== undefined && championsValue !== null && championsValue['DGR 5Y'] !== '-' ? championsValue['DGR 5Y'] / 100.0 : -Number.MAX_VALUE,
            DGR10Y: championsValue !== undefined && championsValue !== null && championsValue['DGR 10Y'] !== '-' ? championsValue['DGR 10Y'] / 100.0 : -Number.MAX_VALUE,
            exDividendLink: dividendDate["link"],
            exDividendDate: dividendDate["ex_dividend_date"],
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
      <div className={dividendChampionsStyle.container}>
        <div className={dividendChampionsStyle.table}>
          <DataGrid rows={rowData} columns={genTableColTemplate()} components={{ NoRowsOverlay: DefaultDataGridTable, Toolbar: ()=>{
            return <SearchGridToolbar searchVal={searchVal} setSearchVal={setSearchVal} clickCallback={(config)=>{
              renderShortStocksTable(config, false)
              }} 
              info={{
                placeholder: 'Filter symbols: AAPL, BAC, KSS, ...',
                tooltip: {
                  text: DividendChampionsTooltip,
                  link: DividendChampionsUrl
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

export default DividendChampions
