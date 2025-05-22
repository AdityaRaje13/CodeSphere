import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Bounce, ToastContainer } from 'react-toastify';
import UserProvider from './context/user.context.jsx';
import 'remixicon/fonts/remixicon.css';

createRoot(document.getElementById('root')).render(
 
  <UserProvider>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />

  </UserProvider>
)
