import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import StockPeerComparison from '../components/stock-peer-comparison/stockPeerComparison'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const StockPeerComparisonPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <StockPeerComparison loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default StockPeerComparisonPage
