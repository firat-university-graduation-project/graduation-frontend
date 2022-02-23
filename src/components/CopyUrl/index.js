import React from "react"
import { message } from "antd"
import { FileCopyIcon } from "../Icons"
import { IconButton } from "@material-ui/core"

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
    <IconButton onClick={copy_url} style={{ color: "#424242" }}>
      <FileCopyIcon />
    </IconButton>
  )
}

export default CopyUrl
