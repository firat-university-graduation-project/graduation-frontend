import React, { useState } from "react"
import { Input, Button } from "@material-ui/core"
import "./Home.css"

const Home = () => {
  const [url, setUrl] = useState("")

  const handleChange = (e) => setUrl(e.target.value)

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
          <br />
          <br />
          <br />
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

        <div
          style={{
            background: "white",
            width: "30%",
            height: "auto",
            padding: "20px",
            minWidth: "400px",
            textAlign: "center",
            margin: "auto",
            marginTop: "100px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>
            Start or join a meeting
          </p>
          <Input
            placeholder="URL"
            onChange={(e) => handleChange(e)}
            required={true}
            onKeyDown={(e) => {
              e.key === "Enter" && join()
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={join}
            style={{ margin: "20px" }}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home
