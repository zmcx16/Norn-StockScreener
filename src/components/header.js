import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

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

  return (
    <div className={headerStyle.container}>
      <div className={headerStyle.kanbanBlock}>
        <Img fixed={imageData.images.childImageSharp.fixed} fadeIn={false} className={headerStyle.kanbanimg}/>
        <div></div>
        <div className={headerStyle.kanbanTextBlock}>
          <Tooltip arrow classes={{ tooltip: tooltipStyle.noMaxWidth }} title={<span style={{ whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center' }}>{kanbanNote}</span>} >
            <Typography style={{ fontSize: '21px' }} className={commonStyle.comicFont}>Norn-StockScreener</Typography>
          </Tooltip>
          <Typography>{kanbanText}</Typography>
        </div>
        <FormControlLabel
          className={headerStyle.darkmodetoggle} style={{ background: isDarkMode ? 'black' : 'azure' }}
          control={
            <IOSSwitch
              onChange={() => { setIsDarkMode(!isDarkMode) }}
              checked={isDarkMode}
            />
          }
          labelPlacement='start'
          label={<>
            <span style={{ fontSize: '28px', color: isDarkMode ? 'darkgray' : 'gold' }}>☀</span>
            <span style={{ fontSize: '24px' }}>&nbsp;/&nbsp;</span>
            <span style={{ fontSize: '28px', color: isDarkMode ? 'gold' : 'darkgray' }}>☽</span>
          </>}
        />
      </div>
    </div>
  )
}

export default Header
