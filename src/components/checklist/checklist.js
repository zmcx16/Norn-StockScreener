import React, { useState, useEffect, useRef } from 'react'

import useFetch from 'use-http'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import DeleteIcon from '@mui/icons-material/Delete'
import InputIcon from '@mui/icons-material/Input'
import OutputIcon from '@mui/icons-material/Output'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import { ThemeProvider } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import Paper from '@mui/material/Paper'
import shortid from 'shortid'

import { GetDataByFetchObj } from '../../common/reactUtils'
import { ChecklistTooltips, DefaultGroupChecklist } from '../../common/checklistDef'
import ModalWindow from '../modalWindow'
import FormDialog from '../formDialog'
import ChecklistTable from './checklistTable'
import CheckpointPannel from './checkpointPannel'

import commonStyle from '../common.module.scss'
import checklistStyle from './checklist.module.scss'

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
  const [groupChecklist, setGroupChecklist] = useState(DefaultGroupChecklist)
  const [groupSelect, setGroupSelect] = useState(0)
  const checklistConfigRef = useRef(groupChecklist[0])

  const modalWindowRef = useRef({
    popModalWindow: null,
    popPureModal: null
  })

  const reloadChecklistTable = () => {
    setResultTable(<ChecklistTable ChecklistRef={ChecklistRef} modalWindowRef={modalWindowRef} key={shortid.generate()} />)
  }
  
  const ChecklistRef = useRef({
    getStockDataRef: ()=>{ return stockDataRef.current },
    getChecklistConfigRef: ()=>{ return checklistConfigRef.current },
    getReordering: ()=>{ return reordering },
    getSearchStockRef: ()=>{ return searchStockRef.current },
    checklistTableRowSelectionChanged: (rowSelection)=>{  
      if (Object.keys(rowSelection).length === 0) {
        setDisplayDeleteBtn(false)
      } else {
        setDisplayDeleteBtn(true)
      }
    },
    saveChecklistConfigList: null,
    openCheckpointPannel: null,
    searchStockOnClick: null,
    reorderOnClick: null,
    deleteOnClick: null,
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
        reloadChecklistTable()
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
  const searchStockRef = useRef(null)
  const [displayDeleteBtn, setDisplayDeleteBtn] = useState(false)

  const [settingMenu, setSettingMenu] = useState(null)
  const [reordering, setReordering] = useState(false)
  const openSettingMenu = Boolean(settingMenu)

  const formDialogRef = useRef({
    openDialog: null,
    cancelCallback: null,
    confirmCallback: null
  })
    
  const customTheme = createTheme({
    palette: {
      order: { 
        backgroundColor: '#2196f3', color: '#fff'
      },
      delete: { 
        backgroundColor: '#e53935', color: '#fff'
      }
    },
  })

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!

    fetchData()
    return () => {
      // componentWillUnmount is here!
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={commonStyle.defaultFont + ' ' + checklistStyle.container}>
      <ThemeProvider theme={customTheme}>
        <div className={commonStyle.defaultFont + ' ' + checklistStyle.groupPannel}>
          <FormControl size="small" variant="outlined" className={checklistStyle.checklistSelect}>
            <InputLabel htmlFor="checklists-select">{'Checklists'}</InputLabel>
            <Select
              native
              value={groupSelect}
              displayEmpty
              onChange={(event) => {
                checklistConfigRef.current = groupChecklist[event.target.value]
                setGroupSelect(event.target.value)
                reloadChecklistTable()
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
          <Paper
            component="form"
            sx={{ p: '6 16', display: 'flex', alignItems: 'center' }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder='AAPL, BAC, KSS, ...'
              inputProps={{ 'aria-label': 'search-us-stocks' }}
              inputRef={searchStockRef}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => {
              ChecklistRef.current.searchStockOnClick()
            }}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button className={checklistStyle.tableCmdBtn} size="large" variant="contained" style={customTheme.palette.order} startIcon={<SwapVertIcon />} onClick={() => {
            ChecklistRef.current.reorderOnClick(!reordering, setReordering)
          }}>{reordering ? 'Reordering' : 'Reorder'}</Button>
          <div>
            <Button className={checklistStyle.tableCmdBtn} size="large" variant="contained" style={{...customTheme.palette.delete, ...{display: displayDeleteBtn ? 'inline-flex': 'none'}}} startIcon={<DeleteIcon />} onClick={() => {
              ChecklistRef.current.deleteOnClick()
            }}>{'Delete'}</Button>
          </div>
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
              formDialogRef.current.cancelCallback = ()=>{}
              formDialogRef.current.confirmCallback = (inputData)=>{
                if (inputData === "") {
                  modalWindowRef.current.popModalWindow(<div>Checklist name cannot be empty...</div>)
                  return
                } else if (groupChecklist.some(x => x["name"] === inputData)) {
                  modalWindowRef.current.popModalWindow(<div>Checklist "{inputData}" already exist...</div>)
                  return
                }

                let tmp = [...groupChecklist, { "name": inputData, "symbols": [], "list": [] }]
                checklistConfigRef.current = tmp[tmp.length - 1]
                setGroupSelect(tmp.length - 1)
                setGroupChecklist(tmp)
                reloadChecklistTable()
              }
              setSettingMenu(null)
              formDialogRef.current.openDialog(true, "Create New Checklist", "To create the new checklist, please enter your new checklist name here.", "Confirm", "Cancel", "Checklist Name")
            }}>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Create Checklist</ListItemText>
            </MenuItem>
            <MenuItem onClick={()=>{
              if (groupChecklist.length <= 1) {
                modalWindowRef.current.popModalWindow(<div>Cannot delete the last checklist...</div>)
                return
              }

              formDialogRef.current.cancelCallback = ()=>{}
              formDialogRef.current.confirmCallback = ()=>{
                let tmp = [...groupChecklist]
                tmp.splice(groupSelect, 1)
                checklistConfigRef.current = tmp[0]
                setGroupSelect(0)
                setGroupChecklist(tmp)
                reloadChecklistTable()
              }
              setSettingMenu(null)
              formDialogRef.current.openDialog(false, "Confirm Delete", `Are you sure you want to remove "${groupChecklist[groupSelect]["name"]}" checklist?`, "Confirm", "Cancel", "")
            }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete Checklist</ListItemText>
            </MenuItem>
            <MenuItem onClick={()=>{
              setSettingMenu(null)
              ChecklistRef.current.saveChecklistConfigList = (newChecklistConfigList) => {
                let newGroupChecklist = [...groupChecklist]
                newGroupChecklist[groupSelect].list = newChecklistConfigList
                setGroupChecklist(newGroupChecklist)
                reloadChecklistTable()
              }
              ChecklistRef.current.openCheckpointPannel(groupChecklist[groupSelect]["name"])
            }}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Checkpoints</ListItemText>
            </MenuItem>
            <label htmlFor="import-checklists-file">
            <MenuItem>
            <input
              id="import-checklists-file"
                  type="file"
                  hidden
                  onChange={(e)=>{
                    Object.entries(e.target.files).forEach(([key, value]) => {
                      var reader = new FileReader()
                      reader.onload = (function (theFile) {
                        return function (e) {
                          let data = JSON.parse(e.target.result)
                          checklistConfigRef.current = data[0]
                          setSettingMenu(null)
                          setGroupSelect(0)
                          setGroupChecklist(data)
                          reloadChecklistTable()
                        }
                      })(value)
                      reader.readAsBinaryString(value)
                      e.target.value = ''
                    })
                  }}
                />
              <ListItemIcon>
                <InputIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Import Checklists</ListItemText>
            </MenuItem>
            </label>
            <MenuItem onClick={()=>{
              var aTag = document.createElement('a')
              var blob = new Blob([JSON.stringify(groupChecklist)])
              aTag.download = 'Norn-StockScreener_checklists.json'
              aTag.href = URL.createObjectURL(blob)
              aTag.click()
              URL.revokeObjectURL(blob)
            }}>
              <ListItemIcon>
                <OutputIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export Checklists</ListItemText>
            </MenuItem>
            <MenuItem onClick={()=>{
              
            }}>
              <ListItemIcon>
                <RestartAltIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset Default</ListItemText>
            </MenuItem>
          </Menu>
        </div>
        {resultTable}
        <ModalWindow modalWindowRef={modalWindowRef} />
        <FormDialog formDialogRef={formDialogRef} />
        <CheckpointPannel ChecklistRef={ChecklistRef} modalWindowRef={modalWindowRef}/>
      </ThemeProvider>
    </div>
  )
}

export default Checklist
