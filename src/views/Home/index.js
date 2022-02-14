import React, { useState } from "react"
import { Input, Button, IconButton } from "@material-ui/core"
import GitHubIcon from "@material-ui/icons/GitHub"
import "./Home.css"

const Home = () => {
  const [url, setUrl] = useState("")

  const handleChange = (e) => setUrl(e.target.value)

  const join = () => {
    if (url !== "") {
      let newUrl = url.split("")
      window.location.href = `/${newUrl[newUrl.length - 1]}`
    } else {
      let newUrl = Math.random().toString(36).substring(2, 7)
      window.location.href = `${newUrl}`
    }
  }

  return (
    <div>
      <div className="container_home">
        <div className="source_code_link_wrapper">
          Source Code:
          <IconButton
            style={{ color: "black" }}
            onClick={() =>
              (window.location.href =
                "https://github.com/firat-university-graduation-project/graduation-frontend-demo")
            }
          >
            <GitHubIcon />
          </IconButton>
        </div>

        <div className="title">
          <h1
            style={{ fontSize: "45px", marginBottom: "8px", fontWeight: "500" }}
          >
            Video Meeting
          </h1>
          <p style={{ fontWeight: "200" }}>
            Video conference website that lets you stay in touch with all your
            friends.
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
          <Input placeholder="URL" onChange={(e) => handleChange(e)} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => join()}
            style={{ margin: "20px" }}
          >
            Go
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home