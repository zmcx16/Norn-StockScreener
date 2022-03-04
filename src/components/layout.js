import React, { useState} from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import Cookies from 'universal-cookie'

import Header from './header'
import Footer from './footer'

import { COOKIE_KEY_DARK_MODE } from '../common/common'

import layoutStyle from './layout.module.scss'

const Layout = ({ children} ) => {

  const cookies = new Cookies()
  if (!cookies.get(COOKIE_KEY_DARK_MODE)){
    cookies.set(COOKIE_KEY_DARK_MODE, 0, { path: '/' })
  }

  const [isDarkMode, setIsDarkMode] = useState(cookies.get(COOKIE_KEY_DARK_MODE)!=0)

  return (
    <ThemeProvider theme={createTheme({ 
      palette: { 
        mode: isDarkMode ? 'dark' : 'light',
        background: {
          default: isDarkMode ? '#303030' : '#fcfafa',
        }
      }})}>
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
