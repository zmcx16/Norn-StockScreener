
import React, { useState, useRef, useEffect, useMemo } from 'react'
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
import { isMobile } from 'react-device-detect'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import SearchGridToolbar from '../searchGridToolbar'
import { SymbolNameField, PriceField, PureFieldWithValueCheck, PercentField, ColorPercentField } from '../../common/dataGridUtil'
import { getUrl } from '../../common/utils'
import { NoMaxWidthTooltip } from '../../common/reactUtils'
import FactorPannel, {GetTacticFromCookie} from './factorPannel'
import { GetPeerTemplateDict } from '../../common/peer'

import stockPeerComparisonStyle from './stockPeerComparison.module.scss'
import '../muiTablePagination.css'


const customTheme = createTheme({
  palette: {
    applyPeer: { 
      backgroundColor: '#43a047', color: '#fff'
    },
  },
})


const StockPeerComparison = ({ loadingAnimeRef }) => {

  let peerTemplateDict = GetPeerTemplateDict()

  const [hideColState, setHideColState] = useState({})
  const [tactic, setTactic] = useState(GetTacticFromCookie())

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })
  
  const factorPannelRef = useRef({
    getValue: null,
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
    RecomP: { hide: false, text: 'Recom Peer' },
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
      PeerField('PEP', tableColList.PEP.text, 110, 2, ('PEP' in tactic && !tactic['PEP']) ? true : ('PEP' in hideColState ? hideColState['PEP'] : tableColList['PEP'].hide), "PE", "PE_I", peerTemplateDict['PEP'].flag , "P/E Peer (Stock / Industry)"),
      PeerField('FwdPEP', tableColList.FwdPEP.text, 110, 2, ('FwdPEP' in tactic && !tactic['FwdPEP']) ? true : ('FwdPEP' in hideColState ? hideColState['FwdPEP'] : tableColList['FwdPEP'].hide), "FwdPE", "FwdPE_I", peerTemplateDict['FwdPEP'].flag, "Forward P/E Peer (Stock / Industry)"),
      PeerField('PEGP', tableColList.PEGP.text, 110, 2, ('PEGP' in tactic && !tactic['PEGP']) ? true : ('PEGP' in hideColState ? hideColState['PEGP'] : tableColList['PEGP'].hide), "PEG", "PEG_I", peerTemplateDict['PEGP'].flag, "PEG Peer (Stock / Industry)"),
      PeerField('PSP', tableColList.PSP.text, 110, 2, ('PSP' in tactic && !tactic['PSP']) ? true : ('PSP' in hideColState ? hideColState['PSP'] : tableColList['PSP'].hide), "PS", "PS_I", peerTemplateDict['PSP'].flag, "P/S Peer (Stock / Industry)"),
      PeerField('PBP', tableColList.PBP.text, 110, 2, ('PBP' in tactic && !tactic['PBP']) ? true : ('PBP' in hideColState ? hideColState['PBP'] : tableColList['PBP'].hide), "PB", "PB_I", peerTemplateDict['PBP'].flag, "P/B Peer (Stock / Industry)"),
      PeerField('PCP', tableColList.PCP.text, 110, 2, ('PCP' in tactic && !tactic['PCP']) ? true : ('PCP' in hideColState ? hideColState['PCP'] : tableColList['PCP'].hide), "PC", "PC_I", peerTemplateDict['PCP'].flag, "P/C Peer (Stock / Industry)"),
      PeerField('PFCFP', tableColList.PFCFP.text, 110, 2, ('PFCFP' in tactic && !tactic['PFCFP']) ? true : ('PFCFP' in hideColState ? hideColState['PFCFP'] : tableColList['PFCFP'].hide), "PFCF", "PFCF_I", peerTemplateDict['PFCFP'].flag, "P/FCF Peer (Stock / Industry)"),
      PeerField('DividendP', tableColList.DividendP.text, 110, 2, ('DividendP' in tactic && !tactic['DividendP']) ? true : ('DividendP' in hideColState ? hideColState['DividendP'] : tableColList['DividendP'].hide), "Dividend", "Dividend_I", peerTemplateDict['DividendP'].flag, "Dividend % Peer (Stock / Industry)"),
      PeerField('FloatShortP', tableColList.FloatShortP.text, 110, 2, ('FloatShortP' in tactic && !tactic['FloatShortP']) ? true : ('FloatShortP' in hideColState ? hideColState['FloatShortP'] : tableColList['FloatShortP'].hide), "FloatShort", "FloatShort_I", peerTemplateDict['FloatShortP'].flag, "Float Short Peer (Stock / Industry)"),
      PeerField('RecomP', tableColList.RecomP.text, 110, 2, ('RecomP' in tactic && !tactic['RecomP']) ? true : ('RecomP' in hideColState ? hideColState['RecomP'] : tableColList['RecomP'].hide), "Recom", "Recom_I", peerTemplateDict['RecomP'].flag, "Recommend Peer (Stock / Industry)"),
      PureFieldWithValueCheck("BtrThnAvg", tableColList.BtrThnAvg.text, 110, 0, "BtrThnAvg" in hideColState ? hideColState["BtrThnAvg"] : tableColList['BtrThnAvg'].hide),
      PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, "PE" in hideColState ? hideColState["PE"] : tableColList['PE'].hide),
      PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, "PB" in hideColState ? hideColState["PB"] : tableColList['PB'].hide),
      PercentField("Dividend", tableColList.Dividend.text, 150, "Dividend" in hideColState ? hideColState["Dividend"] : tableColList['Dividend'].hide),
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
    if (config === null) {
      config = {filter_symbols: [], filter_industries: []}
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
    }

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
            Dividend: stockInfo !== undefined && stockInfo !== null && stockInfo['Dividend %'] !== '-' ? stockInfo['Dividend %'] : -Number.MAX_VALUE,
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
            PEG: stockInfo !== undefined && stockInfo !== null && stockInfo['PEG'] !== '-' ? stockInfo['PEG'] : Number.MAX_VALUE,
            PEG_I: industryStat !== undefined && industryStat !== null && industryStat['PEG'] !== '-' ? industryStat['PEG'] : Number.MAX_VALUE,
            PS: stockInfo !== undefined && stockInfo !== null && stockInfo['P/S'] !== '-' ? stockInfo['P/S'] : Number.MAX_VALUE,
            PS_I: industryStat !== undefined && industryStat !== null && industryStat['P/S'] !== '-' ? industryStat['P/S'] : Number.MAX_VALUE,
            PB: stockInfo !== undefined && stockInfo !== null && stockInfo['P/B'] !== '-' ? stockInfo['P/B'] : Number.MAX_VALUE,
            PB_I: industryStat !== undefined && industryStat !== null && industryStat['P/B'] !== '-' ? industryStat['P/B'] : Number.MAX_VALUE,
            PC: stockInfo !== undefined && stockInfo !== null && stockInfo['P/C'] !== '-' ? stockInfo['P/C'] : Number.MAX_VALUE,
            PC_I: industryStat !== undefined && industryStat !== null && industryStat['P/C'] !== '-' ? industryStat['P/C'] : Number.MAX_VALUE,
            PFCF: stockInfo !== undefined && stockInfo !== null && stockInfo['P/FCF'] !== '-' ? stockInfo['P/FCF'] : Number.MAX_VALUE,
            PFCF_I: industryStat !== undefined && industryStat !== null && industryStat['P/FCF'] !== '-' ? industryStat['P/FCF'] : Number.MAX_VALUE,
            Dividend_I: industryStat !== undefined && industryStat !== null && industryStat['Dividend'] !== '-' ? industryStat['Dividend'] : -Number.MAX_VALUE,
            FloatShort: stockInfo !== undefined && stockInfo !== null && stockInfo['Short Float'] !== '-' ? stockInfo['Short Float'] : Number.MAX_VALUE,
            FloatShort_I: industryStat !== undefined && industryStat !== null && industryStat['Float Short'] !== '-' ? industryStat['Float Short'] : Number.MAX_VALUE,
            Recom: stockInfo !== undefined && stockInfo !== null && stockInfo['Recom'] !== '-' ? stockInfo['Recom'] : Number.MAX_VALUE,
            Recom_I: industryStat !== undefined && industryStat !== null && industryStat['Recom'] !== '-' ? industryStat['Recom'] : Number.MAX_VALUE,
          }
          o['PEP'] = o['PE'] != Number.MAX_VALUE && o['PE_I'] != Number.MAX_VALUE ? o['PE'] / o['PE_I'] : Number.MAX_VALUE
          o['FwdPEP'] = o['FwdPE'] != Number.MAX_VALUE && o['FwdPE_I'] != Number.MAX_VALUE ? o['FwdPE'] / o['FwdPE_I'] : Number.MAX_VALUE
          o['PEGP'] = o['PEG'] != Number.MAX_VALUE && o['PEG_I'] != Number.MAX_VALUE ? o['PEG'] / o['PEG_I'] : Number.MAX_VALUE
          o['PSP'] = o['PS'] != Number.MAX_VALUE && o['PS_I'] != Number.MAX_VALUE ? o['PS'] / o['PS_I'] : Number.MAX_VALUE
          o['PBP'] = o['PB'] != Number.MAX_VALUE && o['PB_I'] != Number.MAX_VALUE ? o['PB'] / o['PB_I'] : Number.MAX_VALUE
          o['PCP'] = o['PC'] != Number.MAX_VALUE && o['PC_I'] != Number.MAX_VALUE ? o['PC'] / o['PC_I'] : Number.MAX_VALUE
          o['PFCFP'] = o['PFCF'] != Number.MAX_VALUE && o['PFCF_I'] != Number.MAX_VALUE ? o['PFCF'] / o['PFCF_I'] : Number.MAX_VALUE
          o['DividendP'] = o['Dividend'] != -Number.MAX_VALUE && o['Dividend_I'] != -Number.MAX_VALUE ? o['Dividend'] / o['Dividend_I'] : -Number.MAX_VALUE
          o['FloatShortP'] = o['FloatShort'] != Number.MAX_VALUE && o['FloatShort_I'] != Number.MAX_VALUE ? o['FloatShort'] / o['FloatShort_I'] : Number.MAX_VALUE
          o['RecomP'] = o['Recom'] != Number.MAX_VALUE && o['Recom_I'] != Number.MAX_VALUE ? o['Recom'] / o['Recom_I'] : Number.MAX_VALUE

          // calc BtrThnAvg for total count by flag & enable
          o['BtrThnAvg'] = Object.keys(peerTemplateDict).reduce((result, key) => {
            let tacticReal = factorPannelRef.current.getValue()
            if (key in tacticReal && tacticReal[key] && key in o && (o[key] != -Number.MAX_VALUE && o[key] != Number.MAX_VALUE)) {
              let key_i = key.substring(0, key.length - 1)
              result += calcPeerSign(o[key_i], o[key_i + '_I'], peerTemplateDict[key].flag) > 0 ? 1 : 0
            }
            return result
          }, 0)

          if(!("filter_industries" in config)) {
            config["filter_industries"] = []
          }
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
    renderStockPeerComparisonTable(null)
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
              <div className={ isMobile?stockPeerComparisonStyle.cmdPanelMobile:stockPeerComparisonStyle.cmdPanel}>
              <SearchGridToolbar searchVal={searchVal} setSearchVal={setSearchVal} clickCallback={(config)=>{
                  if ("filter_symbols" in config && config.filter_symbols.length === 0) {
                    config = null
                  }
                  renderStockPeerComparisonTable(config)
                }} 
                info={{
                  placeholder: 'Filter symbols: AAPL, BAC, KSS, ...',
                }}
              />
              <FactorPannel factorPannelRef={factorPannelRef} />
              <div></div>
              <ThemeProvider theme={customTheme}>
              <Box display="flex" justify="flex-end">
                <Button size="small" style={customTheme.palette.applyPeer} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                  setTactic(factorPannelRef.current.getValue())
                  let symbols = searchVal.replaceAll("\"","").split(',').map((symbol) => symbol.trim().toUpperCase())
                  let config = null
                  if (symbols.length !== 0 && symbols[0] !== '') {
                      config = {filter_symbols: symbols}
                  }
                  renderStockPeerComparisonTable(config)
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
