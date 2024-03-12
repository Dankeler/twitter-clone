import Post from "./Post"
import NewPost  from "./NewPost"
import axios from "axios";
import { useEffect, useState } from "react";

const MainFeed = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts", {
          headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
      })

        if (response.status === 200) {
          setPosts(response.data)
        }
      } catch(err) {
        console.log(err)
      }
    }
    fetchPosts()
  }, [])
  
    return (
      <div className="flex justify-center items-center my-8 flex-col">
        <NewPost></NewPost>
        {posts && (
          posts.map((post, idx) => (
            <Post key={idx} props={post}></Post>
          ))
        )}
      </div>
    );
}


export default MainFeed