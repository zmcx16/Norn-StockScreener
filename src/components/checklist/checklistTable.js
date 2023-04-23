import React, { useState, useEffect, useRef, useMemo } from 'react'
import MaterialReactTable from 'material-react-table'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import DeleteIcon from '@mui/icons-material/Delete'
import { ThemeProvider } from '@mui/styles'
import Button from '@mui/material/Button'
import { createTheme } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'

import { FinvizUrl } from '../../common/common'
import { ChecklistKey_Def } from '../../common/checklistDef'
import { EPSGrowthTagsDict } from '../../common/tagsDef'

import commonStyle from '../common.module.scss'
import checklistgTableStyle from './checklistTable.module.scss'


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
  

const ChecklistTable = ({ChecklistTableRef, modalWindowRef}) => {

    const checklistConfig = ChecklistTableRef.current.getChecklistConfigRef()
    const stockData = ChecklistTableRef.current.getStockDataRef()
  
    const columns = useMemo(()=>[
      {
        accessorKey: "symbol",
        header: ChecklistKey_Def["symbol"].name,
        enableColumnOrdering: false,
        Cell: ({ cell }) => (
          <Link href={ FinvizUrl + 'quote.ashx?t=' + cell.getValue()} target="_blank" rel="noreferrer noopener">
            <span>{cell.getValue()}</span>
          </Link>
        ),
      }
    ].concat(checklistConfig["list"].map((item) => {
      if (ChecklistKey_Def[item.name].type === "from_end") {
        return {
          accessorKey: item.name,
          header: ChecklistKey_Def[item.name].name,
          Header: ({ column }) => (
            <Tooltip arrow title={
              <span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center' }}>
                {`From: "${item.condition["from"]}" | End: "${item.condition["end"]}"`}
              </span>} >
              <div> {column.columnDef.header}</div>
            </Tooltip>
          ),
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
      } else if (ChecklistKey_Def[item.name].type === "tags") {
        return {
          accessorKey: item.name,
          header: ChecklistKey_Def[item.name].name,
          Header: ({ column }) => (
            <Tooltip arrow title={
              <span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center' }}>
                {"Full Match: " + prettyTags(item.condition["match_all"])}
              </span>} >
              <div> {column.columnDef.header}</div>
            </Tooltip>
          ),
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
  
    const genTableData = (symbols) => {
      return symbols.map((symbol) => {
        let data = {"symbol": symbol}
        if (symbol in stockData) {
          checklistConfig["list"].forEach((item) => {
            if (item.name in stockData[symbol]) {
              data[item.name] = stockData[symbol][item.name]
            } else { 
              data[item.name] = "-"
            }
          })
        } else {
          checklistConfig["list"].forEach((item) => {
            data[item.name] = "-"
          })
        }
        return data
      })
    }
    const [tableData, setTableData] = useState(genTableData(checklistConfig["symbols"]))
    const [enableRowSelection, setEnableRowSelection] = useState(true)
    const [rowSelection, setRowSelection] = useState({})
    const tableRef = useRef(null)
    const searchStockRef = useRef(null)
  
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
      checklistConfig["symbols"] = newTableData.map((data) => data["symbol"])
      console.log(checklistConfig["symbols"])
      setTableData([...newTableData])
    }
  
    return (
      <div className={commonStyle.defaultFont + ' ' + checklistgTableStyle.tableContainer}>
        <ThemeProvider theme={customTheme}>
          <div className={checklistgTableStyle.tableCmdPanel}>
            <Paper
              component="form"
              sx={{ p: '6 16', display: 'flex', alignItems: 'center' }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder='AAPL, BAC, KSS, ...'
                inputProps={{ 'aria-label': 'search-us-stocks' }}
                inputRef={searchStockRef}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => {
                const symbols = searchStockRef.current.value.split(',').map((symbol) => symbol.trim())
                symbols.forEach((symbol) => {
                  if (symbol === '') {
                    return
                  }
                  if (checklistConfig["symbols"].includes(symbol)) {
                    modalWindowRef.current.popModalWindow(<div>{symbol} is already in the list</div>)
                    return
                  } else if (!(symbol in stockData)){
                    modalWindowRef.current.popModalWindow(<div>{symbol} is not found</div>)
                    return
                  }
                  checklistConfig["symbols"].push(symbol)
                  updateTableData(genTableData(checklistConfig["symbols"]) )
                  searchStockRef.current.value = ""
                })
              }}>
                <SearchIcon />
              </IconButton>
            </Paper>
            <Button className={checklistgTableStyle.tableCmdBtn} size="large" variant="contained" style={customTheme.palette.order} startIcon={<SwapVertIcon />} onClick={() => {
              setEnableRowSelection(!enableRowSelection)
              setRowSelection({})
            }}>{enableRowSelection ? 'Reorder' : 'Reordering'}</Button>
            <Button className={checklistgTableStyle.tableCmdBtn} size="large" variant="contained" style={{...customTheme.palette.delete, ...{display: Object.keys(rowSelection).length === 0 ? 'none': 'inline-flex'}}} startIcon={<DeleteIcon />} onClick={() => {
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
          state={{ rowSelection }}
          getRowId={(row) => row.symbol}
          onRowSelectionChange={setRowSelection}
          enableRowSelection={enableRowSelection}
          enableRowDragging={!enableRowSelection}
          enableRowOrdering
          enableColumnOrdering={!enableRowSelection}
          columnOrder={columnOrder}
          onColumnOrderChange={(order)=>{
            let tmp = []
            let orderTmp = order.filter(e => Object.keys(ChecklistKey_Def).includes(e))
            console.log(orderTmp)
            orderTmp.forEach((key) => {
              checklistConfig["list"].some((item, index) => {
                if (item["name"] === key) {
                  tmp.push(item)
                  checklistConfig["list"].splice(index, 1)
                  return true
                }
                return false
              })
            })
            checklistConfig["list"] = tmp
            console.log(checklistConfig["list"])
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

export default ChecklistTable
