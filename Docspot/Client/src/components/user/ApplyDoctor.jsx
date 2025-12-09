// src/components/user/ApplyDoctor.jsx
import React, { useState } from "react";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import API from "../../api";

function ApplyDoctor({ userId }) {
  const [doctor, setDoctor] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    fees: "",
    timings: "",
  });

  const handleTimingChange = (_, timings) => {
    setDoctor({ ...doctor, timings });
  };

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!userId) {
      message.error("User not found. Please log in again.");
      return;
    }

    try {
      const res = await API.post("/user/registerdoc", { doctor, userId });

      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <h2 className="mb-4 text-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Apply as Doctor
      </h2>

      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/70 dark:border-slate-700 dark:bg-slate-900/95 dark:shadow-slate-950/70">
        <Form layout="vertical" onFinish={handleSubmit}>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Personal Details
          </h4>

          <Row gutter={20}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Full Name" required>
                <Input
                  name="fullName"
                  value={doctor.fullName}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Phone" required>
                <Input
                  name="phone"
                  type="number"
                  value={doctor.phone}
                  onChange={handleChange}
                  placeholder="Your phone"
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Email" required>
                <Input
                  name="email"
                  type="email"
                  value={doctor.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={24}>
              <Form.Item label="Address" required>
                <Input
                  name="address"
                  type="text"
                  value={doctor.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>
          </Row>

          <h4 className="mb-3 mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Professional Details
          </h4>

          <Row gutter={20}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Specialization" required>
                <Input
                  name="specialization"
                  type="text"
                  value={doctor.specialization}
                  onChange={handleChange}
                  placeholder="Your specialization"
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Experience (years)" required>
                <Input
                  name="experience"
                  type="number"
                  value={doctor.experience}
                  onChange={handleChange}
                  placeholder="Your experience"
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Fees" required>
                <Input
                  name="fees"
                  type="number"
                  value={doctor.fees}
                  onChange={handleChange}
                  placeholder="Your fees"
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Timings" required>
                <TimePicker.RangePicker
                  format="HH:mm"
                  onChange={handleTimingChange}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg active:translate-y-0 dark:shadow-indigo-900/60"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default ApplyDoctor;
