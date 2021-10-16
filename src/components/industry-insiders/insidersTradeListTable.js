import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import useFetch from 'use-http'
import moment from 'moment'

import ModalWindow from '../modalWindow'
import DefaultDataGridTable from '../defaultDataGridTable'
import { SymbolNameField, PureFieldWithValueCheck, PercentField, ColorPercentField, KMBTField } from '../../common/reactUtils'
import { getUrl } from '../../common/utils'

import insidersTradeListTableStyle from './insidersTradeListTable.module.scss'
import '../muiTablePagination.css'

const InsidersTradeListTable = ({ loadingAnimeRef }) => {

    const modalWindowRef = useRef({
        popModalWindow: null,
        popPureModal: null,
    })

    const tableColList = {
        Symbol: { show: true, text: 'Symbol' },
        Transaction: { show: true, text: 'Transaction' },
        Value: { show: true, text: 'Value' },
        Close: { show: true, text: 'Price' },
        PE: { show: true, text: 'P/E' },
        PB: { show: true, text: 'P/B' },
        Dividend: { show: true, text: 'Dividend %' },
        High52: { show: true, text: '52W High' },
        Low52: { show: true, text: '52W Low' },
        PerfWeek: { show: true, text: 'Perf Week' },
        PerfMonth: { show: true, text: 'Perf Month' },
        PerfQuarter: { show: true, text: 'Perf Quarter' },
        PerfHalfY: { show: true, text: 'Perf Half Y' },
        PerfYear: { show: true, text: 'Perf Year' },
        PerfYTD: { show: true, text: 'Perf YTD' },
    }

    const showColListRef = useRef(Object.keys(tableColList).reduce((accumulator, currentValue) => {
        accumulator[currentValue] = tableColList[currentValue].show
        return accumulator
    }, {}))

    const getData = async (url, fetchObj) => {
        const resp_data = await fetchObj.get(url)
        if (fetchObj.response.ok && resp_data) {
            return resp_data
        }
        else {
            return null
        }
    }

    const getTableColTemplate = (showColList) => {
        return [
            {
                field: 'date',
                headerName: 'Date',
                width: 100,
                renderCell: (params) => (
                    <span>{moment(params.row['date']).format('MM/DD/YYYY')}</span>
                ),
                colShow: true
            },
            SymbolNameField('symbol', 'Symbol', 90, true),
            {
                field: 'transaction',
                headerName: 'Transaction',
                width: 140,
                renderCell: (params) => (
                    params.value === "-" ?
                        <span>-</span> :
                        <span style={{ fontWeight: 500, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{params.value === 1 ? 'Buy' : (params.value === -1 ? 'Sale' : 'Option Exercise')}</span>
                ),
                colShow: showColList['Transaction']
            },
            KMBTField("value", tableColList.Value.text, 110, 2, showColList['Value']),
            PureFieldWithValueCheck("close", tableColList.Close.text, 110, 2, showColList['Close']),
            PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, showColList['PE']),
            PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, showColList['PB']),
            PercentField("dividend", tableColList.Dividend.text, 110, showColList['Dividend']),
            PercentField("high52", tableColList.High52.text, 110, showColList['High52']),
            PercentField("low52", tableColList.Low52.text, 110, showColList['Low52']),
            ColorPercentField("perfWeek", tableColList.PerfWeek.text, 110, 2, showColList['PerfWeek'], 500),
            ColorPercentField("perfMonth", tableColList.PerfMonth.text, 110, 2, showColList['PerfMonth'], 500),
            ColorPercentField("perfQuarter", tableColList.PerfQuarter.text, 110, 2, showColList['PerfQuarter'], 500),
            ColorPercentField("perfHalfY", tableColList.PerfHalfY.text, 110, 2, showColList['PerfHalfY'], 500),
            ColorPercentField("perfYear", tableColList.PerfYear.text, 110, 2, showColList['PerfYear'], 500),
            ColorPercentField("perfYTD", tableColList.PerfYTD.text, 110, 2, showColList['PerfYTD'], 500),
        ]
    }

    const getTableCol = () => {
        return getTableColTemplate(showColListRef.current).reduce((accumulator, currentValue) => {
            if (currentValue.colShow) {
                accumulator.push(currentValue)
            }
            return accumulator
        }, [])
    }
    const [tableCol, setTableCol] = useState(getTableCol())

    const fetchStockData = useFetch({ cachePolicy: 'no-cache' })
    const fetchInsidersData = useFetch({ cachePolicy: 'no-cache' })

    const getInsidersTradeListTable = () => {
        let industry = ''
        let url_params = new URL(getUrl()).searchParams
        if (url_params.has('industry')) {
            industry = url_params.get('industry')
        } else {
            modalWindowRef.current.popModalWindow(<div>Industry parameter not found</div>)
            loadingAnimeRef.current.setLoading(false)
            return
        }

        Promise.all([
            getData("/norn-data/stock/stat.json", fetchStockData),
            getData('/norn-data/insiders/data/' + industry + '.json', fetchInsidersData),
        ]).then((allResponses) => {
            // console.log(allResponses)
            if (allResponses.length == 2 && allResponses[0] !== null && allResponses[1] !== null) {
                let output = allResponses[1].map((value, index) => {
                    let stockInfo = allResponses[0][value['Symbol']]
                    let o = {
                        id: index,
                        date: new Date(value['Date']),
                        symbol: value['Symbol'],
                        transaction: value['Transaction'],
                        value: value['Value'],
                        close: stockInfo !== undefined && stockInfo !== null && stockInfo['Close'] !== '-' ? stockInfo['Close'] : -Number.MAX_VALUE,
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

    const [rowData, setRowData] = useState([])

    const renderCheckbox = (key) => {
        return <FormControlLabel
            key={key}
            control={
                <Checkbox
                    onChange={() => {
                        showColListRef.current[key] = !showColListRef.current[key]
                        setTableCol(getTableCol())
                    }}
                    name={tableColList[key].text}
                    color="primary"
                    defaultChecked={tableColList[key].show}
                />
            }
            label={
                <div>{tableColList[key].text}</div>
            }
        />
    }

    useEffect(() => {
        // componentDidMount is here!
        // componentDidUpdate is here!
        getInsidersTradeListTable()
        return () => {
            // componentWillUnmount is here!
        }
    }, [])

    return (
        <>
            <div className={insidersTradeListTableStyle.container}>
                <div className={insidersTradeListTableStyle.showColumn}>
                    {Object.keys(showColListRef.current).map((key, index) => {
                        return renderCheckbox(key)
                    })}
                </div>
                <div className={insidersTradeListTableStyle.table}>
                    <DataGrid rows={rowData} columns={tableCol} autoPageSize={true} components={{ noRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick />
                </div>
            </div>
            <ModalWindow modalWindowRef={modalWindowRef} />
        </>
    )
}

export default InsidersTradeListTable
