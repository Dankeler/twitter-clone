/* eslint-disable react/prop-types */
import {formatDistanceToNow} from "date-fns"

const Post = (props) => {
    const timeAgo = formatDistanceToNow(new Date(props.props.datecreated), { addSuffix: true });
  
    return (
      <div className="bg-slate-800 p-4 rounded-lg shadow mb-4 w-1/3">
        <div className="flex items-center">
          <img src="https://placekitten.com/50/50" alt="Avatar" className="rounded-full h-10 w-10" />
          <div className="ml-2">
            <h2 className="font-semibold text-lg text-left">{props.props.author.username}</h2>
            <p className="text-white">{timeAgo}</p>
          </div>
        </div>
        <p className="mt-2">{props.props.content}</p>
        <div className="mt-2 flex items-center">
        <button className="text-white hover:text-blue-500 flex items-center justify-start">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Like
          </button>
          <button className="text-white hover:text-blue-500 flex items-center ml-2">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
            Reply
          </button>
          <p>{props.props.likes}</p>
        </div>
      </div>
    );
}


export default Post