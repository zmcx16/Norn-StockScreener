import React, { useRef } from 'react'

import FilterContainer from './filterContainer'
import ResultTable from './resultTable'
import LoadingAnime from './loadingAnime'
import commonStyle from './common.module.scss'

const App = () => {
  
  const ResultTableRef = useRef({
    setTable: null
  })

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })


  return (
    <>
      <div className={commonStyle.defaultFont}>
        <FilterContainer ResultTableRef={ResultTableRef} loadingAnimeRef={loadingAnimeRef}/>
        <ResultTable ResultTableRef={ResultTableRef}/>
        <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
      </div>
    </>
  )
}

export default App
