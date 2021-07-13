import React, { useState, useRef, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import Popper from '@material-ui/core/Popper'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import shortid from 'shortid'
import useFetch from 'use-http'

import ModalWindow from '../modalWindow'
import { rollingCorrelationWindowDays } from '../../common/common'
import RollingCorrelationChart from './rollingCorrelationChart'

import marketCorrelationMatrixStyle from './marketCorrelationMatrix.module.scss'

const pcorr = (x, y) => {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;
  const minLength = x.length = y.length = Math.min(x.length, y.length),
    reduce = (xi, idx) => {
      const yi = y[idx];
      sumX += xi;
      sumY += yi;
      sumXY += xi * yi;
      sumX2 += xi * xi;
      sumY2 += yi * yi;
    }
  x.forEach(reduce)
  return (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY))
}

const getTableCategories = (table) => {
  return table.map((category) => {
    return {
      symbol: category.symbol,
      src: category.src
    }
  })
}

const table2MatrixData = (table) => {

  const categories = getTableCategories(table)

  const negativeColor = (correlation) => {
    const alpha = Math.abs(correlation)
    return `rgba(243, 87, 86, ${isNaN(alpha) ? 0 : alpha})`
  }

  const positiveColor = (correlation) => {
    const alpha = Math.abs(correlation);
    return `rgba(46, 233, 255, ${isNaN(alpha) ? 0 : alpha})`
  }

  const parsedData = categories.reduce((acc, rowSymbolSrc) => {
    const category = table.find((d) => d.symbol === rowSymbolSrc.symbol)
    const categoryCorrelations = categories.reduce((acc2, colSymbolSrc) => {
      const value = category.correlations[colSymbolSrc.symbol]['value']
      const pValue = category.correlations[colSymbolSrc.symbol]['p_value']
      const dataUrl = category['dataUrl']
      const row = categories.findIndex(p => p.symbol == rowSymbolSrc.symbol)
      const column = categories.findIndex(p => p.symbol == colSymbolSrc.symbol)
      const color =
        value < 0 ? negativeColor(value) : positiveColor(value)

      return [
        ...acc2,
        {
          colSymbolSrc,
          rowSymbolSrc,
          row,
          column,
          value,
          pValue,
          dataUrl,
          color
        }
      ]
    }, [])
    return [...acc, ...categoryCorrelations];
  }, [])

  return parsedData
}

const MatrixNode = ({ data, popperTipRef, modalWindowRef }) => {
  let nodeStyle = marketCorrelationMatrixStyle.matrixNode
  if (data.row === 0) {
    nodeStyle += ' ' + marketCorrelationMatrixStyle.matrixNodeFirstRow
  }

  if (data.column === 0) {
    nodeStyle += ' ' + marketCorrelationMatrixStyle.matrixNodeFirstColumn
  }

  const message = 
`${data.colSymbolSrc.symbol} has a ${data.value} correlation to ${data.rowSymbolSrc.symbol}
p-value: ${data.pValue}
`
  const fetch1 = useFetch({ cachePolicy: 'no-cache' })
  const fetch2 = useFetch({ cachePolicy: 'no-cache' })

  return (
    <div className={nodeStyle}>
      <div style={{ background: data.color }} onMouseOver={(event)=>{
        popperTipRef.current.setOpen(true, event.currentTarget, message)
      }} onMouseOut={() => {
        popperTipRef.current.setOpen(false)
      }} onClick={()=>{
        const getMarketData = async (src, symbol, fetchObj) => {
          let fileName = btoa(src + '_' + symbol) + '.json'
          const resp_data = await fetchObj.get('/norn-data/markets/' + fileName)
          if (fetchObj.response.ok && resp_data.data && resp_data.data.length > 0) {
            return resp_data.data
          }
          else {
            return null
          }
        }

        Promise.all([
          getMarketData(data.colSymbolSrc.src, data.colSymbolSrc.symbol, fetch1),
          getMarketData(data.rowSymbolSrc.src, data.rowSymbolSrc.symbol, fetch2),
        ]).then((allResponses) => {
          // console.log(allResponses)
          if (allResponses.length == 2 && allResponses[0] !== null && allResponses[1] !== null) {
            
            const overDateInterval = (d1, d2, days) => {
              return Date.parse(d1) - Date.parse(d2) > days * 24 * 60 * 60 * 1000
            }

            const convertDictData = (arr) => {
              let key_data_val = {}
              const key_data_is_monthly_intervals = overDateInterval(arr[0]["Date"], arr[1]["Date"], 15)
              arr.forEach((d, i) => {
                let v = d["Close"]
                if (typeof v === 'string') {
                  v = parseFloat(v.replace("%", ""))
                }

                if (key_data_is_monthly_intervals) {
                  let dt = Date.parse(d["Date"])
                  const date_offset = (dt.getMonth() + 1).toString().padStart(2, "0") + "/01/" + dt.getFullYear().toString()
                  key_data_val[date_offset] = v
                } else {
                  key_data_val[d["Date"]] = v
                }
              })
              return key_data_val
            }

            let dataDict1 = convertDictData(allResponses[0])
            let dataDict2 = convertDictData(allResponses[1])

            const getIntersectionKey = (o1, o2) => {
              return Object.keys(o1).filter({}.hasOwnProperty.bind(o2));
            }

            const keys = getIntersectionKey(dataDict1, dataDict2)            
            let slidingWindowSize = 2
            let startCalcTime = Date.parse(keys[keys.length - 1]) + rollingCorrelationWindowDays * 24 * 60 * 60 * 1000
            for (let i = keys.length - 2; i>=0; i--) {
              if (startCalcTime <= Date.parse(keys[i])) {
                slidingWindowSize = Math.max(slidingWindowSize, keys.length - 1 - i + 1)
                break
              }
            }
            
            let pcorrData = []
            for (let i = keys.length - 1 - slidingWindowSize + 1; i >= 0; i--) {
              
              let dataX = []
              let dataY = []
              let dataWindow = keys.slice(i, i + slidingWindowSize)
              dataWindow.forEach((e)=>{
                dataX.push(dataDict1[e])
                dataY.push(dataDict2[e])
              })
              let score = pcorr(dataX, dataY)
              pcorrData.push({ 'Date': keys[i], 'Score': score})
            }

            // console.log(pcorrData)
            const description = `${data.rowSymbolSrc.symbol} - ${data.colSymbolSrc.symbol} Rolling ${rollingCorrelationWindowDays} days Correlation`
            modalWindowRef.current.popModalWindow(<RollingCorrelationChart data={pcorrData} description={description} />)
          } else {
            modalWindowRef.current.popModalWindow(<div>Load some market data failed</div>)
          }
        }).catch(() => {
          modalWindowRef.current.popModalWindow(<div>Load market data failed</div>)
        })
      }}>
        {data.value==='NaN' ? 'NaN' : data.value.toFixed(2).replace(/(\.0*|(?<=(\..*))0*)$/, '').replace("0.",".")}
      </div>
    </div>
  )
}

const PopperTip = ({ popperTipRef }) =>{

  // PopperTip API
  popperTipRef.current = {
    setOpen: (v, a=null, msg='') => {
      if (v) {
        setAnchorEl(a)
        setMessage(msg)
      }
      setOpenPopper(v)
    },
    getOpen: () => {
      return openPopper
    }
  }

  const [openPopper, setOpenPopper] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [message, setMessage] = useState('')

  return (
    <Popper open={openPopper} anchorEl={anchorEl} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper style={{padding: '10px'}}>
            <span style={{ whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{message}</span>
          </Paper>
        </Fade>
      )}
    </Popper>
  )
}

const MarketCorrelationMatrix = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const popperTipRef = useRef({
    setOpen: null,
    getOpen: null,
  })

  const [table, setTable] = useState([])

  const { get, response } = useFetch({ cachePolicy: 'no-cache' })
  const getCorrelationTable = async () => {
    const resp_data = await get('/norn-data/market-correlation-matrix.json')
    if (response.ok) {
      console.log(resp_data)
      setTable(resp_data['table'])
    }
    else {
      modalWindowRef.current.popModalWindow(<div>Load market-correlation-matrix.json failed</div>)
      setTable([])
    }
    loadingAnimeRef.current.setLoading(false)
  }

  const renderColumnTitle = () => {
    return (
      <>
        <div className={marketCorrelationMatrixStyle.matrixColTitle} key={shortid.generate()}></div>
        {getTableCategories(table).map((val) => {
          return <div className={marketCorrelationMatrixStyle.matrixColTitle} key={shortid.generate()}>{val.symbol}</div>
        })}
      </>
    )
  }

  const renderRowsTitleAndData = () => {
    let output = []
    table2MatrixData(table).forEach((d, i)=>{
      if (i % table.length === 0) {
        output.push(
          <div className={marketCorrelationMatrixStyle.matrixRowTitle} key={shortid.generate()}>
            <Link href={d.dataUrl} target="_blank" rel="noreferrer noopener">
              <span>{d.rowSymbolSrc.symbol}</span>
            </Link>
          </div>)
      }
      output.push(<MatrixNode data={d} popperTipRef={popperTipRef} modalWindowRef={modalWindowRef} key={shortid.generate()} />)
    })

    return output
  }

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    getCorrelationTable()
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={marketCorrelationMatrixStyle.container}>
        <div style={{ display: 'grid', justifyItems: 'center', alignItems: 'center', gridTemplateColumns: '200px ' + '40px '.repeat(getTableCategories(table).length)}}>
          {renderColumnTitle()}
          {renderRowsTitleAndData()}
        </div>
      </div>
      <PopperTip popperTipRef={popperTipRef}/>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default MarketCorrelationMatrix
