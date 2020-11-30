/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"


function SEO() {

  return (
    <Helmet
      htmlAttributes={`en`}
      title={`NornScreener`}
      titleTemplate={`%s | NornScreener`}
      meta={[
        {
          name: `description`,
          content: `NornScreener`,
        },
        {
          property: `og:title`,
          content: `NornScreener`,
        },
        {
          property: `og:image`,
          content: `https://i.imgur.com/iQz1ujc.jpg`,
        },
        {
          property: `og:description`,
          content: `NornScreener`,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: `zmcx16`,
        },
        {
          name: `twitter:title`,
          content: `zmcx16`,
        },
        {
          name: `twitter:description`,
          content: `NornScreener`,
        },
      ]}
      link={[
        {
          rel: "alternate",
          href: "https://norn-stockscreener.zmcx16.moe",
          hreflang: `en`,
        }
      ]}
    />
  )
}

SEO.defaultProps = {
  lang: `en`
}

SEO.propTypes = {
  lang: PropTypes.string
}

export default SEO
