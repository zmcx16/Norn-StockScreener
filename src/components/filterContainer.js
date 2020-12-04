import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search';
import { blue, red, green } from '@material-ui/core/colors'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import FilterCriteria from './filterCriteria'

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
  
  var dataTemplate = {
    name: "P/B",
    display_name: "Price-Book Ratio",
    args_items: ["< 0", "0 - 0.5", "0.5 - 1.0", "1.0 - 1.5", "1.5 - 2.0", "2.0 - 3.0", "> 3.0"],
    default_index: 2
  }

  // API Definition
  const filterCriteriaRef = useRef({
    getValue: null
  })

  return (
    <>
      <div className={filterContainerStyle.container}>
        <Grid container spacing={1} justify="center">
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <MuiThemeProvider theme={customTheme}>
            <div className={filterContainerStyle.cmdPanel}>  
              <div></div>
              <Button variant="contained" style={customTheme.palette.import}>Import</Button>
              <Button variant="contained" style={customTheme.palette.export}>Export</Button>
              <div></div>
              <MuiThemeProvider theme={createMuiTheme({ palette: { primary: blue, secondary: red } })}>
                <Button className={filterContainerStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />}>Query Now</Button>
              </MuiThemeProvider>
            </div>
           </MuiThemeProvider>
        </Grid>
      </div>
    </>
  )
}

export default FilterContainer
