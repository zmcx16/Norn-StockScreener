import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import BarChartSharpIcon from '@material-ui/icons/BarChartSharp'
import Link from '@material-ui/core/Link'
import useFetch from 'use-http'
import moment from 'moment'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import StockAndTrendDataChart from './stockAndTrendDataChart'
import { SymbolNameField, PureFieldWithValueCheck, PercentField, ColorPercentField } from '../../common/reactUtils'

import googleTrendStocksTableStyle from './googleTrendStocksTable.module.scss'
import '../muiTablePagination.css'

const GoogleTrendStocksTable = ({ loadingAnimeRef }) => {

  const [hideColState, setHideColState] = useState({})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const tableColList = {
    Week3: { hide: true, text: 'W3-Max' },
    Week3R: { hide: false, text: 'W3-Ratio' },
    Month3: { hide: true, text: 'M3-Max' },
    Month3R: { hide: false, text: 'M3-Ratio' },
    Month7: { hide: true, text: 'M7-Max' },
    Month7R: { hide: false, text: 'M7-Ratio' },
    Month14: { hide: true, text: 'M14-Max' },
    Month14R: { hide: false, text: 'M14-Ratio' },
    Quart7: { hide: true, text: 'Q7-Max' },
    Quart7R: { hide: false, text: 'Q7-Ratio' },
    Quart14: { hide: true, text: 'Q14-Max' },
    Quart14R: { hide: false, text: 'Q14-Ratio' },
    Quart21: { hide: true, text: 'Q21-Max' },
    Quart21R: { hide: false, text: 'Q21-Ratio' },
    Year14: { hide: true, text: 'Y14-Max' },
    Year14R: { hide: false, text: 'Y14-Ratio' },
    Year21: { hide: true, text: 'Y21-Max' },
    Year21R: { hide: false, text: 'Y21-Ratio' },
    Avg: { hide: false, text: 'Avg-Max' },
    AvgR: { hide: false, text: 'Avg-Ratio' },
    Close: { hide: false, text: 'Price' },
    PE: { hide: false, text: 'P/E' },
    PB: { hide: false, text: 'P/B' },
    Dividend: { hide: false, text: 'Dividend %' },
    High52: { hide: true, text: '52W High' },
    Low52: { hide: true, text: '52W Low' },
    PerfWeek: { hide: true, text: 'Perf Week' },
    PerfMonth: { hide: true, text: 'Perf Month' },
    PerfQuarter: { hide: true, text: 'Perf Quarter' },
    PerfHalfY: { hide: true, text: 'Perf Half Y' },
    PerfYear: { hide: true, text: 'Perf Year' },
    PerfYTD: { hide: true, text: 'Perf YTD' },
    Chart: { hide: false, text: 'Chart' },
  }

  const trendDataField = (field, headerName, width, valueKey, hide) => {
    let date = ""
    if (valueKey.indexOf("week")!==-1) {
      date = "now 7-d"
    } else if (valueKey.indexOf("month") !== -1) {
      date = "today 1-m"
    } else if (valueKey.indexOf("quarter") !== -1) {
      date = "today 3-m"
    } else if (valueKey.indexOf("year") !== -1) {
      date = "today 12-m"
    }

    return {
      field: field,
      headerName: headerName,
      width: width,
      type: 'number',
      renderCell: (params) => (
        <Link href={encodeURI("https://trends.google.com.tw/trends/explore?date=" + date + "&q=" + params.row['keyword'])} target="_blank" rel="noreferrer noopener">
          <span>{params.row[valueKey].toFixed(2)}</span>
        </Link>
      ),
      hide: hide
    }
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

  const genTableColTemplate = () => {
    return [
      SymbolNameField('symbol', 'Symbol', 130, 'symbol' in hideColState ? hideColState['symbol'] : false),
      trendDataField("week3", tableColList.Week3.text, 140, "week3", "week3" in hideColState ? hideColState["week3"] : tableColList['Week3'].hide),
      trendDataField("week3R", tableColList.Week3R.text, 140, "week3R", "week3R" in hideColState ? hideColState["week3R"] : tableColList['Week3R'].hide),
      trendDataField("month3", tableColList.Month3.text, 140, "month3", "month3" in hideColState ? hideColState["month3"] : tableColList['Month3'].hide),
      trendDataField("month3R", tableColList.Month3R.text, 140, "month3R", "month3R" in hideColState ? hideColState["month3R"] : tableColList['Month3R'].hide),
      trendDataField("month7", tableColList.Month7.text, 140, "month7", "month7" in hideColState ? hideColState["month7"] : tableColList['Month7'].hide),
      trendDataField("month7R", tableColList.Month7R.text, 140, "month7R", "month7R" in hideColState ? hideColState["month7R"] : tableColList['Month7R'].hide),
      trendDataField("month14", tableColList.Month14.text, 140, "month14", "month14" in hideColState ? hideColState["month14"] : tableColList['Month14'].hide),
      trendDataField("month14R", tableColList.Month14R.text, 150, "month14R", "month14R" in hideColState ? hideColState["month14R"] : tableColList['Month14R'].hide),
      trendDataField("quarter7", tableColList.Quart7.text, 140, "quarter7", "quarter7" in hideColState ? hideColState["quarter7"] : tableColList['Quart7'].hide),
      trendDataField("quarter7R", tableColList.Quart7R.text, 140, "quarter7R", "quarter7R" in hideColState ? hideColState["quarter7R"] : tableColList['Quart7R'].hide),
      trendDataField("quarter14", tableColList.Quart14.text, 140, "quarter14", "quarter14" in hideColState ? hideColState["quarter14"] : tableColList['Quart14'].hide),
      trendDataField("quarter14R", tableColList.Quart14R.text, 150, "quarter14R", "quarter14R" in hideColState ? hideColState["quarter14R"] : tableColList['Quart14R'].hide),
      trendDataField("quarter21", tableColList.Quart21.text, 140, "quarter21", "quarter21" in hideColState ? hideColState["quarter21"] : tableColList['Quart21'].hide),
      trendDataField("quarter21R", tableColList.Quart21R.text, 150, "quarter21R", "quarter21R" in hideColState ? hideColState["quarter21R"] : tableColList['Quart21R'].hide),
      trendDataField("year14", tableColList.Year14.text, 140, "year14", "year14" in hideColState ? hideColState["year14"] : tableColList['Year14'].hide),
      trendDataField("year14R", tableColList.Year14R.text, 140, "year14R", "year14R" in hideColState ? hideColState["year14R"] : tableColList['Year14R'].hide),
      trendDataField("year21", tableColList.Year21.text, 140, "year21", "year21" in hideColState ? hideColState["year21"] : tableColList['Year21'].hide),
      trendDataField("year21R", tableColList.Year21R.text, 140, "year21R", "year21R" in hideColState ? hideColState["year21R"] : tableColList['Year21R'].hide),
      { 
        field: 'avg', 
        headerName: tableColList.Avg.text, 
        width: 140, 
        type: 'number',
        renderCell: (params) => (
          <span>{params.row['avg'].toFixed(2)}</span>
        ),
        hide: 'avg' in hideColState ? hideColState['avg'] : tableColList['Avg'].hide
      },
      {
        field: 'avgR',
        headerName: tableColList.AvgR.text,
        width: 140,
        type: 'number',
        renderCell: (params) => (
          <span>{params.row['avgR'].toFixed(2)}</span>
        ),
        hide: 'avgR' in hideColState ? hideColState['avgR'] : tableColList['AvgR'].hide
      },
      PureFieldWithValueCheck("close", tableColList.Close.text, 110, 2, "close" in hideColState ? hideColState["close"] : tableColList['Close'].hide),
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
            onClick={() => {
              Promise.all([
                getData("/norn-data/stock/historical-quotes/" + params.row['symbol']+".json", fetchStockData),
                getData("/norn-data/google-trend/data/" + params.row['symbol'] + ".json", fetchGoogleTrendData),
              ]).then((allResponses) => {
                // console.log(allResponses)
                if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {
                  
                  // get all google trend date
                  let allDateByKey = {}
                  const convertGoogleTrendData2DictByDate = (data, key, valueKey) => {
                    data.forEach((val) => {
                      let date = Date.parse(val["Date"])
                      if (!(date in allDateByKey)) {
                        allDateByKey[date] = {}
                      }
                      allDateByKey[date][key] = val[valueKey]
                    })
                  }
                  convertGoogleTrendData2DictByDate(allResponses[0], "close", "Close")
                  convertGoogleTrendData2DictByDate(allResponses[0], "volume", "Volume")
                  convertGoogleTrendData2DictByDate(allResponses[1]["week"], "week", "Value")
                  convertGoogleTrendData2DictByDate(allResponses[1]["month"], "month", "Value")
                  convertGoogleTrendData2DictByDate(allResponses[1]["quarter"], "quarter", "Value")
                  convertGoogleTrendData2DictByDate(allResponses[1]["year"], "year", "Value")
                  //console.log(allDateByKey)
                  let allDataArray = []
                  let targetKeys = ["close", "volume", "week", "month", "quarter", "year"]
                  Object.keys(allDateByKey).sort().forEach((key) => {
                    let o = { Date: moment(parseInt(key)).format('MM/DD/YYYY HH:mm:ss') }
                    targetKeys.forEach((val) => {
                      if (val in allDateByKey[key]) {
                        o[val] = allDateByKey[key][val]
                      }
                    })
                    allDataArray.push(o)
                  })
                  //console.log(allDataArray)
                  const title = `${params.row['symbol']} (${params.row['keyword']}) Chart`
                  modalWindowRef.current.popModalWindow(<StockAndTrendDataChart title={title} data={allDataArray} />)
                } else {
                  modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
                }
              }).catch(() => {
                modalWindowRef.current.popModalWindow(<div>Can't draw google trend with stock price chart</div>)
              })
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
  const fetchGoogleTrendData = useFetch({ cachePolicy: 'no-cache' })

  const getGoogleTrendTable = ()=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/google-trend/stat.json', fetchGoogleTrendData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {      
        let output = allResponses[1].map((value, index) => {
          let stockInfo = allResponses[0][value['symbol']]
          const getRatio = (val, avg) => {
            return avg === 0 ? 0 : val / avg
          }
          let o = {
            id: index,
            symbol: value['symbol'],
            keyword: value['keyword'],
            week3: value['week-3'],
            week3R: getRatio(value['week-3'], value['week-avg']) ,
            month3: value['month-3'],
            month3R: getRatio(value['month-3'], value['month-avg']),
            month7: value['month-7'],
            month7R: getRatio(value['month-7'], value['month-avg']),
            month14: value['month-14'],
            month14R: getRatio(value['month-14'], value['month-avg']),
            quarter7: value['quarter-7'],
            quarter7R: getRatio(value['quarter-7'], value['quarter-avg']),
            quarter14: value['quarter-14'],
            quarter14R: getRatio(value['quarter-14'], value['quarter-avg']),
            quarter21: value['quarter-21'],
            quarter21R: getRatio(value['quarter-21'], value['quarter-avg']),
            year14: value['year-14'],
            year14R: getRatio(value['year-14'], value['year-avg']),
            year21: value['year-21'],
            year21R: getRatio(value['year-21'], value['year-avg']),
            avg: 0,
            avgR: 0,
            close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
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
          o.avg = [o.week3, o.month3, o.month7, o.month14, o.quarter7, o.quarter14, o.quarter21, o.year14, o.year21].reduce((a, b) => a + b, 0) / 9.0
          o.avgR = [o.week3R, o.month3R, o.month7R, o.month14R, o.quarter7R, o.quarter14R, o.quarter21R, o.year14R, o.year21R].reduce((a, b) => a + b, 0) / 9.0
          return o
        })
        setRowData(output)
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

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    getGoogleTrendTable()
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={googleTrendStocksTableStyle.container}>
        <div className={googleTrendStocksTableStyle.table}>
          <DataGrid rows={rowData} columns={genTableColTemplate()} rowsPerPageOptions={[]} autoPageSize={true} components={{ NoRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick onColumnVisibilityChange={(param) => {
            let tempHideColState = hideColState
            tempHideColState[param['field']] = !param['isVisible']
            setHideColState(tempHideColState)
          }}/>
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default GoogleTrendStocksTable
