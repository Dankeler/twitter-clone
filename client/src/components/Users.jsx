import axios from 'axios';
import { useEffect, useState } from 'react';
import sample_photo from "../assets/sample-avatar.jpg"
import {Buffer} from "buffer"
import {Link} from "react-router-dom"

const User = (user) => {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [friendStatus, setFriendStatus] = useState("add as friend")

  useEffect(() => {
    if (user.user.avatar !== null && user.user.avatar.data) {
        const avatarBase64 = Buffer.from(user.user.avatar.data, "base64")
        const avatarUrl = `${avatarBase64}`
        setAvatarUrl(avatarUrl)
    }
  }, [])

  const id = user.user._id

  const username = localStorage.getItem("id")
  
  useEffect(() => {
      if (user.user.friends.some(friend => friend.friendId === username && friend.status === "added_by")) {
        setFriendStatus("Confirm as a friend");
      } else if (user.user.friends.some(friend => friend.friendId === username && friend.status === "friends")) {
        setFriendStatus("Friends");
      }
  }, []);
  
  const sendFriendRequest = async () => {
    try {
        const response = await axios.patch("http://localhost:3000/home/users", {id}, {
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
        if (response.status === 200) {
          setFriendStatus("Friend request sent")
        } else if (response.status === 201) {
          setFriendStatus("Friends")
        }
    } catch(err) {
        console.log(err)
    }
  }

  return (
    <div className="bg-slate-800 p-3 rounded-lg shadow-lg mt-6 outline outline-slate-700 overflow-y-auto">
      <Link to={`/home/users/${id}`}>
      <div className="flex items-center">
        <img
          src={avatarUrl ? avatarUrl : sample_photo}
          alt="Avatar"
          className="rounded-full h-8 w-8"
        />
        <div className="ml-2">
          <h2 className="font-semibold text-lg text-left">
            {user.user.username}
          </h2>
          <p className="text-white text-left text-balance">{user.user.about}</p>
        </div>
      </div>
      </Link>
      <button className="float-start" onClick={sendFriendRequest}>
        <p className="mt-2 text-left">{friendStatus}</p>
      </button>
    </div>
  );
  
};

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/home/users", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                });
                if (response.status === 200) {
                    setUsers(response.data);
                }
                
            } catch(err) {
                console.log(err);
            }
        };
        fetchUsers();
    }, []);
    
  return (
    <div className='flex items-center justify-center flex-col'>
            {users.map((user) => (
            <User key={user.id} user={user} />
        ))}
    </div>
  );
};

export default Users;
