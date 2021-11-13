import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import BarChartSharpIcon from '@material-ui/icons/BarChartSharp'
import Link from '@material-ui/core/Link'
import useFetch from 'use-http'

import ModalWindow from '../modalWindow'
import IndustryMarketChart from './industryMarketChart'
import DefaultDataGridTable from '../defaultDataGridTable'
import { ColorPercentField } from '../../common/reactUtils'

import industryTableStyle from './industryTable.module.scss'
import '../muiTablePagination.css'

const IndustryTable = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const tableColList = {
    Change: { show: true, text: 'Change' },
    FloatShort: { show: false, text: 'Float Short' },
    Recom: { show: false, text: 'Recom' },
    PerfWeek: { show: true, text: 'Perf Week' },
    PerfMonth: { show: true, text: 'Perf Month' },
    PerfQuart: { show: true, text: 'Perf Quart' },
    PerfHalf: { show: true, text: 'Perf Half' },
    PerfYear: { show: true, text: 'Perf Year' },
    PerfYTD: { show: true, text: 'Perf YTD' },
    MKSymbol: { show: true, text: 'Symbol' },
    MKSource: { show: true, text: 'Source' },
    MKPerfWeek: { show: true, text: 'Perf Week' },
    MKPerfMonth: { show: true, text: 'Perf Month' },
    MKPerfQuart: { show: true, text: 'Perf Quart' },
    MKPerfHalf: { show: true, text: 'Perf Half' },
    MKPerfYear: { show: true, text: 'Perf Year' },
    MKPerfYTD: { show: true, text: 'Perf YTD' },
    Chart: { show: true, text: 'Chart' },
  }

  const showColListRef = useRef(Object.keys(tableColList).reduce((accumulator, currentValue) => {
    accumulator[currentValue] = tableColList[currentValue].show
    return accumulator
  }, {}))

  const getTableColTemplate = (showColList) => {
    return [
      {
        field: 'Industry',
        headerName: 'Industry',
        width: 250,
        renderCell: (params) => (
          params.row['Url'] === '-' ?
            <span>{params.value}</span> :
            <Link href={params.row['Url']} target="_blank" rel="noreferrer noopener">
              <span>{params.value}</span>
            </Link>
        ),
        colShow: true
      },
      ColorPercentField('Change', tableColList.Change.text, 110, 2, showColList['Change'], 500),
      {
        field: 'FloatShort',
        headerName: tableColList.FloatShort.text,
        width: 110,
        renderCell: (params) => (
          <span>{(params.value * 100).toFixed(2) + "%"}</span>
        ),
        colShow: showColList['FloatShort']
      },
      {
        field: 'Recom',
        headerName: tableColList.Recom.text,
        width: 110,
        renderCell: (params) => (
          <span style={{ fontWeight: 500, color: params.value < 2 ? 'green' : params.value > 3 ? 'red' : '' }}>{params.value}</span>
        ),
        colShow: showColList['Recom']
      },
      ColorPercentField('PerfWeek', tableColList.PerfWeek.text, 110, 2, showColList['PerfWeek'], 500),
      ColorPercentField('PerfMonth', tableColList.PerfMonth.text, 110, 2, showColList['PerfMonth'], 500),
      ColorPercentField('PerfQuart', tableColList.PerfQuart.text, 110, 2, showColList['PerfQuart'], 500),
      ColorPercentField('PerfHalf', tableColList.PerfHalf.text, 110, 2, showColList['PerfHalf'], 500),
      ColorPercentField('PerfYear', tableColList.PerfYear.text, 110, 2, showColList['PerfYear'], 500),
      ColorPercentField('PerfYTD', tableColList.PerfYTD.text, 110, 2, showColList['PerfYTD'], 500),
      { field: 'MKSymbol', headerName: tableColList.MKSymbol.text, width: 110, colShow: showColList['MKSymbol'] },
      { field: 'MKDataUrl', hide: true, colShow: true },
      {
        field: 'MKSource',
        headerName: tableColList.MKSource.text,
        width: 130,
        renderCell: (params) => (
          params.getValue('MKDataUrl') === '-' ?
            <span>-</span> :
            <Link href={params.getValue('MKDataUrl')} target="_blank" rel="noreferrer noopener">
              <span>{params.value}</span>
            </Link>
        ),
        colShow: showColList['MKSource']
      },
      ColorPercentField('MKPerfWeek', tableColList.MKPerfWeek.text, 110, 2, showColList['MKPerfWeek'], 500),
      ColorPercentField('MKPerfMonth', tableColList.MKPerfMonth.text, 110, 2, showColList['MKPerfMonth'], 500),
      ColorPercentField('MKPerfQuart', tableColList.MKPerfQuart.text, 110, 2, showColList['MKPerfQuart'], 500),
      ColorPercentField('MKPerfHalf', tableColList.MKPerfHalf.text, 110, 2, showColList['MKPerfHalf'], 500),
      ColorPercentField('MKPerfYear', tableColList.MKPerfYear.text, 110, 2, showColList['MKPerfYear'], 500),
      ColorPercentField('MKPerfYTD', tableColList.MKPerfYTD.text, 110, 2, showColList['MKPerfYTD'], 500),
      {
        field: 'Chart',
        headerName: tableColList.Chart.text,
        width: 100,
        renderCell: (params) => (
          params.getValue('MKDataUrl') === '-' ?
            <span>-</span> :
          <IconButton
            size="small"
            aria-haspopup="true"
            onClick={() => {
              const getMarketData = async (src, symbol) =>{
                let fileName = (src + '_' + symbol).match(/\w+/gi).join('_') + '.json'
                const resp_data = await get('/norn-data/markets/' + fileName)
                console.log(resp_data)
                if (response.ok && resp_data.data && resp_data.data.length > 0) {
                  let info = {
                    industry: params.row['Industry'],
                    market: params.row['MKSymbol'],
                  }

                  let marketData = resp_data.data.reduce((accumulator, currentValue) => {
                    accumulator.unshift({ Date: currentValue.Date, Close: parseFloat(currentValue.Close)})
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

                  modalWindowRef.current.popModalWindow(<IndustryMarketChart marketData={marketData} perfData={perfData} info={info}/>)
                }
                else{
                  modalWindowRef.current.popModalWindow(<div>Load market data failed</div>)
                }
              }

              getMarketData(params.row['MKSource'], params.row['MKSymbol'])
            }}
          >
            <BarChartSharpIcon color="primary" style={{ fontSize: 40 }} />
          </IconButton>
        ),
        colShow: showColList['Chart']
      },
    ]
  }

  const getTableCol = ()=>{
    return getTableColTemplate(showColListRef.current).reduce((accumulator, currentValue) => {
      if (currentValue.colShow) {
        accumulator.push(currentValue)
      }
      return accumulator
    }, [])
  }
  const [tableCol, setTableCol] = useState(getTableCol())

  const { get, response } = useFetch({ cachePolicy: 'no-cache' })
  const genRowData = (src) => {
    let output = []
    src.forEach((value, index) => {
      let baseData = {
        id: output.length,
        Industry: value['Industry'],
        Change: value['Change'],
        FloatShort: value['Float Short'],
        Recom: value['Recom'],
        PerfWeek: value['Perf Week'],
        PerfMonth: value['Perf Month'],
        PerfQuart: value['Perf Quart'],
        PerfHalf: value['Perf Half'],
        PerfYear: value['Perf Year'],
        PerfYTD: value['Perf YTD'],
        Url: value['Url'],
        MKSymbol: '-',
        MKSource: '-',
        MKPerfWeek: -Number.MAX_VALUE,
        MKPerfMonth: -Number.MAX_VALUE,
        MKPerfQuart: -Number.MAX_VALUE,
        MKPerfHalf: -Number.MAX_VALUE,
        MKPerfYear: -Number.MAX_VALUE,
        MKPerfYTD: -Number.MAX_VALUE,
        MKDataUrl: '-',
      }

      if (value['Market'].length === 0) {
        output.push(baseData)
      }
      else {
        value['Market'].forEach((mkVal, mkIndex) => {
          let data = Object.assign({}, baseData)
          data.id = output.length
          data.MKSymbol = mkVal['symbol']
          data.MKSource = mkVal['src']
          data.MKPerfWeek = mkVal['Perf Week']
          data.MKPerfMonth = mkVal['Perf Month']
          data.MKPerfQuart = mkVal['Perf Quart']
          data.MKPerfHalf = mkVal['Perf Half']
          data.MKPerfYear = mkVal['Perf Year']
          data.MKPerfYTD = mkVal['Perf YTD']
          data.MKPerfYTD = mkVal['Perf YTD']
          data.MKDataUrl = mkVal['dataUrl']
          output.push(data)
        })
      }
    })
    return output
  }

  const getIndustryTable = async () =>{
    const resp_data = await get('/norn-data/indusrty-table.json')
    if (response.ok) {
      console.log(resp_data)
      let output = genRowData(resp_data['data'])
      setRowData(output)
    }
    else{
      modalWindowRef.current.popModalWindow(<div>Load indusrty-table.json failed</div>)
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
    getIndustryTable()
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={industryTableStyle.container}>
        <div className={industryTableStyle.showColumn}>
          {Object.keys(showColListRef.current).map((key, index) => {
            return renderCheckbox(key)
          })}
        </div>
        <div className={industryTableStyle.table}>
          <DataGrid rows={rowData} columns={tableCol} scrollbarSize={17} pageSize={50} components={{ noRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick />
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default IndustryTable
