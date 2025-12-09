import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import p2 from "../images/p2.png"; // adjust path if needed

const API_BASE = "http://localhost:8001";

const Register = ({ darkMode, setDarkMode, userLoggedIn }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    type: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, phone, type } = user;

    if (!fullName || !email || !password || !phone || !type) {
      message.error("All fields are required");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/user/register`, user);

      message.success(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      message.error(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Registration failed"
      );
    }
  };

  return (
    <>
      <MainNavbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        userLoggedIn={userLoggedIn}
      />

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
        <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200 md:grid-cols-2 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-slate-950/70">
          {/* Left - form */}
          <div className="flex items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-sm">
              <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Sign up to your account
              </h1>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                Create your MediCareBook account to book and manage
                appointments.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name */}
                <div className="space-y-1 text-sm">
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={user.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/60"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1 text-sm">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/60"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1 text-sm">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/60"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1 text-sm">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={user.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/90 px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/60"
                  />
                </div>

                {/* Role radios */}
                <div className="space-y-2 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Account type
                  </p>
                  <div className="flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                      <input
                        type="radio"
                        name="type"
                        value="admin"
                        checked={user.type === "admin"}
                        onChange={handleChange}
                        className="h-4 w-4 accent-indigo-600"
                      />
                      Admin
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                      <input
                        type="radio"
                        name="type"
                        value="user"
                        checked={user.type === "user"}
                        onChange={handleChange}
                        className="h-4 w-4 accent-indigo-600"
                      />
                      User
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-black hover:shadow-lg active:translate-y-0 dark:bg-slate-100 dark:text-slate-900 dark:shadow-slate-900/60 dark:hover:bg-white"
                >
                  Register
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>

          {/* Right - image (brightened so it’s visible) */}
          <div className="relative hidden h-full md:block">
            <img
              src={p2}
              alt="Register illustration"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-indigo-200/60 via-transparent to-slate-900/70 dark:from-slate-950/10 dark:via-slate-900/40 dark:to-slate-950" />
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
