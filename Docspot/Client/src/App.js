// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import Notification from "./components/common/Notification";

import UserHome from "./components/user/UserHome";
import AdminHome from "./components/admin/AdminHome";
import UserAppointments from "./components/user/UserAppointments";

function App() {
  // Use token as the real source of truth for auth
  const userLoggedIn = !!localStorage.getItem("token");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 flex flex-col">
        <div className="flex-1">
          <Routes>
            {/* public */}
            <Route
              path="/"
              element={
                <Home
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  userLoggedIn={userLoggedIn}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  userLoggedIn={userLoggedIn}
                />
              }
            />
            <Route
              path="/register"
              element={
                <Register
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  userLoggedIn={userLoggedIn}
                />
              }
            />

            {userLoggedIn && (
              <Route
                path="/notifications"
                element={
                  <Notification
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    userLoggedIn={userLoggedIn}
                  />
                }
              />
            )}

            {/* protected */}
            {userLoggedIn && (
              <>
                <Route
                  path="/userhome"
                  element={
                    <UserHome
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      userLoggedIn={userLoggedIn}
                    />
                  }
                />
                <Route
                  path="/adminhome"
                  element={
                    <AdminHome
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      userLoggedIn={userLoggedIn}
                    />
                  }
                />
                <Route
                  path="/userhome/userappointments/:doctorId"
                  element={<UserAppointments />}
                />
              </>
            )}
          </Routes>
        </div>

        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          © {new Date().getFullYear()} MediCareBook
        </footer>
      </div>
    </Router>
  );
}

export default App;
