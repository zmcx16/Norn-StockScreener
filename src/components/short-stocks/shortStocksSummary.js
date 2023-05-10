import React, { useState, useRef, useEffect, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import Link from '@mui/material/Link'
import useFetch from 'use-http'
import moment from 'moment'

import ModalWindow from '../modalWindow'
import { FinvizUrl } from '../../common/common'
import { YahooFinanceUrl } from '../../common/reactUtils'
import {SymbolNameField, PriceField } from '../../common/reactMaterialTableUtil'

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
            shortFloat: value['Short Float'] !== '-' ? value['Short Float'] : -Number.MAX_VALUE,
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
        setRowData(output)
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
        />
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default ShortStocksSummary
