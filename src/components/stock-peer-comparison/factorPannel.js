import React, { useState, useEffect } from 'react'
import Chip from '@mui/material/Chip'
import { createTheme } from '@mui/material/styles'

import { PeerTemplate } from '../../common/peer'

import factorPannelStyle from './factorPannel.module.scss'

const FactorPannel = ({ factorPannelRef }) => {

  // factorPannelRef API
  factorPannelRef.current.getValue = () => {
    return { 
      tactics: tactic,
    }
  }

  factorPannelRef.current.setValue = (Setting) => {
    let tactic_t = { ...tactic }
    Object.entries(Setting.tactics).forEach(([key, value]) => {
      tactic_t[key] = value
    })
    setTactic(tactic_t)
  }

  factorPannelRef.current.getEnableTacticStrings = () => {
    let enableList=[]
    Object.entries(tactic).forEach(([key, value]) => {
      if (value){
        enableList.push(key)
      }
    })
    return enableList.join(",")
  }

  // tactic
  const [tactic, setTactic] = useState(PeerTemplate.tactics.reduce((accumulator, currentValue)=>{
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

  PeerTemplate.tactics.forEach((element)=>{
    tacticsColor.palette[element.type] = element.color
  })

  const tacticsTheme = createTheme(tacticsColor)

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <div className={factorPannelStyle.container}>
      <div>
        {PeerTemplate.tactics.map((value) => {
          return (
            <Chip key={value.type}
              label={value.displayName} 
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


export default FactorPannel
