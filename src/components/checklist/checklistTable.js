import React, { useState, useEffect, useRef } from 'react'
import MaterialReactTable from 'material-react-table'
import Link from '@mui/material/Link'
import Tooltip from '@mui/material/Tooltip'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import shortid from 'shortid'

import { FinvizUrl } from '../../common/common'
import { ChecklistKey_Def } from '../../common/checklistDef'
import { EPSGrowthTagsDict } from '../../common/tagsDef'
import { convertKMBT } from '../../common/utils'
import { RemoveInvalidWordingForMaterialReactTable, YahooFinanceUrl } from '../../common/reactUtils'

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

function displayCell(val, display_format) {
  if (display_format == "%") {
    return (val * 100).toFixed(2) + "%"
  } else if (display_format == "KMBT") {
    return convertKMBT(val, 2)
  }
  return val.toFixed(2)
}

const ChecklistTable = ({ChecklistRef, modalWindowRef}) => {
  const bomb = useStaticQuery(graphql`
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
    }
  `)

  const checklistConfig = ChecklistRef.current.getChecklistConfigRef()
  const stockData = ChecklistRef.current.getStockDataRef()
  ChecklistRef.current.searchStockOnClick = () => {
    const symbols = ChecklistRef.current.getSearchStockRef().value.split(',').map((symbol) => symbol.trim().toUpperCase())
    let msgList = []
    symbols.forEach((symbol) => {
        if (symbol === '') {
          msgList.push(<div key={shortid.generate()}>Please enter at least one stock symbol</div>)
          return
        }
        if (checklistConfig["symbols"].includes(symbol)) {
          msgList.push(<div key={shortid.generate()}>{symbol} is already in the list</div>)
          return
        } else if (!(symbol in stockData)){
          msgList.push(<div key={shortid.generate()}>{symbol} is not found</div>)
          return
        }
        checklistConfig["symbols"].push(symbol)
        updateTableData(genTableData(checklistConfig["symbols"]) )
        ChecklistRef.current.getSearchStockRef().value = ""
    })
    if (msgList.length > 0)
      modalWindowRef.current.popModalWindow(<div>{msgList}</div>)
  }
  ChecklistRef.current.reorderOnClick = (newReordering, setReordering) => {
    setEnableRowSelection(!newReordering)
    setReordering(newReordering)
    setRowSelection({})
  }
  ChecklistRef.current.deleteOnClick = () => {
    let tmp = tableData
    Object.keys(rowSelection).forEach((symbol) => {
      tmp = tmp.filter((data) => data["symbol"] !== symbol)
    })
    updateTableData(tmp)
    setRowSelection({})
  }

  const columns = [
    {
      accessorKey: "symbol",
      header: ChecklistKey_Def["symbol"].name,
      size: 100,
      enableColumnOrdering: false,
      Cell: ({ cell }) => (
        <Link href={ FinvizUrl + 'quote.ashx?t=' + cell.getValue()} target="_blank" rel="noreferrer noopener">
          <span>{cell.getValue()}</span>
        </Link>
      ),
    },
    {
      accessorKey: "closeSymbol",
      header: ChecklistKey_Def["Close"].name,
      size: 90,
      enableColumnOrdering: false,
      Cell: ({ cell }) => (
        <Link href={ YahooFinanceUrl + 'quote/' + cell.getValue().symbol} target="_blank" rel="noreferrer noopener">
          <span>{cell.getValue().close}</span>
        </Link>
      ),
    },
    {
      accessorKey: "score",
      header: ChecklistKey_Def["score"].name,
      muiTableHeadCellProps: {
        align: 'center',
      },
      size: 100,
      enableColumnOrdering: false,
      Cell: ({ cell }) => (
        <Tooltip arrow title={
          <span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center' }}>
            {cell.getValue().total === 0 ? 'None' : `Pass: ${cell.getValue().pass} | Total: ${cell.getValue().total}`}
          </span>} >
          <div className={checklistgTableStyle.score}>
            <div></div>
            <Img className={checklistgTableStyle.bombImg} fixed={
              cell.getValue().total === 0 ? bomb.bomb3.childImageSharp.fixed :
              (cell.getValue().pass * 1.0 / cell.getValue().total) < (1 / 5.0) ? bomb.bomb5.childImageSharp.fixed :
              (cell.getValue().pass * 1.0 / cell.getValue().total) < (2 / 5.0) ? bomb.bomb4.childImageSharp.fixed :
              (cell.getValue().pass * 1.0 / cell.getValue().total) <  (3 / 5.0) ? bomb.bomb3.childImageSharp.fixed :
              (cell.getValue().pass * 1.0 / cell.getValue().total) < (4 / 5.0) ? bomb.bomb2.childImageSharp.fixed :
              bomb.bomb1.childImageSharp.fixed
            } fadeIn={false} />
            <span style={{ fontSize: 18 }}>({cell.getValue().total === 0 ? "-"  : (cell.getValue().pass * 100 / cell.getValue().total).toFixed(0) + '%'})</span>
            <div></div>
          </div>
        </Tooltip>
      ),
    }
  ].concat(checklistConfig["list"].map((item) => {
    if (ChecklistKey_Def[item.name].type === "from_end") {
      return {
        accessorKey: RemoveInvalidWordingForMaterialReactTable(item.name),
        header: ChecklistKey_Def[item.name].name,
        size: 110,
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
              <span style={{fontWeight: 700, color: checkFromEnd(ChecklistKey_Def[item.name].checkpoint_comp.checkValConvertor(cell.getValue()), item.condition) ? 'green' : 'red' }}>
                {checkFromEnd(ChecklistKey_Def[item.name].checkpoint_comp.checkValConvertor(cell.getValue()), item.condition) ? '✔' : '✘'}
                {" (" + displayCell(cell.getValue(), ChecklistKey_Def[item.name].checkpoint_comp.display_format) + ")"}
              </span>
          )
        ),
      }
    } else if (ChecklistKey_Def[item.name].type === "tags") {
      return {
        accessorKey: RemoveInvalidWordingForMaterialReactTable(item.name),
        header: ChecklistKey_Def[item.name].name,
        size: 110,
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
  }))

  const [columnOrder, setColumnOrder] = useState(columns.map((c) => c.accessorKey))

  const genTableData = (symbols) => {
    return symbols.map((symbol) => {
      let data = {symbol: symbol, score: {pass: 0, total: 0}, closeSymbol: {symbol: symbol, close: '-'}}
      if (symbol in stockData) {
        data.closeSymbol.close = stockData[symbol]["Close"]
        checklistConfig["list"].forEach((item) => {
          let accessorKey = RemoveInvalidWordingForMaterialReactTable(item.name)
          if (item.name in stockData[symbol]) {
            data[accessorKey] = stockData[symbol][item.name]
            if (ChecklistKey_Def[item.name].type === "from_end" && checkFromEnd(ChecklistKey_Def[item.name].checkpoint_comp.checkValConvertor(stockData[symbol][item.name]), item.condition)) {
              data.score.pass += 1
            } else if (ChecklistKey_Def[item.name].type === "tags" && checkTags(stockData[symbol][item.name], item.condition)) {
              data.score.pass += 1
            }
            data.score.total += 1
          } else { 
            data[accessorKey] = "-"
          }
        })
      } else {
        checklistConfig["list"].forEach((item) => {
          let accessorKey = RemoveInvalidWordingForMaterialReactTable(item.name)
          data[accessorKey] = "-"
        })
      }
      return data
    })
  }
  const [tableData, setTableData] = useState(genTableData(checklistConfig["symbols"]))
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

    ChecklistRef.current.checklistTableRowSelectionChanged(rowSelection)

  }, [enableRowSelection, rowSelection])

  const updateTableData = (newTableData) => {
    checklistConfig["symbols"] = newTableData.map((data) => data["symbol"])
    setTableData([...newTableData])
  }

  return (
    <div className={commonStyle.defaultFont + ' ' + checklistgTableStyle.tableContainer}>
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
        enablePagination={true}
        enableColumnActions={false}
        enableHiding={false}
        onColumnOrderChange={(order)=>{
          let tmp = []
          let orderTmp = order.filter(e => Object.keys(ChecklistKey_Def).includes(e))
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