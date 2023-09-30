import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import Options from '../components/options/valuation/options'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const OptionsValuationPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <Options loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default OptionsValuationPage
