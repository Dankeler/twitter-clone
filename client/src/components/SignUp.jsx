import { useState } from "react"
import {Link, Navigate} from "react-router-dom"
import axios from "axios"



const SignUp = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [about, setAbout] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [tos, setTos] = useState(false)

    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            return setError("Passwords do not match")
        } else {
            setError("")
        }

        try {
            const response = await axios.post("http://localhost:3000/sign-up", {username, password, about, avatar})

            if (response.status === 200) {
                setTos(null)
            }
        } catch(err) {
            console.log(err)
        }
    }

    function convertToBase(e) {
        if (e.target.files[0].size >= 8388608) {
            return setError("Max file size is 8MB")
        } else {
            setError("")
        }
        let reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            setAvatar(reader.result)
        }
        reader.onerror = (error) => {
            console.log(error)
        }
    }


    return (
        <div className="flex justify-center items-center h-screen">
            {tos === null && <Navigate to="/"/>} 
            <form className="w-64" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label >Username</label>
                    <input id="username" type="text" className="w-full px-3 py-2 border rounded-md" required onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="mb-4">
                    <label>Password</label>
                    <input id="password" type="password" className=" w-full px-3 py-2 border rounded-md" required onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div className="mb-4">
                    <label>Confirm Password</label>
                    <input id="confirmPassword" type="password" className=" w-full px-3 py-2 border rounded-md" required onChange={(e) => setConfirmPassword(e.target.value)}/>
                </div>
                <div className="mb-4">
                    <label>About me</label>
                    <textarea id="about" className="w-full px-3 py-2 border rounded-md" onChange={(e) => setAbout(e.target.value)}/>
                </div>
                <div className="mb-4">
                    <label>Profile Picture</label>
                    <input id="avatar" type="file" accept="image/png, image/jpeg" className="w-full px-3 py-2 border rounded-md" onChange={convertToBase}/>
                </div>
                <div className="mb-2 flex text-nowrap items-center gap-4">
                <input id="tos" type="checkbox" className=" px-3 py-2 border rounded-md size-4" required onChange={() => setTos(!tos)}/>
                    <label>Agree to Terms of Service</label>
                </div>
                {error && <div><p className="text-red-500">{error}</p></div>}
                <button type="submit" className="mb-8 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition duration-300">Sign Up</button>
                <button className="bg-slate-400 w-1/2 py-1 rounded-md hover:bg-slate-500 transition duration-300">
                    <Link to="/">Go Back</Link>
                </button>
            </form>
        </div>
    )
}

export default SignUp