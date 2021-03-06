import "./styles/App.css"
import "antd/dist/antd.css"
import Home from "./views/Home"
import Video from "./views/Video"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/:url" exact component={Video} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
