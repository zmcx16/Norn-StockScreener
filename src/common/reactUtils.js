import React, { useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { FinvizUrl, YahooFinanceEnUrl } from './common'
import { convertKMBT } from './utils'

// export const YahooFinanceUrl = NavZhEnUrl(YahooFinanceZhUrl, YahooFinanceEnUrl)
export const YahooFinanceUrl = YahooFinanceEnUrl

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

export function PureFieldWithValueCheck(field, headerName, width, valueFixed, hide, description = null) {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span>{params.value.toFixed(valueFixed)}</span>
    ),
    hide: hide
  }

  if (description != null) {
    output['description'] = description
  }
  return output
}

export function ColorPosGreenNegRedField(field, headerName, width, hide, description = null){
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span style={{ fontWeight: 500, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(params.value)) === 1 ? '+' : ''}{params.value}</span>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export function PercentField(field, headerName, width, hide, description = null){
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN'  ?
        <span>-</span> :
        <span>{(params.value * 100).toFixed(2) + "%"}</span>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export function KMBTField(field, headerName, width, valueFixed, hide, description = null) {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span>{convertKMBT(params.value, valueFixed)}</span>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export function ColorPercentField(field, headerName, width, valueFixed, hide, fontWeight, description = null){
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === '-' || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span style={{ fontWeight: fontWeight, color: Math.sign(parseFloat(params.value)) === 1 ? 'green' : Math.sign(parseFloat(params.value)) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(params.value)) === 1 ? '+' : ''}{(params.value * 100).toFixed(valueFixed) + "%"}</span>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export function SymbolNameField(field, headerName, width, hide, description = null, source="") {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    renderCell: (params) => (
      <Link href={ source=="yahoo" ? YahooFinanceUrl + 'quote/' + params.value : FinvizUrl + 'quote.ashx?t=' + params.value} target="_blank" rel="noreferrer noopener">
        <span>{params.value}</span>
      </Link>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export function NameWithLinkField(field, headerName, width, linkKey, hide, align='left', description = null) {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    align: align,
    renderCell: (params) => (
      linkKey in params.row && params.row[linkKey] != "" && params.row[linkKey] != "-" ?       
      <Link href={params.row[linkKey]} target="_blank" rel="noreferrer noopener">
        <span>{params.value}</span>
      </Link> : <span>{params.value}</span>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}


export function ColorNumberWithExtraInfoField(field, headerName, width, valueFixed, hide, description = null) {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      "extra_info" in params.row ?
      <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{params.row["extra_info"]}</span>} >
        <Typography sx={{ fontWeight: 'word_color' in params.row ? 600 : 500, color: 'word_color' in params.row ? params.row['word_color'] : 'unset' }} style={{cursor: 'pointer'}}>{params.value.toFixed(valueFixed)}</Typography>
      </NoMaxWidthTooltip>
      :
      <Typography sx={{ fontWeight: 'word_color' in params.row ? 600 : 500, color: 'word_color' in params.row ? params.row['word_color'] : 'unset' }} >{params.value.toFixed(valueFixed)}</Typography>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export const GetDataByFetchObj = async (url, fetchObj) => {
  const resp_data = await fetchObj.get(url)
  if (fetchObj.response.ok && resp_data) {
    return resp_data
  }
  else {
    return null
  }
}

export const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
})


export const RemoveInvalidWordingForMaterialReactTable = (key) => {
  return key.replace('.', '')
}