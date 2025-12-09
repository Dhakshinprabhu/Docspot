import React, { useState, useEffect } from "react";
import { Tabs, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const Notification = ({ darkMode, setDarkMode }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  const getUser = () => {
    const userdata = JSON.parse(localStorage.getItem("userData"));
    if (userdata) {
      setUser(userdata);
    }
  };

  const handleAllMarkRead = async () => {
    if (!user) return;
    try {
      const res = await axios.post(
        "http://localhost:8001/api/user/getallnotification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        const updatedUser = {
          ...user,
          notification: [],
          seennotification: [...(user.seennotification || []), ...(user.notification || [])],
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    try {
      const res = await axios.post(
        "http://localhost:8001/api/user/deleteallnotification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        const updatedUser = { ...user, seennotification: [] };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>

      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-md shadow-slate-200 sm:p-8 dark:bg-slate-900 dark:shadow-slate-950/60">
          <h2 className="mb-4 text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Notifications
          </h2>

          <Tabs defaultActiveKey="unread">
            <TabPane tab="Unread" key="unread">
              <div className="mb-3 flex justify-end">
                <button
                  onClick={handleAllMarkRead}
                  className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-3">
                {user?.notification?.length ? (
                  user.notification.map((notificationMsg, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(notificationMsg.onClickPath)}
                      className="cursor-pointer rounded-2xl border border-indigo-50 bg-indigo-50/60 p-3 text-sm text-slate-800 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-100/70 hover:shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-slate-100 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/60"
                    >
                      {notificationMsg.message}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                    No unread notifications.
                  </p>
                )}
              </div>
            </TabPane>

            <TabPane tab="Read" key="read">
              <div className="mb-3 flex justify-end">
                <button
                  onClick={handleDeleteAll}
                  className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/60"
                >
                  Delete all
                </button>
              </div>

              <div className="space-y-3">
                {user?.seennotification?.length ? (
                  user.seennotification.map((notificationMsg, index) => (
                    <div
                      key={index}
                      onClick={() => navigate(notificationMsg.onClickPath)}
                      className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                    >
                      {notificationMsg.message}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                    No read notifications.
                  </p>
                )}
              </div>
            </TabPane>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Notification;
