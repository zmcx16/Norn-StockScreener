import React from "react"
import { StylesProvider } from "@material-ui/core/styles"

import Layout from "../components/layout"
import App from "../components/app"
import SEO from "../components/seo"


const IndexPage = () => {

  return (
    <StylesProvider injectFirst>
      <SEO />
      <Layout >
        <App />
      </Layout>
    </StylesProvider>
  )
}

export default IndexPage
