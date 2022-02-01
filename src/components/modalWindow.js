import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const ModalWindow = ({ modalWindowRef }) => {

  const [openModal, setOpenModal] = useState(false)
  const [modalNode, setModalNode] = useState(<div></div>)

  modalWindowRef.current = {
    popModalWindow: (content) => {
      setModalNode(
        <Box sx={style}>
          {content}
        </Box>
      )
      setOpenModal(true)
    },
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
