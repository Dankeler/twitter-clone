/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import {formatDistanceToNow} from "date-fns"
import { useEffect, useState } from "react";
import {FaThumbsUp} from "react-icons/fa"
import sample_photo from "../../assets/sample-avatar.jpg"
import {Buffer} from "buffer"

import Comment from "../MainFeed/Comment"
import Replay from "../MainFeed/Replay"

const Post = (props) => {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReplay, setShowReplay] = useState(false)

  const [comments, setComments] = useState([])

  const timeAgo = formatDistanceToNow(new Date(props.props.datecreated), { addSuffix: true });

  useEffect(() => {
    setLoading(true)
    setComments(props.props.comments)
    const getAvatar = () => {
      if (props.props.author.avatar !== null && props.props.author.avatar.data) {
        const avatarBase64 = Buffer.from(props.props.author.avatar.data, "base64")
        const avatarUrl = `${avatarBase64}`
        setAvatarUrl(avatarUrl)
      }
    }
    getAvatar()
    setLoading(false)
  }, [])
 

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow mb-4 w-1/3">
      <div className="flex items-center">
        {!loading && <img src={avatarUrl ? avatarUrl : sample_photo} alt="Avatar" className="rounded-full h-10 w-10" />}
        <div className="ml-2">
          <h2 className="font-semibold text-lg text-left">{props.props.author.username}</h2>
          <p className="text-white">{timeAgo}</p>
        </div>
      </div>
      <p className="mt-2 text-left">{props.props.content}</p>
      <div className="mt-2 flex items-center">
      <button className="text-white hover:text-blue-500 flex items-center justify-start">
          <div className="flex gap-1 items-center">
            <p>{props.props.likes}</p>
            <FaThumbsUp/>
          </div>
        </button>
        <button className="text-white hover:text-blue-500 flex items-center ml-2" onClick={() => setShowReplay(!showReplay)}>
        Reply
          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
      {showReplay && <Replay id={props.props._id} refresh={props.refresh} setRefresh={props.setRefresh}></Replay>}
      {comments && comments.map((comment, idx) => (
        <Comment key={idx} props={comment}></Comment>
      ))}
    </div>
  );
}


export default Post