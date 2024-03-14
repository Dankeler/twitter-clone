/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import sample_photo from '../assets/sample-avatar.jpg';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {formatDistanceToNow} from "date-fns"
import {Buffer} from "buffer"

const PostCard = (props) => {
    const timeAgo = formatDistanceToNow(new Date(props.props.datecreated), { addSuffix: true });
    return (
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg mt-6 outline outline-slate-700 overflow-y-auto w-1/2">
          <div className="flex items-center">
            <div className="ml-2">
              <p className="text-white text-left text-balance">Content: {props.props.content}</p>
              <p className="text-white text-left text-balance">Likes: {props.props.likes.length}</p>
              <p className="text-white text-left text-balance">Comments: {props.props.comments.length}</p>
              <p className="text-white text-left text-balance">{timeAgo}</p>
            </div>
          </div>
        </div>
      );
    };

const User = () => {
    const [username, setUsername] = useState(null)
    const [about, setAbout] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [friendStatus, setFriendStatus] = useState("Not Friends")
    const [posts, setPosts] = useState([])

    const id = useParams()

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/home/users/${id.userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                });
                setUsername(response.data.user.username)
                setAbout(response.data.user.about)
                if (response.data.isFriend) {
                    setFriendStatus("Friends")
                }
                if (response.data.user.avatar !== null && response.data.user.avatar.data) {
                    const avatarBase64 = Buffer.from(response.data.user.avatar.data, "base64")
                    const avatarUrl = `${avatarBase64}`
                    setAvatar(avatarUrl)
                  }
                setPosts(response.data.posts)
            } catch (err) {
                console.log(err);
            }
        }
    
        getUserInfo();
    }, [id]);
    

  return (
    <div className='flex justify-center items-center h-[85%] flex-col'>
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg mt-6 outline outline-slate-700 overflow-y-auto w-1/2">
        <div className="flex items-center">
            <img
            src={avatar ? avatar : sample_photo}
            alt="Avatar"
            className="rounded-full h-8 w-8"
            />
            <div className="ml-2">
            <h2 className="font-semibold text-lg text-left">
                {username}
            </h2>
            <p className="text-white text-left text-balance">{about}</p>
            </div>
        </div>
            <p className="mt-2 text-left">{friendStatus}</p>
            
            <p className="mt-2 text-left">Amount of posts: {posts.length}</p>
        </div>
        {posts.map((post, index) => (
            <PostCard key={index} props={post}></PostCard>
        ))}
    </div>

  );
};

export default User;
