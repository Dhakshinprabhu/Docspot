import React from "react";
import { Link } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import p3 from "../images/p3.webp";

const Home = ({ darkMode, setDarkMode }) => {
  return (
    <>
      <MainNavbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900">
        {/* Hero */}
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:py-20 lg:px-8">
          {/* Left - image */}
          <div className="order-2 w-full md:order-1 md:w-1/2">
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-indigo-100 blur-2xl dark:bg-indigo-900/50" />
              <div className="absolute -right-4 -bottom-6 h-20 w-20 rounded-full bg-cyan-100 blur-2xl dark:bg-cyan-900/40" />
              <img
                src={p3}
                alt="Doctor appointment illustration"
                className="relative z-10 w-full rounded-3xl bg-white/80 shadow-xl shadow-indigo-100 dark:bg-slate-900/80 dark:shadow-slate-900/60"
              />
            </div>
          </div>

          {/* Right - text */}
          <div className="order-1 w-full space-y-6 md:order-2 md:w-1/2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
              Healthcare, simplified
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-50">
              Effortlessly schedule your{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                doctor appointments
              </span>
              <br />
              with just a few clicks.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              Manage your health from anywhere. Browse verified doctors, compare
              availability, and book visits without waiting on hold or standing
              in queues.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg active:translate-y-0 dark:shadow-indigo-900/50"
              >
                Book your Doctor
                <span className="ml-2 text-base">↗</span>
              </Link>

              <span className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                No extra charges. Just faster appointments.
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Real-time slots
                </p>
                <p>See who&apos;s available before you even leave home.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">
                  Verified doctors
                </p>
                <p>Specialist profiles, ratings, and patient reviews.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About section */}
        <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-16">
            <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
              About <span className="text-indigo-600 dark:text-indigo-400">MediCareBook</span>
            </h2>
            <div className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              <p className="mb-4">
                Booking a doctor appointment has never been easier. With our
                online platform, you can schedule visits without waiting on hold
                or juggling calls with busy receptionists.
              </p>
              <p className="mb-4">
                Browse a wide network of doctors across multiple specialties.
                Each profile includes detailed information, from qualifications
                to availability, so you can make informed decisions with
                confidence.
              </p>
              <p className="mb-4">
                Once you&apos;ve chosen a doctor, booking is just a few clicks
                away. Pick a time slot that works for you, get instant
                confirmation, and receive reminders so you never miss an
                appointment.
              </p>
              <p className="mb-4">
                Need urgent care? Access same-day and next-day slots designed
                for time-sensitive cases. Store your medical history securely
                and use online payments for a smooth check-in experience.
              </p>
              <p>
                Take control of your health with MediCareBook. Streamlined
                scheduling, clear information, and a better experience for both
                patients and doctors—that&apos;s the future of healthcare
                booking.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
