/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'


function SEO() {

  const descrption = `scan and filter instruments based on market cap, dividend yield, ROE and popular investment master's stock tactics to find valuable stocks.`

  return (
    <Helmet
      htmlAttributes={{ lang: `en` }}
      title={`Norn-StockScreener`}
      titleTemplate={`%s | Norn-StockScreener`}
      meta={[
        {
          name: `description`,
          content: `Norn-StockScreener`,
        },
        {
          property: `og:title`,
          content: `Norn-StockScreener`,
        },
        {
          property: `og:image`,
          content: `https://i.imgur.com/iQz1ujc.jpg`,
        },
        {
          property: `og:description`,
          content: descrption,
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
          content: descrption,
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
