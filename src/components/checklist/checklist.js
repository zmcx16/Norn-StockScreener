import React, { useState, useEffect, useRef, useMemo } from 'react'

import useFetch from 'use-http'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import ListItem from '@mui/material/ListItem'
import Avatar from '@mui/material/Avatar'
import FolderIcon from '@mui/icons-material/Folder'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import shortid from 'shortid'

import { GetDataByFetchObj } from '../../common/reactUtils'
import { ChecklistKey_Def, ChecklistTooltips } from '../../common/checklistDef'
import ModalWindow from '../modalWindow'
import FormDialog from '../formDialog'
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
  const [checkPointSelect, setCheckPointSelect] = useState(0)

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

  const [checkpointsList, setCheckpointsList] = useState(<div className={checklistgStyle.checkpointList}>
    <List  sx={{
        width: '100%',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 270,
        border: 1,
        borderColor: 'grey.500',
        borderRadius: 1,
        '& ul': { padding: 0 },
      }}>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
            secondary="Secondary text"
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
            secondary="Secondary text"
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
            secondary="Secondary text"
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
            secondary="Secondary text"
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
            secondary="Secondary text"
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
            secondary="Secondary text"
          />
        </ListItem>
        <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Single-line item"
            secondary="Secondary text"
          />
        </ListItem>
    </List>
  </div>)
  const [resultTable, setResultTable] = useState(<></>)

  const [settingMenu, setSettingMenu] = useState(null)
  const openSettingMenu = Boolean(settingMenu)

  const formDialogRef = useRef({
    openDialog: null,
    cancelCallback: null,
    confirmCallback: null
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
    <div className={commonStyle.defaultFont + ' ' + checklistgStyle.container}>
      <div className={commonStyle.defaultFont + ' ' + checklistgStyle.groupPannel}>
        <FormControl size="small" variant="outlined" className={checklistgStyle.checklistSelect}>
          <InputLabel htmlFor="checklists-select">{'Checklists'}</InputLabel>
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
              setGroupSelect(tmp.length - 1)
              setGroupChecklist(tmp)
              setSettingMenu(null)
            }
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
              setGroupSelect(0)
              setGroupChecklist(tmp)
              setSettingMenu(null)
            }
            formDialogRef.current.openDialog(false, "Confirm Delete", `Are you sure you want to remove "${groupChecklist[groupSelect]["name"]}" checklist?`, "Confirm", "Cancel", "")
          }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Checklist</ListItemText>
          </MenuItem>
          <MenuItem onClick={()=>{}}>
            <ListItemIcon>
              <FolderIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Checkpoints</ListItemText>
          </MenuItem>
        </Menu>
      </div>
      <div className={checklistgStyle.queryPannel} >
        <FormControl size="small" variant="outlined" className={checklistgStyle.checkpointSelect}>
          <InputLabel htmlFor="checkpoints-select">{'Checkpoints'}</InputLabel>
          <Select
            native
            value={checkPointSelect}
            displayEmpty
            onChange={(event) => {
              setCheckPointSelect(event.target.value)
            }}
            label={'Checkpoints'}
          >
            {
              Object.keys(ChecklistKey_Def).reduce((acc, key, index) => {
                if (ChecklistKey_Def[key].checkpoint) {
                  acc.push(<option key={shortid.generate()} value={index}>{ChecklistKey_Def[key].name}</option>)
                }
                return acc
              }, [])
            }
          </Select>
        </FormControl>
        <div></div>
        <div className={checklistgStyle.addCheckpointBtn}>
          <IconButton aria-label="addCheckpoint" style={{maxWidth: '70px', maxHeight: '70px', minWidth: '70px', minHeight: '70px'}}>
            <DoubleArrowIcon fontSize="inherit" style={{maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
          </IconButton>
        </div>
        <div></div>
        {checkpointsList}
        <div className={checklistgStyle.checkpointArgsBlock}></div>
      </div>
      {resultTable}
      <ModalWindow modalWindowRef={modalWindowRef} />
      <FormDialog formDialogRef={formDialogRef} />
    </div>
  )
}

export default Checklist
