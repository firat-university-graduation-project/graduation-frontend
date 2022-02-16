import React from "react"
import { FileDownloadIcon } from "../Icons"
import { useReactMediaRecorder } from "react-media-recorder"
import {
  BsFillRecordCircleFill,
  BsFillStopCircleFill,
  BsDownload,
} from "react-icons/bs"
import { IconButton } from "@material-ui/core"
import styles from "./ScreenRecord.module.css"

const ScreenRecord = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true, screen: true })

  return (
    <>
      {(status === "idle" || status === "stopped") && (
        <IconButton style={{ color: "#424242" }}>
          <button onClick={startRecording} className={styles.button}>
            <BsFillRecordCircleFill fill="#2dfb2d" size={23} />
          </button>
        </IconButton> 
      )}

      {mediaBlobUrl && status === "stopped" && (
        <IconButton style={{ color: "#424242" }}>
          <a
            href={mediaBlobUrl}
            download={"video.mp4"}
            className={`${styles.button} ${styles.downloadButton}`}
          >
            <BsDownload />
          </a>
        </IconButton>
      )}

      {status === "recording" && (
        <IconButton style={{ color: "#424242" }}>
          <button onClick={stopRecording} className={styles.button}>
            <BsFillStopCircleFill fill="#f34040" size={23} />
          </button>
        </IconButton>
      )}
    </>
  )
}

export default ScreenRecord
