import React from "react"
import { StylesProvider } from "@material-ui/core/styles"

import Layout from "../components/layout"
import SEO from "../components/seo"


const IndexPage = () => {

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        Hello World
      </Layout>
    </StylesProvider>
  )
}

export default IndexPage
