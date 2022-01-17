import React, { useRef, useEffect, createRef } from 'react'
import Grid from '@material-ui/core/Grid'
import { blue } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'

import { isMobile } from 'react-device-detect'
import shortid from "shortid"
import useFetch from 'use-http'

import { StockSectorDict, StockIndustryDict} from '../../common/stockdef'
import { FCDataTemplate } from '../../common/argsList'
import { NSSServerUrl, NSSDoQueryAPI } from '../../common/common'
import FilterCriteria from './filterCriteria'
import ModalWindow from '../modalWindow'
import NornMinehunter from './nornMinehunter'
import MultiFactor from './multiFactor'
import FilterSectorsIndustries from './filterSectorsIndustries'

import filterContainerStyle from './filterContainer.module.scss'

const customTheme = createTheme({
  palette: {
    import: { 
      backgroundColor: '#43a047', color: '#fff'
    },
    export: { 
      backgroundColor: '#00a152', color: '#fff'
    }
  },
})

const getCurrentSetting = (filterCriteriaListRef, nornMinehunterRef, multiFactorRef, filterSectorsIndustriesRef)=>{

  let queryData = { data: { baseArg: [], advArg: [], NornMinehunter: {}, Factor_Intersectional_v1: {}, sector_industries: {} } }

  // get basic arg
  FCDataTemplate.forEach((value, index) => {
    let argVal = filterCriteriaListRef.current[index].current.getValue()
    if (argVal.type === 0){
      queryData.data.baseArg.push(argVal)
    } else if (argVal.type === 1) {
      queryData.data.advArg.push(argVal)
    }
  })

  queryData.data.NornMinehunter = nornMinehunterRef.current.getValue()
  queryData.data.Factor_Intersectional_v1 = multiFactorRef.current.getValue()
  queryData.data.sector_industries = filterSectorsIndustriesRef.current.getValue()

  return queryData
}

// split from FilterContainer to prevent rerender FilterContainer
const QueryStocks = ({ queryStocksRef, loadingAnimeRef, filterCriteriaListRef, nornMinehunterRef, multiFactorRef, filterSectorsIndustriesRef, ResultTableRef, modalWindowRef}) => {
  
  //const { post, response } = useFetch('https://localhost:44305')
  const { post, response } = useFetch(NSSServerUrl)

  queryStocksRef.current = {
    doQuery: async () => {

      loadingAnimeRef.current.setLoading(true)

      let queryData = getCurrentSetting(filterCriteriaListRef, nornMinehunterRef, multiFactorRef, filterSectorsIndustriesRef)
      console.log(queryData)

      const resp_data = await post(NSSDoQueryAPI, queryData)
      if (response.ok) {
        console.log(resp_data)

        if (resp_data['ret'] === 0){

          let output = resp_data['data'].map((value, index)=>{
            return { 
              id: index, 
              symbol: value['symbol'], 
              sector: value['sector'] in StockSectorDict ? StockSectorDict[value['sector'].toString()] : StockSectorDict["-1"],
              industry: value['sector'] in StockIndustryDict ? StockIndustryDict[value['industry'].toString()] : StockIndustryDict["-1"],
              marketCap: value['marketCap'] === '-' ? -Number.MAX_VALUE : value['marketCap'],
              PE: value['PE'] === '-' ? -Number.MAX_VALUE : value['PE'],
              PB: value['PB'] === '-' ? -Number.MAX_VALUE : value['PB'],
              price: value['price'] === '-' ? -Number.MAX_VALUE : value['price'],
              change: value['change'] === '-' ? -Number.MAX_VALUE : value['change'],
              volume: value['volume'] === '-' ? -Number.MAX_VALUE : value['volume'],
              beneish_score: value['beneish_score'] < -10000000 ? -Number.MAX_VALUE : value['beneish_score'],
              risk: value['risk'] === -1 ? -Number.MAX_VALUE : value['risk'],
              multiFactor: value['mf_score'] < 0 ? -Number.MAX_VALUE : value['mf_score'],
              tactics: nornMinehunterRef.current.getEnableTacticStrings(),
            }
          })

          ResultTableRef.current.setTable(output)

        }else {
          modalWindowRef.current.popModalWindow(<h2>Get Search Result Failed, ret={resp_data['ret']}</h2>)
        }

      }else {
        modalWindowRef.current.popModalWindow(<h2>Get Search Result Failed.</h2>)
      }

      loadingAnimeRef.current.setLoading(false)
    }
  }

  return (<></>)
}

const FilterContainer = ({ ResultTableRef, loadingAnimeRef }) => {

  // API Definition
  const filterCriteriaListRef = useRef([])
  FCDataTemplate.forEach((value, index) => {
    filterCriteriaListRef.current[index] = createRef()
    filterCriteriaListRef.current[index].current = {
      getValue: null
    }
  })

  const filterSectorsIndustriesRef = useRef({
    getValue: null
  })

  const nornMinehunterRef = useRef({
    getValue: null
  })

  const multiFactorRef = useRef({
    getValue: null
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
          multiFactorRef.current.setValue(data['data']['Factor_Intersectional_v1'])
          filterSectorsIndustriesRef.current.setValue(data['data']['sector_industries'])

          let argType = ['baseArg', 'advArg']
          argType.forEach((v, i) => {
            if(data['data'][v]){
              data['data'][v].forEach((input_v, input_i) => {
                FCDataTemplate.forEach((template_v, template_i) => {
                  let name = filterCriteriaListRef.current[template_i].current.getValue()['name']
                  if (name === input_v['name']) {
                    filterCriteriaListRef.current[template_i].current.setValue(input_v)
                    return
                  }
                })
              })
            }
          })
          
        }
      })(value)

      reader.readAsBinaryString(value)
      e.target.value = ''
    })
  }

  const exportSetting = (e) => {

    let queryData = getCurrentSetting(filterCriteriaListRef, nornMinehunterRef, multiFactorRef, filterSectorsIndustriesRef)

    var aTag = document.createElement('a');
    var blob = new Blob([JSON.stringify(queryData)]);
    aTag.download = 'Norn-StockScreener_setting.json';
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
  }


  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    loadingAnimeRef.current.setLoading(false)

    return () => {
      // componentWillUnmount is here!
    }
  }, [])

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
        <FilterSectorsIndustries filterSectorsIndustriesRef={filterSectorsIndustriesRef} />
        <NornMinehunter nornMinehunterRef={nornMinehunterRef}/>
        <MultiFactor multiFactorRef={multiFactorRef} />
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
            <MuiThemeProvider theme={createTheme({ palette: { primary: blue } })}>
              <Button className={filterContainerStyle.queryBtn} variant="contained" color="primary" startIcon={<SearchIcon />} onClick={() => {
                queryStocksRef.current.doQuery()
              }}>{isMobile ? 'Query' : 'Query Now'}</Button>
            </MuiThemeProvider>
          </div>
        </MuiThemeProvider>
      </div>
      <ModalWindow modalWindowRef={modalWindowRef} />
      <QueryStocks queryStocksRef={queryStocksRef} loadingAnimeRef={loadingAnimeRef} filterCriteriaListRef={filterCriteriaListRef} ResultTableRef={ResultTableRef} nornMinehunterRef={nornMinehunterRef} multiFactorRef={multiFactorRef} filterSectorsIndustriesRef={filterSectorsIndustriesRef} modalWindowRef={modalWindowRef}/>
    </>
  )
}

export default FilterContainer
