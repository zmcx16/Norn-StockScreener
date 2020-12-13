import React, { useState, useEffect, useRef, useCallback, createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search';
import { blue, red } from '@material-ui/core/colors'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import shortid from "shortid"
import useFetch from 'use-http'

import { StockSectorDict, StockIndustryDict} from '../common/stockdef'
import { FCDataTemplate } from '../common/baseargs'
import FilterCriteria from './filterCriteria'
import NornMinehunter from './nornMinehunter'
import LoadingAnime from './loadingAnime'

import filterContainerStyle from './filterContainer.module.scss'

const customTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
    import: { 
      backgroundColor: '#43a047', color: '#fff'
    },
    export: { 
      backgroundColor: '#00a152', color: '#fff'
    }
  },
})

const useModalStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const getCurrentSetting = (filterCriteriaListRef, nornMinehunterRef)=>{

  let queryData = { data: { baseArg: [], NornMinehunter: {} } }

  // get basic arg
  FCDataTemplate.forEach((value, index) => {
    queryData.data.baseArg.push(filterCriteriaListRef.current[index].current.getValue())
  })

  // get norn-minehunter args
  queryData.data.NornMinehunter = nornMinehunterRef.current.getValue()

  return queryData
}

// split from FilterContainer to prevent rerender FilterContainer
const QueryStocks = ({ queryStocksRef, loadingAnimeRef, filterCriteriaListRef, nornMinehunterRef, modalWindowRef}) => {
  
  const { post, response } = useFetch('https://localhost:44305')

  queryStocksRef.current = {
    doQuery: async () => {

      loadingAnimeRef.current.setLoading(true)

      let queryData = getCurrentSetting(filterCriteriaListRef, nornMinehunterRef)
      console.log(queryData)
      //setQueryBody({ grr: 'ddd' })

      /*
      ResultTableRef.current.setTable([
        { id: 1, symbol: 'KBAL', sector: StockSectorDict[0], industry: StockIndustryDict[0], marketCap: '419.72M', PE: 12.01, PB: 1.59, price: 11.69, change: '2.11%', volume: '179,751', risk: 33, tactics: 'BenjaminGraham_v1,HarryBurnIII_v1' }
      ])
      */

      const resp_data = await post('/api/task/do-scan', queryData.data)
      if (response.ok) {
        console.log(resp_data)
      } else {
        modalWindowRef.current.popModalWindow(        
          <>
            <h2>Get Search Result Failed.</h2>
          </>
        )
      }
      loadingAnimeRef.current.setLoading(false)

    }
  }

  return (<></>)
}

const ModalWindow = ({ modalWindowRef }) => {
  
  const classes = useModalStyles()

  const [openModal, setOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState(<div></div>)

  modalWindowRef.current = {
    popModalWindow: (content) => {
      setModalNode(
        <div className={classes.paper}>
          {content}
        </div>
      )
      setOpenModal(true)
    }
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={openModal}
      onClose={() => { setOpenModal(false) }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        {modalNode}
      </Fade>
    </Modal>  
  )
}

const FilterContainer = ({ ResultTableRef }) => {

  // API Definition
  const filterCriteriaListRef = useRef([])
  FCDataTemplate.forEach((value, index) => {
    filterCriteriaListRef.current[index] = createRef()
    filterCriteriaListRef.current[index].current = {
      getValue: null
    }
  })

  const nornMinehunterRef = useRef({
    getValue: null
  })

  const loadingAnimeRef = useRef({
    getLoading: null,
    setLoading: null
  })

  const queryStocksRef = useRef({
    doQuery: null
  })

  const modalWindowRef = useRef({
    popModalWindow: null
  })


  const importSetting = (e) => {
    console.log(e.target.files)
    Object.entries(e.target.files).forEach(([key, value]) => {
      var reader = new FileReader();
      reader.onload = (function (theFile) {
        return function (e) {
          let data = JSON.parse(e.target.result)

          nornMinehunterRef.current.setValue(data['data']['NornMinehunter'])
          
          data['data']['baseArg'].forEach((input_v, input_i) => {
            FCDataTemplate.forEach((template_v, template_i) => {
              let name = filterCriteriaListRef.current[template_i].current.getValue()['name']
              if (name === input_v['name']){
                filterCriteriaListRef.current[template_i].current.setValue(input_v)
                return
              }
            })
          })
        }
      })(value)

      reader.readAsBinaryString(value)
      e.target.value = ''
    })
  }

  const exportSetting = (e) => {

    let queryData = getCurrentSetting(filterCriteriaListRef, nornMinehunterRef)

    var aTag = document.createElement('a');
    var blob = new Blob([JSON.stringify(queryData)]);
    aTag.download = 'Norn-StockScreener_setting.json';
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
  }

  return (
    <>
      <div className={filterContainerStyle.container}>
        <Grid container spacing={1}>
          {
            FCDataTemplate.map((value, index) => {
              return <FilterCriteria key={shortid.generate()} filterCriteriaRef={filterCriteriaListRef.current[index]} dataTemplate={value} />
            })
          }
        </Grid>
        <NornMinehunter nornMinehunterRef={nornMinehunterRef}/>
        <MuiThemeProvider theme={customTheme}>
          <div className={filterContainerStyle.cmdPanel}>
            <div></div>
            <Button variant="contained" component="label" style={customTheme.palette.import}>Import
              <input
                type="file"
                hidden
                onChange={importSetting}
              />
            </Button>
            <div></div>
            <Button variant="contained" style={customTheme.palette.export} onClick={exportSetting}>Export</Button>
            <div></div>
            <MuiThemeProvider theme={createMuiTheme({ palette: { primary: blue, secondary: red } })}>
              <Button className={filterContainerStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                queryStocksRef.current.doQuery()
              }}>Query Now</Button>
            </MuiThemeProvider>
          </div>
        </MuiThemeProvider>
      </div>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef}/>
      <ModalWindow modalWindowRef={modalWindowRef} />
      <QueryStocks queryStocksRef={queryStocksRef} loadingAnimeRef={loadingAnimeRef} filterCriteriaListRef={filterCriteriaListRef} nornMinehunterRef={nornMinehunterRef} modalWindowRef={modalWindowRef}/>
    </>
  )
}

export default FilterContainer
