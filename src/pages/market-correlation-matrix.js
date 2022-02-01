import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import MarketCorrelationMatrix from '../components/market-correlation-matrix/marketCorrelationMatrix'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const MarketCorrelationMatrixPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <MarketCorrelationMatrix loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default MarketCorrelationMatrixPage
