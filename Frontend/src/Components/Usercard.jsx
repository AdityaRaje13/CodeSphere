
import { motion } from "motion/react"

function Usercard({ username, email, userId, setUserModal, addCollabs }) {
    return (
      <div className="usercard bg-slate-700 my-5 px-10 py-5 rounded-xl overflow-x:hidden">
  
        <div className="text-white">
          <h2><b>Username</b> : {username}</h2>
          <h2><b>Email</b> : {email}</h2>
        </div>
  
        <div className="flex justify-end gap-4 mt-5">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
            onClick={() => setUserModal(false)}
          >
            Cancel
          </button>
  
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-md hover:shadow-lg transition-all"
            onClick={() => {addCollabs(userId)}}
          >
            <i className="ri-user-add-line"> Add</i>
          </button>
        </div>
  
      </div>
    );
  }

  <motion.div layoutId="underline" />
  
  export default Usercard;
  