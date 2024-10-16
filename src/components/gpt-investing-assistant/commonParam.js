import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import OutlinedInput from '@mui/material/OutlinedInput'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import shortid from 'shortid'
import dayjs from 'dayjs'

import { GPTModelSelectDef } from '../../common/gpt/commonDef'

import gptInvestingAssistantStyle from './gptInvestingAssistant.module.scss'


const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 13.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export const DatePickerComponent = ({ datePickerRef, label }) => {
  const [value, setValue] = useState(dayjs(new Date()))
  datePickerRef.current.getValue = () => {
    return dayjs(value).format('YYYY-MM-DD')
  }
  const handleChange = (newValue) => {
    setValue(newValue)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        inputFormat="MM/DD/YYYY"
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField size="small" {...params} />}
      />
    </LocalizationProvider>
  );
}

export const ModelComponent = ({ modelInputRef }) => {
  const [modelArg, setModelArg] = useState(0);
  const [modelInputValue, setModelInputValue] = useState(GPTModelSelectDef[0]);

  const handleModelChange = (event) => {
    const selectedModel = GPTModelSelectDef[event.target.value];
    setModelArg(event.target.value);
    setModelInputValue(selectedModel);
  }

  const renderModelInput = (value) => {
    return (
      <form noValidate autoComplete="off" style={{ paddingLeft: "5px", width: "inherit" }}>
        <TextField
          className={gptInvestingAssistantStyle.valueText}
          placeholder="Select or type the model name"
          label={"GPT Model"}
          variant="outlined"
          value={value}
          onChange={(e) => setModelInputValue(e.target.value)}
          size="small"
          inputRef={modelInputRef}
        />
      </form>
    )
  }

  return (
    <div style={{ display: "inline-flex", width: "100%" }}>
      <FormControl size="small" variant="outlined" style={{ minWidth: "150px" }}>
        <InputLabel htmlFor="modelArg-select">{'Model Name'}</InputLabel>
        <Select
          native
          value={modelArg}
          displayEmpty
          onChange={handleModelChange}
          label={'Model Name'}
        >
          {GPTModelSelectDef.map((value, index) => (
            <option key={shortid.generate()} index={index} value={index}>
              {value}
            </option>
          ))}
        </Select>
      </FormControl>
      {renderModelInput(modelInputValue)} 
    </div>
  )
}

export const FiltersComponent = ({ filtersRef, filterName, filtersDef}) => {
  const [filtersArg, setFiltersArg] = useState(filtersRef.current)
  return (
    <FormControl size="small" variant="outlined" style={{width:"100%"}}>
      <InputLabel htmlFor="filtersArg-select">{filterName}</InputLabel>
      <Select
        value={filtersArg}
        multiple
        onChange={(event) => {
          filtersRef.current = event.target.value
          setFiltersArg(event.target.value)
        }}
        label={filterName}
        input={<OutlinedInput label={filterName} />}
        renderValue={(selected) => selected.map((value) => filtersDef[value].display_name).join(', ')}
        MenuProps={MenuProps}
      >
        {
          filtersDef.map((value, index) => {
            return (
              <MenuItem key={index} value={index}>
                <Checkbox checked={filtersArg.includes(index)} />
                <ListItemText primary={value.display_name} />
              </MenuItem>)
          })
        }
      </Select>
    </FormControl>)
}