import React, { useEffect, useState } from "react";
import { Badge } from "antd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicationIcon from "@mui/icons-material/Medication";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

import ApplyDoctor from "./ApplyDoctor";
import UserAppointments from "./UserAppointments";
import DoctorList from "./DoctorList";
import Notification from "../common/Notification";
import API from "../../api";

const UserHome = ({ darkMode, setDarkMode }) => {
  const [doctors, setDoctors] = useState([]);
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState("home");

  const getUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      if (user) {
        setUserData(user);
      }
    } catch (err) {
      console.error("Failed to parse userData:", err);
    }
  };

  const getUserData = async () => {
    try {
      const res = await API.post("/user/getuserdata", {});
      // If backend returns updated user:
      if (res.data?.data) {
        setUserData(res.data.data);
        localStorage.setItem("userData", JSON.stringify(res.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorData = async () => {
    try {
      const res = await API.get("/user/getalldoctorsu");
      if (res.data.success) setDoctors(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    getUserData();
    getDoctorData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const menuButtonClasses = (key) =>
    `flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
      activeMenuItem === key
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
    }`;

  const initials =
    (userdata.fullName || "")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white/95 px-4 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-8">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              MediCareBook
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Your health, organized.
            </p>
          </div>

          <nav className="space-y-2">
            <button
              className={menuButtonClasses("userappointments")}
              onClick={() => setActiveMenuItem("userappointments")}
            >
              <CalendarMonthIcon fontSize="small" />
              <span>Appointments</span>
            </button>

            {userdata.isdoctor === true ? null : (
              <button
                className={menuButtonClasses("applyDoctor")}
                onClick={() => setActiveMenuItem("applyDoctor")}
              >
                <MedicationIcon fontSize="small" />
                <span>Apply Doctor</span>
              </button>
            )}

            <button
              className={menuButtonClasses("home")}
              onClick={() => setActiveMenuItem("home")}
            >
              <span>Home</span>
            </button>

            <button className={menuButtonClasses("logout")} onClick={logout}>
              <LogoutIcon fontSize="small" />
              <span>Logout</span>
            </button>
          </nav>

          <div className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
            <p>
              Logged in as{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {userdata.fullName || "User"}
              </span>
            </p>
            {userdata.isdoctor && (
              <p className="mt-1 text-[11px] uppercase tracking-wide text-emerald-500">
                Doctor account
              </p>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Header NAVBAR */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Dashboard
            </div>

            <div className="flex items-center gap-4">
              {/* theme toggle */}
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-indigo-400"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              {/* notifications */}
              <Badge
                count={
                  userdata?.notification ? userdata.notification.length : 0
                }
                className="cursor-pointer"
                onClick={() => setActiveMenuItem("notification")}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  <NotificationsIcon fontSize="small" />
                </div>
              </Badge>

              {/* profile avatar */}
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-slate-900 dark:text-slate-50 sm:inline">
                  {userdata.fullName || "User"}
                </span>
              </div>
            </div>
          </header>

          {/* Body */}
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            {activeMenuItem === "applyDoctor" && (
              <ApplyDoctor userId={userdata._id} />
            )}

            {activeMenuItem === "notification" && <Notification />}

            {activeMenuItem === "userappointments" && <UserAppointments />}

            {activeMenuItem === "home" && (
              <div className="mx-auto max-w-6xl">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  Home
                </h2>
                {userdata.isdoctor ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You are logged in as a doctor. Check your Appointments
                    section to manage bookings.
                  </p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {doctors.map((doctor) => {
                      const notifyDoc = doctor.userId;
                      return (
                        <DoctorList
                          key={doctor._id}
                          userDoctorId={notifyDoc}
                          doctor={doctor}
                          userdata={userdata}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
