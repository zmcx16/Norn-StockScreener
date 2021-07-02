import React, { useState, useRef, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import shortid from 'shortid'
import useFetch from 'use-http'

import ModalWindow from './modalWindow'

import marketCorrelationMatrixStyle from './marketCorrelationMatrix.module.scss'

const getTableCategories = (table) => {
  return table.map((category) => category.symbol)
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

  const parsedData = categories.reduce((acc, rowTitle) => {
    const category = table.find((d) => d.symbol === rowTitle)
    const categoryCorrelations = categories.reduce((acc2, colTitle) => {
      const value = category.correlations[colTitle]['value']
      const pValue = category.correlations[colTitle]['p_value']
      const dataUrl = category['dataUrl']
      const row = categories.indexOf(rowTitle)
      const column = categories.indexOf(colTitle)
      const color =
        value < 0 ? negativeColor(value) : positiveColor(value)

      return [
        ...acc2,
        {
          colTitle,
          rowTitle,
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

const MatrixNode = ({data}) => {
  let nodeStyle = marketCorrelationMatrixStyle.matrixNode
  if (data.row === 0) {
    nodeStyle += ' ' + marketCorrelationMatrixStyle.matrixNodeFirstRow
  }

  if (data.column === 0) {
    nodeStyle += ' ' + marketCorrelationMatrixStyle.matrixNodeFirstColumn
  }

  return (
    <div className={nodeStyle} style={{background: 'white'}}>
      <div style={{ background: data.color }}>
        {data.value.toFixed(2).replace(/(\.0*|(?<=(\..*))0*)$/, '').replace("0.",".")}
      </div>
    </div>
  )
}

const MarketCorrelationMatrix = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
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
          return <div className={marketCorrelationMatrixStyle.matrixColTitle} key={shortid.generate()}>{val}</div>
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
              <span>{d.rowTitle}</span>
            </Link>
          </div>)
      }
      output.push(<MatrixNode data={d} key={shortid.generate()} />)
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
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default MarketCorrelationMatrix
