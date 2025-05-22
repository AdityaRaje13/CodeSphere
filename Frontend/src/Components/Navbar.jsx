import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

function Navbar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Logout
  const Logout = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:2000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("User logged out successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during logout");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white px-6 py-4 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/images/logo.webp"
            alt="CodeSphere Logo"
            className="h-10 w-10 mr-3 rounded-full shadow-md"
            onError={(e) => (e.target.src = "https://via.placeholder.com/40")} // Fallback image
          />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500">
            CodeSphere
          </h1>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `text-lg font-medium transition-all duration-300 hover:text-purple-300 ${
                isActive ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-200"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `text-lg font-medium transition-all duration-300 hover:text-purple-300 ${
                isActive ? "text-purple-400 border-b-2 border-purple-400" : "text-gray-200"
              }`
            }
          >
            Profile
          </NavLink>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={Logout}
            className="text-lg font-medium text-gray-200 hover:text-red-400 transition-all duration-300"
          >
            Logout
          </motion.button>
          <motion.div
            className="text-gray-200 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome, <span className="text-purple-400">{user?.username || "User"}</span>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4 bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl"
        >
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `block text-lg font-medium py-2 hover:text-purple-300 transition-all duration-300 ${
                isActive ? "text-purple-400" : "text-gray-200"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block text-lg font-medium py-2 hover:text-purple-300 transition-all duration-300 ${
                isActive ? "text-purple-400" : "text-gray-200"
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </NavLink>
          <button
            onClick={() => {
              Logout();
              setIsMobileMenuOpen(false);
            }}
            className="block text-lg font-medium py-2 text-gray-200 hover:text-red-400 transition-all duration-300 w-full text-left"
          >
            Logout
          </button>
          <p className="text-gray-200 font-medium py-2">
            Welcome, <span className="text-purple-400">{user?.username || "User"}</span>
          </p>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;