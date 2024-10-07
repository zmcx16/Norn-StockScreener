import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import GPTInvestingAssistant from '../components/gpt-investing-assistant/gptInvestingAssistant'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const GPTInvestingAssistantPage = () => {

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <GPTInvestingAssistant loadingAnimeRef={loadingAnimeRef} />
      </Layout>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
    </StylesProvider>
  )
}

export default GPTInvestingAssistantPage
