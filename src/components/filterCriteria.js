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

  // variables
  const valueStartRef = useRef('')
  const valueEndRef = useRef('')

  // arg select
  const { name, display_name, args_items, default_index} = dataTemplate
  const [arg, setArg] = useState(default_index)
  const argSelectChange = (event) => {
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
            label="Arg"
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
          <TextField id="FilterCriteria-value-start" className={filterCriteriaStyle.valueText} label="From" variant="outlined" size="small" inputRef={valueStartRef} onClick={()=>{
            console.log(valueStartRef.current.value)
          }}/>
        </form>
        <div>-</div>
        <form noValidate autoComplete="off">
          <TextField id="FilterCriteria-value-end" className={filterCriteriaStyle.valueText} label="End" variant="outlined" size="small" inputRef={valueEndRef} onClick={() => {
            console.log(valueEndRef.current.value)
          }} />
        </form>
      </div>
    </>
  )
}


export default FilterCriteria
