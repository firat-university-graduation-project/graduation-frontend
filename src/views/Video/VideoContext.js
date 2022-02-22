import React, { Component } from "react"
import Video from "./index"

const Video_Context = React.createContext()

class VideoContext extends Component {
  constructor(props) {
    super(props)

    this.state = {
      video: false,
      audio: false,
      screen: false,
      showModal: false,
      screenAvailable: false,
      messages: [],
      message: "",
      newmessages: 0,
      askForUsername: true,
      username: "",
      mediaBlobUrl: "",
    }
  }
  render() {
    console.log(this.state)
    return (
      <>
        <Video_Context.Provider value={this.state}>
          <Video />
        </Video_Context.Provider>
      </>
    )
  }
}

export default VideoContext
