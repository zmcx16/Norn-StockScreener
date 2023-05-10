import React from 'react'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

import { FinvizUrl, YahooFinanceEnUrl } from './common'
import { NoMaxWidthTooltip } from './reactUtils'
import { convertKMBT } from './utils'

// export const YahooFinanceUrl = NavZhEnUrl(YahooFinanceZhUrl, YahooFinanceEnUrl)
export const YahooFinanceUrl = YahooFinanceEnUrl

export function SymbolNameField(field, headerName, width) {
  let output = {
    accessorKey: field,
    header: headerName,
    size: width,
    enableColumnOrdering: false,
    Cell: ({ cell }) => (
      <Link href={ FinvizUrl + 'quote.ashx?t=' + cell.getValue()} target="_blank" rel="noreferrer noopener">
        <span>{cell.getValue()}</span>
      </Link>
    ),
  }
  return output
}

export function PriceField(field, headerName, width) {
  let output = {
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
    Cell: ({ cell, row }) => (
      cell.getValue() === -Number.MAX_VALUE || cell.getValue() === Number.MAX_VALUE ? <span>-</span> :
      <Link href={ YahooFinanceUrl + 'quote/' + row.original.symbol} target="_blank" rel="noreferrer noopener">
        <span>{cell.getValue()}</span>
      </Link>
    ),
  }
  return output
}
