import React, { useState, useEffect } from 'react'
import PlaceIcon from '@mui/icons-material/Place'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import { isMobile } from 'react-device-detect'
import Cookies from 'universal-cookie'

import { IOSSwitch } from './iOSSwitch'
import { NoMaxWidthTooltip } from '../common/reactUtils'
import { kanbanNote, kanbanText, pageRouterTable, COOKIE_KEY_DARK_MODE } from '../common/common'
import { getUrl } from '../common/utils'

import commonStyle from './common.module.scss'
import headerStyle from './header.module.scss'

const Header = ({ isDarkMode, setIsDarkMode }) => {
  const cookies = new Cookies()

  const [pageRouterMenu, setPageRouterMenu] = useState(null)
  const openPageRouterMenu = Boolean(pageRouterMenu)

  const imageData = useStaticQuery(graphql`
    query {
      images: file(relativePath: { eq: "norn-icon.png" }){
        childImageSharp {
          fixed(width: 75) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }
    }
  `)

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    setVisible('visible')
    isMobile ? setToggleMobileDisplay() : setToggleDisplay()
    isMobile ? setKanbanBlock(headerStyle.kanbanBlockMobile) : setKanbanBlock(headerStyle.kanbanBlock)
    isMobile ? setHeaderText('Norn-Screener') : setHeaderText('Norn-StockScreener')
    setIsDarkMode(cookies.get(COOKIE_KEY_DARK_MODE)!=0)
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  const toggleNode = 
    <>
      <span style={{ fontSize: '28px', color: isDarkMode ? 'darkgray' : 'gold' }}>☀</span>
      <span style={{ fontSize: '24px' }}>&nbsp;/&nbsp;</span>
      <span style={{ fontSize: '28px', color: isDarkMode ? 'gold' : 'darkgray' }}>☽</span>
    </>

  const [visible, setVisible] = useState('hidden')
  const [toggleDisplay, setToggleDisplay] = useState('none')
  const [toggleMobileDisplay, setToggleMobileDisplay] = useState('none')
  const [kanbanBlockClass, setKanbanBlock] = useState(headerStyle.kanbanBlock)
  const [headerText, setHeaderText] = useState('')

  const switchDarkModeFunc = () => {
    let new_state = !isDarkMode
    cookies.set(COOKIE_KEY_DARK_MODE, new_state?1:0, { path: '/' })
    setIsDarkMode(new_state)
  }

  return (
    <>
      <div className={headerStyle.container} style={{ visibility: visible }}>
        <div className={kanbanBlockClass}>
          <Img fixed={imageData.images.childImageSharp.fixed} fadeIn={false} className={headerStyle.kanbanimg} />
          <div></div>
          <div className={headerStyle.kanbanTextBlock}>
            <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{kanbanNote}</span>} >
              <Typography style={{ fontSize: '22px', paddingTop: '5px' }} className={commonStyle.comicFont}>{headerText}</Typography>
            </NoMaxWidthTooltip>
            {<Typography style={{ fontSize:'15px', position: 'absolute', paddingTop: '10px' }} >{kanbanText}</Typography>}
          </div>
          <div>
            <IconButton
              size="small"
              aria-haspopup="true"
              onClick={(event) => {
                setPageRouterMenu(event.currentTarget)
              }}
            >
              <PlaceIcon color="primary" style={{ fontSize: 40 }} />
            </IconButton>
            <Menu
              id="page-router-menu"
              anchorEl={pageRouterMenu}
              keepMounted
              open={openPageRouterMenu}
              onClose={() => {
                setPageRouterMenu(null)
              }}
            >
              {pageRouterTable.map((option) => (
                <MenuItem key={option.text} selected={option.path === new URL(getUrl()).pathname} onClick={() => {
                  setPageRouterMenu(null)
                  let url = new URL(getUrl())
                  window.location = url.protocol + "//" + url.hostname + ":" + url.port + option.path
                }}>
                  {option.text}
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div className={headerStyle.darkmodetoggle} style={{ background: isDarkMode ? 'black' : 'azure', paddingRight: '10px', display: toggleMobileDisplay }} onClick={switchDarkModeFunc}>
            {toggleNode}
          </div>
          <FormControlLabel
            className={headerStyle.darkmodetoggle} style={{ background: isDarkMode ? 'black' : 'azure', display: toggleDisplay }}
            control={
              <IOSSwitch
                onChange={switchDarkModeFunc}
                checked={isDarkMode}
              />
            }
            labelPlacement='start'
            label={toggleNode}
          />
        </div>
      </div>
    </>
  )
}

export default Header
