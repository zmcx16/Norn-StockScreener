import React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import TravelExploreIcon from '@mui/icons-material/TravelExplore'

import { FinvizUrl, YahooFinanceEnUrl, ShortSummaryRelLink } from './common'
import { NoMaxWidthTooltip } from './reactUtils'
import { convertKMBT } from './utils'

// export const YahooFinanceUrl = NavZhEnUrl(YahooFinanceZhUrl, YahooFinanceEnUrl)
export const YahooFinanceUrl = YahooFinanceEnUrl


export function PureFieldWithValueCheck(field, headerName, width, valueFixed, hide, description = null, toExponential = false) {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> : 
        toExponential ? 
        <span>{params.value.toExponential(valueFixed)}</span> : 
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

export function ColorPercentField(field, headerName, width, valueFixed, hide, fontWeight, description = null, flag=1){
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === '-' || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ?
        <span>-</span> :
        <span style={{ fontWeight: fontWeight, color: Math.sign(parseFloat(params.value)*flag) === 1 ? 'green' : Math.sign(parseFloat(params.value)*flag) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(params.value)) === 1 ? '+' : ''}{(params.value * 100).toFixed(valueFixed) + "%"}</span>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export function SymbolNameField(headerName, width, hide, description = null, source="") {
  return SymbolNameWithDetailLinkField(headerName, width, hide, description, source, "")
}

export function SymbolNameWithDetailLinkField(headerName, width, hide, description = null, source="", detail_link="") {
  let show_detail_link = detail_link !== ""
  
  let output = {
    field: "symbol",
    headerName: headerName,
    align: show_detail_link ? 'right' : 'left',
    width: width,
    renderCell: (params) => (
      <>
        <Link href={ source=="yahoo" ? YahooFinanceUrl + 'quote/' + params.value : FinvizUrl + 'quote.ashx?t=' + params.value} target="_blank" rel="noreferrer noopener">
          <span>{params.value}</span>
        </Link>
        {
          show_detail_link ?       
          <IconButton onClick={() => window.open(detail_link.replace("{symbol}", params.value), "_blank")}>
            <TravelExploreIcon color="action"/>
          </IconButton> : <></>   
        }
      </>
    ),
    hide: hide
  }
  
  if (description != null) {
    output['description'] = description
  }
  return output
}

export function PriceField(field, headerName, width, hide, description = null, source="") {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    renderCell: (params) => (
      <Link href={ source=="yahoo" ? YahooFinanceUrl + 'quote/' + params.row["symbol"] : FinvizUrl + 'quote.ashx?t=' +  params.row["symbol"] } target="_blank" rel="noreferrer noopener">
        <span>{params.value === '-' || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN' ? '-' : params.value.toFixed(2)}</span>
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

export function ShortFloatLinkWithShowChartField(field, headerName, width, hide, description = null) {
  let output = {
    field: field,
    headerName: headerName,
    width: width,
    type: 'number',
    renderCell: (params) => (
      params.value === "-" || params.value === -Number.MAX_VALUE || params.value === Number.MAX_VALUE || params.value === null || params.value === undefined || params.value === "Infinity" || params.value === 'NaN'  ?
      <span>-</span> :      
      <Link href={ShortSummaryRelLink + "?symbol=" + params.row["symbol"] + "&showChart=true"} target="_blank" rel="noreferrer noopener">
        <span>{(params.value * 100).toFixed(2) + "%"}</span>
      </Link>
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