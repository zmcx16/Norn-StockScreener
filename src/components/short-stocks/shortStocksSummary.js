import React, { useState, useRef, useEffect, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp'
import Link from '@mui/material/Link'
import useFetch from 'use-http'
import moment from 'moment'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import { FinvizUrl } from '../../common/common'
import { SymbolNameField, PureFieldWithValueCheck, PercentField, ColorPercentField } from '../../common/reactUtils'

import shortStocksSummaryStyle from './shortStocksSummary.module.scss'
import '../muiTablePagination.css'

const ShortStocksSummary = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const columns = useMemo(() => [
    {
      accessorKey: "symbol",
      header: "Symbol",
      size: 100,
      enableColumnOrdering: false,
      Cell: ({ cell }) => (
        <Link href={ FinvizUrl + 'quote.ashx?t=' + cell.getValue()} target="_blank" rel="noreferrer noopener">
          <span>{cell.getValue()}</span>
        </Link>
      ),
    },
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
    setRowData([
      {
        symbol: 'AAPL',
      }
    ])
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
          enableGlobalFilterModes
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
