import React, { useState, useEffect, useRef, createRef } from 'react'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip'
import shortid from 'shortid'

import { MFDataTemplate, MFNote, MFUrl } from '../../common/mf'

import commonStyle from '../common.module.scss'
import multiFactorStyle from './multiFactor.module.scss'


const MultiFactor = ({ multiFactorRef }) => {

  // multiFactorRef API
  multiFactorRef.current.getValue = () => {
    return {
      args: MFDataTemplate.weights.reduce((accumulator, currentValue, currentIndex) => {
        accumulator[currentValue.name] = weightListRef.current[currentIndex].current.value
        return accumulator
      }, {})
    }
  }

  multiFactorRef.current.setValue = (MFSetting) => {

    var weight_t = [...MFDataTemplate.weights]
    if (MFSetting && MFSetting.args){
      Object.entries(MFSetting.args).forEach(([setting_key, setting_value]) => {

        MFDataTemplate.weights.some((template_value, template_index) => {
          if (template_value.name === setting_key) {
            weight_t[template_index] = {
              name: setting_key,
              display_name: template_value.display_name,
              val: setting_value
            }
            return true
          } else {
            return false
          }
        })
      })
    }

    weight_t.forEach((value, index) => {
      weightListRef.current[index].current = { value: value.val }
    })

    setWeightListNode(genWeightListField(weight_t))
  }

  const genWeightField = (inputRef, name, value, display_name) => {

    // add key to force re-render component
    return(
      <form noValidate autoComplete="off" key={shortid.generate()}>
        <TextField id={name} className={multiFactorStyle.valueText} label={display_name} variant="outlined" defaultValue={value} size="small" inputRef={inputRef}/>
      </form>
    )
  }

  const genWeightListField = (weights) => {
    return weights.map((value, index) => {
      return (
        genWeightField(weightListRef.current[index], value.name, value.val, value.display_name)
      )
    })
  }

  // weight
  const weightListRef = useRef([])
  MFDataTemplate.weights.forEach((value, index) => {
    weightListRef.current[index] = createRef()
    weightListRef.current[index].current = { value: value.val}
  })

  const [weightListNode, setWeightListNode] = useState(genWeightListField(MFDataTemplate.weights))

  const display_name = 'Multi-Factor Intersectional Model'

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <div className={multiFactorStyle.container}>
      <div>
        <Tooltip arrow title={<span style={{ whiteSpace: 'pre-line' }}>{MFNote}</span>} >
          <Link href={MFUrl} target="_blank" rel="noreferrer noopener">
            <span className={multiFactorStyle.displayName + ' ' + commonStyle.comicFont}>{display_name}</span>
          </Link>
        </Tooltip>
      </div>
      <div className={multiFactorStyle.weightBlock}>
        {weightListNode}
      </div>
    </div>
  )
}


export default MultiFactor
