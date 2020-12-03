import React, { useState, useEffect, useRef, useCallback, createRef } from "react"
import Grid from '@material-ui/core/Grid';

import FilterCriteria from "./filterCriteria"

import filterContainerStyle from "./filterContainer.module.scss"

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
        <Grid container spacing={1}>
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
          <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
        </Grid>
      </div>
    </>
  )
}

export default FilterContainer
