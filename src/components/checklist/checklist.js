import React, { useState, useEffect, useRef, useMemo } from 'react'

import useFetch from 'use-http'
import MaterialReactTable from 'material-react-table'

import { GetDataByFetchObj } from '../../common/reactUtils'
import ModalWindow from '../modalWindow'
import { CheckListKey_Def } from '../../common/checkListDef'
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

const CheckListTable = ({CheckListTableRef}) => {

  const checkListConfig = CheckListTableRef.current.getCheckListConfigRef()
  const stockData = CheckListTableRef.current.getStockDataRef()

  const columns = Object.keys(CheckListKey_Def).map((key) => {
    return {
      accessorKey: key,
      header: CheckListKey_Def[key].name,
    }
  })

  const [, setColumnOrder] = useState([
    'mrt-row-select',
    ...columns.map((c) => c.accessorKey),
  ])

  const [tableData, setTableData] = useState(checkListConfig["symbols"].map((symbol) => {
    let data = {"symbol": symbol}
    if (symbol in stockData) {
      checkListConfig["list"].forEach((item) => {
        if (item in stockData[symbol]) {
          data[item] = stockData[symbol][item]
        } else { 
          data[item] = "-"
        }
      })
    } else {
      checkListConfig["list"].forEach((item) => {
        data[item] = "-"
      })
    }
    return data
  }))
  return (
    <MaterialReactTable
      autoResetPageIndex={false}
      columns={columns}
      data={tableData}
      enableRowOrdering
      enableColumnOrdering 
      enableRowDragging
      onColumnOrderChange={(order)=>{
        console.log(order)
        checkListConfig["list"] = order.slice(1) // remove mrt-row-drag
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
            console.log(tableData)
            checkListConfig["symbols"] = tableData.map((data) => data["symbol"])
            console.log(checkListConfig["symbols"])
            setTableData([...tableData]);
          }
        },
      })}
    />
  )
}

const Checklist = ({loadingAnimeRef}) => {

  const stockDataRef = useRef({})
  const checkListConfigRef = useRef({
    "symbols": ["C", "WFC", "BAC"],
    "list": ["P/E", "eps_financials", "eps_financials"]
  })

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
