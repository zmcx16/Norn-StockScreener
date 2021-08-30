import React, { useRef } from 'react'
import { StylesProvider } from '@material-ui/core/styles'

import Layout from '../components/layout'
import InvestmentGurus from '../components/investment-gurus/investmentGurus'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const InvestmentGurusPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <InvestmentGurus loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default InvestmentGurusPage
