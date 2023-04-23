import React, { useState, useEffect, useRef, useMemo } from 'react'

import useFetch from 'use-http'
import MaterialReactTable from 'material-react-table'

import { GetDataByFetchObj } from '../../common/reactUtils'
import ModalWindow from '../modalWindow'

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

const Checklist = ({loadingAnimeRef}) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })
  
  const stockDataRef = useRef({})

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

  const columns = useMemo(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
    ],
    [],
    //end
  )

  const [tableData, setTableData] = useState([
    {
      firstName: 'Dylan',
      lastName: 'Murray',
      city: 'East Daphne',
    },
    {
      firstName: 'Raquel',
      lastName: 'Kohler',
      city: 'Columbus',
    },
    {
      firstName: 'Ervin',
      lastName: 'Reinger',
      city: 'South Linda',
    },
    {
      firstName: 'Brittany',
      lastName: 'McCullough',
      city: 'Lincoln',
    },
    {
      firstName: 'Branson',
      lastName: 'Frami',
      city: 'Charleston',
    },
  ])


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
      <MaterialReactTable
        autoResetPageIndex={false}
        columns={columns}
        data={tableData}
        enableRowOrdering
        enableSorting={false}
        muiTableBodyRowDragHandleProps={({ table }) => ({
          onDragEnd: () => {
            const { draggingRow, hoveredRow } = table.getState();
            if (hoveredRow && draggingRow) {
              tableData.splice(
                hoveredRow.index,
                0,
                tableData.splice(draggingRow.index, 1)[0],
              );
              setTableData([...tableData]);
            }
          },
        })}
      />
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default Checklist
