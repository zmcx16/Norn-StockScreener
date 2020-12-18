import React, { useState } from 'react'

import loadingAnimeStyle from './loadingAnime.module.scss'

const LoadingAnime = ({loadingAnimeRef}) => {
  
  const [loadingState, setLoadingState] = useState(true)

  // LoadingAnime API
  loadingAnimeRef.current = {
    getLoading: () => {
      return loadingState
    },
    setLoading: (val) => {
      setLoadingState(val)
    }
  }

  return (
    <div className={loadingAnimeStyle.loadingBlock} style={{ display: loadingState ? 'block' : 'none' }}>
      <div className={loadingAnimeStyle.loadingAnimation}>
      </div>
      <div className={loadingAnimeStyle.loadingBackground}>
      </div>
    </div>
  )
}

export default LoadingAnime
