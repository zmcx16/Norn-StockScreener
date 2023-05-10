import React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { NoMaxWidthTooltip } from './reactUtils'
import { FinvizUrl, YahooFinanceEnUrl } from './common'
import { convertKMBT } from './utils'

// export const YahooFinanceUrl = NavZhEnUrl(YahooFinanceZhUrl, YahooFinanceEnUrl)
export const YahooFinanceUrl = YahooFinanceEnUrl

export function SymbolNameField(headerName, width, description = null) {
  return {
    accessorKey: "symbol",
    header: headerName,
    size: width,
    enableColumnOrdering: false,
    Header: ({ column }) => (
      description ? 
      <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{description}</span>} >
        <Typography style={{cursor: 'pointer'}}>{column.columnDef.header}</Typography>
      </NoMaxWidthTooltip> :
      <Typography>{column.columnDef.header}</Typography>
    ),
    Cell: ({ cell }) => (
      <Link href={ FinvizUrl + 'quote.ashx?t=' + cell.getValue()} target="_blank" rel="noreferrer noopener">
        <span>{cell.getValue()}</span>
      </Link>
    ),
  }
}

export function PriceField(field, headerName, width, description = null) {
  return {
    accessorKey: field,
    header: headerName,
    size: width,
    enableColumnOrdering: false,
    /* // easy debug
    muiTableBodyCellProps: ({ cell,row }) => ({
      onClick: () => {
        console.log(row);
      },
    }),
    */
    Header: ({ column }) => (
      description ? 
      <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{description}</span>} >
        <Typography style={{cursor: 'pointer'}}>{column.columnDef.header}</Typography>
      </NoMaxWidthTooltip> :
      <Typography>{column.columnDef.header}</Typography>
    ),
    Cell: ({ cell, row }) => (
      cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE || cell.getValue()  === "-" || cell.getValue()  === null || cell.getValue()  === undefined || cell.getValue()  === "Infinity" || cell.getValue()  === 'NaN' ? <span>-</span> :
      <Link href={ YahooFinanceUrl + 'quote/' + row.original.symbol} target="_blank" rel="noreferrer noopener">
        <span>{cell.getValue()}</span>
      </Link>
    ),
  }
}

export function PureFieldWithValueCheck(field, headerName, width, valueFixed, description = null) {
  return {
    accessorKey: field,
    header: headerName,
    size: width,
    enableColumnOrdering: false,
    Header: ({ column }) => (
      description ? 
      <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{description}</span>} >
        <Typography style={{cursor: 'pointer'}}>{column.columnDef.header}</Typography>
      </NoMaxWidthTooltip> :
      <Typography>{column.columnDef.header}</Typography>
    ),
    Cell: ({ cell }) => (
      cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE || cell.getValue()  === "-" || cell.getValue()  === null || cell.getValue()  === undefined || cell.getValue()  === "Infinity" || cell.getValue()  === 'NaN' ? <span>-</span> :
      <span>{cell.getValue().toFixed(valueFixed)}</span>
    ),
  }
}

export function PercentField(field, headerName, width, valueFixed, description = null){
  return {
    accessorKey: field,
    header: headerName,
    size: width,
    enableColumnOrdering: false,
    Header: ({ column }) => (
      description ? 
      <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{description}</span>} >
        <Typography style={{cursor: 'pointer'}}>{column.columnDef.header}</Typography>
      </NoMaxWidthTooltip> :
      <Typography>{column.columnDef.header}</Typography>
    ),
    Cell: ({ cell }) => (
      cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE || cell.getValue()  === "-" || cell.getValue()  === null || cell.getValue()  === undefined || cell.getValue()  === "Infinity" || cell.getValue()  === 'NaN' ? <span>-</span> :
      <span>{(cell.getValue() * 100).toFixed(valueFixed) + "%"}</span>
    ),
  }
}

export function ColorGreenRedPercentField(field, headerName, width, flag, valueFixed, description = null){
  return {
    accessorKey: field,
    header: headerName,
    size: width,
    enableColumnOrdering: false,
    Header: ({ column }) => (
      description ? 
      <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{description}</span>} >
        <Typography style={{cursor: 'pointer'}}>{column.columnDef.header}</Typography>
      </NoMaxWidthTooltip> :
      <Typography>{column.columnDef.header}</Typography>
    ),
    Cell: ({ cell }) => (
      cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE || cell.getValue()  === "-" || cell.getValue()  === null || cell.getValue()  === undefined || cell.getValue()  === "Infinity" || cell.getValue()  === 'NaN' ? <span>-</span> :
      <span style={{ fontWeight: 500, color: Math.sign(parseFloat(cell.getValue() * flag)) === 1 ? 'green' : Math.sign(parseFloat(cell.getValue() * flag)) === -1 ? 'red' : '' }}>{Math.sign(parseFloat(cell.getValue())) === 1 ? '+' : ''}{(cell.getValue()* 100).toFixed(valueFixed) + "%"}</span>
    ),
  }
}