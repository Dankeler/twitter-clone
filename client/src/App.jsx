import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './stylesheets/App.css'

import StartPage from "./components/StartPage"
import Login from "./components/LogIn"
import SignUp from "./components/SignUp"
import Navbar from "./components/Navbar"

import Friends from "./components/Friends"



function App() {
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<StartPage/>}></Route>
          <Route path="/log-in" element={<Login/>}></Route>
          <Route path="/sign-up" element={<SignUp/>}></Route>
          <Route path="/home" element={<Navbar/>}>
            <Route path="" element={<Friends/>}></Route>
          </Route>
        </Routes>
    </Router>
  )
}



export default App