import React, { useRef } from 'react'
import { StylesProvider } from '@material-ui/core/styles'

import Layout from '../components/layout'
import App from '../components/app'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const IndexPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <App loadingAnimeRef={loadingAnimeRef}/>
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default IndexPage
