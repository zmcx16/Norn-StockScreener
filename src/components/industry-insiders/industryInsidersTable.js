import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListAltIcon from '@mui/icons-material/ListAlt'
import Link from '@mui/material/Link'
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
    Change: { hide: false, text: 'Change' },
    FloatShort: { hide: true, text: 'Float Short' },
    Recom: { hide: true, text: 'Recom' },
    PerfWeek: { hide: false, text: 'Perf Week' },
    PerfMonth: { hide: false, text: 'Perf Month' },
    PerfQuarter: { hide: false, text: 'Perf Quarter' },
    PerfHalfY: { hide: false, text: 'Perf Half Y' },
    PerfYear: { hide: false, text: 'Perf Year' },
    PerfYTD: { hide: false, text: 'Perf YTD' },
    TradeWeek: { hide: false, text: 'Trade Week' },
    TradeMonth: { hide: false, text: 'Trade Month' },
    TradeQuarter: { hide: false, text: 'Trade Quarter' },
    TradeHalfY: { hide: false, text: 'Trade Half Y' },
    TradeYear: { hide: false, text: 'Trade Year' },
    TradeYTD: { hide: false, text: 'Trade YTD' },
    DetailLink: { hide: false, text: 'Detail' },
  }

  const genTableColTemplate = () => {
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
        hide: 'industry' in hideColState ? hideColState['industry'] : false
      },
      ColorPercentField('change', tableColList['Change'].text, 130, 2, 'change' in hideColState ? hideColState['change'] : tableColList['Change'].hide, 500),
      PercentField("floatShort", tableColList['FloatShort'].text, 150, "floatShort" in hideColState ? hideColState["floatShort"] : tableColList['FloatShort'].hide),
      {
        field: 'recom',
        headerName: tableColList['Recom'].text,
        width: 150,
        type: 'number',
        renderCell: (params) => (
          <span style={{ fontWeight: 500, color: params.value < 2 ? 'green' : params.value > 3 ? 'red' : '' }}>{params.value}</span>
        ),
        hide: 'recom' in hideColState ? hideColState['recom'] : tableColList['Recom'].hide
      },
      ColorPercentField("perfWeek", tableColList['PerfWeek'].text, 150, 2, "perfWeek" in hideColState ? hideColState["perfWeek"] : tableColList['PerfWeek'].hide, 500),
      ColorPercentField("perfMonth", tableColList['PerfMonth'].text, 150, 2, "perfMonth" in hideColState ? hideColState["perfMonth"] : tableColList['PerfMonth'].hide, 500),
      ColorPercentField("perfQuarter", tableColList['PerfQuarter'].text, 160, 2, "perfQuarter" in hideColState ? hideColState["perfQuarter"] : tableColList['PerfQuarter'].hide, 500),
      ColorPercentField("perfHalfY", tableColList['PerfHalfY'].text, 150, 2, "perfHalfY" in hideColState ? hideColState["perfHalfY"] : tableColList['PerfHalfY'].hide, 500),
      ColorPercentField("perfYear", tableColList['PerfYear'].text, 150, 2, "perfYear" in hideColState ? hideColState["perfYear"] : tableColList['PerfYear'].hide, 500),
      ColorPercentField("perfYTD", tableColList['PerfYTD'].text, 150, 2, "perfYTD" in hideColState ? hideColState["perfYTD"] : tableColList['PerfYTD'].hide, 500),
      ColorPercentField("tradeWeek", tableColList['TradeWeek'].text, 160, 3, "tradeWeek" in hideColState ? hideColState["tradeWeek"] : tableColList['TradeWeek'].hide, 500),
      ColorPercentField("tradeMonth", tableColList['TradeMonth'].text, 160, 3, "tradeMonth" in  hideColState? hideColState["tradeMonth"] : tableColList['TradeMonth'].hide, 500),
      ColorPercentField("tradeQuarter", tableColList['TradeQuarter'].text, 170, 2, "tradeQuarter" in hideColState ? hideColState["tradeQuarter"] : tableColList['TradeQuarter'].hide, 500),
      ColorPercentField("tradeHalfY", tableColList['TradeHalfY'].text, 160, 2, "tradeHalfY" in hideColState ? hideColState["tradeHalfY"] : tableColList['TradeHalfY'].hide, 500),
      ColorPercentField("tradeYear", tableColList['TradeYear'].text, 160, 2, "tradeYear" in hideColState ? hideColState["tradeYear"] : tableColList['TradeYear'].hide, 500),
      ColorPercentField("tradeYTD", tableColList['TradeYTD'].text, 160, 2, "tradeYTD" in hideColState? hideColState["tradeYTD"] : tableColList['TradeYTD'].hide, 500),
      {
        field: 'detailLink',
        headerName: tableColList['DetailLink'].text,
        width: 130,
        renderCell: (params) => (
          <a href={(new URL(getUrl())).protocol + "//" + (new URL(getUrl())).hostname + ":" + (new URL(getUrl())).port + '/insiders-trade-list' + '?industry=' + params.row['industry'].match(/\w+/gi).join('_')} target="_blank" rel="noreferrer noopener">
            <IconButton
              size="small"
              aria-haspopup="true">
              <ListAltIcon color="primary" style={{ fontSize: 40 }} />
            </IconButton>
          </a>
        ),
        hide: 'detailLink' in  hideColState? hideColState['detailLink'] : tableColList['DetailLink'].hide
      },
    ]
  }

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
  const [hideColState, setHideColState] = useState({})

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
        <div className={industryInsidersTableStyle.table}>
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

export default IndustryInsidersTable
