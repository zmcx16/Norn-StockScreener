import React, { useState, useEffect, useRef, useCallback, createRef } from "react"

import FilterCriteria from "./filterCriteria"

import filterContainerStyle from "./filterContainer.module.scss"

const FilterContainer = () => {
  
  var dataTemplate = {
    name: "P/B",
    name_display: "P/B",
    args_items: ["< 0", "0 - 0.5", "0.5 - 1.0", "1.0 - 1.5", "1.5 - 2.0", "2.0 - 3.0", "> 3.0"],
    default_index: 2
  }

  // API Definition
  const filterCriteriaRef = useRef({
    setValue: null,
    getValue: null
  })

  return (
    <>
      <div className={filterContainerStyle.container}>
        <FilterCriteria filterCriteriaRef={filterCriteriaRef} dataTemplate={dataTemplate} />
      </div>
    </>
  )
}

export default FilterContainer
