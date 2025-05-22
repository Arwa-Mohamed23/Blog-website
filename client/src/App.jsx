import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import CreateEditPost from "./pages/CreateEditPost";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserDetails(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await axios.get("/api/user/", config);
      setUser(data);
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} user={user} />}
          />
          <Route
            path="/register"
            element={<Register onLogin={handleLogin} user={user} />}
          />
          <Route path="/posts/:id" element={<PostDetail user={user} />} />

          {user ? (
            <>
              <Route
                path="/profile"
                element={<Profile user={user} setUser={setUser} />}
              />
              <Route
                path="/posts/create"
                element={<CreateEditPost user={user} />}
              />
              <Route
                path="/posts/edit/:id"
                element={<CreateEditPost user={user} />}
              />
            </>
          ) : null}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
