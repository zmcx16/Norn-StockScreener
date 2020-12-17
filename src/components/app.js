import React, { useRef } from 'react'

import FilterContainer from './filterContainer'
import ResultTable from './resultTable'

import commonStyle from './common.module.scss'

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
