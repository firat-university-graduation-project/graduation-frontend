import React, { useState } from "react"
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

const PreviewModal = (props) => {
  let { mediaBlobUrl } = props
  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)
  }

  return (
    <>
      {mediaBlobUrl && (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            animation={false}
            style={{ zIndex: "999999" }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Download Video</Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{
                overflow: "auto",
                overflowY: "auto",
                height: "600px",
                textAlign: "left",
              }}
            >
              <video
                src={mediaBlobUrl}
                controls
                autoPlay
                loop
                style={{ height: "400px", width: "600px" }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  )
}

export default PreviewModal
