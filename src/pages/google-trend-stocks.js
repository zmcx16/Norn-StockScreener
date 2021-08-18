import React, { useRef } from 'react'
import { StylesProvider } from '@material-ui/core/styles'

import Layout from '../components/layout'
import GoogleTrendStocksTable from '../components/google-trend-stocks/googleTrendStocksTable'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const GoogleTrendStocksPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <GoogleTrendStocksTable loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default GoogleTrendStocksPage
