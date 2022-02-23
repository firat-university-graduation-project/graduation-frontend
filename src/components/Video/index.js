import React from "react"
import CopyUrl from "../CopyUrl"
import { Row, Container } from "reactstrap"

const Video = (props) => {
  const { video, localVideoref, username } = props
  return (
    <div className="container">
      <CopyUrl />

      <Container>
        <Row
          id="main"
          className="flex-container"
          style={{ margin: 0, padding: 0 }}
        >
          {video == true ? (
            <video
              id="my-video"
              ref={localVideoref}
              autoPlay
              muted
              style={{
                borderStyle: "solid",
                borderColor: "#bdbdbd",
                margin: "10px",
                objectFit: "fill",
                width: "50%",
                height: "50%",
              }}
            ></video>
          ) : (
            <div style={{ backgroundColor: "red" }}>
              <h2>{username || "Username"}</h2>
            </div>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default Video
