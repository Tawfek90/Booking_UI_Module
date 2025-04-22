import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./appointments.module.scss";
import { setShowAppointments } from "@/redux/DoctorsModule/DoctorsModuleSlice";

export default function AppointmentsList() {
  const dispatch = useDispatch();
  const { appointments, showAppointments } = useSelector(
    (state) => state.doctors
  );

  // 1) Hooks first, always
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showAppointments) {
        dispatch(setShowAppointments(false));
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showAppointments, dispatch]);

  // 2) Then any early returns
  if (appointments?.length === 0) {
    return <p>No appointments booked yet.</p>;
  }

  // 3) And finally your main render
  return (
    <section
      className={showAppointments ? styles.show : styles.appointmentsWrapper}
      role="region"
      aria-labelledby="appointments-heading"
      aria-hidden={!showAppointments}
    >
      <h2 id="appointments-heading" className="capitalize mb-2">
        My Appointments
      </h2>

      <ul role="list" aria-live="polite" aria-relevant="additions removals">
        {appointments?.map((appt, i) => (
          <li key={i} role="listitem">
            <strong>{appt.name}</strong> ({appt.specialty})<br />
            {appt.day} at {appt.time} {appt.date}
            <br />
            Location: {appt.location}
          </li>
        ))}
      </ul>

      <div className={styles.dismissContainer}>
        <button
          onClick={() => dispatch(setShowAppointments(false))}
          className={styles.dismiss}
          aria-label="Dismiss appointments list"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
}
