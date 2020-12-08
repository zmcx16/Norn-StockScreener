import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import shortid from "shortid"

import { getFromEndVal } from '../common/utils'

import filterCriteriaStyle from "./filterCriteria.module.scss"

/*
// data sample
{
  "name": "P/B",
  "display_name": "Price-Book Ratio",
  "args_items": ["< 0", "0 - 0.5", "0.5 - 1.0", "1.0 - 1.5", "1.5 - 2.0", "2.0 - 3.0", "> 3.0"],
  "default_index": 2
}
*/

const FilterCriteria = ({ filterCriteriaRef, dataTemplate }) => {

  // filterCriteriaRef API
  filterCriteriaRef.getValue = () => {
    return {}
  }

  // gen node
  const genFromEndTextField = (inputFromRef, inputEndRef, FromValue, EndValue) => {

    // add key to force re-render component
    return <>
      <form noValidate autoComplete="off">
        <TextField id="FilterCriteria-value-from" key={shortid.generate()} className={filterCriteriaStyle.valueText} label="From" variant="outlined" defaultValue={FromValue} size="small" inputRef={inputFromRef} onChange={(e) => {
          console.log(e.target.value)
        }} />
      </form>
      <div>-</div>
      <form noValidate autoComplete="off">
        <TextField id="FilterCriteria-value-end" key={shortid.generate()} className={filterCriteriaStyle.valueText} label="End" variant="outlined" defaultValue={EndValue} size="small" inputRef={inputEndRef} onChange={(e) => {
          console.log(e.target.value)
        }} />
      </form>
    </>
  }

  // set arg value
  const valueFromRef = useRef({ value: '' })
  const valueEndRef = useRef({ value: '' })
  const [valueFromEnd, setValueFromEnd] = useState(genFromEndTextField(valueFromRef, valueEndRef, '', ''))

  // arg select
  const { name, display_name, args_items, default_index } = dataTemplate
  const [arg, setArg] = useState(default_index)

  const renderValueFromEnd = (index) => {
    const fromEnd = getFromEndVal(args_items[index])
    setValueFromEnd(genFromEndTextField(valueFromRef, valueEndRef, fromEnd[0], fromEnd[1]))
    setArg(index)
  }


  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    renderValueFromEnd(default_index)
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <>
      <div className={filterCriteriaStyle.argNodes}>
        <span className={filterCriteriaStyle.display_name}>{display_name}</span>
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
