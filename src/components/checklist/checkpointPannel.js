import React, { useState, useRef, useEffect }from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import FolderIcon from '@mui/icons-material/Folder'
import ListItemText from '@mui/material/ListItemText'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import shortid from 'shortid'

import { EPSGrowthTagsDict } from '../../common/tagsDef'
import { ChecklistKey_Def, CheckpointsKeyList } from '../../common/checklistDef'

import checkpointPannelStyle from './checkpointPannel.module.scss'

const CheckpointPannel = ({ChecklistRef}) => {
  const [open, setOpen] = useState(false)
  const [checkPointSelect, setCheckPointSelect] = useState(0)
  const [checkPointComp, setCheckPointComp] = useState(<></>)

  const [setting, setSetting] = useState({
    checklistName: ""
  })

  ChecklistRef.current.openCheckpointPannel = (checklistName) => {
    setSetting({
        checklistName: checklistName
    })
    setOpen(true)
  }

  const handleCancelClose = () => {
    setOpen(false)
  }

  const handleConfirmClose = () => {
    setOpen(false)
  }

  const [tags, setTags] = useState({})
  const tagsRef = useRef({})

  useEffect(() => {
    // componentDidMount is here!
    // componentDidUpdate is here!
    setCheckPointComp(
      <>
        <div style={{display: ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "from_end" ? 'block' : 'none'}}>
          {"from_end"}
        </div>
        <div key={shortid.generate()}  className={checkpointPannelStyle.tagContainer} style={{display: ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "tags" ? 'block' : 'none'}}>
          {
            Object.entries(ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "tags" ? tags : {}).map(([key, value, index]) => {
              console.log(tags)
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

  return (
    <div>
      <Dialog className={checkpointPannelStyle.container} open={open} onClose={handleCancelClose} fullWidth maxWidth="lg">
        <DialogTitle>{setting.checklistName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Add/Delete your checkpoints on this checklist"}
          </DialogContentText>
            <div className={checkpointPannelStyle.queryPannel} >
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
              <div className={checkpointPannelStyle.addCheckpointBtn}>
                <IconButton aria-label="addCheckpoint" style={{maxWidth: '70px', maxHeight: '70px', minWidth: '70px', minHeight: '70px'}} onClick={() => {
                  if (ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].type === "tags") {
                    console.log(tags)
                  }
                }}>
                  <DoubleArrowIcon fontSize="inherit" style={{maxWidth: '50px', maxHeight: '50px', minWidth: '50px', minHeight: '50px'}} />
                </IconButton>
              </div>
              <div></div>
              <div className={checkpointPannelStyle.checkpointList}>
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
              </div>
              <div className={checkpointPannelStyle.checkpointDescription}>
                <Typography variant="h6">
                  {ChecklistKey_Def[CheckpointsKeyList[checkPointSelect]].description}
                </Typography>
              </div>
              <div className={checkpointPannelStyle.checkPointComp}>
                {checkPointComp}
              </div>
            </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose}>{"Cancel"}</Button>
          <Button onClick={handleConfirmClose}>{"Confirm"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default CheckpointPannel