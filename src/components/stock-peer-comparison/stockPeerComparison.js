
import React, { useState, useRef, useEffect } from 'react'
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid'
import ListAltIcon from '@mui/icons-material/ListAlt'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/styles'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import SearchIcon from '@mui/icons-material/Search'
import useFetch from 'use-http'
import Typography from '@mui/material/Typography'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import SearchGridToolbar from '../searchGridToolbar'
import { SymbolNameField, PriceField, PureFieldWithValueCheck, PercentField, ColorPercentField } from '../../common/dataGridUtil'
import { getUrl } from '../../common/utils'
import { NoMaxWidthTooltip } from '../../common/reactUtils'
import FactorPannel from './factorPannel'

import stockPeerComparisonStyle from './stockPeerComparison.module.scss'
import '../muiTablePagination.css'
import { Margin } from '@mui/icons-material'


const customTheme = createTheme({
  palette: {
    applyPeer: { 
      backgroundColor: '#43a047', color: '#fff'
    },
  },
})


const StockPeerComparison = ({ loadingAnimeRef }) => {

  const [hideColState, setHideColState] = useState({})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })
  
  const factorPannelRef = useRef({
    getValue: null
  })

  const tableColList = {
    Close: { hide: false, text: 'Price' },
    PEP: { hide: false, text: 'P/E Peer' },
    FwdPEP: { hide: false, text: 'Fwd P/E Peer' },
    PEGP: { hide: false, text: 'PEG Peer' },
    PSP: { hide: false, text: 'P/S Peer' },
    PBP: { hide: false, text: 'P/B Peer' },
    PCP: { hide: false, text: 'P/C Peer' },
    PFCFP: { hide: false, text: 'P/FCF Peer' },
    DividendP: { hide: false, text: 'Dividend % Peer' },
    FloatShortP: { hide: false, text: 'Float Short Peer' },
    RecomP: { hide: false, text: 'Recommend Peer' },
    BtrThnAvg: { hide: false, text: 'Btr Thn Avg' },
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
    DetailLink: { hide: false, text: 'Detail' },
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

  const calcPeerSign = (stock, industry, flag) => {
    return Math.sign(parseFloat((stock -industry) * flag))
  }

  const PeerField = (field, headerName, width, valueFixed, hide, stockField, industryField, flag, description = null) => {
    let output = {
      field: field,
      headerName: headerName,
      width: width,
      type: 'number',
      renderCell: (params) => (
        params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ? 
        <Typography sx={{ fontWeight: 600, color: 'unset' }} >-</Typography>
        :
        <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}> {`Stock: ${params.row[stockField]} | Industry: ${params.row[industryField]}`}</span>} >
          <Typography sx={{ fontWeight: 600, color: calcPeerSign(params.row[stockField], params.row[industryField], flag) === 1 ? 'green' : calcPeerSign(params.row[stockField], params.row[industryField], flag) === -1 ? 'red' : ''}} style={{cursor: 'pointer'}}>{params.value.toFixed(valueFixed)}</Typography>
        </NoMaxWidthTooltip>
      ),
      hide: hide,
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
      PeerField('PEP', tableColList.PEP.text, 110, 2, 'PEP' in hideColState ? hideColState['PEP'] : tableColList['PEP'].hide, "PE", "PE_I", -1, "P/E Peer (Stock / Industry)"),
      PeerField('FwdPEP', tableColList.FwdPEP.text, 110, 2, 'FwdPEP' in hideColState ? hideColState['FwdPEP'] : tableColList['FwdPEP'].hide, "FwdPE", "FwdPE_I", -1, "Forward P/E Peer (Stock / Industry)"),
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
        field: 'detailLink',
        headerName: tableColList['DetailLink'].text,
        width: 130,
        renderCell: (params) => (
          <a href={(new URL(getUrl())).protocol + "//" + (new URL(getUrl())).hostname + ":" + (new URL(getUrl())).port + '/stock-peer-comparison' + '?industry=' + encodeURIComponent(params.row['industry'])} target="_blank" rel="noreferrer noopener">
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

  const fetchStockNameIndustrySectorData = useFetch({ cachePolicy: 'no-cache' })
  const fetchStockStatData = useFetch({ cachePolicy: 'no-cache' })
  const fetchIndustryStatData = useFetch({ cachePolicy: 'no-cache' })
  const renderStockPeerComparisonTable = (config)=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockStatData),
      getData("/norn-data/stock/info.json", fetchStockNameIndustrySectorData),
      getData("/norn-data/indusrty-table.json", fetchIndustryStatData),
    ]).then((allResponses) => {
      //console.log(allResponses)
      if (allResponses.length === 3 && allResponses[0] !== null && allResponses[1] !== null && allResponses[2] !== null) {
        let industryDict = allResponses[2]["data"].reduce((result, val) => {
          result[val["Industry"]] = {
            'P/E': val['P/E'],
            'Fwd P/E': val['Fwd P/E'],
            'PEG': val['PEG'],
            'P/S': val['P/S'],
            'P/B': val['P/B'],
            'P/C': val['P/C'],
            'P/FCF': val['P/FCF'],
            'Dividend': val['Dividend'],
            'Float Short': val['Float Short'],
            'Recom': val['Recom']
          }
          return result
        }, {})
        console.log(industryDict)
        let output = Object.keys(allResponses[1]).reduce((result, symbol, index) => {
          let stockInfo = allResponses[0][symbol]
          let industry = allResponses[1][symbol][1]
          let industryStat = industryDict[industry]
          let o = {
            id: index,
            symbol: symbol,
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
            // hidden field
            industry: industry,
            PE_I: industryStat !== undefined && industryStat !== null && industryStat['P/E'] !== '-' ? industryStat['P/E'] : Number.MAX_VALUE,
            FwdPE: stockInfo !== undefined && stockInfo !== null && stockInfo['Forward P/E'] !== '-' ? stockInfo['Forward P/E'] : Number.MAX_VALUE, 
            FwdPE_I: industryStat !== undefined && industryStat !== null && industryStat['Fwd P/E'] !== '-' ? industryStat['Fwd P/E'] : Number.MAX_VALUE,
          }
          o['PEP'] = o['PE'] != Number.MAX_VALUE && o['PE_I'] != Number.MAX_VALUE ? o['PE'] / o['PE_I'] : Number.MAX_VALUE
          o['FwdPEP'] = o['FwdPE'] != Number.MAX_VALUE && o['FwdPE_I'] != Number.MAX_VALUE ? o['FwdPE'] / o['FwdPE_I'] : Number.MAX_VALUE

          if((config.filter_symbols.length === 0 && config.filter_industries.length === 0) || config.filter_symbols.includes(symbol) || config.filter_industries.includes(industry)) {
            result.push(o)
          }
          return result
        }, [])
        console.log(output)
        setRowData(output)
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch((error) => {
      console.error(error)
      modalWindowRef.current.popModalWindow(<div>Can't get data</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  const [rowData, setRowData] = useState([])
  const [searchVal, setSearchVal] = useState("")
  
  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    let config = {filter_symbols: [], filter_industries: []}
    if (typeof window !== 'undefined') {
      const queryParameters = new URLSearchParams(window.location.search)
      let symbol = queryParameters.get("symbol")
      if (symbol) {
        config.filter_symbols = [symbol]
      }
      let industry = queryParameters.get("industry")
      if (industry) {
        config.filter_industries = [industry]
      }
    }
    renderStockPeerComparisonTable(config)
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={stockPeerComparisonStyle.container}>
        <div className={stockPeerComparisonStyle.table}>
          <DataGrid rows={rowData} columns={genTableColTemplate()} components={{ NoRowsOverlay: DefaultDataGridTable, Toolbar: ()=>{
            return (<GridToolbarContainer>
              <div className={stockPeerComparisonStyle.cmdPanel}>
              <SearchGridToolbar searchVal={searchVal} setSearchVal={setSearchVal} clickCallback={(config)=>{
                renderStockPeerComparisonTable(config)
                }} 
                info={{
                  placeholder: 'Filter symbols: AAPL, BAC, KSS, ...',
                }}
              />
              <FactorPannel factorPannelRef={factorPannelRef}/>
              <div></div>
              <ThemeProvider theme={customTheme}>
              <Box display="flex" justify="flex-end">
                <Button size="small" style={customTheme.palette.applyPeer} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                  }}>{'Apply Peer'}</Button>
              </Box>
              </ThemeProvider>
              </div>
            </GridToolbarContainer>)
            }}} 
            disableSelectionOnClick onColumnVisibilityChange={(param) => {
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

export default StockPeerComparison
