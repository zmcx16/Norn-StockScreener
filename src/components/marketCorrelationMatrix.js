import React, { useState, useRef, useEffect } from 'react'
import shortid from 'shortid'

import ModalWindow from './modalWindow'

import marketCorrelationMatrixStyle from './marketCorrelationMatrix.module.scss'


const table = [
    {
      key: "Bananas",
      correlations: {
        Bananas: 1.0,
        Apples: -0.0254,
        Grapes: -0.0072,
        Strawberries: -0.0111,
        Oranges: 0.0162,
        Watermelons: 0.038,
        Lemons: 0.0162,
        Blueberries: 0.0073,
        Peaches: 0.0399,
        Pineapples: -1
      }
    },
    {
      key: "Apples",
      correlations: {
        Bananas: -0.0254,
        Apples: 1.0,
        Grapes: -0.0053,
        Strawberries: 0.0205,
        Oranges: -0.0184,
        Watermelons: 0.0122,
        Lemons: -0.0184,
        Blueberries: 0.0061,
        Peaches: 0.0115,
        Pineapples: 0.0045
      }
    },
    {
      key: "Grapes",
      correlations: {
        Bananas: -0.0072,
        Apples: -0.0053,
        Grapes: 1.0,
        Strawberries: 0.0013,
        Oranges: 0.0145,
        Watermelons: 0.0055,
        Lemons: 0.0145,
        Blueberries: -0.0042,
        Peaches: 0.0151,
        Pineapples: 0.0181
      }
    },
    {
      key: "Oranges",
      correlations: {
        Bananas: 0.0162,
        Apples: -0.0184,
        Grapes: 0.0145,
        Strawberries: -0.0125,
        Oranges: 1.0,
        Watermelons: 0.0045,
        Lemons: 0.078,
        Blueberries: -0.0082,
        Peaches: -0.0144,
        Pineapples: 0.0071
      }
    },
    {
      key: "Strawberries",
      correlations: {
        Bananas: -0.0111,
        Apples: 0.0205,
        Grapes: 0.0013,
        Strawberries: 1.0,
        Oranges: -0.0125,
        Watermelons: 0.0024,
        Lemons: -0.0125,
        Blueberries: -0.0033,
        Peaches: -0.0155,
        Pineapples: -0.007
      }
    },
    {
      key: "Watermelons",
      correlations: {
        Bananas: 0.038,
        Apples: 0.0122,
        Grapes: 0.0055,
        Strawberries: 0.0024,
        Oranges: 0.0045,
        Watermelons: 1.0,
        Lemons: 0.0045,
        Blueberries: 0.0302,
        Peaches: -0.015,
        Pineapples: 0.0098
      }
    },
    {
      key: "Lemons",
      correlations: {
        Bananas: 0.0162,
        Apples: -0.0184,
        Grapes: 0.0145,
        Strawberries: -0.0125,
        Oranges: 0.078,
        Watermelons: 0.0045,
        Lemons: 1.0,
        Blueberries: -0.0082,
        Peaches: -0.0144,
        Pineapples: 0.0071
      }
    },
    {
      key: "Blueberries",
      correlations: {
        Bananas: 0.0073,
        Apples: 0.0061,
        Grapes: -0.0042,
        Strawberries: -0.0033,
        Oranges: -0.0082,
        Watermelons: 0.0302,
        Lemons: -0.0082,
        Blueberries: 1.0,
        Peaches: 0.0063,
        Pineapples: 0.0139
      }
    },
    {
      key: "Peaches",
      correlations: {
        Bananas: 0.0399,
        Apples: 0.0115,
        Grapes: 0.0151,
        Strawberries: -0.0155,
        Oranges: -0.0144,
        Watermelons: -0.015,
        Lemons: -0.0144,
        Blueberries: 0.0063,
        Peaches: 1.0,
        Pineapples: 0.0319
      }
    },
    {
      key: "Pineapples",
      correlations: {
        Bananas: -1,
        Apples: 0.0045,
        Grapes: 0.0181,
        Strawberries: -0.007,
        Oranges: 0.0071,
        Watermelons: 0.0098,
        Lemons: 0.0071,
        Blueberries: 0.0139,
        Peaches: 0.0319,
        Pineapples: 1.0
      }
    }
  ]

const categories = table.map((category) => category.key)

const negativeColor = (correlation) => {
  const alpha = Math.abs(correlation);
  return `rgba(243, 87, 86, ${isNaN(alpha) ? 0 : alpha})`;
}

const positiveColor = (correlation) => {
  const alpha = Math.abs(correlation);
  return `rgba(46, 233, 255, ${isNaN(alpha) ? 0 : alpha})`;
}


const parsedData = categories.reduce((acc, rowTitle) => {
  const category = table.find((d) => d.key === rowTitle);
  const matches = Object.keys(category.correlations);
  const categoryCorrelations = categories.reduce((acc2, colTitle) => {
    const value = category.correlations[colTitle];
    const row = categories.indexOf(rowTitle);
    const column = categories.indexOf(colTitle);
    const color =
      value < 0 ? negativeColor(value * 25) : positiveColor(value * 25)

    return [
        ...acc2,
        {
          colTitle,
          rowTitle,
          row,
          column,
          value,
          color
        }
      ]
  }, [])
  return [...acc, ...categoryCorrelations];
}, [])

const MatrixNode = ({data}) => {
  let nodeStyle = marketCorrelationMatrixStyle.matrixNode
  if (data.row === 0) {
    nodeStyle += ' ' + marketCorrelationMatrixStyle.matrixNodeFirstRow
  }

  if (data.column === 0) {
    nodeStyle += ' ' + marketCorrelationMatrixStyle.matrixNodeFirstColumn
  }
  return (
    <div className={nodeStyle} style={{background: data.color}}>
      {data.value.toFixed(2).replace(/(\.0*|(?<=(\..*))0*)$/, '').replace("0.",".")}
    </div>
  )
}

const MarketCorrelationMatrix = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  //console.log(parsedData)

  const renderColumnTitle = () => {
    return (
      <>
        <div className={marketCorrelationMatrixStyle.matrixColTitle} key={shortid.generate()}></div>
        {categories.map((val) => {
          return <div className={marketCorrelationMatrixStyle.matrixColTitle} key={shortid.generate()}>{val}</div>
        })}
      </>
    )
  }

  const renderRowsTitleAndData = () => {

    let output = []
    parsedData.forEach((d, i)=>{
      if (i % table.length === 0) {
        output.push(<div className={marketCorrelationMatrixStyle.matrixRowTitle} key={shortid.generate()}>{d.rowTitle}</div>)
      }
      output.push(<MatrixNode data={d} key={shortid.generate()} />)
    })

    return output
  }

  return (
    <>
      <div className={marketCorrelationMatrixStyle.container}>
        <div style={{ display: 'grid', justifyItems: 'center', alignItems: 'center', gridTemplateColumns: '200px 40px 40px 40px 40px 40px 40px 40px 40px 40px 40px'}}>
          {renderColumnTitle()}
          {renderRowsTitleAndData()}
        </div>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default MarketCorrelationMatrix
