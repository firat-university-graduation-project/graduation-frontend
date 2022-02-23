import React, { useState } from "react"
import { RadioButtonCheckedIcon, DownloadIcon } from "../Icons"
import { useReactMediaRecorder } from "react-media-recorder"
import { IconButton } from "@material-ui/core"
import styles from "./ScreenRecord.module.css"

const ScreenRecord = (props) => {
  let { parentCallback } = props
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, screen: true })

  const setMediaBlobUrl = () => {
    console.log(mediaBlobUrl)
    if (mediaBlobUrl && status === "stopped") {
      parentCallback(mediaBlobUrl)
    }
  }

  return (
    <>
      {(status === "idle" || status === "stopped") && (
        <IconButton style={{ color: "#1aec1a" }} onClick={startRecording}>
          <RadioButtonCheckedIcon fill="#1aec1a" size={23} />
        </IconButton>
      )}

      {mediaBlobUrl && status === "stopped" && (
        <IconButton onClick={setMediaBlobUrl} style={{ color: "#1a9fec" }}>
          <a
            href={mediaBlobUrl}
            download={"video.mp4"}
            className={styles.downloadButton}
          >
            <DownloadIcon />
          </a>
        </IconButton>
      )}

      {status === "recording" && (
        <IconButton style={{ color: "#f34040" }} onClick={stopRecording}>
          <RadioButtonCheckedIcon fill="#f34040" size={23} />
        </IconButton>
      )}
    </>
  )
}

export default ScreenRecord
