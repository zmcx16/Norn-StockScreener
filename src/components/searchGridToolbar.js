
import React, { useRef } from 'react'
import InputBase from '@mui/material/InputBase'
import InfoIcon from '@mui/icons-material/Info'
import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'
import { GridToolbarContainer } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import { isMobile } from 'react-device-detect'
import { NoMaxWidthTooltip } from '../common/reactUtils'

const SearchGridToolbar = ({ searchVal, setSearchVal, clickCallback, info }) => {
    const searchStockRef = useRef(null)

    var doSearch = () => {
      let symbols = searchStockRef.current.value.replaceAll("\"","").split(',').map((symbol) => symbol.trim().toUpperCase())
      console.log(symbols)
      let config = {filter_symbols: []}
      if (symbols.length !== 0 && symbols[0] !== '') {
          config = {filter_symbols: symbols}
      }
      setSearchVal(searchStockRef.current.value)
      clickCallback(config)
    }

    return (
      <GridToolbarContainer>
        <Paper
            component="form"
            sx={{ p: '6 16', m: 1, display: 'flex', alignItems: 'center' }}
        > 
          <InputBase autoFocus
            sx={{ ml: 1, flex: 1 }}
            style={{width: isMobile ? 200 : 400}}
            placeholder={info.placeholder}
            inputProps={{ 'aria-label': 'search-targets' }}
            defaultValue={searchVal}
            inputRef={searchStockRef}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                doSearch()
                ev.preventDefault();
              }
            }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={doSearch}>
            <SearchIcon />
          </IconButton>
        </Paper>
        {'tooltip' in info ? 
          <NoMaxWidthTooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{info.tooltip.text}</span>} >
            <IconButton onClick={() => window.open(info.tooltip.link, "_blank")}>
              <InfoIcon color="action"/>
            </IconButton>
          </NoMaxWidthTooltip> : <></>
        }
      </GridToolbarContainer>
    )
}

export default SearchGridToolbar
