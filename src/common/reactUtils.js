import React, { useEffect, useRef } from 'react'
import Link from '@material-ui/core/Link'

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay])
}

export function colorPosGreenNegRedField(field, headerName, width, colShow){
  return {
    field: field,
    headerName: headerName,
    width: width,
    renderCell: (params) => (
      params.value === "-" || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span style={{ fontWeight: 500, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(params.value)) === 1 ? '+' : ''}{params.value}</span>
    ),
    colShow: colShow
  }
}

export function colorPosGreenNegRedPercentField(field, headerName, width, colShow){
  return {
    field: field,
    headerName: headerName,
    width: width,
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span style={{ fontWeight: 500, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(params.value)) === 1 ? '+' : ''}{(params.value * 100).toFixed(2) + "%"}</span>
    ),
    colShow: colShow
  }
}

export function percentField(field, headerName, width, colShow){
  return {
    field: field,
    headerName: headerName,
    width: width,
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span>{(params.value * 100).toFixed(2) + "%"}</span>
    ),
    colShow: colShow
  }
}


export function colorPercentField(field, headerName, width, colShow){
  return {
    field: field,
    headerName: headerName,
    width: width,
    renderCell: (params) => (
      params.value === -Number.MAX_VALUE || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span style={{ fontWeight: 500, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(params.value)) === 1 ? '+' : ''}{(params.value * 100).toFixed(2) + "%"}</span>
    ),
    colShow: colShow
  }
}

export function SymbolNameField(field, headerName, width, colShow) {
  return {
    field: field,
    headerName: headerName,
    width: width,
    renderCell: (params) => (
      <Link href={"https://finviz.com/quote.ashx?t=" + params.value + "&ty=c&p=d&b=1"} target="_blank" rel="noreferrer noopener">
        <span>{params.value}</span>
      </Link>
    ),
    colShow: colShow
  }
}
