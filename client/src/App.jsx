import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import './stylesheets/App.css'

import StartPage from "./components/StartPage"
import Login from "./components/LogIn"
import SignUp from "./components/SignUp"
import Navbar from "./components/Navbar"
import Users from "./components/Users"

import MainFeed from "./components/MainFeed/MainFeed"



function App() {
  
  return (
    <Router>
        <Routes>
          <Route path="/" element={<StartPage/>}></Route>
          <Route path="/log-in" element={<Login/>}></Route>
          <Route path="/sign-up" element={<SignUp/>}></Route>
          <Route path="/home" element={<Navbar/>}>
            <Route path="" element={<MainFeed/>}></Route>
            <Route path="users" element={<Users/>}></Route>
          </Route>
        </Routes>
    </Router>
  )
}



export default App
