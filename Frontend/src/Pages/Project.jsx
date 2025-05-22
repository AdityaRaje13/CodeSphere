import { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "markdown-to-jsx";
import Editor from "@monaco-editor/react";
import { UserContext } from "../context/user.context";
import { initializeSocket, sendMessage, recieveMessage } from "../../socket";
import Usercard from "../Components/Usercard";
import GroupMemberCard from "../Components/GroupMemberCard";

function Project() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const projectDetails = location.state.projectDetails;

  const [allUsers, setAllUsers] = useState([]);
  const [userModal, setUserModal] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [selectedLang, setSelectLang] = useState("javascript");
  const [fileTree, setFileTree] = useState({});
  const [showEditor, setShowEditor] = useState(false);
  const [chatWidth, setChatWidth] = useState(30); // Percentage width of chat section

  const chatRef = useRef(null);
  const resizeRef = useRef(null);

  // Handle resizing of chat section
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = chatWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / window.innerWidth * 100;
      const newWidth = Math.min(Math.max(startWidth + deltaX, 20), 50);
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Filter users on search
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get all users to show in add user modal
  const getAllUsers = async (e) => {
    e.stopPropagation();
    setUserModal(true);

    try {
      const response = await fetch("http://localhost:2000/api/all-users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllUsers(data.users);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  // Add user in project
  const addCollabs = async (userId) => {
    setUserModal(false);
    try {
      const response = await fetch("http://localhost:2000/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: projectDetails._id, userId: userId }),
      });

      if (response.ok) {
        toast.success("Collaborator added successfully!");
      } else {
        toast.error("User already exists!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding collaborator");
    }
  };

  // Scroll to bottom when new message is sent or received
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  // Send message
  const send = async () => {
    if (!message.trim()) {
      toast.error("Cannot send an empty message!");
      return;
    }

    sendMessage("project-message", {
      message,
      sender: user.email,
    });

    setMessages((prevMessages) => [...prevMessages, { sender: user.email, message }]);
    setMessage("");
    scrollToBottom();

    if (message.includes("@ai")) {
      let data = "";
      try {
        const response = await fetch("http://localhost:2000/api/get-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: message }),
        });

        if (response.ok) {
          data = await response.text();
        } else {
          toast.error("Failed to fetch data from Gemini");
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred with AI request");
        return;
      }

      let responseObject = {
        message: data,
        sender: "@Gemini AI",
      };

      setMessages((prevMessages) => [...prevMessages, responseObject]);
      sendMessage("project-message", responseObject);
      scrollToBottom();

      try {
        const cleanedData = data.replace(/```json|```/g, "");
        const parsedData = JSON.parse(cleanedData);
        if (typeof parsedData === "object" && parsedData !== null) {
          setFileTree(parsedData);
        }
      } catch (error) {
        console.log("AI response is normal text, not setting fileTree.", error);
      }
    }
  };

  // Handle editor validation
  const handleEditorValidation = (markers) => {
    markers.forEach((marker) => console.log("onValidate:", marker.message));
  };

  // Get language from file name
  const getLanguageFromFileName = (fileName) => {
    const extension = fileName.split(".").pop();
    const languageMap = {
      js: "javascript",
      ts: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      py: "python",
      java: "java",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      html: "html",
      css: "css",
      json: "json",
      xml: "xml",
      php: "php",
      sql: "sql",
      go: "go",
      rb: "ruby",
      swift: "swift",
      kt: "kotlin",
    };
    return languageMap[extension] || "plaintext";
  };

  // Copy code to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fileTree[currentFile]?.file?.contents || "");
      toast.success("Code copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy!");
      console.error("Error copying:", err);
    }
  };

  useEffect(() => {
    if (projectDetails?._id) {
      initializeSocket(projectDetails._id);
    }

    recieveMessage("project-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();

      try {
        const cleanedData = data.message.replace(/```json|```/g, "");
        const parsedData = JSON.parse(cleanedData);
        if (typeof parsedData === "object" && parsedData !== null) {
          setFileTree(parsedData);
        }
      } catch (error) {
        console.log("Received normal text response, no JSON detected.", error);
      }
    });

    return () => {
      console.log("Cleaning up socket connection");
    };
  }, [projectDetails?._id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-indigo-800 to-purple-800 text-white font-sans flex flex-col">
      {/* Header */}
      <header className="p-4 bg-gray-900/50 backdrop-blur-md flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-500">
          {projectDetails.name}
        </h1>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getAllUsers}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all"
            aria-label="Add Collaborators"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Collaborators
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSliderOpen(true)}
            className="px-4 py-2 bg-gray-700 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all"
            aria-label="View Collaborators"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Chat Section */}
        <motion.div
          className="bg-gray-700/30 backdrop-blur-md rounded-3xl m-2 flex flex-col"
          style={{ width: `${chatWidth}%` }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-600/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-100">Group Chat</h2>
            <span className="text-sm text-gray-400">{messages.length} messages</span>
          </div>

          {/* Chat Messages */}
          <div ref={chatRef} className="flex-1 p-4 overflow-y-auto hide-scrollbar">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === user.email ? "justify-end" : "justify-start"} mb-3`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === user.email
                      ? "bg-purple-500 text-white"
                      : msg.sender === "@Gemini AI"
                      ? "bg-gray-800 text-gray-200 overflow-auto hide-scrollbar"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  <p className="text-xs text-gray-300 mb-1">{msg.sender}</p>
                  <div className={msg.sender === "@Gemini AI" ? "prose prose-invert max-w-none" : ""}>
                    <Markdown>{msg.message}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-600/50 flex gap-2">
            <input
              type="text"
              placeholder="Type a message (@ai for AI assistance)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-3 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              aria-label="Chat message input"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={send}
              className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className="w-2 bg-gray-600/50 hover:bg-purple-400 cursor-col-resize"
          onMouseDown={handleMouseDown}
        />

        {/* Code Interface */}
        <div className="flex-1 flex m-2">
          {/* File Structure */}
          <motion.div
            className="bg-gray-700/30 backdrop-blur-md rounded-3xl p-4 w-[25%]"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Files</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditor(!showEditor)}
              className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white font-semibold mb-4 shadow-md hover:shadow-lg transition-all"
            >
              {showEditor ? "Hide Editor" : "Show Editor"}
            </motion.button>
            {typeof fileTree === "object" && fileTree !== null ? (
              Object.keys(fileTree).map((file, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    setCurrentFile(file);
                    setShowEditor(true);
                  }}
                  className={`w-full text-left p-3 rounded-lg mb-2 ${
                    currentFile === file ? "bg-purple-500 text-white" : "bg-gray-600/50 text-gray-200"
                  } hover:bg-purple-400 transition-all`}
                >
                  {file}
                </motion.button>
              ))
            ) : (
              <p className="text-gray-400 text-center">No files available</p>
            )}
          </motion.div>

          {/* Code Editor */}
          <motion.div
            className={`flex-1 ml-2 rounded-3xl bg-gray-700/30 backdrop-blur-md p-4 ${
              showEditor ? "block" : "hidden"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: showEditor ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-gray-600 px-4 py-1 rounded-lg text-gray-200">
                  {currentFile || "Untitled"}
                </span>
                {currentFile && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentFile(null)}
                    className="p-1 bg-gray-600 rounded-lg text-gray-200 hover:bg-gray-500"
                    aria-label="Close file"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectLang(e.target.value)}
                  className="p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Select programming language"
                >
                  {[
                    "javascript",
                    "typescript",
                    "python",
                    "java",
                    "c",
                    "cpp",
                    "csharp",
                    "html",
                    "css",
                    "json",
                    "xml",
                    "php",
                    "sql",
                    "go",
                    "ruby",
                    "swift",
                    "kotlin",
                  ].map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </option>
                  ))}
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-all"
                  aria-label="Copy code"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
            <Editor
              theme="vs-dark"
              language={currentFile ? getLanguageFromFileName(currentFile) : selectedLang}
              value={fileTree[currentFile]?.file?.contents || ""}
              defaultValue="// write your code here"
              onValidate={handleEditorValidation}
              onChange={(newValue) => {
                if (currentFile) {
                  setFileTree((prev) => ({
                    ...prev,
                    [currentFile]: {
                      ...prev[currentFile],
                      file: { contents: newValue },
                    },
                  }));
                }
              }}
              className="h-[calc(100%-4rem)] rounded-lg"
            />
          </motion.div>
        </div>
      </main>

      {/* Add User Modal */}
      <AnimatePresence>
        {userModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-700/90 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md max-h-[80vh] overflow-y-auto hide-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Add Collaborators</h2>
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 bg-gray-800/50 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                  aria-label="Search users"
                />
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Usercard
                    key={user._id}
                    username={user.username}
                    email={user.email}
                    userId={user._id}
                    setUserModal={setUserModal}
                    addCollabs={addCollabs}
                  />
                ))
              ) : (
                <p className="text-gray-300 text-center">No users found</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaborators Slider */}
      <AnimatePresence>
        {isSliderOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsSliderOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="fixed top-0 left-0 h-full w-80 bg-gray-700/90 backdrop-blur-lg shadow-2xl z-50 overflow-y-auto hide-scrollbar"
            >
              <div className="p-6 border-b border-gray-600/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Collaborators</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSliderOpen(false)}
                  className="p-2 text-gray-300 hover:text-white"
                  aria-label="Close collaborators panel"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <ul className="p-6 space-y-4">
                {projectDetails.users.map((user, idx) => (
                  <GroupMemberCard key={idx} userId={user} index={idx} />
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Project;