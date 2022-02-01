import React, { useRef } from 'react'
import { StylesProvider } from '@mui/styles'

import Layout from '../components/layout'
import InsidersTradeListTable from '../components/industry-insiders/insidersTradeListTable'
import LoadingAnime from '../components/loadingAnime'
import SEO from '../components/seo'

const InsidersTradeListPage = () => {

    const loadingAnimeRef = useRef({
        getLoading: null,
        setLoading: null
    })

    return (
        <StylesProvider injectFirst>
            <SEO />
            <Layout >
                <InsidersTradeListTable loadingAnimeRef={loadingAnimeRef} />
            </Layout>
            <LoadingAnime loadingAnimeRef={loadingAnimeRef} />
        </StylesProvider>
    )
}

export default InsidersTradeListPage
