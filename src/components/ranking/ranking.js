import React, { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/Info'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'
import shortid from 'shortid'
import useFetch from 'use-http'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'

import { GetDataByFetchObj, SymbolNameField, PureFieldWithValueCheck, PercentField, ColorPercentField, NameWithLinkField, KMBTField, ColorNumberWithExtraInfoField } from '../../common/reactUtils'
import { RankingDef } from '../../common/rankingDef'

import commonStyle from '../common.module.scss'
import rankingStyle from './ranking.module.scss'


const Ranking = ({loadingAnimeRef}) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })
  
  const tableColList = {
    Rank: {hide: false, text: 'Rank'},
    Name: {hide: false, text: 'Name'},
    Symbol: { hide: false, text: 'Symbol' },
    MarketCap: {hide: false, text: 'Market Cap'},
    Close: { hide: false, text: 'Price' },
    High52: { hide: false, text: '52W High' },
    Low52: { hide: false, text: '52W Low' },
    PerfWeek: { hide: false, text: 'Perf Week' },
    PerfMonth: { hide: false, text: 'Perf Month' },
    PerfQuarter: { hide: false, text: 'Perf Quarter' },
    PerfHalfY: { hide: false, text: 'Perf Half Y' },
    PerfYear: { hide: false, text: 'Perf Year' },
    PerfYTD: { hide: false, text: 'Perf YTD' },
    PE: { hide: false, text: 'P/E' },
    PB: { hide: false, text: 'P/B' },
    PS: { hide: false, text: 'P/S' },
    ROE: { hide: false, text: 'ROE' },
    ROA: { hide: false, text: 'ROA' },
    ROI: { hide: false, text: 'ROI' },
    Dividend: { hide: false, text: 'Dividend %' },
  }

  const genTableColTemplate = () => {
    return [
      ColorNumberWithExtraInfoField("rank", tableColList.Rank.text, 60, 0, "rank" in hideColState ? hideColState["rank"] : tableColList['Rank'].hide),
      //PureFieldWithValueCheck("rank", tableColList.Rank.text, 60, 0, "rank" in hideColState ? hideColState["rank"] : tableColList['Rank'].hide),
      NameWithLinkField('name', 'Name', 150, 'link', 'name' in hideColState ? hideColState['name'] : tableColList['Name'].hide),
      SymbolNameField('symbol', 'Symbol', 110, 'symbol' in hideColState ? hideColState['symbol'] : tableColList['Symbol'].hide, null, "yahoo"),
      KMBTField("marketCap", tableColList.MarketCap.text, 130, 2, "marketCap" in hideColState ? hideColState["marketCap"] : tableColList['MarketCap'].hide),
      PureFieldWithValueCheck("close", tableColList.Close.text, 110, 2, "close" in hideColState ? hideColState["close"] : tableColList['Close'].hide),
      PercentField("high52", tableColList.High52.text, 150, "high52" in hideColState ? hideColState["high52"] : tableColList['High52'].hide),
      PercentField("low52", tableColList.Low52.text, 150, "low52" in hideColState ? hideColState["low52"] : tableColList['Low52'].hide),
      ColorPercentField("perfWeek", tableColList.PerfWeek.text, 150, 2, "perfWeek" in hideColState ? hideColState["perfWeek"] : tableColList['PerfWeek'].hide, 500),
      ColorPercentField("perfMonth", tableColList.PerfMonth.text, 150, 2, "perfMonth" in hideColState ? hideColState["perfMonth"] : tableColList['PerfMonth'].hide, 500),
      ColorPercentField("perfQuarter", tableColList.PerfQuarter.text, 150, 2, "perfQuarter" in hideColState ? hideColState["perfQuarter"] : tableColList['PerfQuarter'].hide, 500),
      ColorPercentField("perfHalfY", tableColList.PerfHalfY.text, 150, 2, "perfHalfY" in hideColState ? hideColState["perfHalfY"] : tableColList['PerfHalfY'].hide, 500),
      ColorPercentField("perfYear", tableColList.PerfYear.text, 150, 2, "perfYear" in hideColState ? hideColState["perfYear"] : tableColList['PerfYear'].hide, 500),
      ColorPercentField("perfYTD", tableColList.PerfYTD.text, 150, 2, "perfYTD" in hideColState ? hideColState["perfYTD"] : tableColList['PerfYTD'].hide, 500),
      PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, "PE" in hideColState ? hideColState["PE"] : tableColList['PE'].hide),
      PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, "PB" in hideColState ? hideColState["PB"] : tableColList['PB'].hide),
      PureFieldWithValueCheck("PS", tableColList.PS.text, 110, 2, "PS" in hideColState ? hideColState["PS"] : tableColList['PS'].hide),
      PercentField("ROE", tableColList.ROE.text, 150, "ROE" in hideColState ? hideColState["ROE"] : tableColList['ROE'].hide),
      PercentField("ROA", tableColList.ROA.text, 150, "ROA" in hideColState ? hideColState["ROA"] : tableColList['ROA'].hide),
      PercentField("ROI", tableColList.ROI.text, 150, "ROI" in hideColState ? hideColState["ROI"] : tableColList['ROI'].hide),
      PercentField("dividend", tableColList.Dividend.text, 150, "dividend" in hideColState ? hideColState["dividend"] : tableColList['Dividend'].hide),
    ]
  }


  const fetchRankingData = useFetch({ cachePolicy: 'no-cache' })

  const renderTable = (resp, selectIndex) => {
    let output = RankingDef[selectIndex].data.map((value, index) => {
      let stockInfo = resp[value['symbol']]
      let o = {
        id: index,
        rank: value['rank'],
        name: value['name'],
        symbol: value['symbol'],
        link: value['link'],
        marketCap: stockInfo !== undefined && stockInfo !== null && stockInfo['Market Cap'] !== '-' ? stockInfo['Market Cap'] : -Number.MAX_VALUE,
        close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
        high52: stockInfo !== undefined && stockInfo !== null && stockInfo['52W High'] !== '-' ? stockInfo['52W High'] : -Number.MAX_VALUE,
        low52: stockInfo !== undefined && stockInfo !== null && stockInfo['52W Low'] !== '-' ? stockInfo['52W Low'] : -Number.MAX_VALUE,
        perfWeek: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Week'] !== '-' ? stockInfo['Perf Week'] : -Number.MAX_VALUE,
        perfMonth: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Month'] !== '-' ? stockInfo['Perf Month'] : -Number.MAX_VALUE,
        perfQuarter: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Quarter'] !== '-' ? stockInfo['Perf Quarter'] : -Number.MAX_VALUE,
        perfHalfY: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Half Y'] !== '-' ? stockInfo['Perf Half Y'] : -Number.MAX_VALUE,
        perfYear: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Year'] !== '-' ? stockInfo['Perf Year'] : -Number.MAX_VALUE,
        perfYTD: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf YTD'] !== '-' ? stockInfo['Perf YTD'] : -Number.MAX_VALUE,
        PE: stockInfo !== undefined && stockInfo !== null && stockInfo['P/E'] !== '-' ? stockInfo['P/E'] : Number.MAX_VALUE,
        PB: stockInfo !== undefined && stockInfo !== null && stockInfo['P/B'] !== '-' ? stockInfo['P/B'] : Number.MAX_VALUE,
        PS: stockInfo !== undefined && stockInfo !== null && stockInfo['P/S'] !== '-' ? stockInfo['P/S'] : Number.MAX_VALUE,
        ROE: stockInfo !== undefined && stockInfo !== null && stockInfo['ROE'] !== '-' ? stockInfo['ROE'] : -Number.MAX_VALUE,
        ROA: stockInfo !== undefined && stockInfo !== null && stockInfo['ROA'] !== '-' ? stockInfo['ROA'] : -Number.MAX_VALUE,
        ROI: stockInfo !== undefined && stockInfo !== null && stockInfo['ROI'] !== '-' ? stockInfo['ROI'] : -Number.MAX_VALUE,
        dividend: stockInfo !== undefined && stockInfo !== null && stockInfo['Dividend %'] !== '-' ? stockInfo['Dividend %'] : -Number.MAX_VALUE,
      }
      if ('extra_info' in value) {
        o['extra_info'] = value['extra_info']
      }
      if ('rank_color' in value) {
        o['word_color'] = value['rank_color']
      }
      return o
    })
    setRankingData(output)
  }

  const renderRankingData = (selectIndex) => {
    loadingAnimeRef.current.setLoading(true)
    Promise.all([
      GetDataByFetchObj('/norn-data/stock/stat.json', fetchRankingData),
    ]).then((allResponses) => {
      console.log(allResponses)
      if (allResponses.length === 1 && allResponses[0] !== null) {
        renderTable(allResponses[0], selectIndex)
      } else {
        console.error("renderRankingData some data failed")
        modalWindowRef.current.popModalWindow(<div>Get some data failed...</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch(() => {
      console.error("renderRankingData failed")
      modalWindowRef.current.popModalWindow(<div>Get data failed...</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  const [rankingData, setRankingData] = useState([])
  const [hideColState, setHideColState] = useState({})
  const [arg, setArg] = useState(0)
  
  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    renderRankingData(0)

    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <div className={commonStyle.defaultFont + ' ' + rankingStyle.container}>
      <div key={shortid.generate()} >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl size="small" variant="outlined" className={rankingStyle.rankingTableSelect}>
              <InputLabel htmlFor="arg-select">{'Ranking Indicators'}</InputLabel>
              <Select
                native
                value={arg}
                displayEmpty
                onChange={(event) => {
                  setArg(event.target.value)
                  renderRankingData(event.target.value)
                }}
                label={'Ranking Indicators'}
              >
                {
                  RankingDef.map((value, index) => {
                    return <option key={shortid.generate()} index={index} value={index}>{value.display_name}</option>
                  })
                }
              </Select>
            </FormControl>
            <Tooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{RankingDef[arg].description}</span>} >
              <IconButton onClick={() => window.open(RankingDef[arg].link, "_blank")}>
                <InfoIcon color="action"/>
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <div className={rankingStyle.table}>
          <DataGrid rows={rankingData} columns={genTableColTemplate()} rowsPerPageOptions={[]} autoPageSize={true} components={{ NoRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick onColumnVisibilityChange={(param) => {
            let tempHideColState = hideColState
            tempHideColState[param['field']] = !param['isVisible']
            setHideColState(tempHideColState)
          }} />
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default Ranking
