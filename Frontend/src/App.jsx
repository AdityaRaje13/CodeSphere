import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Project from "./Pages/Project";
import Navbar from './Components/Navbar';
import Profile from './Pages/Profile';


function App() {

  return (
    <>
    
      <BrowserRouter>
      
          <Routes>

            <Route  path='/' element = { <Login/> } />

            <Route  path='/login' element = {  <Login/>  } />

            <Route path='/register' element = { <Register/> } />
            
            <Route path='/home' element={<> <Navbar/><Home/> </> } />

            <Route path='/project' element = { <Project/> } />

            <Route path='/profile' element = { <Profile/> } />

            <Route path='/logout' element = {  <Login/>  }/>

          </Routes>
      
      </BrowserRouter>

    </>
  )
}

export default App



