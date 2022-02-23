import React, { useState } from "react"
import { Input, Button, TextField } from "@material-ui/core"
import "./Home.css"

const Home = () => {
  const [url, setUrl] = useState("")

  const join = () => {
    let newUrl = ""
    if (url !== "") {
      newUrl = url.split("/")
      window.location.href = `/${newUrl[newUrl.length - 1]}`
      setUrl("")
    } else {
      alert("Please enter a URL.")
    }
  }

  return (
    <div>
      <div className="container_home">
        <div className="image_wrapper">
          <img src="images/firat-logo.png" alt="" />
        </div>
        <div className="title">
          <h1
            style={{ fontSize: "45px", marginBottom: "8px", fontWeight: "500" }}
          >
            Graduation Project~Video Meeting
          </h1>
          <p style={{ fontWeight: "200" }}>
            Intelligent video conferencing website that provides image
            processing with artificial intelligence.
          </p>
        </div>

        <div className="login_container">
          <p style={{ }}>
            Start or join a meeting
          </p>
          <div className="login_wrapper">
            <TextField
              placeholder="URL"
              onChange={(e) => setUrl(e.target.value)}
              required={true}
              onKeyDown={(e) => e.key === "Enter" && join()}
              autoFocus
            />
            <Button
              variant="contained"
              color="primary"
              onClick={join}
              style={{ margin: "20px" }}
              disabled={!url}
              autoFocus
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
