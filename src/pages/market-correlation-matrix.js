import React, { useRef } from 'react'
import { StylesProvider } from '@material-ui/core/styles'

import Layout from '../components/layout'
import MarketCorrelationMatrix from '../components/marketCorrelationMatrix'
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
