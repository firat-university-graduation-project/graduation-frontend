import React from "react"
import Modal from "react-bootstrap/Modal"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"

const VoiceMessageModal = (props) => {
  const { showModalVoiceMessages, closeModalVoiceMessages } = props
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>
  }

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
              SpeechRecognition.startListening({ language: "tr-TR" })
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
