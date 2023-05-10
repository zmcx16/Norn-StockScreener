import React, { useState, useRef, useEffect, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import Link from '@mui/material/Link'
import useFetch from 'use-http'
import moment from 'moment'

import ModalWindow from '../modalWindow'
import { FinvizUrl } from '../../common/common'
import { YahooFinanceUrl, NoMaxWidthTooltip } from '../../common/reactUtils'
import {SymbolNameField, PriceField, PercentField, ColorGreenRedPercentField, PureFieldWithValueCheck } from '../../common/reactMaterialTableUtil'

import shortStocksSummaryStyle from './shortStocksSummary.module.scss'
import '../muiTablePagination.css'

const ShortStocksSummary = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const columns = useMemo(() => [
    SymbolNameField('symbol', 'Symbol', 100),
    PriceField('close', 'Price', 90),
    {
      accessorKey: 'shortFloat',
      header: 'Short Float',
      size: 110,
      enableColumnOrdering: false,
      Header: ({column}) => (
        <Typography>{column.columnDef.header}</Typography>
      ),
      Cell: ({ cell, row }) => (
        cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE || cell.getValue()  === "-" || cell.getValue()  === null || cell.getValue()  === undefined || cell.getValue()  === "Infinity" || cell.getValue()  === 'NaN' ? <span>-</span> :
        <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{
          (row.original.shortInterest) + " / " + (row.original.shsFloat)
        }</span>} >
          <span>{(cell.getValue() * 100).toFixed(2) + "%"}</span>
        </NoMaxWidthTooltip>
      ),
    },
    {
      accessorKey: 'shortRatio',
      header: 'Short Ratio',
      size: 110,
      enableColumnOrdering: false,
      Header: ({column}) => (
        <Typography>{column.columnDef.header}</Typography>
      ),
      Cell: ({ cell, row }) => (
        cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE || cell.getValue()  === "-" || cell.getValue()  === null || cell.getValue()  === undefined || cell.getValue()  === "Infinity" || cell.getValue()  === 'NaN' ? <span>-</span> :
        <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{
          (row.original.shortInterest) + " / " + (row.original.shsFloat)
        }</span>} >
          <span>{cell.getValue().toFixed(2)}</span>
        </NoMaxWidthTooltip>
      ),
    },
    ColorGreenRedPercentField('SF0_5m', 'SF-15d', 110, -1, 2, "Short Float Latest 15 Days Changed (%)"),
    ColorGreenRedPercentField('SF1m', 'SF-30d', 110, -1, 2, "Short Float Latest 30 Days Changed (%)"),
    ColorGreenRedPercentField('SF1_5m', 'SF-45d', 110, -1, 2, "Short Float Latest 45 Days Changed (%)"),
    ColorGreenRedPercentField('SF0_5y', 'SF-6mo', 110, -1, 2, "Short Float Latest 6 Months Changed (%)"),
    ColorGreenRedPercentField('SF1y', 'SF-1yr', 110, -1, 2, "Short Float Latest 1 Years Changed (%)"),
    ColorGreenRedPercentField('SR0_5m', 'SR-15d', 110, -1, 2, "Short Ratio Latest 15 Days Changed (%)"),
    ColorGreenRedPercentField('SR1m', 'SR-30d', 110, -1, 2, "Short Ratio Latest 30 Days Changed (%)"),
    ColorGreenRedPercentField('SR1_5m', 'SR-45d', 110, -1, 2, "Short Ratio Latest 45 Days Changed (%)"),
    ColorGreenRedPercentField('SR0_5y', 'SR-6mo', 110, -1, 2, "Short Ratio Latest 6 Months Changed (%)"),
    ColorGreenRedPercentField('SR1y', 'SR-1yr', 110, -1, 2, "Short Ratio Latest 1 Years Changed (%)"),
    PureFieldWithValueCheck('PE', 'P/E', 110, 2),
    PureFieldWithValueCheck('PB', 'P/B', 110, 2),
    PercentField('dividend', 'Dividend %', 110, 2),
    PercentField('high52', '52W High', 110, 2),
    PercentField('low52', '52W Low', 110, 2),
    ColorGreenRedPercentField('perfWeek', 'Perf Week', 110, 1, 2),
    ColorGreenRedPercentField('perfMonth', 'Perf Month', 110, 1, 2),
    ColorGreenRedPercentField('perfQuarter', 'Perf Quarter', 110, 1, 2),
    ColorGreenRedPercentField('perfHalfY', 'Perf Half Y', 110, 1, 2),
    ColorGreenRedPercentField('perfYear', 'Perf Year', 110, 1, 2),
    ColorGreenRedPercentField('perfYTD', 'Perf YTD', 110, 1, 2),
  ], [])

  //optionally access the underlying virtualizer instance
  const rowVirtualizerInstanceRef = useRef(null)
  const [rowData, setRowData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sorting, setSorting] = useState([])

  const getData = async (url, fetchObj) => {
    const resp_data = await fetchObj.get(url)
    if (fetchObj.response.ok && resp_data) {
      return resp_data
    }
    else {
      return null
    }
  }

  const fetchStockData = useFetch({ cachePolicy: 'no-cache' })
  const fetchShortData = useFetch({ cachePolicy: 'no-cache' })
  const renderShortStocksTable = ()=>{
    Promise.all([
      getData("/norn-data/stock/stat.json", fetchStockData),
      getData('/norn-data/stock-short/stat.json', fetchShortData),
    ]).then((allResponses) => {
      // console.log(allResponses)
      if (allResponses.length === 2 && allResponses[0] !== null && allResponses[1] !== null) {      
        let output = Object.keys(allResponses[1]["data"]).map((symbol) => {
          let stockInfo = allResponses[0][symbol]
          let value = allResponses[1]["data"][symbol]
          let o = {
            symbol: symbol,
            close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
            shsFloat: value['Shs Float'] !== '-' ? value['Shs Float'] : -Number.MAX_VALUE,
            shortInterest: value['Short Interest'] !== '-' ? value['Short Interest'] : -Number.MAX_VALUE,
            shortFloat: value['Short Float'] !== '-' ? value['Short Float'] : -Number.MAX_VALUE,
            shortRatio: value['Short Ratio'] !== '-' ? value['Short Ratio'] : -Number.MAX_VALUE,
            SF0_5m: value['SF-0.5m'] !== '-' ? value['SF-0.5m'] : -Number.MAX_VALUE,
            SF1m: value['SF-1m'] !== '-' ? value['SF-1m'] : -Number.MAX_VALUE,
            SF1_5m: value['SF-1.5m'] !== '-' ? value['SF-1.5m'] : -Number.MAX_VALUE,
            SF0_5y: value['SF-0.5y'] !== '-' ? value['SF-0.5y'] : -Number.MAX_VALUE,
            SF1y: value['SF-1y'] !== '-' ? value['SF-1y'] : -Number.MAX_VALUE,
            SR0_5m: value['SR-0.5m'] !== '-' ? value['SR-0.5m'] : -Number.MAX_VALUE,
            SR1m: value['SR-1m'] !== '-' ? value['SR-1m'] : -Number.MAX_VALUE,
            SR1_5m: value['SR-1.5m'] !== '-' ? value['SR-1.5m'] : -Number.MAX_VALUE,
            SR0_5y: value['SR-0.5y'] !== '-' ? value['SR-0.5y'] : -Number.MAX_VALUE,
            SR1y: value['SR-1y'] !== '-' ? value['SR-1y'] : -Number.MAX_VALUE,
            PE: stockInfo !== undefined && stockInfo !== null && stockInfo['P/E'] !== '-' ? stockInfo['P/E'] : Number.MAX_VALUE,
            PB: stockInfo !== undefined && stockInfo !== null && stockInfo['P/B'] !== '-' ? stockInfo['P/B'] : Number.MAX_VALUE,
            dividend: stockInfo !== undefined && stockInfo !== null && stockInfo['Dividend %'] !== '-' ? stockInfo['Dividend %'] : -Number.MAX_VALUE,
            high52: stockInfo !== undefined && stockInfo !== null && stockInfo['52W High'] !== '-' ? stockInfo['52W High'] : -Number.MAX_VALUE,
            low52: stockInfo !== undefined && stockInfo !== null && stockInfo['52W Low'] !== '-' ? stockInfo['52W Low'] : -Number.MAX_VALUE,
            perfWeek: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Week'] !== '-' ? stockInfo['Perf Week'] : -Number.MAX_VALUE,
            perfMonth: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Month'] !== '-' ? stockInfo['Perf Month'] : -Number.MAX_VALUE,
            perfQuarter: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Quarter'] !== '-' ? stockInfo['Perf Quarter'] : -Number.MAX_VALUE,
            perfHalfY: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Half Y'] !== '-' ? stockInfo['Perf Half Y'] : -Number.MAX_VALUE,
            perfYear: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf Year'] !== '-' ? stockInfo['Perf Year'] : -Number.MAX_VALUE,
            perfYTD: stockInfo !== undefined && stockInfo !== null && stockInfo['Perf YTD'] !== '-' ? stockInfo['Perf YTD'] : -Number.MAX_VALUE,
          }
          return o
        })
        console.log(output)
        setRowData(output.slice(10))
      } else {
        modalWindowRef.current.popModalWindow(<div>Load some data failed</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch(() => {
      modalWindowRef.current.popModalWindow(<div>Can't get data</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    if (typeof window !== 'undefined') {
      renderShortStocksTable()
      setIsLoading(false)
    }
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      if (rowVirtualizerInstanceRef.current?.scrollToIndex) {
        rowVirtualizerInstanceRef.current.scrollToIndex(0)
      }
    } catch (error) {
      console.error(error)
    }
  }, [sorting])

  return (
    <>
      <div className={shortStocksSummaryStyle.container}>
        <MaterialReactTable
          columns={columns}
          data={rowData} 
          enableBottomToolbar={false}
          enableColumnResizing
          enableColumnVirtualization
          enableGlobalFilter={false}
          enablePagination={false}
          enablePinning
          enableRowNumbers
          enableRowVirtualization
          muiTableContainerProps={{ sx: { maxHeight: '600px' } }}
          onSortingChange={setSorting}
          state={{ isLoading, sorting }}
          rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //optional
          rowVirtualizerProps={{ overscan: 5 }} //optionally customize the row virtualizer
          columnVirtualizerProps={{ overscan: 2 }} //optionally customize the column virtualizer
          renderTopToolbarCustomActions={() => 
          <Typography style={{top: 5, position: 'relative'}} variant="subtitle1">Short Data Source: 
            <Link href={"https://www.finra.org/finra-data/browse-catalog/equity-short-interest/data"} target="_blank" rel="noreferrer noopener">
              <span style={{paddingLeft: 10}}>FINRA Equity Short Interest Data</span>
            </Link>
          </Typography>}
        />
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default ShortStocksSummary
