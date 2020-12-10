import React, { useState, useEffect, useRef, useCallback, createRef } from "react"

import FilterContainer from './filterContainer'
import ResultTable from './resultTable'

import commonStyle from './common.module.scss'
import appStyle from './app.module.scss'

const App = () => {
  
  const ResultTableRef = useRef({
    setTable: null
  })

  return (
    <>
      <div className={commonStyle.defaultFont}>
        <FilterContainer ResultTableRef={ResultTableRef}/>
        <ResultTable ResultTableRef={ResultTableRef}/>
      </div>
    </>
  )
}

export default App
