import { useState, useContext } from "react";
import { Link, useNavigate} from "react-router-dom";
import { toast } from 'react-toastify';
import { UserContext } from "../context/user.context";

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setUser} = useContext(UserContext);

  const navigate = useNavigate();

  // On submit
  const submitHandler = async(e) => {

    e.preventDefault();

    // create user object
    const user = {
      email : email,
      password : password
    }

    try {

      const response = await fetch("http://localhost:2000/api/login", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify(user),
      });

      if(response.ok){

        const res_data = await response.json();
        // console.log(res_data.user);

        setUser(res_data.user);
        localStorage.setItem("token", res_data.token);

        toast.success("User Login successful");
        
        navigate('/home');
      }
      else{
        toast.error("Invalid credentials");
      }
      
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">

        <div className="flex items-center justify-center w-full mb-6">
          <img
            src="../../public/images/logo.webp" 
            alt="Logo"
            className="h-10 w-10 mr-3"
          />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500">
            CodeSphere
          </h1>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-6" onSubmit={submitHandler}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              onChange={(e) => {setEmail(e.target.value)}}
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mt-1 text-sm bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              onChange={(e) => {setPassword(e.target.value)}}
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 mt-1 text-sm bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-sm font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:underline hover:text-blue-300"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
