import React, { useState } from "react"
import { message } from "antd"
import { FileCopyIcon } from "../Icons"
import { IconButton } from "@material-ui/core"
import Modal from "react-bootstrap/Modal"
import QRCode from "../QRCode"
import { Button } from "@material-ui/core"
import { saveAs } from "file-saver"

const copy_url = () => {
  let text = window.location.href
  if (!navigator.clipboard) {
    let textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
      message.success("Link copied to clipboard!")
    } catch (err) {
      message.error("Failed to copy")
    }
    document.body.removeChild(textArea)
    return
  }
  navigator.clipboard.writeText(text).then(
    function () {
      message.success("Link copied to clipboard!")
    },
    () => {
      message.error("Failed to copy")
    }
  )
}

const CopyUrl = () => {
  const [show, setShow] = useState(false)
  const [qrURL, setQrURL] = useState("")

  const download_qr = () => {
    saveAs(qrURL, "qr-code.jpg") // Put your image url here.
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  return (
    <span>
      <IconButton onClick={handleShow} style={{ color: "#424242" }}>
        <FileCopyIcon />
      </IconButton>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QRCode type="modal" setQrURL={setQrURL} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={download_qr}>Download QR Code</Button>
          <Button onClick={copy_url}>Copy Url</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </span>
  )
}

export default CopyUrl
