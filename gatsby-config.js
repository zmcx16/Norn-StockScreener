module.exports = {
  siteMetadata: {
    title: `Norn-StockScreener`,
    description: `scan and filter instruments based on market cap, dividend yield, ROE and popular investment master's stock tactics to find valuable stocks.`,
    author: `@zmcx16`,
    siteUrl: `https://norn-stockscreener.zmcx16.moe`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-material-ui`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Norn-StockScreener`,
        description: `Filter, shortlist stock from the market.`,
        short_name: `Norn-Screener`,
        start_url: `/`,
        background_color: `#1a3664`,
        theme_color: `#1a3664`,
        display: `standalone`,
        icon: `src/images/norn-icon.png`, // This path is relative to the root of the site.
        icon_options: {
          // For all the options available,
          // please see the section "Additional Resources" below.
          // purpose: `any maskable`,
          purpose: `any`,
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    `gatsby-plugin-offline`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-148957524-6",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: true,
        // Setting this parameter is optional
        //anonymize: true,
        // Setting this parameter is also optional
        //respectDNT: true,
        // Avoids sending pageview hits from custom paths
        //exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        //pageTransitionDelay: 0,
        // Enables Google Optimize using your container Id
        //optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
        // Enables Google Optimize Experiment ID
        //experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
        // Set Variation ID. 0 for original 1,2,3....
        //variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
        // Any additional optional fields
        //sampleRate: 5,
        //siteSpeedSampleRate: 10,
        //cookieDomain: "example.com",
      },
    },
  ],
}
