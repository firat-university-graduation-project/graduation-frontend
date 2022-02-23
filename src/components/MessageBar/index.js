import React, { useRef, useEffect } from "react"
import { Input, Button } from "@material-ui/core"
import "./MessageBar.css"

const MessageBar = (props) => {
  const { messages, message, handleMessage, sendMessage } = props

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, message])

  return (
    <div className="message_container">
      <div className="message_header">
        <h3>Messages</h3>
      </div>
      <div className="message_body">
        <ul>
          {messages.length > 0 ? (
            messages.map((item, index) => (
              <li key={index} style={{ textAlign: "left" }}>
                <p style={{ wordBreak: "break-all" }}>
                  <b>{item.sender}</b>: {item.data}
                </p>
              </li>
            ))
          ) : (
            <p>No message yet</p>
          )}
        </ul>
        <div ref={messagesEndRef} />
      </div>
      <div className="message_footer">
        <Input
          placeholder="Message"
          value={message}
          onChange={(e) => handleMessage(e)}
          onKeyDown={(e) => e.key == "Enter" && sendMessage()}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  )
}

export default MessageBar
