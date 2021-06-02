import React, { useState, useRef, useEffect } from 'react'
import { DataGrid, GridOverlay } from '@material-ui/data-grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import BarChartSharpIcon from '@material-ui/icons/BarChartSharp'
import Link from '@material-ui/core/Link'
import useFetch from 'use-http'

import ModalWindow from './modalWindow'
import IndustryMarketChart from './industryMarketChart'

import industryTableStyle from './industryTable.module.scss'
import './resultTable.css'

const useNoDataStyles = makeStyles((theme) => ({
  root: {
    flexDirection: 'column',
    '& .ant-empty-img-1': {
      fill: theme.palette.type === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.type === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.type === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.type === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.type === 'light' ? '0.8' : '0.08',
      fill: theme.palette.type === 'light' ? '#f5f5f5' : '#fff',
    },
  },
  label: {
    marginTop: theme.spacing(1),
  },
}))

function NoDataInTable() {
  const classes = useNoDataStyles()

  return (
    <GridOverlay className={classes.root}>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <div className={classes.label}>No Data</div>
    </GridOverlay>
  )
}

const IndustryTable = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const colorPercentField = (field, headerName, width, colShow)=>{
    return {
      field: field,
      headerName: headerName,
      width: width,
      renderCell: (params) => (
        params.value === -Number.MAX_VALUE || params.value === "Infinity" || params.value === 'NaN' ? 
          <span>-</span> : 
          <span style={{ fontWeight: 500, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(params.value)) === 1 ? '+' : ''}{(params.value * 100).toFixed(2) + "%"}</span>
      ),
      colShow: colShow
    }
  }

  const tableColList = {
    Change: { show: true, text: 'Change' },
    FloatShort: {show: true, text: 'Float Short' },
    Recom: { show: true, text: 'Recommand' },
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
    Graph: { show: true, text: 'Graph' },
  }

  const showColListRef = useRef(Object.keys(tableColList).reduce((accumulator, currentValue) => {
    accumulator[currentValue] = tableColList[currentValue].show
    return accumulator
  }, {}))

  const getTableColTemplate = (showColList) => {
    return [
      { field: 'Industry', headerName: 'Industry', width: 250, colShow: true },
      colorPercentField('Change', tableColList.Change.text, 110, showColList['Change']),
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
        width: 120,
        renderCell: (params) => (
          <span style={{ fontWeight: 500, color: params.value < 2 ? 'green' : params.value > 3 ? 'red' : '' }}>{params.value}</span>
        ),
        colShow: showColList['Recom']
      },
      colorPercentField('PerfWeek', tableColList.PerfWeek.text, 110, showColList['PerfWeek']),
      colorPercentField('PerfMonth', tableColList.PerfMonth.text, 110, showColList['PerfMonth']),
      colorPercentField('PerfQuart', tableColList.PerfQuart.text, 110, showColList['PerfQuart']),
      colorPercentField('PerfHalf', tableColList.PerfHalf.text, 110, showColList['PerfHalf']),
      colorPercentField('PerfYear', tableColList.PerfYear.text, 110, showColList['PerfYear']),
      colorPercentField('PerfYTD', tableColList.PerfYTD.text, 110, showColList['PerfYTD']),
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
      colorPercentField('MKPerfWeek', tableColList.MKPerfWeek.text, 110, showColList['MKPerfWeek']),
      colorPercentField('MKPerfMonth', tableColList.MKPerfMonth.text, 110, showColList['MKPerfMonth']),
      colorPercentField('MKPerfQuart', tableColList.MKPerfQuart.text, 110, showColList['MKPerfQuart']),
      colorPercentField('MKPerfHalf', tableColList.MKPerfHalf.text, 110, showColList['MKPerfHalf']),
      colorPercentField('MKPerfYear', tableColList.MKPerfYear.text, 110, showColList['MKPerfYear']),
      colorPercentField('MKPerfYTD', tableColList.MKPerfYTD.text, 110, showColList['MKPerfYTD']),
      {
        field: 'Graph',
        headerName: tableColList.Graph.text,
        width: 100,
        renderCell: (params) => (
          params.getValue('MKDataUrl') === '-' ?
            <span>-</span> :
          <IconButton
            size="small"
            aria-haspopup="true"
            onClick={() => {
              const getMarketData = async (industry, src, symbol) =>{
                let fileName = btoa(industry + '_' + src + '_' + symbol) + '.json'
                const resp_data = await get('/norn-data/market-industry/market/' + fileName)
                console.log(resp_data)
                if (response.ok && resp_data.data && resp_data.data.length > 0) {
                  let marketData = resp_data.data.reduce((accumulator, currentValue) => {
                    accumulator.unshift({ Date: currentValue.Date, Close: currentValue.Close})
                    return accumulator
                  }, [])
                  modalWindowRef.current.popModalWindow(<div style={{ width: '800px', height: '400px' }}><IndustryMarketChart marketData={marketData}/></div>)
                }
                else{
                  modalWindowRef.current.popModalWindow(<div>Load market data failed</div>)
                }
              }

              getMarketData(params.getValue('Industry'), params.getValue('MKSource'), params.getValue('MKSymbol'))
            }}
          >
            <BarChartSharpIcon color="primary" style={{ fontSize: 40 }} />
          </IconButton>
        ),
        colShow: showColList['Graph']
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

  const { get, response } = useFetch()
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
    const resp_data = await get('/norn-data/market-industry/indusrty-table.json')
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
          <DataGrid rows={rowData} columns={tableCol} scrollbarSize={17} pageSize={50} components={{ noRowsOverlay: NoDataInTable, }} disableSelectionOnClick />
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default IndustryTable
