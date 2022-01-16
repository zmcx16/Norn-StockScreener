import React, { useState, useRef, useEffect } from 'react'
import { DataGrid } from '@material-ui/data-grid'
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
        Symbol: { hide: false, text: 'Symbol' },
        Transaction: { hide: false, text: 'Transaction' },
        Value: { hide: false, text: 'Value' },
        Close: { hide: false, text: 'Price' },
        PE: { hide: false, text: 'P/E' },
        PB: { hide: false, text: 'P/B' },
        Dividend: { hide: false, text: 'Dividend %' },
        High52: { hide: false, text: '52W High' },
        Low52: { hide: false, text: '52W Low' },
        PerfWeek: { hide: false, text: 'Perf Week' },
        PerfMonth: { hide: false, text: 'Perf Month' },
        PerfQuarter: { hide: false, text: 'Perf Quarter' },
        PerfHalfY: { hide: false, text: 'Perf Half Y' },
        PerfYear: { hide: false, text: 'Perf Year' },
        PerfYTD: { hide: false, text: 'Perf YTD' },
    }

    const getData = async (url, fetchObj) => {
        const resp_data = await fetchObj.get(url)
        if (fetchObj.response.ok && resp_data) {
            return resp_data
        }
        else {
            return null
        }
    }

    const genTableColTemplate = () => {
        return [
            {
                field: 'date',
                headerName: 'Date',
                width: 120,
                type: 'date',
                renderCell: (params) => (
                    <span>{moment(params.row['date']).format('MM/DD/YYYY')}</span>
                ),
                hide: 'date' in hideColState ? hideColState['date'] : false
            },
            SymbolNameField('symbol', 'Symbol', 130, 'symbol' in hideColState ? hideColState['symbol'] : false),
            {
                field: 'transaction',
                headerName: 'Transaction',
                width: 160,
                type: 'number',
                renderCell: (params) => (
                    params.value === "-" ?
                        <span>-</span> :
                        <span style={{ fontWeight: 500, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{params.value === 1 ? 'Buy' : (params.value === -1 ? 'Sale' : 'Option Exercise')}</span>
                ),
                hide: 'transaction' in hideColState ? hideColState['transaction'] : tableColList['Transaction'].hide
            },
            KMBTField("value", tableColList.Value.text, 130, 2, "value" in hideColState ? hideColState["value"] : tableColList['Value'].hide),
            PureFieldWithValueCheck("close", tableColList.Close.text, 110, 2, "close" in hideColState ? hideColState["close"] : tableColList['Close'].hide),
            PureFieldWithValueCheck("PE", tableColList.PE.text, 110, 2, "PE" in hideColState ? hideColState["PE"] : tableColList['PE'].hide),
            PureFieldWithValueCheck("PB", tableColList.PB.text, 110, 2, "PB" in  hideColState ? hideColState["PB"] : tableColList['PB'].hide),
            PercentField("dividend", tableColList.Dividend.text, 150, "dividend" in hideColState ? hideColState["dividend"] : tableColList['Dividend'].hide),
            PercentField("high52", tableColList.High52.text, 150, "high52" in  hideColState? hideColState["high52"] : tableColList['High52'].hide),
            PercentField("low52", tableColList.Low52.text, 150, "low52" in hideColState ? hideColState["low52"] :  tableColList['Low52'].hide),
            ColorPercentField("perfWeek", tableColList.PerfWeek.text, 150, 2, "perfWeek" in hideColState ? hideColState["perfWeek"] : tableColList['PerfWeek'].hide, 500),
            ColorPercentField("perfMonth", tableColList.PerfMonth.text, 150, 2, "perfMonth" in   hideColState? hideColState["perfMonth"] : tableColList['PerfMonth'].hide, 500),
            ColorPercentField("perfQuarter", tableColList.PerfQuarter.text, 160, 2, "perfQuarter" in hideColState ? hideColState["perfQuarter"] : tableColList['PerfQuarter'].hide, 500),
            ColorPercentField("perfHalfY", tableColList.PerfHalfY.text, 150, 2, "perfHalfY" in  hideColState? hideColState["perfHalfY"] : tableColList['PerfHalfY'].hide, 500),
            ColorPercentField("perfYear", tableColList.PerfYear.text, 150, 2, "perfYear" in  hideColState ? hideColState["perfYear"] :  tableColList['PerfYear'].hide, 500),
            ColorPercentField("perfYTD", tableColList.PerfYTD.text, 150, 2, "perfYTD" in hideColState ? hideColState["perfYTD"] : tableColList['PerfYTD'].hide, 500),
        ]
    }

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
    const [hideColState, setHideColState] = useState({})

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
                <div className={insidersTradeListTableStyle.table}>
                    <DataGrid rows={rowData} columns={genTableColTemplate()} rowsPerPageOptions={[]} autoPageSize={true} components={{ NoRowsOverlay: DefaultDataGridTable, }} disableSelectionOnClick onColumnVisibilityChange={(param) => {
                        let tempHideColState = hideColState
                        tempHideColState[param['field']] = !param['isVisible']
                        setHideColState(tempHideColState)
                    }}/>
                </div>
            </div>
            <ModalWindow modalWindowRef={modalWindowRef} />
        </>
    )
}

export default InsidersTradeListTable
