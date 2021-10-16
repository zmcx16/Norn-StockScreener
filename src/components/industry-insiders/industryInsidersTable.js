import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import ListAltIcon from '@material-ui/icons/ListAlt'
import Link from '@material-ui/core/Link'
import useFetch from 'use-http'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import { PercentField, ColorPercentField } from '../../common/reactUtils'
import { getUrl } from '../../common/utils'

import industryInsidersTableStyle from './industryInsidersTable.module.scss'
import '../muiTablePagination.css'

const IndustryInsidersTable = ({ loadingAnimeRef }) => {

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
    PerfQuarter: { show: true, text: 'Perf Quarter' },
    PerfHalfY: { show: true, text: 'Perf Half Y' },
    PerfYear: { show: true, text: 'Perf Year' },
    PerfYTD: { show: true, text: 'Perf YTD' },
    TradeWeek: { show: true, text: 'Trade Week' },
    TradeMonth: { show: true, text: 'Trade Month' },
    TradeQuarter: { show: true, text: 'Trade Quarter' },
    TradeHalfY: { show: true, text: 'Trade Half Y' },
    TradeYear: { show: true, text: 'Trade Year' },
    TradeYTD: { show: true, text: 'Trade YTD' },
    DetailLink: { show: true, text: 'Detail' },
  }

  const showColListRef = useRef(Object.keys(tableColList).reduce((accumulator, currentValue) => {
    accumulator[currentValue] = tableColList[currentValue].show
    return accumulator
  }, {}))

  const getTableColTemplate = (showColList) => {
    return [
      {
        field: 'industry',
        headerName: 'Industry',
        width: 250,
        renderCell: (params) => (
          params.row['url'] === '-' ?
            <span>{params.value}</span> :
            <Link href={params.row['url']} target="_blank" rel="noreferrer noopener">
              <span>{params.value}</span>
            </Link>
        ),
        colShow: true
      },
      ColorPercentField('change', tableColList.Change.text, 110, 2, showColList['Change'], 500),
      PercentField("floatShort", tableColList.FloatShort.text, 110, showColList['FloatShort']),
      {
        field: 'recom',
        headerName: tableColList.Recom.text,
        width: 110,
        renderCell: (params) => (
          <span style={{ fontWeight: 500, color: params.value < 2 ? 'green' : params.value > 3 ? 'red' : '' }}>{params.value}</span>
        ),
        colShow: showColList['Recom']
      },
      ColorPercentField("perfWeek", tableColList.PerfWeek.text, 110, 2, showColList['PerfWeek'], 500),
      ColorPercentField("perfMonth", tableColList.PerfMonth.text, 110, 2, showColList['PerfMonth'], 500),
      ColorPercentField("perfQuarter", tableColList.PerfQuarter.text, 110, 2, showColList['PerfQuarter'], 500),
      ColorPercentField("perfHalfY", tableColList.PerfHalfY.text, 110, 2, showColList['PerfHalfY'], 500),
      ColorPercentField("perfYear", tableColList.PerfYear.text, 110, 2, showColList['PerfYear'], 500),
      ColorPercentField("perfYTD", tableColList.PerfYTD.text, 110, 2, showColList['PerfYTD'], 500),
      ColorPercentField("tradeWeek", tableColList.TradeWeek.text, 120, 3, showColList['TradeWeek'], 500),
      ColorPercentField("tradeMonth", tableColList.TradeMonth.text, 120, 3, showColList['TradeMonth'], 500),
      ColorPercentField("tradeQuarter", tableColList.TradeQuarter.text, 120, 2, showColList['TradeQuarter'], 500),
      ColorPercentField("tradeHalfY", tableColList.TradeHalfY.text, 120, 2, showColList['TradeHalfY'], 500),
      ColorPercentField("tradeYear", tableColList.TradeYear.text, 120, 2, showColList['TradeYear'], 500),
      ColorPercentField("tradeYTD", tableColList.TradeYTD.text, 120, 2, showColList['TradeYTD'], 500),
      {
        field: 'detailLink',
        headerName: tableColList.DetailLink.text,
        width: 90,
        renderCell: (params) => (
          <a href={(new URL(getUrl())).protocol + "//" + (new URL(getUrl())).hostname + ":" + (new URL(getUrl())).port + '/insiders-trade-list' + '?industry=' + params.getValue('industry').match(/[a-z]+($|\S+)/gi).join('-')} target="_blank" rel="noreferrer noopener">
            <IconButton
              size="small"
              aria-haspopup="true">
              <ListAltIcon color="primary" style={{ fontSize: 40 }} />
            </IconButton>
          </a>
        ),
        colShow: showColList['DetailLink']
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

  const getIndustryInsidersTable = async ()=>{
    const resp_data = await get('/norn-data/insiders/stat.json')
    if (response.ok) {
      console.log(resp_data)
      // let output = genRowData(resp_data['data'])
      let output = resp_data['data'].map((value, index) => {
        let o = {
          id: index,
          industry: value['Industry'],
          url: value['Url'],
          change: value['Change'],
          floatShort: value['Float Short'],
          perfWeek: value['Perf Week'] !== '-' ? value['Perf Week'] : -Number.MAX_VALUE,
          perfMonth: value['Perf Month'] !== '-' ? value['Perf Month'] : -Number.MAX_VALUE,
          perfQuarter: value['Perf Quart'] !== '-' ? value['Perf Quart'] : -Number.MAX_VALUE,
          perfHalfY: value['Perf Half'] !== '-' ? value['Perf Half'] : -Number.MAX_VALUE,
          perfYear: value['Perf Year'] !== '-' ? value['Perf Year'] : -Number.MAX_VALUE,
          perfYTD: value['Perf YTD'] !== '-' ? value['Perf YTD'] : -Number.MAX_VALUE,
          recom: value['Recom'],
          tradeWeek: value['Trade Week'] !== '-' ? value['Trade Week'] : -Number.MAX_VALUE,
          tradeMonth: value['Trade Month'] !== '-' ? value['Trade Month'] : -Number.MAX_VALUE,
          tradeQuarter: value['Trade Quart'] !== '-' ? value['Trade Quart'] : -Number.MAX_VALUE,
          tradeHalfY: value['Trade Half'] !== '-' ? value['Trade Half'] : -Number.MAX_VALUE,
          tradeYear: value['Trade Year'] !== '-' ? value['Trade Year'] : -Number.MAX_VALUE,
          tradeYTD: value['Trade YTD'] !== '-' ? value['Trade YTD'] : -Number.MAX_VALUE,
        }
        return o
      })  
      setRowData(output)
    }
    else {
      modalWindowRef.current.popModalWindow(<div>Load stat.json failed</div>)
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
    getIndustryInsidersTable()
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={industryInsidersTableStyle.container}>
        <div className={industryInsidersTableStyle.showColumn}>
          {Object.keys(showColListRef.current).map((key, index) => {
            return renderCheckbox(key)
          })}
        </div>
        <div className={industryInsidersTableStyle.table}>
          <DataGrid rows={rowData} columns={tableCol} autoPageSize={true} components={{ noRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick />
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default IndustryInsidersTable
