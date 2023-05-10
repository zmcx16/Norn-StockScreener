import React, { useState, useRef } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { DataGrid } from '@mui/x-data-grid'
import { isMobile } from 'react-device-detect'

import { convertKMBT } from '../../common/utils'
import { FinvizUrl } from '../../common/common'
import { NMUrl } from '../../common/nm'
import DefaultDataGridTable from '../defaultDataGridTable'
import { ColorPercentField, YahooFinanceUrl } from '../../common/dataGridUtil'

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

  // ResultTableRef API
  ResultTableRef.current = {
    setTable: (data)=>{
      setTableData(renderTable(data))
      containerRef.current.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  const [hideColState, setHideColState] = useState({})

  const renderTable = (data)=>{
    // workaround When the vertical scrollbar appears, the horizontal scrollbar is shown as well
    // root cause: OSX/Xubuntu: 15px (default scrollbarSize value), Windows: 17px
    // https://gitmemory.com/issue/mui-org/material-ui-x/660/737896038
    return <DataGrid rows={data} rowsPerPageOptions={[]} columns={tableHeaderTemplate} scrollbarSize={17} pageSize={20} components={{ NoRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick onColumnVisibilityChange={(param) => {
      let tempHideColState = hideColState
      tempHideColState[param['field']] = !param['isVisible']
      setHideColState(tempHideColState)
    }}/>
  }

  const tableHeaderTemplate = [
    { field: 'symbol', headerName: 'Symbol', width: 130, hide: 'symbol' in hideColState? hideColState['symbol'] : false },
    { field: 'sector', headerName: 'Sector', width: 155, hide: 'sector' in hideColState ? hideColState['sector'] : isMobile },
    { field: 'industry', headerName: 'Industry', width: 255, hide: 'industry' in hideColState ? hideColState['industry'] : isMobile },
    {
      field: 'marketCap',
      headerName: 'Market Cap',
      width: 150,
      type: 'number',
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : convertKMBT(params.value, 2)}</span>
      ),
      hide: 'marketCap' in hideColState ? hideColState['marketCap'] : isMobile
    },
    {
      field: 'PE',
      headerName: 'P/E',
      width: 110,
      type: 'number',
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
      ),
      hide: 'PE' in hideColState ? hideColState['PE'] : false
    },
    {
      field: 'PB',
      headerName: 'P/B',
      width: 110,
      type: 'number',
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
      ),
      hide: 'PB' in hideColState ? hideColState['PB'] : false
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 110,
      type: 'number',
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
      ),
      hide: 'price' in hideColState ? hideColState['price'] : false
    },
    ColorPercentField('change', 'Change', 130, 2, 'change' in hideColState ? hideColState['change'] : false, 700),
    {
      field: 'volume',
      headerName: 'Volume',
      width: 130,
      type: 'number',
      renderCell: (params) => (
        <span>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : convertKMBT(params.value, 2)}</span>
      ),
      hide: 'volume' in hideColState ? hideColState['volume'] : isMobile
    },
    {
      field: 'beneish_score',
      headerName: 'Beneish Model',
      width: 180,
      type: 'number',
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
      hide: 'beneish_score' in hideColState ? hideColState['beneish_score'] : isMobile
    },
    {
      field: 'risk',
      headerName: 'Risk',
      width: 130,
      type: 'number',
      renderCell: (params) => (
        <div className={resultTableStyle.risk}>
          <a href={NMUrl + '?api=get-def-scan&tactics=' + params.row['tactics'] + '&symbol=' + params.row['symbol']} target="_blank" rel="noreferrer noopener">
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
      hide: 'risk' in  hideColState? hideColState['risk'] : false
    },
    { 
      field: 'multiFactor', 
      headerName: 'Mulit-Factor', 
      width: 160, 
      type: 'number',
      renderCell: (params) => (
        <span style={{ fontSize: 18 }}>{(params.value === "NaN" || params.value === "Infinity" || params.value === -Number.MAX_VALUE) ? "NaN" : params.value.toFixed(2)}</span>
      ),
      hide: 'multiFactor' in  hideColState ? hideColState['multiFactor'] : false 
    },
    {
      field: 'links',
      headerName: 'Links',
      width: 130,
      renderCell: (params) => (
        <div className={resultTableStyle.links}>
          <a href={FinvizUrl + 'quote.ashx?t=' + params.row['symbol']} target="_blank" rel="noreferrer noopener">
            <Img className={resultTableStyle.linkIcon} fixed={data.finviz.childImageSharp.fixed} fadeIn={false} />
          </a>
          <a href={YahooFinanceUrl + 'quote/' + params.row['symbol']} target="_blank" rel="noreferrer noopener">
            <Img className={resultTableStyle.linkIcon} fixed={data.yahoo.childImageSharp.fixed} fadeIn={false} />
          </a>
        </div>
      ), 
      hide: 'links' in hideColState? hideColState['links'] : false
    },
  ]

  const [tableData, setTableData] = useState(renderTable([]))
  const containerRef = useRef()

  return (
    <div className={resultTableStyle.container} ref={containerRef} style={{ height: 640, width: '100%' }}>
      {tableData}
    </div>
  )
}

export default ResultTable
