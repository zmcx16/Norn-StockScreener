import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import { DataGrid } from '@material-ui/data-grid'
import { isMobile } from 'react-device-detect'

import { StockSectorDict, StockIndustryDict, FinvizUrl, YahooFinanceEnUrl, YahooFinanceZhUrl, NMUrl } from '../common/common'

import resultTableStyle from './resultTable.module.scss'

const ResultTable = () => {

  const data = useStaticQuery(graphql`
    query {
      bomb1: file(relativePath: { eq: "bomb1.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed
          }
        }  
      }

      bomb2: file(relativePath: { eq: "bomb2.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed
          }
        }  
      }

      bomb3: file(relativePath: { eq: "bomb3.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed
          }
        }  
      }

      bomb4: file(relativePath: { eq: "bomb4.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed
          }
        }  
      }

      bomb5: file(relativePath: { eq: "bomb5.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed
          }
        }  
      }

      finviz: file(relativePath: { eq: "finviz-favicon.png" }){
        childImageSharp {
          fixed(width: 32) {
            ...GatsbyImageSharpFixed
          }
        }  
      }
      
      yahoo: file(relativePath: { eq: "yahoo-favicon.png" }){
        childImageSharp {
          fixed(width: 32) {
            ...GatsbyImageSharpFixed
          }
        }  
      }      
    }
  `)

  const YahooFinanceUrl = (typeof window !== 'undefined' && navigator.language.includes('zh')) ? YahooFinanceZhUrl : YahooFinanceEnUrl

  const tableHeaderTemplate = [
    { field: 'symbol', headerName: 'Symbol', width: 110, mobileShow: true },
    { field: 'sector', headerName: 'Sector', width: 155, mobileShow: false },
    { field: 'industry', headerName: 'Industry', width: 255, mobileShow: false },
    { field: 'marketCap', headerName: 'Market Cap', width: 130, mobileShow: false },
    { field: 'PE', headerName: 'P/E', width: 80, mobileShow: true },
    { field: 'PB', headerName: 'P/B', width: 80, mobileShow: true },
    { field: 'price', headerName: '	Price', width: 90, mobileShow: true },
    { field: 'change', headerName: 'Change', width: 110, mobileShow: true },
    { field: 'volume', headerName: 'Volume', width: 110, mobileShow: true },
    { field: 'tactics', hide: true, mobileShow: true },
    {
      field: 'risk',
      headerName: 'Risk',
      width: 130,
      renderCell: (params) => (
        <div className={resultTableStyle.risk}>
          <a href={NMUrl + '?api=get-def-scan&tactics=' + params.getValue('tactics') + '&symbol=' + params.getValue('symbol')} target="_blank" rel="noreferrer noopener">
            <Img className={resultTableStyle.bombImg} fixed={
              isNaN(params.value) ? data.bomb3.childImageSharp.fixed :
                params.value < 100 * (1 / 5.0) ? data.bomb1.childImageSharp.fixed :
                  params.value < 100 * (2 / 5.0) ? data.bomb2.childImageSharp.fixed :
                    params.value < 100 * (3 / 5.0) ? data.bomb3.childImageSharp.fixed :
                      params.value < 100 * (4 / 5.0) ? data.bomb4.childImageSharp.fixed :
                        data.bomb5.childImageSharp.fixed
            } fadeIn={false} />
          </a>
          <span style={{ fontSize: 18 }}>({params.value}%)</span>
        </div>
      ), 
      mobileShow: true
    },
    {
      field: 'links',
      headerName: 'Links',
      width: 130,
      renderCell: (params) => (
        <div className={resultTableStyle.links}>
          <a href={FinvizUrl + 'quote.ashx?t=' + params.getValue('symbol')} target="_blank" rel="noreferrer noopener">
            <Img className={resultTableStyle.linkIcon} fixed={data.finviz.childImageSharp.fixed} fadeIn={false} />
          </a>
          <a href={YahooFinanceUrl + 'quote/' + params.getValue('symbol')} target="_blank" rel="noreferrer noopener">
            <Img className={resultTableStyle.linkIcon} fixed={data.yahoo.childImageSharp.fixed} fadeIn={false} />
          </a>
        </div>
      ), 
      mobileShow: true
    },
  ]

  const tableHeader = tableHeaderTemplate.reduce((accumulator, currentValue) => {
    if (!isMobile || currentValue.mobileShow){
      accumulator.push(currentValue)
    }
    return accumulator
  }, [])

  const tableData = [
    { id: 1, symbol: 'KBAL', sector: StockSectorDict[0], industry: StockIndustryDict[0], marketCap: '419.72M', PE: 12.01, PB: 1.59, price: 11.69, change: '2.11%', volume: '179,751', risk: 33, tactics: 'BenjaminGraham_v1,HarryBurnIII_v1' }
  ]

  return (
    <div className={resultTableStyle.container}>
      <DataGrid rows={tableData} columns={tableHeader} pageSize={20} disableSelectionOnClick/>
    </div>
  )
}

export default ResultTable
