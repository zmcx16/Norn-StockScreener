import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import PCRSummary from '../components/options/pcr/pcrSummary'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const OptionsPCRPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <PCRSummary loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default OptionsPCRPage
