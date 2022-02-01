import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import IndustryTable from '../components/industry-market/industryTable'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const IndustryPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <IndustryTable loadingAnimeRef={loadingAnimeRef}/>
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default IndustryPage
