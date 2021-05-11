import React, { useState, useEffect, useRef } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import { createMuiTheme } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip'
import { isMobile } from 'react-device-detect'
import shortid from 'shortid'
import { StockSectorDict, StockIndustryDict } from '../common/stockdef'

import commonStyle from './common.module.scss'
import filterSectorsIndustriesStyle from './filterSectorsIndustries.module.scss'


const FilterSectorsIndustries = ({ filterSectorsIndustriesRef }) => {

  // filterSectorsIndustriesRef API
  filterSectorsIndustriesRef.current.getValue = () => {
    return {
      sectors: sectors,
      industries: industries
    }
  }

  filterSectorsIndustriesRef.current.setValue = (FSISetting) => {

    let sectors_t = { ...sectors }
    Object.entries(FSISetting.sectors).forEach(([key, value]) => {
      sectors_t[key] = value
    })
    setSectors(sectors_t)

    let industries_t = { ...industries }
    Object.entries(FSISetting.industries).forEach(([key, value]) => {
      industries_t[key] = value
    })
    setIndustries(industries_t)
  }

  const [sectors, setSectors] = useState(Object.keys(StockSectorDict).reduce((accumulator, currentKey) => {
    if (currentKey != "-1") { // Nan don't care
      accumulator[currentKey] = false
    }
    return accumulator
  }, {}))

  const [industries, setIndustries] = useState(Object.keys(StockIndustryDict).reduce((accumulator, currentKey) => {
    if (currentKey != "-1") { // Nan don't care
      accumulator[currentKey] = false
    }
    return accumulator
  }, {}))

  // chip color
  let chipColor = {
    palette: {
      default:
      {
        main: { backgroundColor: '#e0e0e0', color: 'rgba(0, 0, 0, 0.87)' }
      },
      activate: 
      {
        main: { backgroundColor: '#ff5722', color: '#fff' }
      }
    }
  }

  const chipTheme = createMuiTheme(chipColor)

  /*
  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    return () => {
      // componentWillUnmount is here!
    }
  }, [])
  */

  return (
    <div className={filterSectorsIndustriesStyle.container}>
      <div>
        {Object.keys(StockSectorDict).map((key, index) => {
          if (key == "-1") { // remove Nan
            return
          }

          return (
            <Chip key={'sector_' + key}
              label={StockSectorDict[key]}
              style={sectors[key] ? { ...chipTheme.palette.activate.main, ...{ margin: '3px 5px' } } : { ...chipTheme.palette.default.main, ...{ margin: '3px 5px' } }}
              onClick={() => {
                let sectors_t = { ...sectors }
                sectors_t[key] = !sectors_t[key]
                setSectors(sectors_t)
              }} />
          )
        })}
      </div>
    </div>
  )
}


export default FilterSectorsIndustries
