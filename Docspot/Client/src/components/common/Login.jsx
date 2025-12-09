// src/components/common/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import photo1 from "../images/photo1.png";

const API_BASE = "http://localhost:8001";

const Login = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      message.error("Email and password are required");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/user/login`, user);

      if (res.data?.success) {
        // Be defensive about backend shape
        const token = res.data.token;
        const userData =
          res.data.userData || res.data.user || res.data.data || null;

        if (!token || !userData) {
          console.error("Unexpected login response:", res.data);
          message.error("Invalid login response from server");
          return;
        }

        // Persist auth
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));

        message.success("Login successfully");

        // Role-based redirect (fallbacks)
        const type = userData.type;
        const isAdmin = userData.isAdmin || type === "admin";

        if (isAdmin) {
          navigate("/adminhome");
        } else {
          // normal user / doctor both use userhome dashboard
          navigate("/userhome");
        }
      } else {
        message.error(res.data?.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      message.error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Something went wrong"
      );
    }
  };

  return (
    <>
      <MainNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200 md:grid-cols-2 dark:bg-slate-900 dark:shadow-slate-950/60">
          {/* Left - image */}
          <div className="relative hidden h-full md:block">
            <img
              src={photo1}
              alt="Login illustration"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700/80 via-slate-900/80 to-cyan-500/60" />
            <div className="relative z-10 flex h-full flex-col justify-between p-8 text-slate-100">
              <div>
                <h2 className="text-2xl font-semibold">
                  Welcome back to MediCareBook
                </h2>
                <p className="mt-3 text-sm text-slate-200/80">
                  Continue where you left off. Manage your upcoming appointments
                  and stay on top of your health.
                </p>
              </div>
              <div className="space-y-2 text-xs text-slate-200/80">
                <p>✓ Secure, encrypted login</p>
                <p>✓ Access to your full appointment history</p>
                <p>✓ Quick re-booking with your favorite doctors</p>
              </div>
            </div>
          </div>

          {/* Right - form */}
          <div className="flex items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-sm">
              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Sign in to your account
              </h1>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                Use your registered email to access your dashboard.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 text-sm">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
                  />
                </div>

                <div className="space-y-1 text-sm">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="off"
                    value={user.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg active:translate-y-0 dark:shadow-indigo-900/60"
                >
                  Login
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
