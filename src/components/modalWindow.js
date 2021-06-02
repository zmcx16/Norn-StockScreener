import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Fade from '@material-ui/core/Fade'
import Backdrop from '@material-ui/core/Backdrop'
import Modal from '@material-ui/core/Modal'

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
    },
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

export default ModalWindow
