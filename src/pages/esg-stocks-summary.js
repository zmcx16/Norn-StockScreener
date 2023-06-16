import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import ESGStocksSummary from '../components/esg-stocks/esgStocksSummary'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const ESGStocksSummaryPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <ESGStocksSummary loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default ESGStocksSummaryPage
