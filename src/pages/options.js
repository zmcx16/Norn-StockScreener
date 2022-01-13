import React, { useRef } from 'react'
import { StylesProvider } from '@material-ui/core/styles'

import Layout from '../components/layout'
import Options from '../components/options/options'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const OptionsPage = () => {

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

export default OptionsPage
