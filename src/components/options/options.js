import React, { useState, useEffect, useRef } from 'react'
import Grid from '@material-ui/core/Grid'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import shortid from 'shortid'
import useFetch from 'use-http'

import ModalWindow from '../modalWindow'
import { GetDataByFetchObj } from '../../common/reactUtils'
import { Options_Def } from '../../common/optionsDef'

import commonStyle from '../common.module.scss'
import optionsStyle from './options.module.scss'


const Options = ({loadingAnimeRef}) => {

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null,
  })

  const fetchOptionsData = useFetch({ cachePolicy: 'no-cache' })

  const renderOptionsData = (file_name) => {
    Promise.all([
      GetDataByFetchObj('/norn-data/options/' + file_name + '.json', fetchOptionsData),
    ]).then((allResponses) => {
      console.log(allResponses)
      if (allResponses.length == 1 && allResponses[0] !== null) {
        loadingAnimeRef.current.setLoading(false)
      } else {
        console.error("renderOptionsData some data failed")
        modalWindowRef.current.popModalWindow(<div>Get some data failed...</div>)
        loadingAnimeRef.current.setLoading(false)
      }
    }).catch(() => {
      console.error("renderOptionsData failed")
      modalWindowRef.current.popModalWindow(<div>Get data failed...</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  const refreshData = (name) => {
    if (name.startsWith('self_query')) {
      // self query mode
    } else {
      renderOptionsData(name)
    }
  }

  const [optionsTable, setOptionsTable] = useState()
  const [arg, setArg] = useState(0)

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    refreshData(Options_Def[0].name)

    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <div className={commonStyle.defaultFont + ' ' + optionsStyle.container}>
      <div key={shortid.generate()} >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl size="small" variant="outlined" className={optionsStyle.optionsTableSelect}>
              <InputLabel htmlFor="arg-select">{'Options Valuation'}</InputLabel>
              <Select
                native
                value={arg}
                displayEmpty
                onChange={(event) => {
                  setArg(event.target.value)
                  refreshData(Options_Def[event.target.value].name)
                }}
                label={'Options Valuation'}
              >
                {
                  Options_Def.map((value, index) => {
                    return <option key={shortid.generate()} index={index} value={index}>{value.display_name}</option>
                  })
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {optionsTable}
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default Options
