import React, { useEffect, useState } from "react";
import axios from "axios";

import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicationIcon from "@mui/icons-material/Medication";
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge } from "antd";

import Notification from "../common/Notification";
import AdminUsers from "./AdminUsers";
import AdminDoctors from "./AdminDoctors";
import AdminAppointments from "./AdminAppointments";

const AdminHome = () => {
  const [userdata, setUserData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState("adminappointments");

  const getUser = () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) setUserData(user);
  };

  const getUserData = async () => {
    try {
      await axios.post(
        "http://localhost:8001/api/user/getuserdata",
        {},
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  const menuButton = (key, label, Icon) => (
    <button
      onClick={() => setActiveMenuItem(key)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition 
        ${
          activeMenuItem === key
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        }`}
    >
      <Icon fontSize="small" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 px-5 py-6 border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>

        <nav className="space-y-2">
          {menuButton("adminusers", "Users", CalendarMonthIcon)}
          {menuButton("admindoctors", "Doctors", MedicationIcon)}
          {menuButton("adminappointments", "Appointments", CalendarMonthIcon)}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <LogoutIcon fontSize="small" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-3 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <Badge
              count={userdata?.notification?.length || 0}
              onClick={() => setActiveMenuItem("notification")}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 dark:bg-slate-800 cursor-pointer">
                <NotificationsIcon />
              </div>
            </Badge>
            <p className="text-sm font-medium">
              Hi, <span className="font-semibold">{userdata.fullName}</span>
            </p>
          </div>
        </header>

        {/* Body */}
        <main className="p-6 flex-1 overflow-y-auto">
          {activeMenuItem === "notification" && <Notification />}
          {activeMenuItem === "adminusers" && <AdminUsers />}
          {activeMenuItem === "admindoctors" && <AdminDoctors />}
          {activeMenuItem === "adminappointments" && <AdminAppointments />}
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
