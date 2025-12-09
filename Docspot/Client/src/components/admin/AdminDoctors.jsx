import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8001/api/admin/getalldoctors",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) setDoctors(res.data.data);
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  const handleApprove = async (doctorId, status, userid) => {
    try {
      const res = await axios.post(
        "http://localhost:8001/api/admin/getapprove",
        { doctorId, status, userid },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) message.success(res.data.message);
      getDoctors();
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const handleReject = async (doctorId, status, userid) => {
    try {
      const res = await axios.post(
        "http://localhost:8001/api/admin/getreject",
        { doctorId, status, userid },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) message.success(res.data.message);
      getDoctors();
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-4">All Doctors</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length ? (
              doctors.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-b border-slate-200 dark:border-slate-700"
                >
                  <td className="px-4 py-2">{doc._id}</td>
                  <td className="px-4 py-2">{doc.fullName}</td>
                  <td className="px-4 py-2">{doc.email}</td>
                  <td className="px-4 py-2">{doc.phone}</td>
                  <td className="px-4 py-2">
                    {doc.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleApprove(doc._id, "approved", doc.userId)
                          }
                          className="mr-2 rounded-lg bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          handleReject(doc._id, "rejected", doc.userId)
                        }
                        className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctors;
