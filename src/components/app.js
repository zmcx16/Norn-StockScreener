import React, { useState, useEffect, useRef, useCallback, createRef } from "react"

import FilterContainer from './filterContainer'
import ResultTable from './resultTable'

import commonStyle from './common.module.scss'
import appStyle from './app.module.scss'

const App = () => {
  
  return (
    <>
      <div className={commonStyle.defaultFont}>
        <FilterContainer  />
        <ResultTable />
      </div>
    </>
  )
}

export default App
