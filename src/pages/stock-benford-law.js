import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import StockBenfordLaw from '../components/stock-benford-law/stockBenfordLaw'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const StockBenfordLawPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <StockBenfordLaw loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default StockBenfordLawPage
