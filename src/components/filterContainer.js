import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search';
import { blue, red } from '@material-ui/core/colors'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import shortid from "shortid"
import useFetch from 'use-http'

import { FCDataTemplate, StockSectorDict, StockIndustryDict} from '../common/common'
import FilterCriteria from './filterCriteria'
import NornMinehunter from './nornMinehunter'
import LoadingAnime from './loadingAnime'

import filterContainerStyle from './filterContainer.module.scss'

const customTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
    import: { 
      backgroundColor: '#43a047', color: '#fff'
    },
    export: { 
      backgroundColor: '#00a152', color: '#fff'
    }
  },
})

// split from FilterContainer to prevent rerender FilterContainer
const QueryStocks = ({ queryStocksRef, loadingAnimeRef, filterCriteriaListRef, nornMinehunterRef}) => {
  
  const { post, response } = useFetch('https://localhost:44305')

  queryStocksRef.current = {
    doQuery: async () => {

      loadingAnimeRef.current.setLoading(true)

      let queryData = { data: { baseArg: [], NornMinehunter: {} } }

      // get basic arg
      FCDataTemplate.forEach((value, index) => {
        queryData.data.baseArg.push(filterCriteriaListRef.current[index].current.getValue())
      })

      // get norn-minehunter args
      queryData.data.NornMinehunter = nornMinehunterRef.current.getValue()

      //console.log(queryData)
      //setQueryBody({ grr: 'ddd' })

      /*
      ResultTableRef.current.setTable([
        { id: 1, symbol: 'KBAL', sector: StockSectorDict[0], industry: StockIndustryDict[0], marketCap: '419.72M', PE: 12.01, PB: 1.59, price: 11.69, change: '2.11%', volume: '179,751', risk: 33, tactics: 'BenjaminGraham_v1,HarryBurnIII_v1' }
      ])
      */

      const resp_data = await post('/api/task/do-scan', queryData.data)
      if (response.ok) {
        console.log(resp_data)
      } else {
        console.error('error')
      }
      loadingAnimeRef.current.setLoading(false)

    }
  }

  return (<></>)
}


const FilterContainer = ({ ResultTableRef }) => {

  // API Definition
  const filterCriteriaListRef = useRef([])
  FCDataTemplate.forEach((value, index) => {
    filterCriteriaListRef.current[index] = createRef()
    filterCriteriaListRef.current[index].current = {
      getValue: null
    }
  })

  const nornMinehunterRef = useRef({
    getValue: null
  })

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  const queryStocksRef = useRef({
    doQuery: null
  })

  return (
    <>
      <div className={filterContainerStyle.container}>
        <Grid container spacing={1}>
          {
            FCDataTemplate.map((value, index) => {
              return <FilterCriteria key={shortid.generate()} filterCriteriaRef={filterCriteriaListRef.current[index]} dataTemplate={value} />
            })
          }
        </Grid>
        <NornMinehunter nornMinehunterRef={nornMinehunterRef}/>
        <MuiThemeProvider theme={customTheme}>
          <div className={filterContainerStyle.cmdPanel}>
            <div></div>
            <Button variant="contained" style={customTheme.palette.import}>Import</Button>
            <div></div>
            <Button variant="contained" style={customTheme.palette.export}>Export</Button>
            <div></div>
            <MuiThemeProvider theme={createMuiTheme({ palette: { primary: blue, secondary: red } })}>
              <Button className={filterContainerStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                queryStocksRef.current.doQuery()
              }}>Query Now</Button>
            </MuiThemeProvider>
          </div>
        </MuiThemeProvider>
      </div>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef}/>
      <QueryStocks queryStocksRef={queryStocksRef} loadingAnimeRef={loadingAnimeRef} filterCriteriaListRef={filterCriteriaListRef} nornMinehunterRef={nornMinehunterRef}/>
    </>
  )
}

export default FilterContainer
