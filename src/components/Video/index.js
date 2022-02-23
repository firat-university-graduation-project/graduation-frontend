import React from "react"
import { Row, Container } from "reactstrap"
import "./video.css"

const Video = (props) => {
  const { video, localVideoref, username } = props
  return (
    <div className="video_container">
      <Row
        id="main"
        className="flex-container"
        style={{ margin: 0, padding: 0 }}
      >
        {video == true ? (
          <video id="my-video" ref={localVideoref} autoPlay muted />
        ) : (
          <div className="user_silhouette_wrapper">
            <img
              className="user_silhouette"
              src="images/user-silhouette.jpg"
              alt="User Silhouette"
            />
            <p>{username}</p>
          </div>
        )}
      </Row>
    </div>
  )
}

export default Video
