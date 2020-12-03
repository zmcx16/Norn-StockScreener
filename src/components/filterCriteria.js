import React, { useState, useEffect, useRef, useCallback, createRef } from "react"
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import shortid from "shortid"

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
  filterCriteriaRef.current.getValue = () => {
    return {}
  }

  // gen node
  const genTextField = (id, label, inputRef, defaultValue) => {
    // add key to force re-render component
    return <TextField id={id} key={shortid.generate()} className={filterCriteriaStyle.valueText} label={label} variant="outlined" defaultValue={defaultValue} size="small" inputRef={inputRef} onChange={(e) => {
      console.log(e.target.value)
    }} />
  }

  // set arg value
  const valueFromRef = useRef('')
  const [valueFrom, setValueFrom] = useState(genTextField("FilterCriteria-value-from", "From", valueFromRef, ''))
  const valueEndRef = useRef('')
  const [valueEnd, setValueEnd] = useState(genTextField("FilterCriteria-value-end", "End", valueEndRef, ''))


  // arg select
  const { name, display_name, args_items, default_index } = dataTemplate
  const [arg, setArg] = useState(default_index)
  const argSelectChange = (event) => {

    const index = event.target.value
    const val = args_items[index]
    if (val.includes('<')) {
      let t_arr = val.split('<')
      console.log(t_arr)
      setValueFrom(genTextField("FilterCriteria-value-from", "From", valueFromRef, ''))
      setValueEnd(genTextField("FilterCriteria-value-end", "End", valueEndRef, t_arr[1]))
    }
    else if (val.includes('>')) {
      let t_arr = val.split('>')
      console.log(t_arr)
      setValueFrom(genTextField("FilterCriteria-value-from", "From", valueFromRef, t_arr[1]))
      setValueEnd(genTextField("FilterCriteria-value-end", "End", valueEndRef, ''))
    }
    else {
      let t_arr = val.split('-')
      console.log(t_arr)
      setValueFrom(genTextField("FilterCriteria-value-from", "From", valueFromRef, t_arr[0]))
      setValueEnd(genTextField("FilterCriteria-value-end", "End", valueEndRef, t_arr[1]))
    }

    setArg(event.target.value)
  };

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
            onChange={argSelectChange}
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
        <form noValidate autoComplete="off">
          {valueFrom}
        </form>
        <div>-</div>
        <form noValidate autoComplete="off">
          {valueEnd}
        </form>
      </div>
    </>
  )
}


export default FilterCriteria
