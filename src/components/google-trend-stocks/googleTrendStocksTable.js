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
import { SymbolNameField, PureFieldWithValueCheck, PercentField } from '../../common/reactUtils'

import googleTrendStocksTableStyle from './googleTrendStocksTable.module.scss'
import '../muiTablePagination.css'

const GoogleTrendStocksTable = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const tableColList = {
    Week3: { show: false, text: 'W3-Max' },
    Week3R: { show: true, text: 'W3-Ratio' },
    Month3: { show: false, text: 'M3-Max' },
    Month3R: { show: true, text: 'M3-Ratio' },
    Month7: { show: false, text: 'M7-Max' },
    Month7R: { show: true, text: 'M7-Ratio' },
    Month14: { show: false, text: 'M14-Max' },
    Month14R: { show: true, text: 'M14-Ratio' },
    Quart7: { show: false, text: 'Q7-Max' },
    Quart7R: { show: true, text: 'Q7-Ratio' },
    Quart14: { show: false, text: 'Q14-Max' },
    Quart14R: { show: true, text: 'Q14-Ratio' },
    Quart21: { show: false, text: 'Q21-Max' },
    Quart21R: { show: true, text: 'Q21-Ratio' },
    Year14: { show: false, text: 'Y14-Max' },
    Year14R: { show: true, text: 'Y14-Ratio' },
    Year21: { show: false, text: 'Y21-Max' },
    Year21R: { show: true, text: 'Y21-Ratio' },
    Avg: { show: true, text: 'Avg-Max' },
    AvgR: { show: true, text: 'Avg-Ratio' },
    Close: { show: true, text: 'Price' },
    PE: { show: true, text: 'P/E' },
    PB: { show: true, text: 'P/B' },
    Dividend: { show: true, text: 'Dividend %' },
    High52: { show: false, text: '52W High' },
    Low52: { show: false, text: '52W Low' },
    PerfWeek: { show: false, text: 'Perf Week' },
    PerfMonth: { show: false, text: 'Perf Month' },
    PerfQuarter: { show: false, text: 'Perf Quarter' },
    PerfHalfY: { show: false, text: 'Perf Half Y' },
    PerfYear: { show: false, text: 'Perf Year' },
    PerfYTD: { show: false, text: 'Perf YTD' },
    Chart: { show: true, text: 'Chart' },
  }

  const showColListRef = useRef(Object.keys(tableColList).reduce((accumulator, currentValue) => {
    accumulator[currentValue] = tableColList[currentValue].show
    return accumulator
  }, {}))

  const trendDataField = (field, headerName, width, valueKey, colShow) => {
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
      renderCell: (params) => (
        <Link href={encodeURI("https://trends.google.com.tw/trends/explore?date=" + date + "&q=" + params.row['keyword'])} target="_blank" rel="noreferrer noopener">
          <span>{params.row[valueKey].toFixed(2)}</span>
        </Link>
      ),
      colShow: colShow
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

  const getTableColTemplate = (showColList) => {
    return [
      SymbolNameField('symbol', 'Symbol', 90, true),
      trendDataField("week3", tableColList.Week3.text, 100, "week3", showColList['Week3']),
      trendDataField("week3R", tableColList.Week3R.text, 100, "week3R", showColList['Week3R']),
      trendDataField("month3", tableColList.Month3.text, 100, "month3", showColList['Month3']),
      trendDataField("month3R", tableColList.Month3R.text, 100, "month3R", showColList['Month3R']),
      trendDataField("month7", tableColList.Month7.text, 100, "month7", showColList['Month7']),
      trendDataField("month7R", tableColList.Month7R.text, 100, "month7R", showColList['Month7R']),
      trendDataField("month14", tableColList.Month14.text, 100, "month14", showColList['Month14']),
      trendDataField("month14R", tableColList.Month14R.text, 100, "month14R", showColList['Month14R']),
      trendDataField("quarter7", tableColList.Quart7.text, 100, "quarter7", showColList['Quart7']),
      trendDataField("quarter7R", tableColList.Quart7R.text, 100, "quarter7R", showColList['Quart7R']),
      trendDataField("quarter14", tableColList.Quart14.text, 100, "quarter14", showColList['Quart14']),
      trendDataField("quarter14R", tableColList.Quart14R.text, 100, "quarter14R", showColList['Quart14R']),
      trendDataField("quarter21", tableColList.Quart21.text, 100, "quarter21", showColList['Quart21']),
      trendDataField("quarter21R", tableColList.Quart21R.text, 100, "quarter21R", showColList['Quart21R']),
      trendDataField("year14", tableColList.Year14.text, 100, "year14", showColList['Year14']),
      trendDataField("year14R", tableColList.Year14R.text, 100, "year14R", showColList['Year14R']),
      trendDataField("year21", tableColList.Year21.text, 100, "year21", showColList['Year21']),
      trendDataField("year21R", tableColList.Year21R.text, 100, "year21R", showColList['Year21R']),
      { 
        field: 'avg', 
        headerName: tableColList.Avg.text, 
        width: 100, 
        renderCell: (params) => (
          <span>{params.row['avg'].toFixed(2)}</span>
        ),
        colShow: showColList['Avg'] 
      },
      {
        field: 'avgR',
        headerName: tableColList.AvgR.text,
        width: 100,
        renderCell: (params) => (
          <span>{params.row['avgR'].toFixed(2)}</span>
        ),
        colShow: showColList['AvgR']
      },
      PureFieldWithValueCheck("close", tableColList.Close.text, 110, 2, showColList['Close']),
      PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, showColList['PE']),
      PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, showColList['PB']),
      PercentField("dividend", tableColList.Dividend.text, 110, showColList['Dividend']),
      PercentField("high52", tableColList.High52.text, 110, showColList['High52']),
      PercentField("low52", tableColList.Low52.text, 110, showColList['Low52']),
      PercentField("perfWeek", tableColList.PerfWeek.text, 110, showColList['PerfWeek']),
      PercentField("perfMonth", tableColList.PerfMonth.text, 110, showColList['PerfMonth']),
      PercentField("perfQuarter", tableColList.PerfQuarter.text, 110, showColList['PerfQuarter']),
      PercentField("perfHalfY", tableColList.PerfHalfY.text, 110, showColList['PerfHalfY']),
      PercentField("perfYear", tableColList.PerfYear.text, 110, showColList['PerfYear']),
      PercentField("perfYTD", tableColList.PerfYTD.text, 110, showColList['PerfYTD']),
      {
        field: 'Chart',
        headerName: tableColList.Chart.text,
        width: 90,
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
                if (allResponses.length == 2 && allResponses[0] !== null && allResponses[1] !== null) {
                  
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
        colShow: showColList['Chart']
      },
    ]
  }

  const getTableCol = () => {
    return getTableColTemplate(showColListRef.current).reduce((accumulator, currentValue) => {
      if (currentValue.colShow) {
        accumulator.push(currentValue)
      }
      return accumulator
    }, [])
  }
  const [tableCol, setTableCol] = useState(getTableCol())

  const { get, response } = useFetch({ cachePolicy: 'no-cache' })
  const fetchStockData = useFetch({ cachePolicy: 'no-cache' })
  const fetchGoogleTrendData = useFetch({ cachePolicy: 'no-cache' })

  const getGoogleTrendTable = ()=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/google-trend/stat.json', fetchGoogleTrendData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length == 2 && allResponses[0] !== null && allResponses[1] !== null) {      
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

  const renderCheckbox = (key) => {
    return <FormControlLabel
      key={key}
      control={
        <Checkbox
          onChange={() => {
            showColListRef.current[key] = !showColListRef.current[key]
            setTableCol(getTableCol())
          }}
          name={tableColList[key].text}
          color="primary"
          defaultChecked={tableColList[key].show}
        />
      }
      label={
        <div>{tableColList[key].text}</div>
      }
    />
  }

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
        <div className={googleTrendStocksTableStyle.showColumn}>
          {Object.keys(showColListRef.current).map((key, index) => {
            return renderCheckbox(key)
          })}
        </div>
        <div className={googleTrendStocksTableStyle.table}>
          <DataGrid rows={rowData} columns={tableCol} autoPageSize={true} components={{ noRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick />
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default GoogleTrendStocksTable
