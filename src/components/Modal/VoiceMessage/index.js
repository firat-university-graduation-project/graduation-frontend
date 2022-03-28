import React, { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"

const VoiceMessageModal = (props) => {
  const {
    showModalVoiceMessages,
    closeModalVoiceMessages,
    username,
    sendVoiceMessage,
    handleVoiceMessage,
  } = props
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()
  const [transcriptState, setTranscriptState] = useState({
    transcript: [],
    username: "",
  })

  useEffect(() => {
    SpeechRecognition.startListening({ language: "tr-TR", continuous: true })

    if (transcript.length > 100) {
      resetTranscript()
      setTranscriptState({
        transcript: [...transcriptState.transcript, transcript],
        username,
      })
      // sendVoiceMessage()
      // handleVoiceMessage()

      // return () => {
      //   resetTranscript()
      // }
    }
  }, [transcript])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

  // console.log(transcriptState)

  return (
    <Modal
      show={showModalVoiceMessages}
      onHide={closeModalVoiceMessages}
      style={{ zIndex: "999999" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Voice Message</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          overflow: "auto",
          overflowY: "auto",
          height: "400px",
          textAlign: "left",
        }}
      >
        <div>
          <p>Microphone: {listening ? "on" : "off"}</p>
          <button
            onClick={() =>
              SpeechRecognition.startListening({
                continuous: true,
                language: "tr-TR",
              })
            }
          >
            Start
          </button>
          <button onClick={SpeechRecognition.stopListening}>Stop</button>
          <button onClick={resetTranscript}>Reset</button>
          <p>{transcript}</p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default VoiceMessageModal
