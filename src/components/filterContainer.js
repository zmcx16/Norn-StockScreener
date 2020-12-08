import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search';
import { blue, red } from '@material-ui/core/colors'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import shortid from "shortid"

import {FCDataTemplate} from '../common/common'
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

const FilterContainer = () => {

  // API Definition
  const filterCriteriaListRef = useRef(Array(FCDataTemplate.length).fill({}))

  const nornMinehunterRef = useRef({
    getValue: null
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
              <Button className={filterContainerStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />}>Query Now</Button>
            </MuiThemeProvider>
          </div>
        </MuiThemeProvider>
      </div>
    </>
  )
}

export default FilterContainer
