import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search';
import { blue, red } from '@material-ui/core/colors'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import shortid from "shortid"

import { FCDataTemplate, StockSectorDict, StockIndustryDict} from '../common/common'
import FilterCriteria from './filterCriteria'
import NornMinehunter from './nornMinehunter'

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

const FilterContainer = ({ ResultTableRef}) => {

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

  const [isLoading, setIsLoading] = useState(false)
  const [queryBody, setQueryBody] = useState({})

  useEffect(() => {
    if (Object.keys(queryBody).length !== 0){
      console.log(queryBody)
      fetch("https://localhost:44305/api/task/do-scan",{
        body: JSON.stringify(queryBody),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST'  
      })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoading(false)
          console.log(result)
        },
        (error) => {
          setIsLoading(false)
          console.log(error)
        }
      )
    }
  }, [queryBody])

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
            <Button className={filterContainerStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={()=>{

              let queryData = {data:{baseArg:[], NornMinehunter:{}}}

              // get basic arg
              FCDataTemplate.forEach((value, index) => {
                queryData.data.baseArg.push(filterCriteriaListRef.current[index].current.getValue())
              })

              // get norn-minehunter args
              queryData.data.NornMinehunter = nornMinehunterRef.current.getValue()
              
              //console.log(queryData)
                setQueryBody({
                  "data": [
                    {
                      "type": "PeterLynch_v1",
                      "name": "Tactic1",
                      "target": [
                        "T",
                        "PSX"
                      ],
                      "args": {
                        "PEG": 1,
                        "Market Cap": 10000,
                        "LT Debt/Eq": 0.3,
                        "Debt/Eq": 0.3,
                        "EPS this Y": 0,
                        "EPS next Y_%": 0,
                        "EPS past 5Y": 0,
                        "EPS next 5Y": 0
                      }
                    },
                    {
                      "type": "Stasistw_v1",
                      "name": "Tactic2",
                      "target": [
                        "T",
                        "PSX"
                      ],
                      "args": {
                        "P/B": 3,
                        "EPS past 5Y": 0,
                        "Dividend %": 2,
                        "LT Debt/Eq": 0.6,
                        "Sales past 5Y": 0,
                        "ROE": 0,
                        "SMA200": 0,
                        "EPS this Y": 0,
                        "EPS next Y_%": 0
                      }
                    }
                  ]
                })

              ResultTableRef.current.setTable([
                { id: 1, symbol: 'KBAL', sector: StockSectorDict[0], industry: StockIndustryDict[0], marketCap: '419.72M', PE: 12.01, PB: 1.59, price: 11.69, change: '2.11%', volume: '179,751', risk: 33, tactics: 'BenjaminGraham_v1,HarryBurnIII_v1' }
              ])

            }}>Query Now</Button>
            </MuiThemeProvider>
          </div>
        </MuiThemeProvider>
      </div>
    </>
  )
}

export default FilterContainer
