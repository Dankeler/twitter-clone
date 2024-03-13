/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {FaThumbsUp} from "react-icons/fa"
import {formatDistanceToNow} from "date-fns"
import {Buffer} from "buffer"
import sample_photo from "../../assets/sample-avatar.jpg"
import axios from "axios";


const Comment = (props) => {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [like, setLike] = useState(props.props.likes.length)
  const id = props.props._id

  const timeAgo = formatDistanceToNow(new Date(props.props.datecreated), { addSuffix: true });

  useEffect(() => {
    const getAvatar = () => {
      if (props.props.author.avatar !== null && props.props.author.avatar.data) {
        const avatarBase64 = Buffer.from(props.props.author.avatar.data, "base64")
        const avatarUrl = `${avatarBase64}`
        setAvatarUrl(avatarUrl)
      }
    }
    getAvatar()
  })

  const handleLiking = async () => {
    try {
      const response = await axios.patch("http://localhost:3000/post/comment/like", {id}, {
        headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}

      })
      if (response.status === 200) {
        setLike(like + 1)
      } else {
        setLike(like - 1)
      }
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-slate-800 p-3 rounded-lg shadow-lg mt-2 w-11/12 outline outline-slate-700">
      <div className="flex items-center">
          <img
            src={avatarUrl ? avatarUrl : sample_photo}
            alt="Avatar"
            className="rounded-full h-8 w-8"
          />
        <div className="ml-2">
          <h2 className="font-semibold text-lg text-left">
            {props.props.author.username}
          </h2>
          <p className="text-white">{timeAgo}</p>
        </div>
      </div>
      <p className="mt-2 text-left">{props.props.content}</p>
      <div className="mt-2 flex items-center">
        <button className="text-white hover:text-blue-500 flex items-center justify-start" onClick={handleLiking}>
          <div className="flex gap-1 items-center">
          <p>{like}</p>
          <FaThumbsUp/>
          </div>
        </button>
      </div>
    </div>
  );
};
    
export default Comment;