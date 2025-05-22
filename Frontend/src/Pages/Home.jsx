import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [ownProjects, setOwnProjects] = useState([]);
  const [collabProjects, setCollabProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Stats for cards
  const stats = [
    {
      title: "Total Projects",
      value: ownProjects.length + collabProjects.length,
      color: "from-purple-600 to-pink-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      secondary: `${Math.round(
        ((ownProjects.length + collabProjects.length) / Math.max(ownProjects.length + collabProjects.length, 1)) * 100
      )}%`,
    },
    {
      title: "Your Projects",
      value: ownProjects.length,
      color: "from-blue-600 to-cyan-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
      secondary: `${Math.round(
        (ownProjects.length / Math.max(ownProjects.length + collabProjects.length, 1)) * 100
      )}%`,
    },
    {
      title: "Collaborated Projects",
      value: collabProjects.length,
      color: "from-amber-500 to-red-500",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      secondary: `${Math.round(
        (collabProjects.length / Math.max(ownProjects.length + collabProjects.length, 1)) * 100
      )}%`,
    },
  ];

  // Create new Project
  const submitHandler = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);

    try {
      const response = await fetch("http://localhost:2000/api/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName }),
      });

      if (response.ok) {
        toast.success("Project created successfully!");
        fetchProjects();
        setProjectName("");
      } else {
        toast.error("Error occurred: " + response.statusText);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while creating the project.");
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
      toast.error("An error occurred while fetching projects.");
    }
  };

  // Delete a project
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      const response = await fetch(`http://localhost:2000/api/delete/${projectToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Project deleted successfully!");
        fetchProjects();
      } else {
        toast.error("Error occurred: " + response.statusText);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the project.");
    } finally {
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue!");
      navigate("/login");
    } else {
      fetchProjects();
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-indigo-800 to-purple-800 text-white font-sans">
      {/* Header Section */}
      <header className="p-6 flex justify-center">
        <motion.h1
          className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          CodeSphere
        </motion.h1>
      </header>

      {/* Floating New Project Button */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 z-50"
        aria-label="Create new project"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        New Project
      </motion.button>

      {/* Main Content */}
      <main className="p-4 max-w-6xl mx-auto">
        {/* Project Statistics */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Project Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
                className={`bg-gray-700/30 backdrop-blur-md rounded-xl p-6 border border-gray-600/50 hover:border-purple-400 transition-all duration-300 flex flex-col items-center text-center`}
              >
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-full mb-4 shadow-lg`}>
                  {stat.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-purple-300">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Your Projects Section */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
            Your Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownProjects.length > 0 ? (
              ownProjects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * ownProjects.indexOf(project) }}
                  whileHover={{ y: -10, boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)" }}
                  className="relative bg-gray-700/20 backdrop-blur-lg rounded-xl p-6 cursor-pointer border border-gray-600/50 hover:border-purple-400 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>
                  <div
                    onClick={() => navigate("/project", { state: { projectDetails: project } })}
                    className="flex-1 pl-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">{project.name}</h3>
                    <p className="text-gray-300 text-sm">Collaborators: {project.users.length}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-purple-400"></span>
                      <span className="text-gray-200 text-xs">Active</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setProjectToDelete(project);
                      setIsDeleteModalOpen(true);
                    }}
                    className="absolute top-4 right-4 p-2 bg-gray-800/50 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-500/20 transition-all"
                    aria-label={`Delete ${project.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M7 7h10"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-300 col-span-full text-center text-lg">
                No projects yet. Create your first project!
              </p>
            )}
          </div>
        </motion.section>

        {/* Collaboration Projects Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400">
            Collaboration Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collabProjects.length > 0 ? (
              collabProjects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * collabProjects.indexOf(project) }}
                  whileHover={{ y: -10, boxShadow: "0 15px 40px rgba(0, 0, 0, 0.3)" }}
                  className="relative bg-gray-700/20 backdrop-blur-lg rounded-xl p-6 cursor-pointer border border-gray-600/50 hover:border-purple-400 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500"></div>
                  <div
                    onClick={() => navigate("/project", { state: { projectDetails: project } })}
                    className="flex-1 pl-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">{project.name}</h3>
                    <p className="text-gray-300 text-sm">Collaborators: {project.users.length}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-400"></span>
                      <span className="text-gray-200 text-xs">Collaborating</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setProjectToDelete(project);
                      setIsDeleteModalOpen(true);
                    }}
                    className="absolute top-4 right-4 p-2 bg-gray-800/50 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-500/20 transition-all"
                    aria-label={`Delete ${project.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M7 7h10"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-300 col-span-full text-center text-lg">
                No collaboration projects yet.
              </p>
            )}
          </div>
        </motion.section>
      </main>

      {/* Modal for Creating New Project */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-700/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
              <form onSubmit={submitHandler}>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project Name"
                  className="w-full p-3 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all mb-6"
                  required
                  aria-label="Project name"
                />
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-gray-200 rounded-lg hover:bg-gray-600 transition-all"
                    aria-label="Cancel"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all"
                    aria-label="Create project"
                  >
                    Create
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal for Confirming Delete */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-700/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Delete Project</h2>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-gray-200 rounded-lg hover:bg-gray-600 transition-all"
                  aria-label="Cancel"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteProject}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  aria-label="Confirm delete"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline CSS for Gradient Border Animation */}
      <style jsx>{`
        @keyframes gradient-border {
          0% {
            border-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2), transparent) 1;
          }
          50% {
            border-image: linear-gradient(45deg, rgba(255, 255, 255, 0.4), transparent) 1;
          }
          100% {
            border-image: linear-gradient(45deg, rgba(255, 255, 255, 0.2), transparent) 1;
          }
        }
        .animate-gradient-border {
          animation: gradient-border 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;