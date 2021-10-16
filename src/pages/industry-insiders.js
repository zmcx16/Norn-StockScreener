import React, { useRef } from 'react'
import { StylesProvider } from '@material-ui/core/styles'

import Layout from '../components/layout'
import IndustryInsidersTable from '../components/industry-insiders/industryInsidersTable'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const IndustryInsidersPage = () => {

    const loadingAnimeRef = useRef({
        getLoading: null,
        setLoading: null
    })

    return (
        <StylesProvider injectFirst>
            <SEO />
            <Layout >
                <IndustryInsidersTable loadingAnimeRef={loadingAnimeRef} />
            </Layout>
            <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
        </StylesProvider>
    )
}

export default IndustryInsidersPage
