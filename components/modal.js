import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const Modal = ({show, onClose, children}) => {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const handleCloseClick = err => {
    err.preventDefault()
    onClose()
  }

  const modalContent = show ? (
    <StyledModalOverlay>
      <StyledModal>
        <StyledModalHeader>
          <a href='#' onClick={handleCloseClick}>
            x
          </a>
        </StyledModalHeader>
        <StyledModalBody>{children}</StyledModalBody>
      </StyledModal>
    </StyledModalOverlay>
  ) : null

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.querySelector('#modal-root')
    )
  }

  return null
}

const StyledModalBody = styled.div`
  padding-top: 10px;
`

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
`

const StyledModal = styled.div`
  background: white;
  overflow: scroll;
  width: 500px;
  height: 600px;
  border-radius: 15px;
  padding: 15px;
`

const StyledModalOverlay = styled.div`
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

export default Modal
