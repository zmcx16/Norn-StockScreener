import React, { useState, useRef, createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import { blue } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles'
import { isMobile } from 'react-device-detect'
import shortid from "shortid"
import useFetch from 'use-http'

import { StockSectorDict, StockIndustryDict} from '../common/stockdef'
import { FCDataTemplate } from '../common/baseargs'
import { NSSServerUrl, NSSDoQueryAPI } from '../common/common'
import FilterCriteria from './filterCriteria'
import NornMinehunter from './nornMinehunter'
import LoadingAnime from './loadingAnime'

import filterContainerStyle from './filterContainer.module.scss'

const customTheme = createMuiTheme({
  palette: {
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
const QueryStocks = ({ queryStocksRef, loadingAnimeRef, filterCriteriaListRef, nornMinehunterRef, ResultTableRef, modalWindowRef}) => {
  
  //const { post, response } = useFetch('http://localhost:7071')
  const { post, response } = useFetch(NSSServerUrl)

  queryStocksRef.current = {
    doQuery: async () => {

      loadingAnimeRef.current.setLoading(true)

      let queryData = getCurrentSetting(filterCriteriaListRef, nornMinehunterRef)
      //console.log(queryData)

      const resp_data = await post(NSSDoQueryAPI, queryData)
      if (response.ok) {
        //console.log(resp_data)

        if (resp_data['ret'] === 0){

          let output = resp_data['data'].map((value, index)=>{
            return { 
              id: index, 
              symbol: value['symbol'], 
              sector: value['sector'] in StockSectorDict ? StockSectorDict[value['sector'].toString()] : StockSectorDict["-1"],
              industry: value['sector'] in StockIndustryDict ? StockIndustryDict[value['industry'].toString()] : StockIndustryDict["-1"],
              marketCap: value['marketCap'] === '-' ? 'NaN' : value['marketCap'],
              PE: value['PE'] === '-' ? 'NaN' : value['PE'],
              PB: value['PB'] === '-' ? 'NaN' : value['PB'],
              price: value['price'] === '-' ? 'NaN' : value['price'],
              change: value['change'] === '-' ? 'NaN' : value['change'],
              volume: value['volume'] === '-' ? 'NaN' : value['volume'],
              risk: value['risk'] === -1 ? 'NaN' : value['risk'],
              tactics: nornMinehunterRef.current.getEnableTacticStrings(),
            }
          })

          ResultTableRef.current.setTable(output)

        }else{
          modalWindowRef.current.popModalWindow(
            <>
              <h2>Get Search Result Failed, ret={resp_data['ret']}</h2>
            </>
          )
        }

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
            <MuiThemeProvider theme={createMuiTheme({ palette: { primary: blue } })}>
              <Button className={filterContainerStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                queryStocksRef.current.doQuery()
              }}>{isMobile ? 'Query' : 'Query Now'}</Button>
            </MuiThemeProvider>
          </div>
        </MuiThemeProvider>
      </div>
      <LoadingAnime loadingAnimeRef={loadingAnimeRef}/>
      <ModalWindow modalWindowRef={modalWindowRef} />
      <QueryStocks queryStocksRef={queryStocksRef} loadingAnimeRef={loadingAnimeRef} filterCriteriaListRef={filterCriteriaListRef} ResultTableRef={ResultTableRef} nornMinehunterRef={nornMinehunterRef} modalWindowRef={modalWindowRef}/>
    </>
  )
}

export default FilterContainer
