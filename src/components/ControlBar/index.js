import React from "react"
import { IconButton, Badge } from "@material-ui/core"
import {
  VideocamIcon,
  VideocamOffIcon,
  MicIcon,
  MicOffIcon,
  ScreenShareIcon,
  StopScreenShareIcon,
  CallEndIcon,
  ChatIcon,
} from "../../components/Icons"
import ScreenRecord from "../ScreenRecord"
import CopyUrl from "../CopyUrl"

const ControlBar = (props) => {
  const {
    handleVideo,
    handleEndCall,
    handleAudio,
    handleScreen,
    screenAvailable,
    screen,
    openChat,
    newmessages,
    audio,
    video,
    handlePreviewUrl,
  } = props

  return (
    <div
      className="btn-down"
      style={{
        backgroundColor: "whitesmoke",
        color: "whitesmoke",
        textAlign: "center",
      }}
    >
      <IconButton style={{ color: "#424242" }} onClick={handleVideo}>
        {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>

      <IconButton style={{ color: "#f44336" }} onClick={handleEndCall}>
        <CallEndIcon />
      </IconButton>

      <IconButton style={{ color: "#424242" }} onClick={handleAudio}>
        {audio === true ? <MicIcon /> : <MicOffIcon />}
      </IconButton>

      {screenAvailable === true ? (
        <IconButton style={{ color: "#424242" }} onClick={handleScreen}>
          {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
        </IconButton>
      ) : null}

      <ScreenRecord parentCallback={handlePreviewUrl} />

      <CopyUrl />

      <Badge
        badgeContent={newmessages}
        max={999}
        color="secondary"
        onClick={openChat}
      >
        <IconButton style={{ color: "#424242" }} onClick={openChat}>
          <ChatIcon />
        </IconButton>
      </Badge>
    </div>
  )
}

export default ControlBar
