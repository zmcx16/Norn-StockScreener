import React, { useState, useRef } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { DataGrid, GridOverlay } from '@material-ui/data-grid'
import { isMobile } from 'react-device-detect'
import { makeStyles } from '@material-ui/core/styles'

import { convertKMBT } from '../../common/utils'
import { FinvizUrl, YahooFinanceEnUrl, YahooFinanceZhUrl } from '../../common/common'
import { NMUrl } from '../../common/nm'
import DefaultDataGridTable from '../defaultDataGridTable'
import { ColorPercentField } from '../../common/reactUtils'

import resultTableStyle from './resultTable.module.scss'
import '../muiTablePagination.css'

const ResultTable = ({ResultTableRef}) => {

  const data = useStaticQuery(graphql`
    query {
      bomb1: file(relativePath: { eq: "bomb1.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb2: file(relativePath: { eq: "bomb2.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb3: file(relativePath: { eq: "bomb3.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb4: file(relativePath: { eq: "bomb4.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb5: file(relativePath: { eq: "bomb5.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb1_2: file(relativePath: { eq: "bomb1-2.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb2_2: file(relativePath: { eq: "bomb2-2.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb3_2: file(relativePath: { eq: "bomb3-2.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb4_2: file(relativePath: { eq: "bomb4-2.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      bomb5_2: file(relativePath: { eq: "bomb5-2.png" }){
        childImageSharp {
          fixed(width: 42) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }

      finviz: file(relativePath: { eq: "finviz-favicon.png" }){
        childImageSharp {
          fixed(width: 32) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }
      
      yahoo: file(relativePath: { eq: "yahoo-favicon.png" }){
        childImageSharp {
          fixed(width: 32) {
            ...GatsbyImageSharpFixed_noBase64
          }
        }  
      }      
    }
  `)

  const YahooFinanceUrl = (typeof window !== 'undefined' && navigator.language.includes('zh')) ? YahooFinanceZhUrl : YahooFinanceEnUrl

  // ResultTableRef API
  ResultTableRef.current = {
    setTable: (data)=>{
      setTableData(renderTable(data))
      containerRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  const renderTable = (data)=>{
    // workaround When the vertical scrollbar appears, the horizontal scrollbar is shown as well
    // root cause: OSX/Xubuntu: 15px (default scrollbarSize value), Windows: 17px
    // https://gitmemory.com/issue/mui-org/material-ui-x/660/737896038
    return <DataGrid rows={data} columns={tableHeader} scrollbarSize={17} pageSize={20} components={{ noRowsOverlay: DefaultDataGridTable,}} disableSelectionOnClick />
  }

  const tableHeaderTemplate = [
    { field: 'symbol', headerName: 'Symbol', width: 110, mobileShow: true },
    { field: 'sector', headerName: 'Sector', width: 155, mobileShow: false },
    { field: 'industry', headerName: 'Industry', width: 255, mobileShow: false },
    {
      field: 'marketCap',
      headerName: 'Market Cap',
      width: 130,
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : convertKMBT(params.value, 2)}</span>
      ),
      mobileShow: false
    },
    {
      field: 'PE',
      headerName: 'P/E',
      width: 80,
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
      ),
      mobileShow: true
    },
    {
      field: 'PB',
      headerName: 'P/B',
      width: 80,
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
      ),
      mobileShow: true
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 90,
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
      ),
      mobileShow: true
    },
    ColorPercentField('change', 'Change', 110, true, 700),
    {
      field: 'volume',
      headerName: 'Volume',
      width: 110,
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : convertKMBT(params.value, 2)}</span>
      ),
      mobileShow: false
    },
    { field: 'tactics', hide: true, mobileShow: true },
    {
      field: 'beneish_score',
      headerName: 'Beneish Model',
      width: 130,
      renderCell: (params) => (
        <div className={resultTableStyle.risk}>
          <a>
            <Img className={resultTableStyle.bombImg} fixed={
              (isNaN(params.value) || params.value === -Number.MAX_VALUE) ? data.bomb3_2.childImageSharp.fixed :
                params.value < -2.22 ? data.bomb2_2.childImageSharp.fixed :
                  params.value < -1.78 ? data.bomb3_2.childImageSharp.fixed :
                    data.bomb4_2.childImageSharp.fixed
            } fadeIn={false} />
          </a>
          <span style={{ fontSize: 18 }}>({(params.value === "NaN" || params.value === "Infinity" ||  params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)})</span>
        </div>
      ), 
      mobileShow: false
    },
    {
      field: 'risk',
      headerName: 'Risk',
      width: 130,
      renderCell: (params) => (
        <div className={resultTableStyle.risk}>
          <a href={NMUrl + '?api=get-def-scan&tactics=' + params.getValue('tactics') + '&symbol=' + params.getValue('symbol')} target="_blank" rel="noreferrer noopener">
            <Img className={resultTableStyle.bombImg} fixed={
              (isNaN(params.value) || params.value === -Number.MAX_VALUE) ? data.bomb3.childImageSharp.fixed :
                params.value < 100 * (1 / 5.0) ? data.bomb1.childImageSharp.fixed :
                  params.value < 100 * (2 / 5.0) ? data.bomb2.childImageSharp.fixed :
                    params.value < 100 * (3 / 5.0) ? data.bomb3.childImageSharp.fixed :
                      params.value < 100 * (4 / 5.0) ? data.bomb4.childImageSharp.fixed :
                        data.bomb5.childImageSharp.fixed
            } fadeIn={false} />
          </a>
          <span style={{ fontSize: 18 }}>({(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN"  : params.value + "%"})</span>
        </div>
      ), 
      mobileShow: true
    },
    { 
      field: 'multiFactor', 
      headerName: 'Mulit-Factor', 
      width: 130, 
      renderCell: (params) => (
        <span style={{ fontSize: 18 }}>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
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

  const [tableData, setTableData] = useState(renderTable([]))
  const containerRef = useRef()

  return (
    <div className={resultTableStyle.container} ref={containerRef}>
      {tableData}
    </div>
  )
}

export default ResultTable
