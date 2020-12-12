import React, { useState} from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from "@material-ui/core/styles"
import { CssBaseline, createMuiTheme } from "@material-ui/core"

import Header from './header'
import Footer from './footer'

import layoutStyle from './layout.module.scss'

const Layout = ({ children} ) => {
  
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <ThemeProvider theme={createMuiTheme({ palette: { type: isDarkMode ? 'dark' : 'light' } })}>
      <CssBaseline />
      <div className={layoutStyle.container}>
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <main>{children}</main>
      </div>
      <Footer/>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
