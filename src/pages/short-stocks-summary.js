import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import ShortStocksSummary from '../components/short-stocks/shortStocksSummary'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const ShortStocksSummaryPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <ShortStocksSummary loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default ShortStocksSummaryPage
