import React, { useState, useRef }from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

const FormDialog = ({formDialogRef}) => {
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  const [setting, setSetting] = useState({
    title: "",
    content: "",
    confirmText: "",
    cancelText: "",
    textfieldLabel: ""
  })

  formDialogRef.current.openDialog = (withInput, title, content, confirmText, cancelText, textfieldLabel) => {
    setOpen(true)
    setSetting(
      {
        withInput: withInput,
        title: title,
        content: content,
        confirmText: confirmText,
        cancelText: cancelText,
        textfieldLabel: textfieldLabel
      }
    )
  }

  const handleCancelClose = () => {
    setOpen(false)
    formDialogRef.current.cancelCallback()
  }

  const handleConfirmClose = () => {
    setOpen(false)
    if (setting.withInput) {
      formDialogRef.current.confirmCallback(inputRef.current.value)
    } else {
      formDialogRef.current.confirmCallback()
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleCancelClose}>
        <DialogTitle>{setting.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {setting.content}
          </DialogContentText>
          <TextField
            style={{display: setting.withInput ? "block" : "none"}}
            autoFocus
            margin="dense"
            id="name"
            label={setting.textfieldLabel}
            type="text"
            fullWidth
            variant="standard"
            inputRef={inputRef}
          />
        </DialogContent>
        <DialogActions>
          <Button style={{fontWeight: 600}} onClick={handleCancelClose}>{setting.cancelText}</Button>
          <Button style={{fontWeight: 600}} onClick={handleConfirmClose}>{setting.confirmText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default FormDialog