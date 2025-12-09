// src/components/MainNavbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const MainNavbar = ({ darkMode, setDarkMode, userLoggedIn }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 dark:text-indigo-400"
      : "text-slate-600 dark:text-slate-300";

  const toggleTheme = () => setDarkMode((d) => !d);

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-white"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            M
          </span>
          <span>MediCareBook</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop links */}
          <div className="hidden items-center gap-6 text-sm font-medium sm:flex">
            <Link
              to="/"
              className={`transition hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={`transition hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive(
                "/login"
              )}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`transition hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive(
                "/register"
              )}`}
            >
              Register
            </Link>

            {/* 👇 Only show when logged in */}
            {userLoggedIn && (
              <Link
                to="/notifications"
                className={`transition hover:text-indigo-600 dark:hover:text-indigo-400 ${isActive(
                  "/notifications"
                )}`}
              >
                Notifications
              </Link>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-indigo-400"
            type="button"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 sm:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            type="button"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-3 text-sm shadow-sm sm:hidden dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className={`py-1 ${isActive("/")}`}
            >
              Home
            </Link>
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={`py-1 ${isActive("/login")}`}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className={`py-1 ${isActive("/register")}`}
            >
              Register
            </Link>

            {/* 👇 Only when logged in */}
            {userLoggedIn && (
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className={`py-1 ${isActive("/notifications")}`}
              >
                Notifications
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
