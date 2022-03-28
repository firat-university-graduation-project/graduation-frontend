import React, { useRef } from "react"
import ReactDOM from "react-dom"
import * as faceApi from "face-api.js"
import Modal from "react-bootstrap/Modal"

const expressionMap = {
  neutral: "😶",
  happy: "😄",
  sad: "😞",
  angry: "🤬",
  fearful: "😖",
  disgusted: "🤢",
  surprised: "😲",
}

class FaceApi extends React.Component {
  video = React.createRef()
  constructor(props) {
    super(props)
    this.state = { expressions: [] }
  }

  componentDidMount() {
    this.run()
  }

  log = (...args) => {
    console.log(...args)
  }

  run = async () => {
    this.log("run started")
    try {
      await faceApi.nets.tinyFaceDetector.load("/models")
      await faceApi.loadFaceExpressionModel(`/models`)
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      this.video.current.srcObject = this.mediaStream
    } catch (e) {
      this.log(e.name, e.message, e.stack)
    }
  }

  onPlay = async () => {
    if (
      this.video?.current?.paused ||
      this.video?.current?.ended ||
      !faceApi.nets.tinyFaceDetector.params
    ) {
      setTimeout(() => this.onPlay())
      return
    }

    const options = new faceApi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.5,
    })
    const result = await faceApi
      .detectSingleFace(this.video.current, options)
      .withFaceExpressions()

    
    
    // const canvas = faceApi.createCanvasFromMedia(this.video)
    // document.body.append(canvas)
    // const boxSize = {
    //   width: this.video.width,
    //   height: this.video.height,
    // }

    // faceApi.matchDimensions(canvas, boxSize)

    // setInterval(async () => {
    //   //async
    //   // await
    //   const detections = await faceApi
    //     .detectAllFaces(this.video, new faceApi.TinyFaceDetectorOptions())
    //     .withFaceLandmarks()
    //     .withFaceExpressions()

    //   canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
    //   const resizedDetections = faceApi.resizeResults(detections, boxSize)

    //   faceApi.draw.drawDetections(canvas, resizedDetections)
    //   faceApi.draw.drawFaceLandmarks(canvas, resizedDetections)
    //   faceApi.draw.drawFaceExpressions(canvas, resizedDetections)
    // })



    if (result) {
      this.log(result)
      const expressions = result.expressions.reduce(
        (acc, { expression, probability }) => {
          acc.push([expressionMap[expression], probability])
          return acc
        },
        []
      )
      this.log(expressions)
      this.setState(() => ({ expressions }))
    }

    setTimeout(() => this.onPlay(), 1000)
  }

  render() {
    return (
      <Modal
        show={this.props.showFaceApiModal}
        onHide={this.props.closeFaceApiModal}
        style={{ zIndex: "999999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Face Recognition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {this.state.expressions
              .sort((a, b) => b[1] - a[1])
              .filter((_, i) => i < 3)
              .map(([e, w]) => (
                <p key={e + w}>
                  {e} {w}
                </p>
              ))}
          </div>
          <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <video
              ref={this.video}
              autoPlay
              muted
              onPlay={this.onPlay}
              style={{
                position: "absolute",
                width: "100%",
                height: "100vh",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default FaceApi
