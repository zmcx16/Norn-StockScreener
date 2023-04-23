import React, { useState, useEffect, useRef, useMemo } from 'react'

import useFetch from 'use-http'
import MaterialReactTable from 'material-react-table'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import DeleteIcon from '@mui/icons-material/Delete'
import { ThemeProvider } from '@mui/styles'
import Button from '@mui/material/Button'
import { createTheme } from '@mui/material/styles'

import { FinvizUrl } from '../../common/common'
import { GetDataByFetchObj, YahooFinanceUrl } from '../../common/reactUtils'
import ModalWindow from '../modalWindow'
import { CheckListKey_Def } from '../../common/checkListDef'
import { EPSGrowthTagsDict } from '../../common/tagsDef'

import commonStyle from '../common.module.scss'
import checklistgStyle from './checklist.module.scss'

function CombineData(stock_info, eps_analysis, eps_financials) {
  let data = stock_info
  eps_analysis.forEach(element => {
    let symbol = element["symbol"]
    if (symbol in data) {
      data[symbol]["eps_analysis"] = element["tags"]
    } else {
      data[symbol] = {"eps_analysis": element["tags"]}
    }
  })
  eps_financials.forEach(element => {
    let symbol = element["symbol"]
    if (symbol in data) {
      data[symbol]["eps_financials"] = element["tags"]
    } else {
      data[symbol] = {"eps_financials": element["tags"]}
    }
  })
  return data
}

function checkFromEnd(val, condition) {
  let arg_from = condition["from"]
  let arg_end = condition["end"]
  if (arg_from != "" || arg_end != "")
  {
      let from = arg_from == "" ? 0 : arg_from
      let end = arg_end == "" ? 0 : arg_end
      if (arg_end != "" && val > end)
      {
          return false
      }
      else if (arg_from != "" && val < from)
      {
          return false
      }
  }
  return true
}

function checkTags(val, condition) {
  let match_all = true
  condition["match_all"].every((item) => {
    let match_tag = false
    val.some((v) => {
      if (v == item) {
        match_tag = true
        return true
      }
      return false
    })
    if (!match_tag) {
      match_all = false
      return false
    }
    return true
  })

  if (match_all) {
    return true
  }   
  return false
}

function prettyTags(val) {
  let pretty_tags = []
  val.forEach((tag) => {
    pretty_tags.push(EPSGrowthTagsDict[tag])
  })
  return pretty_tags.join(",\n")
}

const CheckListTable = ({CheckListTableRef}) => {

  const checkListConfig = CheckListTableRef.current.getCheckListConfigRef()
  const stockData = CheckListTableRef.current.getStockDataRef()

  const columns = useMemo(()=>[
    {
      accessorKey: "symbol",
      header: CheckListKey_Def["symbol"].name,
      enableColumnOrdering: false,
      Cell: ({ cell }) => (
        <Link href={ FinvizUrl + 'quote.ashx?t=' + cell.getValue()} target="_blank" rel="noreferrer noopener">
          <span>{cell.getValue()}</span>
        </Link>
      ),
    }
  ].concat(checkListConfig["list"].map((item) => {
    if (CheckListKey_Def[item.name].type === "from_end") {
      return {
        accessorKey: item.name,
        header: CheckListKey_Def[item.name].name,
        Cell: ({ cell }) => (
          (
            cell.getValue() === "-" || cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE || cell.getValue() === null || cell.getValue() === undefined || cell.getValue() === "Infinity" || cell.getValue() === 'NaN' ?
              <span>-</span> :
              <span style={{fontWeight: 700, color: checkFromEnd(cell.getValue(), item.condition) ? 'green' : 'red' }}>
                {checkFromEnd(cell.getValue(), item.condition) ? '✔' : '✘'}
                {" (" + cell.getValue().toFixed(2) + ")"}
              </span>
          )
        ),
      }
    } else if (CheckListKey_Def[item.name].type === "tags") {
      return {
        accessorKey: item.name,
        header: CheckListKey_Def[item.name].name,
        Cell: ({ cell }) => (
          (
            cell.getValue() === null || cell.getValue() === undefined || cell.getValue() === "-" ?
              <span>-</span> :
              <span style={{fontWeight: 700, display: 'flex', color: checkTags(cell.getValue(), item.condition) ? 'green' : 'red' }}>
                <Tooltip arrow title={
                  <span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center' }}>
                    {cell.getValue().length === 0 ? 'None' : prettyTags(cell.getValue())}
                  </span>} >
                  <div> {checkTags(cell.getValue(), item.condition) ? '✔' : '✘'}</div>
                </Tooltip>
              </span>
          )
        ),
      }
    }
  })), [])

  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.accessorKey))

  const [tableData, setTableData] = useState(checkListConfig["symbols"].map((symbol) => {
    let data = {"symbol": symbol}
    if (symbol in stockData) {
      checkListConfig["list"].forEach((item) => {
        if (item.name in stockData[symbol]) {
          data[item.name] = stockData[symbol][item.name]
        } else { 
          data[item.name] = "-"
        }
      })
    } else {
      checkListConfig["list"].forEach((item) => {
        data[item.name] = "-"
      })
    }
    return data
  }))

  const [enableRowSelection, setEnableRowSelection] = useState(true)
  const [rowSelection, setRowSelection] = useState({})
  const tableRef = useRef(null)

  useEffect(() => {
    const columnVisibility = tableRef.current.getState().columnVisibility;
    if (enableRowSelection) {
      tableRef.current.setColumnVisibility({...columnVisibility, 'mrt-row-select': true, 'mrt-row-actions': true, 'mrt-row-drag': false})
    } else {
      tableRef.current.setColumnVisibility({...columnVisibility, 'mrt-row-select': false, 'mrt-row-actions': true, 'mrt-row-drag': true})
    }
  }, [enableRowSelection])

  const customTheme = createTheme({
    palette: {
      order: { 
        backgroundColor: '#2196f3', color: '#fff'
      },
      delete: { 
        backgroundColor: '#e53935', color: '#fff'
      }
    },
  })

  const updateTableData = (newTableData) => {
    console.log(newTableData)
    checkListConfig["symbols"] = newTableData.map((data) => data["symbol"])
    console.log(checkListConfig["symbols"])
    setTableData([...newTableData])
  }

  return (
    <div className={commonStyle.defaultFont + ' ' + checklistgStyle.tableContainer}>
      <ThemeProvider theme={customTheme}>
        <div className={checklistgStyle.tableCmdPanel}>
          <Button className={checklistgStyle.tableCmdBtn} variant="contained" style={customTheme.palette.order} startIcon={<SwapVertIcon />} onClick={() => {
            setEnableRowSelection(!enableRowSelection)
            setRowSelection({})
          }}>{enableRowSelection ? 'Reorder' : 'Reordering'}</Button>
          <Button className={checklistgStyle.tableCmdBtn} variant="contained" style={{...customTheme.palette.delete, ...{display: Object.keys(rowSelection).length === 0 ? 'none': 'inline-flex'}}} startIcon={<DeleteIcon />} onClick={() => {
            let tmp = tableData
            Object.keys(rowSelection).forEach((symbol) => {
              tmp = tmp.filter((data) => data["symbol"] !== symbol)
            })
            updateTableData(tmp)
          }}>{'Delete'}</Button>
        </div>
      </ThemeProvider>
      <MaterialReactTable
        tableInstanceRef={tableRef}
        autoResetPageIndex={false}
        columns={columns}
        data={tableData}
        enableRowSelection={enableRowSelection}
        state={{ rowSelection }}
        getRowId={(row) => row.symbol}
        onRowSelectionChange={setRowSelection}
        enableRowOrdering
        enableRowDragging={!enableRowSelection}
        enableColumnOrdering={!enableRowSelection}
        columnOrder={columnOrder}
        onColumnOrderChange={(order)=>{
          let tmp = []
          let orderTmp = order.filter(e => Object.keys(CheckListKey_Def).includes(e))
          console.log(orderTmp)
          orderTmp.forEach((key) => {
            checkListConfig["list"].some((item, index) => {
              if (item["name"] === key) {
                tmp.push(item)
                checkListConfig["list"].splice(index, 1)
                return true
              }
              return false
            })
          })
          checkListConfig["list"] = tmp
          console.log(checkListConfig["list"])
          setColumnOrder([...order])
        }}
        enableSorting={false}
        enableFilters={false}
        muiTableBodyRowDragHandleProps={({ table }) => ({
          onDragEnd: () => {
            const { draggingRow, hoveredRow } = table.getState();
            if (hoveredRow && draggingRow) {
              tableData.splice(
                hoveredRow.index,
                0,
                tableData.splice(draggingRow.index, 1)[0],
              );
              updateTableData(tableData)
            }
          },
        })}
      />
    </div>
  )
}

const Checklist = ({loadingAnimeRef}) => {

  const stockDataRef = useRef({})
  const checkListConfigRef = useRef({
    "symbols": ["C", "WFC", "BAC", "AA", "CAAP", "ADUS"],
    "list": [
      { 
        "name": "P/E", 
        "condition": {"from": "", "end": "10"}
      },
      { 
        "name": "eps_financials", 
        "condition": {"match_all": ["all_positive"]}
      },
      { 
        "name": "eps_analysis", 
        "condition": {"match_all": ["all_positive"]}
      }
    ]})

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null
  })
  
  const CheckListTableRef = useRef({
    getStockDataRef: ()=>{ return stockDataRef.current },
    getCheckListConfigRef: ()=>{ return checkListConfigRef.current }
  })

  const fetchStockInfoData = useFetch({ cachePolicy: 'no-cache' })
  const fetchEPSAnalysisData = useFetch({ cachePolicy: 'no-cache' })
  const fetchEPSFinancialsData = useFetch({ cachePolicy: 'no-cache' })

  const fetchData = () => {
    loadingAnimeRef.current.setLoading(true)
    let fetch_data = [
      GetDataByFetchObj('/norn-data/stock/stat.json', fetchStockInfoData),
      GetDataByFetchObj('/norn-data/ranking/eps_analysis.json', fetchEPSAnalysisData),
      GetDataByFetchObj('/norn-data/ranking/eps_financials.json', fetchEPSFinancialsData)
    ]

    Promise.all(fetch_data).then((allResponses) => {
      console.log(allResponses)
      if (allResponses.length === fetch_data.length) {
        stockDataRef.current = CombineData(allResponses[0], allResponses[1]["data"], allResponses[2]["data"])
        console.log(stockDataRef.current)
        setResultTable(<CheckListTable CheckListTableRef={CheckListTableRef} />)
      } else {
        console.error("fetchData some data failed")
        modalWindowRef.current.popModalWindow(<div>Get some data failed...</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch(() => {
      console.error("fetchData failed")
      modalWindowRef.current.popModalWindow(<div>Get data failed...</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  const [resultTable, setResultTable] = useState(<></>)

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!

    fetchData()
    return () => {
      // componentWillUnmount is here!
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={commonStyle.defaultFont + ' ' + checklistgStyle.container}>
      {resultTable}
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default Checklist
