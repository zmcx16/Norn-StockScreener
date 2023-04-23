import React, { useState }from 'react'
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
import InputLabel from '@mui/material/InputLabel'
import shortid from 'shortid'

import { ChecklistKey_Def } from '../../common/checklistDef'

import checkpointPannelStyle from './checkpointPannel.module.scss'

const CheckpointPannel = ({ChecklistRef}) => {
  const [open, setOpen] = useState(false)
  const [checkPointSelect, setCheckPointSelect] = useState(0)

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
                <div className={checkpointPannelStyle.addCheckpointBtn}>
                <IconButton aria-label="addCheckpoint" style={{maxWidth: '70px', maxHeight: '70px', minWidth: '70px', minHeight: '70px'}}>
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