import { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import axios from "axios"
import sample_avatar from "../assets/sample-avatar.jpg"
import {Buffer} from "buffer"




const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const [username, setUsername] = useState(null)
    const [avatarUrl, setAvatarDataUrl] = useState(null)

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getUser = async () => {
            if (localStorage.getItem("accessToken")) {
                setUsername(localStorage.getItem("username"));
                const avatarBuffer = localStorage.getItem("avatar")
                if (avatarBuffer) {
                    const avatarBase64 = Buffer.from(avatarBuffer, "base64")
                    const avatarUrl = `${avatarBase64}`
                    setAvatarDataUrl(avatarUrl)
                }
                setIsLoading(false)
            }
        };
        getUser();
    }, [avatarUrl]);


    const handleLogout = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/home/log-out", {}, {
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })

            if (response.status === 200) {
                localStorage.clear()
                setUsername(null)
            }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <>
            {!isLoading && (
                <>
                    {!username ? (
                        <Navigate to="/" />
                    ) : (
                        <>
                            <div className="w-full p-0 h-[5%] flex justify-between outline outline-1 outline-white">
                                <div className="flex justify-center min-w-64 px-6 h-full items-center">
                                    <p className="border-white border-x-4 flex items-center h-full w-20 justify-center">Home</p>
                                    <p className="flex items-center h-full w-20 justify-center">Friends</p>
                                    <p className="border-white border-x-4 flex items-center h-full w-20 justify-center">Groups</p>
                                </div>
                                <div className="flex px-6 cursor-pointer h-full items-center" onClick={() => setMenuOpen(!menuOpen)}>
                                    <span className="text-bg font-medium mx-6">{username}</span>
                                    <img src={avatarUrl ? avatarUrl : sample_avatar} alt="User Avatar" className="rounded-full h-full w-full" />
                                    {menuOpen && (
                                        <div className="absolute right-0 top-12 w-48 bg-white border rounded shadow-lg">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit Profile</a>
                                            <button onClick={handleLogout} className="bg-black">Log Out</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Outlet />
                        </>
                    )}
                </>
            )}
        </>
    );
    
}

export default Navbar