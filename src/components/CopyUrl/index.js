import React from "react"
import { message } from "antd"
import { Input, Button } from "@material-ui/core"

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
  return (
    <div style={{ paddingTop: "20px" }}>
      <Input value={window.location.href} disable="true"></Input>
      <Button
        style={{
          backgroundColor: "#3f51b5",
          color: "whitesmoke",
          marginLeft: "20px",
          marginTop: "10px",
          width: "120px",
          fontSize: "10px",
        }}
        onClick={copy_url}
      >
        Copy invite link
      </Button>
    </div>
  )
}

export default CopyUrl
