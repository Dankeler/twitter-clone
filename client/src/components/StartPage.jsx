import {Link} from "react-router-dom"

const StartPage = () => {
    return (
        <div className="flex justify-center items-center h-screen flex-col">
            <div className="bg-gray-900 p-8 rounded-3xl mb-8 hover:bg-gray-800 transition duration-500">
                <h1 className="text-5xl">Welcome to ****** Social Media Platform!</h1>
            </div>
            <div className="mb-8">
                <h3>Log in or Sign up to continue.</h3>
            </div>
            <div className="flex justify-center gap-12 w-72">
                <button className="w-1/2 py-1 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition duration-300">
                    <Link to="/log-in">Log In</Link>
                </button>
                <button className="w-1/2 py-1 px-6 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 transition duration-300">
                    <Link to="/sign-up">Sign Up</Link>
                </button>
            </div>
        </div>
    )
}

export default StartPage