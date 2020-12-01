import React, { useState, useEffect, useRef, useCallback, createRef } from "react"

import FilterCriteria from "./filterCriteria"

import commonStyle from "./common.module.scss"
import filterContainerStyle from "./filterContainer.module.scss"

const FilterContainer = () => {
  
  var dataTemplate = {
    name: "P/B",
    name_display: "P/B",
    args_items: ["< 0", "0 - 0.5", "0.5 - 1.0", "1.0 - 1.5", "1.5 - 2.0", "2.0 - 3.0", "> 3.0"],
    default_index: 2
  }

  const filterCriteriaRef = useRef()

  return (
    <>
      <div className={filterContainerStyle.container + ' ' + commonStyle.defaultFont}>
        <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
      </div>
    </>
  )
}

export default FilterContainer
