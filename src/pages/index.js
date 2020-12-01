import React from "react"
import { StylesProvider } from "@material-ui/core/styles"

import Layout from "../components/layout"
import FilterContainer from "../components/filterContainer"
import SEO from "../components/seo"


const IndexPage = () => {

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <FilterContainer />
      </Layout>
    </StylesProvider>
  )
}

export default IndexPage
