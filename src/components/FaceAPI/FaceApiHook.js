import React, { useRef, useState, useEffect } from "react"
import * as faceApi from "face-api.js"
import Modal from "react-bootstrap/Modal"

const FaceApiHook = (props) => {
  const expressionMap = {
    neutral: "Neutral: 😶",
    happy: "Happy: 😄",
    sad: "Sad: 😞",
    angry: "Angry: 🤬",
    fearful: "Fearful: 😖",
    disgusted: "Disgusted: 🤢",
    surprised: "Surprised: 😲",
  }
  const { showFaceApiModal, closeFaceApiModal } = props
  const [expressions, setExpressions] = useState([])
  let video = useRef()

  Promise.all([
    faceApi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceApi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceApi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceApi.nets.faceExpressionNet.loadFromUri("/models"),
  ])

  useEffect(async () => {
    log("run started")
    try {
      await faceApi.nets.tinyFaceDetector.load("/models")
      await faceApi.loadFaceExpressionModel(`/models`)
      let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })

      video.current.srcObject = mediaStream
    } catch (e) {
      log(e.name, e.message, e.stack)
    }
  }, [])

  const log = async (...args) => {
    console.log(...args)
  }

  const onPlay = async () => {
    if (
      video?.current?.paused ||
      video?.current?.ended ||
      !faceApi.nets.tinyFaceDetector.params
    ) {
      setTimeout(() => onPlay())
      return
    }

    const options = new faceApi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.5,
    })
    const result = await faceApi
      .detectSingleFace(video.current, options)
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
      log(result)
      const expressions = result.expressions.reduce(
        (acc, { expression, probability }) => {
          acc.push([expressionMap[expression], probability])
          return acc
        },
        []
      )
      log(expressions)
      setExpressions(expressions)
    }

    setTimeout(() => onPlay(), 1000)
  }

  return (
    <Modal
      show={showFaceApiModal}
      onHide={closeFaceApiModal}
      style={{ zIndex: "999999" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Face Recognition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {expressions
            .sort((a, b) => b[1] - a[1])
            .filter((_, i) => i < 1)
            .map(([e, w]) => (
              <p key={e + w}>
                {e} {w}
              </p>
            ))}
        </div>
        <div style={{ width: "100%", height: "100vh", position: "relative" }}>
          <video
            ref={video}
            autoPlay
            muted
            onPlay={onPlay}
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

export default FaceApiHook
