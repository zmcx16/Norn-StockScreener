import React, { useState, useRef, useEffect } from 'react'

import ModalWindow from './modalWindow'

import marketCorrelationMatrixStyle from './marketCorrelationMatrix.module.scss'

const MarketCorrelationMatrix = ({ loadingAnimeRef }) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  return (
    <>
      <div className={marketCorrelationMatrixStyle.container}>
        test
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </>
  )
}

export default MarketCorrelationMatrix
