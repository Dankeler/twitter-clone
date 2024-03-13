/* eslint-disable react/prop-types */
import axios from "axios"
import { useState } from "react"

const Replay = (props) => {
    const [replayContent, setReplyContent] = useState("")
    const id = props.id
    console.log(props)

    const replaySend = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:3000/post/comment/create", {replayContent, id}, {
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })
            props.setRefresh(prevRefresh => !prevRefresh)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <form className="mt-4" onSubmit={replaySend}>
            <textarea
                defaultValue={replayContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply here..."
                className="bg-slate-600 rounded-lg p-2 w-full h-24"
                required
            ></textarea>
            <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
                Submit
            </button>
    </form>
    )
}

export default Replay