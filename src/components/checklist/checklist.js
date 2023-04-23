import React, { useState, useEffect, useRef, useMemo } from 'react'

import useFetch from 'use-http'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import shortid from 'shortid'

import { GetDataByFetchObj } from '../../common/reactUtils'
import { ChecklistTooltips } from '../../common/checklistDef'
import ModalWindow from '../modalWindow'
import ChecklistTable from './checklistTable'

import commonStyle from '../common.module.scss'
import checklistgStyle from './checklist.module.scss'

function CombineData(stock_info, eps_analysis, eps_financials) {
  let data = stock_info
  eps_analysis.forEach(element => {
    let symbol = element["symbol"]
    if (symbol in data) {
      data[symbol]["eps_analysis"] = element["tags"]
    } else {
      data[symbol] = {"eps_analysis": element["tags"]}
    }
  })
  eps_financials.forEach(element => {
    let symbol = element["symbol"]
    if (symbol in data) {
      data[symbol]["eps_financials"] = element["tags"]
    } else {
      data[symbol] = {"eps_financials": element["tags"]}
    }
  })
  return data
}


const Checklist = ({loadingAnimeRef}) => {

  const stockDataRef = useRef({})
  const [groupChecklist, setGroupChecklist] = useState([
    {
      "name": "Default Checklist",
      "symbols": ["C", "WFC", "BAC", "AA", "CAAP", "ADUS"],
      "list": [
        { 
          "name": "P/E", 
          "condition": {"from": "", "end": "10"}
        },
        { 
          "name": "eps_financials", 
          "condition": {"match_all": ["all_positive"]}
        },
        { 
          "name": "eps_analysis", 
          "condition": {"match_all": ["all_positive"]}
        }
      ]
    }
  ])
  const [groupSelect, setGroupSelect] = useState(0)

  const checklistConfigRef = useRef(groupChecklist[0])

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null
  })
  
  const ChecklistTableRef = useRef({
    getStockDataRef: ()=>{ return stockDataRef.current },
    getChecklistConfigRef: ()=>{ return checklistConfigRef.current }
  })

  const fetchStockInfoData = useFetch({ cachePolicy: 'no-cache' })
  const fetchEPSAnalysisData = useFetch({ cachePolicy: 'no-cache' })
  const fetchEPSFinancialsData = useFetch({ cachePolicy: 'no-cache' })

  const fetchData = () => {
    loadingAnimeRef.current.setLoading(true)
    let fetch_data = [
      GetDataByFetchObj('/norn-data/stock/stat.json', fetchStockInfoData),
      GetDataByFetchObj('/norn-data/ranking/eps_analysis.json', fetchEPSAnalysisData),
      GetDataByFetchObj('/norn-data/ranking/eps_financials.json', fetchEPSFinancialsData)
    ]

    Promise.all(fetch_data).then((allResponses) => {
      console.log(allResponses)
      if (allResponses.length === fetch_data.length) {
        stockDataRef.current = CombineData(allResponses[0], allResponses[1]["data"], allResponses[2]["data"])
        console.log(stockDataRef.current)
        setResultTable(<ChecklistTable ChecklistTableRef={ChecklistTableRef} modalWindowRef={modalWindowRef} />)
      } else {
        console.error("fetchData some data failed")
        modalWindowRef.current.popModalWindow(<div>Get some data failed...</div>)
      }
      loadingAnimeRef.current.setLoading(false)
    }).catch(() => {
      console.error("fetchData failed")
      modalWindowRef.current.popModalWindow(<div>Get data failed...</div>)
      loadingAnimeRef.current.setLoading(false)
    })
  }

  const [resultTable, setResultTable] = useState(<></>)

  const [anchorEl, setAnchorEl] = useState(null)
  const [settingMenu, setSettingMenu] = useState(null)
  const openSettingMenu = Boolean(settingMenu)

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!

    fetchData()
    return () => {
      // componentWillUnmount is here!
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={commonStyle.defaultFont + ' ' + checklistgStyle.container}>
      <div className={commonStyle.defaultFont + ' ' + checklistgStyle.groupPannel}>
        <FormControl size="small" variant="outlined" className={checklistgStyle.checklistSelect}>
          <InputLabel htmlFor="arg-select">{'Checklists'}</InputLabel>
          <Select
            native
            value={groupSelect}
            displayEmpty
            onChange={(event) => {
              setGroupSelect(event.target.value)
            }}
            label={'Checklists'}
          >
            {
              groupChecklist.map((value, index) => {
                return <option key={shortid.generate()} index={index} value={index}>{value.name}</option>
              })
            }
          </Select>
        </FormControl>
        <Tooltip arrow title={<span style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '20px', textAlign: 'center'}}>{ChecklistTooltips}</span>} >
          <IconButton>
            <InfoIcon color="action"/>
          </IconButton>
        </Tooltip>
        <Button id="setting-button" 
          aria-controls={openSettingMenu ? 'setting-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openSettingMenu ? 'true' : undefined}
          size="large" style={{fontWeight: 600}} startIcon={<SettingsIcon />} onClick={(event) => {
            setSettingMenu(event.currentTarget)
        }}>{'Setting'}</Button>
        <Menu
          id="setting-menu"
          anchorEl={settingMenu}
          open={openSettingMenu}
          onClose={()=>{
            setSettingMenu(null)
          }}
          MenuListProps={{
            'aria-labelledby': 'setting-button',
          }}
        >
          <MenuItem onClick={()=>{
            let tmp = [...groupChecklist, { "name": "New Checklist", "symbols": [], "list": [] }]
            setGroupSelect(tmp.length - 1)
            setGroupChecklist(tmp)
            setSettingMenu(null)
          }}>
            <ListItemIcon>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Create Checklist</ListItemText>
          </MenuItem>
          <MenuItem onClick={()=>{
            let tmp = [...groupChecklist]
            tmp.splice(groupSelect, 1)
            setGroupSelect(0)
            setGroupChecklist(tmp)
            setSettingMenu(null)
          }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Checklist</ListItemText>
          </MenuItem>
        </Menu>
      </div>
      {resultTable}
      <ModalWindow modalWindowRef={modalWindowRef} />
    </div>
  )
}

export default Checklist
