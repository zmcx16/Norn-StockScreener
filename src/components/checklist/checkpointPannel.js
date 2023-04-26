import React, { useState, useRef, useEffect }from 'react'
import { flushSync } from 'react-dom'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { green, red, blueGrey } from '@mui/material/colors'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import ArticleIcon from '@mui/icons-material/Article';
import ListItemText from '@mui/material/ListItemText'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import shortid from 'shortid'
import { isMobile } from 'react-device-detect'

import { EPSGrowthTagsDict } from '../../common/tagsDef'
import { ChecklistKey_Def, CheckpointsKeyList } from '../../common/checklistDef'
import { getFromEndVal, isNumeric } from '../../common/utils'

import checkpointPannelStyle from './checkpointPannel.module.scss'


const FilterCriteria = ({ filterCriteriaRef, dataTemplate }) => {

  // filterCriteriaRef API
  filterCriteriaRef.current.getValue = () => {
    return { name: name, from: valueFromRef.current.value, end: valueEndRef.current.value}
  }

  filterCriteriaRef.current.setValue = (value) => {
    setValueFromEnd(genFromEndTextField(valueFromRef, valueEndRef, value.from, value.end))
  }
  

  // gen node
  const genFromEndTextField = (inputFromRef, inputEndRef, FromValue, EndValue) => {

    // add key to force re-render component
    return <>
      <form noValidate autoComplete="off">
        <TextField key={shortid.generate()} style={{margin: isMobile ? '15px 0': ''}} className={checkpointPannelStyle.valueText} label="From" variant="outlined" defaultValue={FromValue} size="small" inputRef={inputFromRef} />
      </form>
      <div style={{display: isMobile ? 'none': ''}}>-</div>
      <form noValidate autoComplete="off">
        <TextField key={shortid.generate()} className={checkpointPannelStyle.valueText} label="End" variant="outlined" defaultValue={EndValue} size="small" inputRef={inputEndRef} />
      </form>
    </>
  }

  // set arg value
  const valueFromRef = useRef({ value: '' })
  const valueEndRef = useRef({ value: '' })
  const [valueFromEnd, setValueFromEnd] = useState(genFromEndTextField(valueFromRef, valueEndRef, '', ''))

  // arg select
  const { name, display_name, args_items, default_index } = dataTemplate
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
    return () => {
      // componentWillUnmount is here!
    }
  }, [])

  return (
    <> 
      <div className={ isMobile ? checkpointPannelStyle.argNodesMobile : checkpointPannelStyle.argNodes}>
        { isMobile ? "" : display_name}
        <FormControl size="small" variant="outlined" className={checkpointPannelStyle.argNodesSelect}>
          <InputLabel htmlFor="arg-select">{name}</InputLabel>
          <Select
            native
            value={arg}
            displayEmpty
            onChange={(event) => {
              renderValueFromEnd(event.target.value)
            }}
            label={name}
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
    </>
  )
}
  
function prettyTags(val) {
  let pretty_tags = []
  val.forEach((tag) => {
    pretty_tags.push(EPSGrowthTagsDict[tag])
  })
  return pretty_tags.join(",\n")
}

function conditionToString(item) {
  if (ChecklistKey_Def[item.name].type === "from_end") {
    return `From: "${item.condition["from"]}" | End: "${item.condition["end"]}"`
  } else if (ChecklistKey_Def[item.name].type === "tags") {
    return "Full Match: " + prettyTags(item.condition["match_all"])
  }
}

const CheckpointPannel = ({ChecklistRef, modalWindowRef}) => {
  const [open, setOpen] = useState(false)
  const [checkPointSelect, setCheckPointSelect] = useState(0)
  const [checkPointComp, setCheckPointComp] = useState(<></>)
  const checklistConfigListTempRef = useRef(ChecklistRef.current.getChecklistConfigRef() ? [...ChecklistRef.current.getChecklistConfigRef().list] : []) // workaround Gatsby build failed

  const [setting, setSetting] = useState({
    checklistName: ""
  })

  ChecklistRef.current.openCheckpointPannel = (checklistName) => {
    setSetting({
        checklistName: checklistName
    })
    checklistConfigListTempRef.current = ChecklistRef.current.getChecklistConfigRef() ? [...ChecklistRef.current.getChecklistConfigRef().list] : [] // workaround Gatsby build failed
    setCheckpointsComp(renderCheckpointsComp())
    setOpen(true)
  }

  const handleCancelClose = () => {
    setOpen(false)
  }

  const handleConfirmClose = () => {
    if (checklistConfigListTempRef.current.length === 0) {
      modalWindowRef.current.popModalWindow(<div>Checklist is empty, please add at least one checkpoint.</div>)
      return
    }
    ChecklistRef.current.saveChecklistConfigList(checklistConfigListTempRef.current)
    setOpen(false)
  }

  const filterCriteriaRef = useRef({getValue: null})

  const [tags, setTags] = useState({})
  const tagsRef = useRef({})

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    setCheckPointComp(
      <>
        <div style={{display: ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "from_end" ? 'block' : 'none'}}>
          {
            ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "from_end" ? 
            <FilterCriteria style={{padding: '5px 0 0 0'}} key={shortid.generate()} filterCriteriaRef={filterCriteriaRef} dataTemplate={
              {
                "name": ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].name,
                "display_name":  ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].checkpoint_comp.display_name,
                "args_items": ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].checkpoint_comp.args_items,
                "default_index": ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].checkpoint_comp.default_index
              }
            } />
            : <></>
          }
        </div>
        <div key={shortid.generate()}  className={checkpointPannelStyle.tagContainer} style={{display: ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "tags" ? 'block' : 'none'}}>
          {
            Object.entries(ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "tags" ? tags : {}).map(([key, value]) => {
              return <Chip
                key={shortid.generate()} 
                label={value.text}
                style={{
                  margin: '3px 5px', 
                  color: tags[key].enabe ? '#fff':'rgba(0, 0, 0, 0.87)',
                  backgroundColor: tags[key].enabe ? '#ff5722' : '#e0e0e0'
                }}
                onClick={() => {
                  // let tags_temp = tags    // bug: this is a reference, not a copy, will not trigger setTags
                  let tags_temp = {...tags}  // copy the object
                  tags_temp[key].enabe = !tags_temp[key].enabe
                  tagsRef.current = tags_temp
                  setTags(tags_temp)
                }} 
              />
            })
          }
        </div>
      </>
    )
    return () => {
      // componentWillUnmount is here!
    }
  }, [checkPointSelect, tags]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderCheckpointsComp = () => {
    return checklistConfigListTempRef.current.map((item, index) => {
      return (
        <ListItem
          key={shortid.generate()}
          secondaryAction={
            <IconButton sx={{ color: red[600] }} edge="end" aria-label="delete" onClick={() => {
              checklistConfigListTempRef.current.splice(index, 1)
              setCheckpointsComp(renderCheckpointsComp())
            }} >
              <DeleteIcon />
            </IconButton>
          }
          >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: blueGrey[500] }}>
              <ArticleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={ChecklistKey_Def[item.name].checkpoint_comp.display_name}
            secondary={conditionToString(item)}
          />
        </ListItem>
  )})}

  const [checkpointsComp, setCheckpointsComp] = useState(renderCheckpointsComp())
  const listCheckpointsRef = useRef()
  return (
    <div>
      <Dialog className={checkpointPannelStyle.container} open={open} onClose={handleCancelClose} fullWidth maxWidth="lg">
        <DialogTitle>{setting.checklistName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Add/Delete your checkpoints on this checklist"}
          </DialogContentText>
            <div className={ isMobile ? checkpointPannelStyle.queryPannelMobile : checkpointPannelStyle.queryPannel} >
              <FormControl size="small" variant="outlined" className={checkpointPannelStyle.checkpointSelect}>
              <InputLabel htmlFor="checkpoints-select">{'Checkpoints'}</InputLabel>
              <Select
                  native
                  value={checkPointSelect}
                  displayEmpty
                  onChange={(event) => {
                    if (ChecklistKey_Def[CheckpointsKeyList[event.target.value]].type === "tags") {
                      let tags_temp = {}
                      ChecklistKey_Def[CheckpointsKeyList[event.target.value]].checkpoint_comp.args_items.forEach((key) => {
                        tags_temp[key] = {
                          text: EPSGrowthTagsDict[key],
                          enabe: ChecklistKey_Def[CheckpointsKeyList[event.target.value]].checkpoint_comp.default_selects.includes(key)
                        }
                      })
                      tagsRef.current = tags_temp
                      setTags(tags_temp)
                    }
                    setCheckPointSelect(event.target.value)
                  }}
                  label={'Checkpoints'}
              >
                {
                  CheckpointsKeyList.map((key, index) => {
                    return <option key={shortid.generate()} value={index}>{ChecklistKey_Def[key].name}</option>
                  })
                }
              </Select>
              </FormControl>
              <div></div>
              <div className={ isMobile ? checkpointPannelStyle.checkpointDescriptionMobile : checkpointPannelStyle.checkpointDescription}>
                <Typography variant="subtitle1">
                  {ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].description}
                </Typography>
              </div>
              <div className={checkpointPannelStyle.checkPointComp}>
                {checkPointComp}
              </div>
              <div className={checkpointPannelStyle.addCheckpointBtn}>
                <IconButton sx={{ color: green['A700'] }} aria-label="addCheckpoint" style={{maxWidth: isMobile ? '100%' : '70px', maxHeight: '70px', minWidth: '70px', minHeight: '70px', width: isMobile ? '100%': ''}} onClick={() => {
                  let name = CheckpointsKeyList[checkPointSelect]
                  let type = ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type
                  if (checklistConfigListTempRef.current.some(e => e.name == name)) {
                    modalWindowRef.current.popModalWindow(<div>Checkpoint {name} already exists</div>)
                    return
                  }          
                  let checkpoint = {
                    "name": name,
                    "condition": {}
                  }
                  
                  if (type === "tags") {
                    checkpoint.condition = {
                      "match_all": Object.keys(tags).reduce((acc, key) => {
                        if (tags[key].enabe) {
                          acc.push(key)
                        }
                        return acc
                      }, [])
                    }
                    if (checkpoint.condition.match_all.length === 0) {
                      modalWindowRef.current.popModalWindow(<div>At least one tag is required</div>)
                      return
                    }

                  } else if (type === "from_end") {
                    let fromEnd = filterCriteriaRef.current.getValue()
                    if (fromEnd.from === "" && fromEnd.end === "") {
                      modalWindowRef.current.popModalWindow(<div>From or End are required</div>)
                      return
                    }
                    if ((fromEnd.from !== "" && !isNumeric(fromEnd.from)) || (fromEnd.end !== "" && !isNumeric(fromEnd.end))) {
                      modalWindowRef.current.popModalWindow(<div>From and End must be float</div>)
                      return
                    }
                    checkpoint.condition = {
                      "from": fromEnd.from,
                      "end": fromEnd.end
                    }
                  }
                  checklistConfigListTempRef.current.push(checkpoint)
                  // wait until the DOM is updated with the new state
                  flushSync(() => {
                    setCheckpointsComp(renderCheckpointsComp())
                  })

                  const lastElement = listCheckpointsRef.current?.lastElementChild;
                  if (lastElement) {
                    lastElement.scrollIntoView({ behavior: "smooth" })
                  }
                }}>
                  <DoubleArrowIcon fontSize="inherit" style={{maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                </IconButton>
              </div>
              <div></div>
              <div className={checkpointPannelStyle.checkpointList}>
                  <List ref={listCheckpointsRef} sx={{
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
                    {checkpointsComp}
                  </List>
              </div>
            </div>
        </DialogContent>
        <DialogActions>
          <Button size="large" style={{fontWeight: 600}} onClick={handleCancelClose}>{"Cancel"}</Button>
          <Button size="large" style={{fontWeight: 600}} onClick={handleConfirmClose}>{"Confirm"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CheckpointPannel