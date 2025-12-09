import React, { useEffect, useState } from "react";
import { message } from "antd";
import API from "../../api";

const UserAppointments = () => {
  const [userid, setUserId] = useState();
  const [type, setType] = useState(false);
  const [userAppointments, setUserAppointments] = useState([]);
  const [doctorAppointments, setDoctorAppointments] = useState([]);

  const getUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      if (user) {
        const { _id, isdoctor } = user;
        setUserId(_id);
        setType(isdoctor);
      } else {
        message.error("No user to show. Please log in again.");
      }
    } catch (err) {
      console.error("Failed to parse userData:", err);
      message.error("Invalid user data. Please log in again.");
    }
  };

  const getUserAppointment = async () => {
    if (!userid) return;
    try {
      const res = await API.get("/user/getuserappointments", {
        params: { userId: userid },
      });
      if (res.data.success) {
        setUserAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const getDoctorAppointment = async () => {
    if (!userid) return;
    try {
      const res = await API.get("/doctor/getdoctorappointments", {
        params: { userId: userid },
      });
      if (res.data.success) {
        setDoctorAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleStatus = async (userid, appointmentId, status) => {
    try {
      const res = await API.post("/doctor/handlestatus", {
        userid,
        appointmentId,
        status,
      });
      if (res.data.success) {
        message.success(res.data.message);
        getDoctorAppointment();
        getUserAppointment();
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleDownload = async (url, appointId) => {
    try {
      const res = await API.get("/doctor/getdocumentdownload", {
        params: { appointId },
        responseType: "blob",
      });
      if (res.data) {
        const fileUrl = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/pdf" })
        );
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        downloadLink.setAttribute("href", fileUrl);
        const fileName = url.split("/").pop();
        downloadLink.setAttribute("download", fileName);
        downloadLink.style.display = "none";
        downloadLink.click();
      } else {
        message.error("No document found");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!userid) return;
    if (type === true) {
      getDoctorAppointment();
    } else {
      getUserAppointment();
    }
  }, [userid, type]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <h2 className="mb-4 text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        All Appointments
      </h2>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/70">
        {type === true ? (
          // Doctor view
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Date of Appointment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Document
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm dark:divide-slate-800 dark:bg-slate-900">
                {doctorAppointments.length > 0 ? (
                  doctorAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-100">
                        {appointment.userInfo.fullName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {appointment.date}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {appointment.userInfo.phone}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            handleDownload(
                              appointment.document.path,
                              appointment._id
                            )
                          }
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          {appointment.document.filename}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                        {appointment.status}
                      </td>
                      <td className="px-4 py-3">
                        {appointment.status === "approved" ? null : (
                          <button
                            onClick={() =>
                              handleStatus(
                                appointment.userInfo._id,
                                appointment._id,
                                "approved"
                              )
                            }
                            className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      No appointments to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Normal user view
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Doctor Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Date of Appointment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm dark:divide-slate-800 dark:bg-slate-900">
                {userAppointments.length > 0 ? (
                  userAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-100">
                        {appointment.docName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {appointment.date}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                        {appointment.status}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      No appointments to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAppointments;
