import React, { useState, useRef, createRef } from 'react'
import Chip from '@mui/material/Chip'
import { createTheme } from '@mui/material/styles'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import shortid from 'shortid'
import { StockSectorDict, StockIndustryDict } from '../../common/stockdef'
import { FinvizUrl} from '../../common/common'

import filterSectorsIndustriesStyle from './filterSectorsIndustries.module.scss'


const ChipObj = ({chipObjRef, text}) => {

  chipObjRef.current.getValue = () => {
    return value
  }

  chipObjRef.current.setValue = (value) => {
    setValue(value)
  }

  const [value, setValue] = useState(false)

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

  const chipTheme = createTheme(chipColor)

  return <Chip
    label={text}
    style={value ? { ...chipTheme.palette.activate.main, ...{ margin: '3px 5px' } } : { ...chipTheme.palette.default.main, ...{ margin: '3px 5px' } }}
    onClick={() => {
      setValue(!value)
    }} 
  />
}

const FilterSectorsIndustries = ({ filterSectorsIndustriesRef }) => {

  // filterSectorsIndustriesRef API
  filterSectorsIndustriesRef.current.getValue = () => {
    return {
      sectors: Object.keys(filterSectorsRef.current).reduce((accumulator, currentKey) => {
        if (filterSectorsRef.current[currentKey].current.getValue())
          accumulator.push(currentKey)
        return accumulator
      }, []),
      industries: Object.keys(filterIndustriesRef.current).reduce((accumulator, currentKey) => {
        if (filterIndustriesRef.current[currentKey].current.getValue())
          accumulator.push(currentKey)
        return accumulator
      }, [])
    }
  }

  filterSectorsIndustriesRef.current.setValue = (FSISetting) => {

    Object.entries(filterSectorsRef.current).forEach(([key, value]) => {
      if (key in FSISetting.sectors)
        filterSectorsRef.current[key].current.setValue(true)
      else
        filterSectorsRef.current[key].current.setValue(false)
    })

    Object.entries(filterIndustriesRef.current).forEach(([key, value]) => {
      if (key in FSISetting.industries)
        filterIndustriesRef.current[key].current.setValue(true)
      else
        filterIndustriesRef.current[key].current.setValue(false)
    })
  }

  const filterSectorsRef = useRef({})
  Object.entries(StockSectorDict).forEach(([key, value]) => {
    if (key !== "-1") {
      filterSectorsRef.current[key] = createRef()
      filterSectorsRef.current[key].current = {
        getValue: null
      }
    }
  })

  const filterIndustriesRef = useRef({})
  Object.entries(StockIndustryDict).forEach(([key, value]) => {
    if (key !== "-1") {
      filterIndustriesRef.current[key] = createRef()
      filterIndustriesRef.current[key].current = {
        getValue: null
      }
    }
  })

  const renderShowHideCheckbox = (id, labeltext, link, linkText)=> {
    return <FormControlLabel
      control={
        <Checkbox
          onChange={(event) => {
            // useState will re-render too many item and drop state, update real dom element css style directly.
            document.getElementById(id).style.display = event.target.checked ? 'block' : 'none'
          }}
          name={labeltext}
          color="secondary"
        />
      }
      label={
        <div>
          <span>{labeltext}&nbsp;</span>
          <Link href={link} target="_blank" rel="noreferrer noopener" underline='none'>
            <span>({linkText})</span>
          </Link>
        </div>
      }
    />
  }

  const renderSIContainer = (dataRef, defDict) => {
    var dataList = Object.keys(dataRef.current).map(function (key) {
      return [key, defDict[key]]
    })
    dataList.sort(function (first, second) {
      var orderBool = first[1] > second[1]
      return orderBool ? 1 : -1
    })

    return dataList.map((data) => {
      return <ChipObj chipObjRef={dataRef.current[data[0]]} text={data[1]} key={shortid.generate()} />
    })
  }

  return (
    <div className={filterSectorsIndustriesStyle.container}>
      <FormGroup row>
        {renderShowHideCheckbox('sectorContainer', 'Filter Sectors', FinvizUrl + 'groups.ashx?g=sector&v=152&o=-perf1w&c=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26', 'Index')}
        {renderShowHideCheckbox('industryContainer', 'Filter Industries', FinvizUrl + 'groups.ashx?g=industry&v=152&o=-perf1w&c=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26', 'Index')}
      </FormGroup>
      <div id={'sectorContainer'} className={filterSectorsIndustriesStyle.SectorIndustryContainer}>
        {renderSIContainer(filterSectorsRef, StockSectorDict)}
      </div>
      <div id={'industryContainer'} className={filterSectorsIndustriesStyle.SectorIndustryContainer}>
        {renderSIContainer(filterIndustriesRef, StockIndustryDict)}
      </div>
    </div>
  )
}


export default FilterSectorsIndustries
