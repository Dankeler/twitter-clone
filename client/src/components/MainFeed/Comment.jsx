

const Comment = () => {
    return (
        <div className="bg-slate-800 p-3 rounded-lg shadow-lg mt-2 w-11/12 outline outline-slate-700">
          <div className="flex items-center">
              <img
                src=""
                alt="Avatar"
                className="rounded-full h-8 w-8"
              />
            <div className="ml-2">
              <h2 className="font-semibold text-lg text-left">
                username
              </h2>
              <p className="text-white">time ago</p>
            </div>
          </div>
          <p className="mt-2 text-left">content</p>
          <div className="mt-2 flex items-center">
            <button className="text-white hover:text-blue-500 flex items-center justify-start">
              <div className="flex gap-1 items-center">
                <p>likes</p>
              </div>
            </button>
            <button className="text-white hover:text-blue-500 flex items-center ml-2">
              Reply
              <svg
                className="h-5 w-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14M12 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      );
    };
    
export default Comment;