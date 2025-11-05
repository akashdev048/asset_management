import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './View/Home';
import Login from "./View/Login";
import './assets/css/style.css';
import { useSelector } from "react-redux"
 
 
function App(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.isLoggedIn);
  const { auth } = useSelector((state) => state)
 
  useEffect(() => {
    // console.log("auth.isAuthenticated", auth.isAuthenticated)
    setIsLoggedIn(localStorage.isLoggedIn)
  }, [localStorage, auth.isAuthenticated])
 
 
  return (
    <>
      {
        isLoggedIn ?
        //true ?
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home key="home" />} />
 
          </Routes>
          :
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
 
 
          </Routes>
      }
    </>
  );
}
 
export default App;