import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import BarChartSharpIcon from '@material-ui/icons/BarChartSharp'
import Link from '@material-ui/core/Link'
import useFetch from 'use-http'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import { FinvizUrl } from '../../common/common'

import googleTrendStocksTableStyle from './googleTrendStocksTable.module.scss'
import '../muiTablePagination.css'

const GoogleTrendStocksTable = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const tableColList = {
    Week3: { show: true, text: 'Week-3' },
    Month3: { show: true, text: 'Month-3' },
    Month7: { show: true, text: 'Month-7' },
    Month14: { show: true, text: 'Month-14' },
    Quart7: { show: true, text: 'Quart-7' },
    Quart14: { show: true, text: 'Quart-14' },
    Quart21: { show: true, text: 'Quart-21' },
    Year14: { show: true, text: 'Year-14' },
    Year21: { show: true, text: 'Year-21' },
    Avg: { show: true, text: 'Avg' },
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
          <span>{params.row[valueKey]}</span>
        </Link>
      ),
      colShow: colShow
    }
  }

  const getTableColTemplate = (showColList) => {
    return [
      { 
        field: 'symbol', 
        headerName: 'Symbol',
        width: 90,
        renderCell: (params) => (
          <Link href={FinvizUrl + 'quote.ashx?t=' + params.row['symbol']} target="_blank" rel="noreferrer noopener">
            <span>{params.row['symbol']}</span>
          </Link>
        ),
        colShow: true 
      },
      trendDataField("week3", tableColList.Week3.text, 95, "week3", showColList['Week3']),
      trendDataField("month3", tableColList.Month3.text, 95, "month3", showColList['Month3']),
      trendDataField("month7", tableColList.Month7.text, 95, "month7", showColList['Month7']),
      trendDataField("month14", tableColList.Month14.text, 95, "month14", showColList['Month14']),
      trendDataField("quarter7", tableColList.Quart7.text, 95, "quarter7", showColList['Quart7']),
      trendDataField("quarter14", tableColList.Quart14.text, 95, "quarter14", showColList['Quart14']),
      trendDataField("quarter21", tableColList.Quart21.text, 95, "quarter21", showColList['Quart21']),
      trendDataField("year14", tableColList.Year14.text, 95, "year14", showColList['Year14']),
      trendDataField("year21", tableColList.Year21.text, 95, "year21", showColList['Year21']),
      { 
        field: 'avg', 
        headerName: 'Avg', 
        width: 90, 
        renderCell: (params) => (
          <span>{params.row['avg'].toFixed(2)}</span>
        ),
        colShow: showColList['Avg'] 
      },
      {
        field: 'Chart',
        headerName: tableColList.Chart.text,
        width: 90,
        renderCell: (params) => (
          <IconButton
            size="small"
            aria-haspopup="true"
            onClick={() => {
              /*
              const getMarketData = async (src, symbol) => {
                let fileName = btoa(src + '_' + symbol) + '.json'
                const resp_data = await get('/norn-data/markets/' + fileName)
                console.log(resp_data)
                if (response.ok && resp_data.data && resp_data.data.length > 0) {
                  let info = {
                    industry: params.row['Industry'],
                    market: params.row['MKSymbol'],
                  }

                  let marketData = resp_data.data.reduce((accumulator, currentValue) => {
                    accumulator.unshift({ Date: currentValue.Date, Close: parseFloat(currentValue.Close) })
                    return accumulator
                  }, [])

                  let perfData = [
                    {
                      name: 'Perf Week',
                      industry: parseInt(params.row['PerfWeek'] * 10000, 10) / 100.0,
                      market: parseInt(params.row['MKPerfWeek'] * 10000, 10) / 100.0,
                    },
                    {
                      name: 'Perf Month',
                      industry: parseInt(params.row['PerfMonth'] * 10000, 10) / 100.0,
                      market: parseInt(params.row['MKPerfMonth'] * 10000, 10) / 100.0,
                    },
                    {
                      name: 'Perf Quart',
                      industry: parseInt(params.row['PerfQuart'] * 10000, 10) / 100.0,
                      market: parseInt(params.row['MKPerfQuart'] * 10000, 10) / 100.0,
                    },
                    {
                      name: 'Perf Half',
                      industry: parseInt(params.row['PerfHalf'] * 10000, 10) / 100.0,
                      market: parseInt(params.row['MKPerfHalf'] * 10000, 10) / 100.0,
                    },
                    {
                      name: 'Perf Year',
                      industry: parseInt(params.row['PerfYear'] * 10000, 10) / 100.0,
                      market: parseInt(params.row['MKPerfYear'] * 10000, 10) / 100.0,
                    },
                    {
                      name: 'Perf YTD',
                      industry: parseInt(params.row['PerfYTD'] * 10000, 10) / 100.0,
                      market: parseInt(params.row['MKPerfYTD'] * 10000, 10) / 100.0,
                    },
                  ]

                  modalWindowRef.current.popModalWindow(<IndustryMarketChart marketData={marketData} perfData={perfData} info={info} />)
                }
                else {
                  modalWindowRef.current.popModalWindow(<div>Load market data failed</div>)
                }
              }
              */
              // getMarketData(params.row['MKSource'], params.row['MKSymbol'])
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

  const getGoogleTrendTable = async () => {
    const resp_data = await get('/norn-data/google-trend/stat.json')
    if (response.ok) {
      // console.log(resp_data)
      let output = resp_data.map((value, index) => {
        return {
          id: index,
          symbol: value['symbol'],
          keyword: value['keyword'],
          week3: value['week-3'],
          month3: value['month-3'],
          month7: value['month-7'],
          month14: value['month-14'],
          quarter7: value['quarter-7'],
          quarter14: value['quarter-14'],
          quarter21: value['quarter-21'],
          year14: value['year-14'],
          year21: value['year-21'],
          avg: (value['week-3'] + value['month-3'] + value['month-7'] + value['month-14'] + value['quarter-7'] + value['quarter-14'] + value['quarter-21'] + value['year-14'] + value['year-21']) / 9.0,
        }
      })
      setRowData(output)
    }
    else {
      modalWindowRef.current.popModalWindow(<div>Load google trend stat.json failed</div>)
      setRowData([])
    }
    loadingAnimeRef.current.setLoading(false)
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
