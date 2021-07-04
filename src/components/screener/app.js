import React, { useRef } from 'react'

import FilterContainer from './filterContainer'
import ResultTable from './resultTable'
import commonStyle from '../common.module.scss'

const App = ({ loadingAnimeRef }) => {
  
  const ResultTableRef = useRef({
    setTable: null
  })

  return (
    <>
      <div className={commonStyle.defaultFont}>
        <FilterContainer ResultTableRef={ResultTableRef} loadingAnimeRef={loadingAnimeRef}/>
        <ResultTable ResultTableRef={ResultTableRef}/>
      </div>
    </>
  )
}

export default App
