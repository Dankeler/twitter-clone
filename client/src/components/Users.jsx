import axios from 'axios';
import { useEffect, useState } from 'react';
import sample_photo from "../assets/sample-avatar.jpg"
import {Buffer} from "buffer"

const User = (user) => {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [friendStatus, setFriendStatus] = useState(null)

  useEffect(() => {
    if (user.user.avatar !== null && user.user.avatar.data) {
        const avatarBase64 = Buffer.from(user.user.avatar.data, "base64")
        const avatarUrl = `${avatarBase64}`
        setAvatarUrl(avatarUrl)
    }
  }, [])

  const id = user.user._id
  console.log(user.user.friends)

  const username = localStorage.getItem("username")
  
  useEffect(() => {
    if (user.user.friends.some(friend => friend.friendId === username)) {
      if (user.user.friends.some(friend => friend.status === "sent_to")) {
        setFriendStatus("sent_to");
      }
      if (user.user.friends.some(friend => friend.status === "true")) {
        setFriendStatus("true");
      }
    }
  }, []);
  

  const sendFriendRequest = async () => {
    try {
        await axios.patch("http://localhost:3000/home/users", {id}, {
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
    } catch(err) {
        console.log(err)
    }
  }

  return (
    <div className="bg-slate-800 p-3 rounded-lg shadow-lg mt-6 outline outline-slate-700 overflow-y-auto">
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
