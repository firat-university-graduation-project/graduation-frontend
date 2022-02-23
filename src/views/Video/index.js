import React, { Component } from "react"
import io from "socket.io-client"
import "bootstrap/dist/css/bootstrap.css"
import "./Video.css"

import PreviewModal from "../../components/Modal/Preview"
import MessageModal from "../../components/Modal/Message"
import AskForUsername from "../../components/AskForUsername"
import ControlBar from "../../components/ControlBar"
import VideoComp from "../../components/Video"
import MessageBar from "../../components/MessageBar"

let connections = {}
const peerConnectionConfig = {
  iceServers: [
    // { 'urls': 'stun:stun.services.mozilla.com' },
    { urls: "stun:stun.l.google.com:19302" },
  ],
}
let socket = null
let socketId = null
let elms = 0

class Video extends Component {
  constructor(props) {
    super(props)

    this.localVideoref = React.createRef()
    this.videoAvailable = false
    this.audioAvailable = false

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
    connections = {}

    this.getPermissions()
  }

  getPermissions = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(() => {
          this.videoAvailable = true
          this.audioAvailable = true
        })
        .catch(() => {
          this.videoAvailable = false
          this.audioAvailable = false
        })

      if (navigator.mediaDevices.getDisplayMedia) {
        this.setState({ screenAvailable: true })
      } else {
        this.setState({ screenAvailable: false })
      }

      if (this.videoAvailable || this.audioAvailable) {
        navigator.mediaDevices
          .getUserMedia({
            video: this.videoAvailable,
            audio: this.audioAvailable,
          })
          .then((stream) => {
            window.localStream = stream
            this.localVideoref.current.srcObject = stream
          })
          .catch((e) => console.log(e))
      }
    } catch (e) {
      console.log(e)
    }
  }

  getMedia = () => {
    this.setState(
      {
        video: this.videoAvailable,
        audio: this.audioAvailable,
      },
      () => {
        this.getUserMedia()
        this.connectToSocketServer()
      }
    )
  }

  getUserMedia = () => {
    if (
      (this.state.video && this.videoAvailable) ||
      (this.state.audio && this.audioAvailable)
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: this.state.video, audio: this.state.audio })
        .then(this.getUserMediaSuccess)
        .catch((e) => console.log(e))
    } else {
      try {
        let tracks = this.localVideoref.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())

        navigator.mediaDevices
          .getUserMedia({ video: false, audio: false })
          .then(this.getUserMediaSuccess)
          .catch((e) => console.log(e))
      } catch (e) {}
    }
  }

  getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop())
    } catch (e) {
      console.log(e)
    }

    window.localStream = stream
    this.localVideoref.current.srcObject = stream

    for (let id in connections) {
      if (id === socketId) continue

      connections[id].addStream(window.localStream)

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            )
          })
          .catch((e) => console.log(e))
      })
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              video: false,
              audio: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks()
                tracks.forEach((track) => track.stop())
              } catch (e) {
                console.log(e)
              }

              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()])
              window.localStream = blackSilence()
              this.localVideoref.current.srcObject = window.localStream

              for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                  connections[id]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        id,
                        JSON.stringify({
                          sdp: connections[id].localDescription,
                        })
                      )
                    })
                    .catch((e) => console.log(e))
                })
              }
            }
          )
        })
    )
  }

  getDislayMedia = () => {
    if (this.state.screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(this.getDislayMediaSuccess)
          .catch((e) => console.log(e))
      }
    }
  }

  getDislayMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop())
    } catch (e) {
      console.log(e)
    }

    window.localStream = stream
    this.localVideoref.current.srcObject = stream

    for (let id in connections) {
      if (id === socketId) continue

      connections[id].addStream(window.localStream)

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socket.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            )
          })
          .catch((e) => console.log(e))
      })
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          this.setState(
            {
              screen: false,
            },
            () => {
              try {
                let tracks = this.localVideoref.current.srcObject.getTracks()
                tracks.forEach((track) => track.stop())
              } catch (e) {
                console.log(e)
              }

              let blackSilence = (...args) =>
                new MediaStream([this.black(...args), this.silence()])
              window.localStream = blackSilence()
              this.localVideoref.current.srcObject = window.localStream

              this.getUserMedia()
            }
          )
        })
    )
  }

  gotMessageFromServer = (fromId, message) => {
    let signal = JSON.parse(message)

    if (fromId !== socketId) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socket.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      )
                    })
                    .catch((e) => console.log(e))
                })
                .catch((e) => console.log(e))
            }
          })
          .catch((e) => console.log(e))
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e))
      }
    }
  }

  changeCssVideos = (main) => {
    let widthMain = main.offsetWidth
    let minWidth = "30%"
    if ((widthMain * 30) / 100 < 300) {
      minWidth = "300px"
    }
    let minHeight = "40%"

    let height = String(100 / elms) + "%"
    let width = ""
    if (elms === 0 || elms === 1) {
      width = "100%"
      height = "100%"
    } else if (elms === 2) {
      width = "45%"
      height = "100%"
    } else if (elms === 3 || elms === 4) {
      width = "35%"
      height = "50%"
    } else {
      width = String(100 / elms) + "%"
    }

    let videos = main.querySelectorAll("video")
    for (let a = 0; a < videos.length; ++a) {
      videos[a].style.minWidth = minWidth
      videos[a].style.minHeight = minHeight
      videos[a].style.setProperty("width", width)
      videos[a].style.setProperty("height", height)
    }

    return { minWidth, minHeight, width, height }
  }

  connectToSocketServer = () => {
    socket = io.connect(process.env.REACT_APP_SERVER_URL, { secure: true })

    socket.on("signal", this.gotMessageFromServer)

    socket.on("connect", () => {
      socket.emit("join-call", window.location.href)
      socketId = socket.id

      socket.on("chat-message", this.addMessage)

      socket.on("user-left", (id) => {
        let video = document.querySelector(`[data-socket="${id}"]`)
        if (video !== null) {
          elms--
          video.parentNode.removeChild(video)

          let main = document.getElementById("main")
          this.changeCssVideos(main)
        }
      })

      socket.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConnectionConfig
          )
          // Wait for their ice candidate
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socket.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              )
            }
          }

          // Wait for their video stream
          connections[socketListId].onaddstream = (event) => {
            // TODO mute button, full screen button
            let searchVidep = document.querySelector(
              `[data-socket="${socketListId}"]`
            )
            if (searchVidep !== null) {
              // if i don't do this check it make an empyt square
              searchVidep.srcObject = event.stream
            } else {
              elms = clients.length
              let main = document.getElementById("main")
              let cssMesure = this.changeCssVideos(main)

              let video = document.createElement("video")

              let css = {
                minWidth: cssMesure.minWidth,
                minHeight: cssMesure.minHeight,
                maxHeight: "100%",
                margin: "10px",
                borderStyle: "solid",
                borderColor: "#bdbdbd",
                objectFit: "fill",
              }
              for (let i in css) video.style[i] = css[i]

              video.style.setProperty("width", cssMesure.width)
              video.style.setProperty("height", cssMesure.height)
              video.setAttribute("data-socket", socketListId)
              video.srcObject = event.stream
              video.autoplay = true
              video.playsinline = true

              main.appendChild(video)
            }
          }

          // Add the local video stream
          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream)
          } else {
            let blackSilence = (...args) =>
              new MediaStream([this.black(...args), this.silence()])
            window.localStream = blackSilence()
            connections[socketListId].addStream(window.localStream)
          }
        })

        if (id === socketId) {
          for (let id2 in connections) {
            if (id2 === socketId) continue

            try {
              connections[id2].addStream(window.localStream)
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socket.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  )
                })
                .catch((e) => console.log(e))
            })
          }
        }
      })
    })
  }

  silence = () => {
    let ctx = new AudioContext()
    let oscillator = ctx.createOscillator()
    let dst = oscillator.connect(ctx.createMediaStreamDestination())
    oscillator.start()
    ctx.resume()
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
  }
  black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    })
    canvas.getContext("2d").fillRect(0, 0, width, height)
    let stream = canvas.captureStream()
    return Object.assign(stream.getVideoTracks()[0], { enabled: false })
  }

  handleVideo = () => {
    this.setState({ video: !this.state.video }, () => this.getUserMedia())
    let main = document.getElementById("main")
    this.changeCssVideos(main)
  }

  handleAudio = () =>
    this.setState({ audio: !this.state.audio }, () => this.getUserMedia())
  handleScreen = () =>
    this.setState({ screen: !this.state.screen }, () => this.getDislayMedia())

  handleEndCall = () => {
    try {
      let tracks = this.localVideoref.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
    } catch (e) {}
    window.location.href = "/"
  }

  openChat = () => this.setState({ showModal: true, newmessages: 0 })
  closeChat = () => this.setState({ showModal: false })
  handleMessage = (e) => this.setState({ message: e.target.value })

  addMessage = (data, sender, socketIdSender) => {
    this.setState((prevState) => ({
      messages: [...prevState.messages, { sender: sender, data: data }],
    }))
    if (socketIdSender !== socketId) {
      this.setState({ newmessages: this.state.newmessages + 1 })
    }
  }

  handleUsername = (e) => this.setState({ username: e.target.value })

  sendMessage = () => {
    socket.emit("chat-message", this.state.message, this.state.username)
    this.setState({ message: "", sender: this.state.username })
  }

  connect = () =>
    this.setState({ askForUsername: false }, () => this.getMedia())

  render() {
    return (
      <div>
        {this.state.askForUsername === true ? (
          <AskForUsername
            handleUsername={this.handleUsername}
            connect={this.connect}
            localVideoref={this.localVideoref}
            username={this.state.username}
          />
        ) : (
          <div className="container">
            <div className="main">
              <ControlBar
                handleVideo={this.handleVideo}
                handleEndCall={this.handleEndCall}
                handleAudio={this.handleAudio}
                handleScreen={this.handleScreen}
                screenAvailable={this.state.screenAvailable}
                screen={this.state.screen}
                newmessages={this.state.newmessages}
                audio={this.state.audio}
                openChat={this.openChat}
                handlePreviewUrl={(mediaBlobUrl) =>
                  this.setState({ mediaBlobUrl })
                }
                video={this.state.video}
              />

              <PreviewModal mediaBlobUrl={this.state.mediaBlobUrl} />

              <MessageModal
                showModal={this.state.showModal}
                messages={this.state.messages}
                message={this.state.message}
                handleMessage={this.handleMessage}
                sendMessage={this.sendMessage}
                closeChat={this.closeChat}
              />
              <VideoComp
                video={this.state.video}
                localVideoref={this.localVideoref}
                username={this.state.username}
              />
            </div>

            <MessageBar
              className="message_bar"
              showModal={this.state.showModal}
              messages={this.state.messages}
              message={this.state.message}
              handleMessage={this.handleMessage}
              sendMessage={this.sendMessage}
              closeChat={this.closeChat}
            />
          </div>
        )}
      </div>
    )
  }
}

export default Video
