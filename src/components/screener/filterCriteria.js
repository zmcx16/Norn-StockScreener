import React, { useState, useEffect, useRef } from 'react'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { isMobile } from 'react-device-detect'
import shortid from 'shortid'

import { argSetValueBackgroundColor } from '../../common/common'
import { getFromEndVal } from '../../common/utils'

import filterCriteriaStyle from './filterCriteria.module.scss'

/*
// data sample
{
  "name": "P/B",
  "display_name": "Price-Book Ratio",
  "type": 1,
  "args_items": ["< 0", "0 - 0.5", "0.5 - 1.0", "1.0 - 1.5", "1.5 - 2.0", "2.0 - 3.0", "> 3.0"],
  "default_index": 2
}
*/

const FilterCriteria = ({ filterCriteriaRef, dataTemplate }) => {

  // filterCriteriaRef API
  filterCriteriaRef.current.getValue = () => {
    return { name: name, type: type, from: valueFromRef.current.value, end: valueEndRef.current.value}
  }

  filterCriteriaRef.current.setValue = (value) => {
    setValueFromEnd(genFromEndTextField(valueFromRef, valueEndRef, value.from, value.end))
    renderNodeColor(value.from, value.end)
  }
  

  // gen node
  const genFromEndTextField = (inputFromRef, inputEndRef, FromValue, EndValue) => {

    // add key to force re-render component
    return <>
      <form noValidate autoComplete="off">
        <TextField key={shortid.generate()} className={filterCriteriaStyle.valueText} label="From" variant="outlined" defaultValue={FromValue} size="small" inputRef={inputFromRef} onChange={(e) => {
          renderNodeColor(inputFromRef.current.value, inputEndRef.current.value)
        }} />
      </form>
      <div>-</div>
      <form noValidate autoComplete="off">
        <TextField key={shortid.generate()} className={filterCriteriaStyle.valueText} label="End" variant="outlined" defaultValue={EndValue} size="small" inputRef={inputEndRef} onChange={(e) => {
          renderNodeColor(inputFromRef.current.value, inputEndRef.current.value)
        }} />
      </form>
    </>
  }

  // node background color
  const [argNodesColor, setArgNodesColor] = useState('')
  // render node color
  const renderNodeColor = (from, end) => {
    if (from === '' && end === '')
      setArgNodesColor('')
    else
      setArgNodesColor(argSetValueBackgroundColor)
  }

  // set arg value
  const valueFromRef = useRef({ value: '' })
  const valueEndRef = useRef({ value: '' })
  const [valueFromEnd, setValueFromEnd] = useState(genFromEndTextField(valueFromRef, valueEndRef, '', ''))

  // arg select
  const { name, display_name, type, tooltip, args_items, default_index } = dataTemplate
  const [arg, setArg] = useState(default_index)

  const renderValueFromEnd = (index) => {

    const fromEnd = getFromEndVal(args_items[index])
    setValueFromEnd(genFromEndTextField(valueFromRef, valueEndRef, fromEnd[0], fromEnd[1]))
    setArg(index)

    renderNodeColor(fromEnd[0], fromEnd[1])
  }


  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    renderValueFromEnd(default_index)
    renderTitleNode()
    setVisible('visible')
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  const [titleNode, setTitleNode] = useState(<></>)

  const renderTitleNode = () => {
    setTitleNode(
      <>
        {isMobile ?
          <div></div>
          :
          <Tooltip arrow title={<span style={{  fontSize: '14px', whiteSpace: 'pre-line' }}>{tooltip}</span>} >
            <span className={filterCriteriaStyle.display_name}>{display_name}</span>
          </Tooltip>
        } 
      </>
    )
  }

  const [visible, setVisible] = useState('hidden')

  return (
    <> 
      <div className={filterCriteriaStyle.argNodes} style={{ background: argNodesColor, visibility: visible }}>
        {titleNode}
        <FormControl size="small" variant="outlined" className={filterCriteriaStyle.argNodesSelect}>
          <InputLabel htmlFor="arg-select">{name}</InputLabel>
          <Select
            native
            value={arg}
            displayEmpty
            onChange={(event) => {
              renderValueFromEnd(event.target.value)
            }}
            label={name}
          >
            {
              args_items.map((value, index) => {
                return <option key={shortid.generate()} index={index} value={index}>{value}</option>
              })
            }
          </Select>
        </FormControl>
        <div></div>
        {valueFromEnd}
      </div>
    </>
  )
}


export default FilterCriteria
