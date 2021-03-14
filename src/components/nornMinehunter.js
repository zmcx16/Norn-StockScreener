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

import { NMDataTemplate, NMNote, NMUrl } from '../common/nm'
import { getFromEndVal } from '../common/utils'

import commonStyle from './common.module.scss'
import nornMinehunterStyle from './nornMinehunter.module.scss'


const NornMinehunter = ({ nornMinehunterRef }) => {

  // nornMinehunterRef API
  nornMinehunterRef.current.getValue = () => {
    return { 
      tactics: tactic,
      from: valueFromRef.current.value, 
      end: valueEndRef.current.value 
    }
  }

  nornMinehunterRef.current.setValue = (NMSetting) => {

    setValueFromEnd(genFromEndTextField(valueFromRef, valueEndRef, NMSetting.from, NMSetting.end))

    let tactic_t = { ...tactic }
    Object.entries(NMSetting.tactics).forEach(([key, value]) => {
      tactic_t[key] = value
    })
    setTactic(tactic_t)
  }

  nornMinehunterRef.current.getEnableTacticStrings = () => {
    let enableList=[]
    Object.entries(tactic).forEach(([key, value]) => {
      if (value){
        enableList.push(key)
      }
    })
    return enableList.join(",")
  }

  // gen node
  const genFromEndTextField = (inputFromRef, inputEndRef, FromValue, EndValue) => {

    // add key to force re-render component
    return <>
      <form noValidate autoComplete="off">
        <TextField id="nornMinehunter-value-from" key={shortid.generate()} className={nornMinehunterStyle.valueText} label="From" variant="outlined" defaultValue={FromValue} size="small" inputRef={inputFromRef}/>
      </form>
      <div>-</div>
      <form noValidate autoComplete="off">
        <TextField id="nornMinehunter-value-end" key={shortid.generate()} className={nornMinehunterStyle.valueText} label="End" variant="outlined" defaultValue={EndValue} size="small" inputRef={inputEndRef}/>
      </form>
    </>
  }

  // tactic
  const [tactic, setTactic] = useState(NMDataTemplate.tactics.reduce((accumulator, currentValue)=>{
    accumulator[currentValue.type] = currentValue.enable
    return accumulator
  }, {}))

  // tactic color
  let tacticsColor = {
    palette: { 
      default: 
      {
        main: { backgroundColor: '#e0e0e0', color: 'rgba(0, 0, 0, 0.87)' },
        avatar: { backgroundColor: '#bdbdbd', color: '#616161' },
      }
    }
  }

  NMDataTemplate.tactics.forEach((element)=>{
    tacticsColor.palette[element.type] = element.color
  })

  const tacticsTheme = createMuiTheme(tacticsColor)

  // set arg value
  const valueFromRef = useRef({ value: '' })
  const valueEndRef = useRef({ value: '' })
  const [valueFromEnd, setValueFromEnd] = useState(genFromEndTextField(valueFromRef, valueEndRef, '', ''))


  // arg select
  const display_name = 'Norn-Minehunter'
  const args_items = ["Any", "< 20", "< 40", "< 60", "< 80", "> 0", "> 20", "> 40", "> 60", "> 80"]
  const default_index = 3

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
    isMobile ? setArgNodesStyle(nornMinehunterStyle.argNodesMobile) : setArgNodesStyle(nornMinehunterStyle.argNodes)
    if(isMobile){
      setTitleEmptyNode(<><div></div><div></div><div></div><div></div></>)
    }
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  const [argNodesStyle, setArgNodesStyle] = useState()
  const [titleEmptyNode, setTitleEmptyNode] = useState(<></>)

  return (
    <div className={nornMinehunterStyle.container}>
      <div className={argNodesStyle}>
        <Tooltip arrow title={<span style={{ whiteSpace: 'pre-line' }}>{NMNote}</span>} >
          <Link href={NMUrl} target="_blank" rel="noreferrer noopener">
            <span className={nornMinehunterStyle.displayName + ' ' + commonStyle.comicFont}>{display_name}</span>
          </Link>
        </Tooltip>
        {titleEmptyNode}
        <FormControl size="small" variant="outlined" className={nornMinehunterStyle.argNodesSelect}>
          <InputLabel htmlFor="arg-select">Avg Score</InputLabel>
          <Select
            native
            value={arg}
            displayEmpty
            onChange={(event) => {
              renderValueFromEnd(event.target.value)
            }}
            label='avg score'
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
      <div>
        {NMDataTemplate.tactics.map((value, index) => {
          return (
            <Chip key={value.type}
              avatar={
                <Avatar
                  style={tactic[value.type] ? tacticsTheme.palette[value.type].avatar : tacticsTheme.palette.default.avatar}
                >{value.abbr}</Avatar>
              }
              label={value.type} 
              style={tactic[value.type] ? { ...tacticsTheme.palette[value.type].main, ...{ margin: '3px 5px' } } : { ...tacticsTheme.palette.default.main, ...{ margin: '3px 5px' }}}
              onClick={() => {
                let tactic_t = { ...tactic }
                tactic_t[value.type] = !tactic_t[value.type]
                setTactic(tactic_t)
              }} />
          )
        })}
      </div>
    </div>
  )
}


export default NornMinehunter
