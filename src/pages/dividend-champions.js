import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import DividendChampions from '../components/dividend-champions/dividendChampions'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const DividendChampionsPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <DividendChampions loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default DividendChampionsPage
