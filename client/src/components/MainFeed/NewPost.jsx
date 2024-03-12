/* eslint-disable react/prop-types */
import axios from "axios"
import { useState } from "react"

const NewPost = () => {
    const [postText, setPostText] = useState("")

    const handleSend = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:3000/post/create", {postText}, {
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })

            if (response.status === 200) {
                console.log("gitek")
            }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <form className="mb-4 w-1/3" onSubmit={handleSend}>
        <textarea
        onChange={(e) => setPostText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        ></textarea>
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Post</button>
      </form>
    )
}

export default NewPost