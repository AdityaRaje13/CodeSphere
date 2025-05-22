import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Navbar from "../Components/Navbar";

const Profile = () => {
  const [user, setUser] = useState({});
  const [ownProjects, setOwnProjects] = useState([]);
  const [collabProjects, setCollabProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const ownProjectNum = ownProjects.length;
  const collabProjectNum = collabProjects.length;

  // Pie chart data
  const data = [
    { name: "Your Projects", value: ownProjectNum },
    { name: "Collaborated Projects", value: collabProjectNum },
  ];

  const COLORS = ["#6366f1", "#f59e0b"]; // Indigo and amber for vibrancy

  // Get user details
  const getUserData = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/profile-details", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        toast.success("User profile loaded");
      } else {
        toast.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching profile");
    }
  };

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:2000/api/seperate-project", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOwnProjects(data.ownProjects);
        setCollabProjects(data.collabProjects);
      } else {
        toast.error("No projects found");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching projects");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue!");
      navigate("/login");
    } else {
      getUserData();
      fetchProjects();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-indigo-800 to-purple-800 text-white font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <motion.h1
          className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          User Profile
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Info Card */}
          <motion.div
            className="bg-gray-700/30 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-600/50 hover:border-purple-400 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-6">
                <img
                  src="/images/profile.jpg"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover shadow-lg"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/128")} // Fallback image
                />
              </div>
              <ul className="text-lg space-y-4 w-full">
                <li>
                  <span className="font-semibold text-purple-300">User ID:</span> {user._id || "N/A"}
                </li>
                <li>
                  <span className="font-semibold text-purple-300">Name:</span> {user.username || "N/A"}
                </li>
                <li>
                  <span className="font-semibold text-purple-300">Email:</span> {user.email || "N/A"}
                </li>
                <li>
                  <span className="font-semibold text-purple-300">Contact:</span> {user.contact || "N/A"}
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Stats and Pie Chart */}
          <motion.div
            className="bg-gray-700/30 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-600/50 hover:border-purple-400 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Project Statistics</h2>
            <div className="flex flex-col items-center">
              <PieChart width={250} height={250}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
              </PieChart>
              <ul className="text-lg mt-6 space-y-2">
                <li className="flex items-center">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full bg-gray-300"></span>
                  Total Projects: {ownProjectNum + collabProjectNum}
                </li>
                <li className="flex items-center text-indigo-400">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full bg-indigo-500"></span>
                  Your Projects: {ownProjectNum}
                </li>
                <li className="flex items-center text-amber-400">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full bg-amber-500"></span>
                  Collaborated Projects: {collabProjectNum}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;