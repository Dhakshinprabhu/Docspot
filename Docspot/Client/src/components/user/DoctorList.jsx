import React, { useState } from "react";
import { message } from "antd";
import API from "../../api";

const DoctorList = ({ userDoctorId, doctor, userdata }) => {
  const [dateTime, setDateTime] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [show, setShow] = useState(false);

  const currentDate = new Date().toISOString().slice(0, 16);

  const handleChange = (event) => {
    setDateTime(event.target.value);
  };

  const handleDocumentChange = (event) => {
    setDocumentFile(event.target.files[0]);
  };

  const handleBook = async (e) => {
    e.preventDefault();

    if (!userdata?._id) {
      message.error("User not found. Please log in again.");
      return;
    }

    if (!dateTime) {
      message.error("Please choose date and time");
      return;
    }

    if (!documentFile) {
      message.error("Please upload a document image");
      return;
    }

    try {
      const formattedDateTime = dateTime.replace("T", " ");
      const formData = new FormData();
      formData.append("image", documentFile);
      formData.append("date", formattedDateTime);
      formData.append("userId", userdata._id);
      formData.append("doctorId", doctor._id);
      formData.append("userInfo", JSON.stringify(userdata));
      formData.append("doctorInfo", JSON.stringify(doctor));

      if (userDoctorId) {
        formData.append("doctorUserId", userDoctorId);
      }

      const res = await API.post("/user/getappointment", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        setShow(false);
      } else {
        message.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <>
      {/* Card */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm shadow-slate-200/80 transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/70">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Dr. {doctor.fullName}
          </h3>
          <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {doctor.specialization}
          </span>
        </div>

        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Phone: <span className="font-medium">{doctor.phone}</span>
          </p>
          <p>
            Address: <span className="font-medium">{doctor.address}</span>
          </p>
          <p>
            Experience:{" "}
            <span className="font-medium">{doctor.experience} yrs</span>
          </p>
          <p>
            Fees: <span className="font-medium">₹{doctor.fees}</span>
          </p>
          <p>
            Timing:{" "}
            <span className="font-medium">
              {doctor.timings?.[0]} – {doctor.timings?.[1]}
            </span>
          </p>
        </div>

        <button
          onClick={() => setShow(true)}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md active:translate-y-0 dark:shadow-indigo-900/60"
        >
          Book Now
        </button>
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/80 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                Booking Appointment
              </h2>
              <button
                onClick={() => setShow(false)}
                className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold">Doctor:</span> Dr.{" "}
                {doctor.fullName}
              </p>
              <p>
                <span className="font-semibold">Specialization:</span>{" "}
                {doctor.specialization}
              </p>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div className="space-y-1 text-sm">
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Appointment date & time
                </label>
                <input
                  name="date"
                  type="datetime-local"
                  min={currentDate}
                  value={dateTime}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/60"
                />
              </div>

              <div className="space-y-1 text-sm">
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Documents (image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDocumentChange}
                  className="w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-indigo-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:file:bg-indigo-500"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShow(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-md active:translate-y-0 dark:shadow-indigo-900/60"
                >
                  Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorList;
