import axios from "axios"
import { useState } from "react"
import {Link, Navigate} from "react-router-dom"

const Login = () => {
    const [username, setUser] = useState("")
    const [password, setPassword] = useState("")

    const [logged, setLogged] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/log-in", {username, password})

            if (response.status === 200) {
                setLogged("asdfasdf")
                console.log(response)
                localStorage.setItem("accessToken", response.data.accessToken)
                localStorage.setItem("username", response.data.username)
                localStorage.setItem("avatar", response.data.avatar)
            }
        } catch(err) {
            console.log(err)
        }

    }

    return (
        <div className="flex justify-center items-center h-screen">
            {logged && <Navigate to="/home"/>}
            <form className="w-64" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label>Username</label>
                    <input id="username" type="text" className="w-full px-3 py-2 border rounded-md" onChange={(e) => setUser(e.target.value)}/>
                </div>
                <div className="mb-4">
                    <label>Password</label>
                    <input id="password" type="password" className="w-full px-3 py-2 border rounded-md" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="mb-8 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition duration-300">Log In</button>
                <button className="bg-slate-400 w-1/2 py-1 rounded-md hover:bg-slate-500 transition duration-300">
                    <Link to="/">Go Back</Link>
                </button>
            </form>
        </div>
    )
}

export default Login