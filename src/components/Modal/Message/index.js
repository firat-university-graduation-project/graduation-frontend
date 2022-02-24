import React from "react"
import Modal from "react-bootstrap/Modal"
import { Input, Button } from "@material-ui/core"

const MessageModal = (props) => {
  const {
    showModal,
    messages,
    message,
    handleMessage,
    sendMessage,
    closeChat,
  } = props

  return (
    <Modal show={showModal} onHide={closeChat} style={{ zIndex: "999999" }}>
      <Modal.Header closeButton>
        <Modal.Title>Chat Room</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          overflow: "auto",
          overflowY: "auto",
          height: "400px",
          textAlign: "left",
        }}
      >
        {messages.length > 0 ? (
          messages.map((item, index) => (
            <div key={index} style={{ textAlign: "left" }}>
              <p style={{ wordBreak: "break-all" }}>
                <b>{item.sender}</b>: {item.data}
              </p>
            </div>
          ))
        ) : (
          <p>No message yet</p>
        )}
      </Modal.Body>
      <Modal.Footer className="div-send-msg">
        <Input
          placeholder="Message"
          value={message}
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => e.key == "Enter" && sendMessage()}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MessageModal
