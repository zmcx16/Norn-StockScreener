import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import StockPriceSimulation from '../components/stock-price-simulation/StockPriceSimulation'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const StockPriceSimulationPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <StockPriceSimulation loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default StockPriceSimulationPage
