import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import { isMobile } from 'react-device-detect'

import { IOSSwitch } from './iOSSwitch'
import { kanbanNote, kanbanText } from '../common/common'

import commonStyle from './common.module.scss'
import headerStyle from './header.module.scss'

const useStylesTooltip = makeStyles((theme) => ({
  noMaxWidth: {
    maxWidth: 'none',
  },
}))

const Header = ({ isDarkMode, setIsDarkMode }) => {

  const tooltipStyle = useStylesTooltip()

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

  return (
    <>
      <div className={headerStyle.container} style={{ visibility: visible }}>
        <div className={kanbanBlockClass}>
          <Img fixed={imageData.images.childImageSharp.fixed} fadeIn={false} className={headerStyle.kanbanimg} />
          <div></div>
          <div className={headerStyle.kanbanTextBlock}>
            <Tooltip arrow classes={{ tooltip: tooltipStyle.noMaxWidth }} title={<span style={{ whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center' }}>{kanbanNote}</span>} >
              <Typography style={{ fontSize: '22px', paddingTop: '5px' }} className={commonStyle.comicFont}>{headerText}</Typography>
            </Tooltip>
            {<Typography style={{ fontSize:'15px', position: 'absolute', paddingTop: '10px' }} >{kanbanText}</Typography>}
          </div>
          <div className={headerStyle.darkmodetoggle} style={{ background: isDarkMode ? 'black' : 'azure', paddingRight: '10px', display: toggleMobileDisplay }} onClick={
            () => { setIsDarkMode(!isDarkMode) }
          }>
            {toggleNode}
          </div>
          <FormControlLabel
            className={headerStyle.darkmodetoggle} style={{ background: isDarkMode ? 'black' : 'azure', display: toggleDisplay }}
            control={
              <IOSSwitch
                onChange={() => { setIsDarkMode(!isDarkMode) }}
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
