import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contact, SetContact] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const submitHandler = async (e) => {

    e.preventDefault();

    const user = {
      username : username,
      email : email,
      contact : contact,
      password : password
    }

    // console.log(user);

    try {

      const response = await fetch("http://localhost:2000/api/register", 
        {
          method : "POST",
          headers : {
            "Content-Type" : "application/json",
          },
          body : JSON.stringify(user),  
        });

        if(response.ok){
          toast.success("User created successfully");
          navigate('/login');
        }
        else{
          toast.error("Error occured");
        }
    } 
    catch (error) {
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

        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
        <form className="space-y-6" onSubmit={submitHandler}>

        <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              onChange={(e) => {setUsername(e.target.value)}}
              type="text"
              id="username"
              placeholder="Enter your username"
              required
              className="w-full px-4 py-2 mt-1 text-sm bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
              htmlFor="contact"
              className="block text-sm font-medium text-gray-300"
            >
              Contact
            </label>
            <input
              onChange={(e) => {SetContact(e.target.value)}}
              type="text"
              id="contact"
              placeholder="Enter your contact"
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
            Register
          </button>

        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline hover:text-blue-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
