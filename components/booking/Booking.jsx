"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./booking.module.scss";
import {
  setBooking,
  setDoctors,
  setSelectedDoctor,
  addAppointment,
} from "@/redux/DoctorsModule/DoctorsModuleSlice";
import Image from "next/image";

const Booking = React.forwardRef((_, ref) => {
  const dispatch = useDispatch();
  const { booking, selectedDoctor, doctors } = useSelector(
    (state) => state.doctors
  );

  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  // Reset when doctor or day changes
  useEffect(() => {
    setDay("");
    setTime("");
  }, [selectedDoctor]);
  useEffect(() => {
    setTime("");
  }, [day]);

  const handleBook = () => {
    if (!selectedDoctor) return;

    // Update global & selectedDoctor availability…
    const idx = doctors.findIndex(
      (doc) =>
        doc.name === selectedDoctor.name && doc.photo === selectedDoctor.photo
    );
    if (idx > -1) {
      const target = doctors[idx];
      const newGlobalAvail = target.availability?.filter(
        (slot) => !(slot.day === day && slot.time === time)
      );
      const updatedDoctors = [...doctors];
      updatedDoctors[idx] = { ...target, availability: newGlobalAvail };
      dispatch(setDoctors(updatedDoctors));

      const newSelAvail = selectedDoctor.availability?.filter(
        (slot) => !(slot.day === day && slot.time === time)
      );
      dispatch(
        setSelectedDoctor({
          ...selectedDoctor,
          availability: newSelAvail,
          days: Array.from(new Set(newSelAvail.map((a) => a.day))),
        })
      );
    }

    dispatch(addAppointment({ ...selectedDoctor, day, time }));

    // Show confirmation
    setConfirmation(true);
    setTimeout(() => {
      setConfirmation(false);
      dispatch(setBooking(false));
    }, 3000);
  };

  // Times for the chosen day
  const timeOptions =
    selectedDoctor?.availability
      ?.filter((slot) => slot.day === day)
      .map((slot) => slot.time) || [];

  // Focus the dialog when it opens
  useEffect(() => {
    if (booking && ref.current) {
      ref.current.focus();
    }
  }, [booking, ref]);

  // Close on ESC
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      dispatch(setBooking(false));
    }
  };

  return (
    <div
      className={booking ? styles.show : styles.booking}
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-heading"
      aria-describedby="booking-desc"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      {/* Dialog heading & description */}
      <h2
        id="booking-heading"
        className=" capitalize font-[700] text-center mb-1"
      >
        Book an appointment with Dr.{" "}
        <span className=" text-blue-500"> {selectedDoctor?.name}</span>
      </h2>
      <p id="booking-desc" className="sr-only">
        Select a day and time slot, then Confirm or Cancel your booking.
      </p>

      {/* Doctor’s photo */}
      {selectedDoctor?.photo && (
        <Image
          src={selectedDoctor?.photo}
          width={200}
          height={100}
          quality={100}
          alt={`Photo of Dr. ${selectedDoctor?.name}`}
        />
      )}

      {/* Day & time selectors */}
      <div className={styles.selectOptions}>
        <div>
          <label htmlFor="booking-day-select" className="sr-only">
            Select booking day
          </label>
          <select
            id="booking-day-select"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            aria-describedby="booking-day-desc"
          >
            <option value="" hidden>
              Select day
            </option>
            {selectedDoctor?.days?.map((d, idx) => (
              <option value={d} key={idx}>
                {d}
              </option>
            ))}
          </select>
          <p id="booking-day-desc" className="sr-only">
            Choose one of the available days for your appointment.
          </p>
        </div>

        {day && (
          <div>
            <label htmlFor="booking-time-select" className="sr-only">
              Select booking time
            </label>
            <select
              id="booking-time-select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-describedby="booking-time-desc"
            >
              <option value="" hidden>
                Select time
              </option>
              {timeOptions.map((t, idx) => (
                <option value={t} key={idx}>
                  {t}
                </option>
              ))}
            </select>
            <p id="booking-time-desc" className="sr-only">
              Choose an available time slot on {day}.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation message */}
      {confirmation && (
        <div className={styles.confirmation} role="status" aria-live="polite">
          Appointment booked successfully
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => dispatch(setBooking(false))}
          aria-label="Cancel booking"
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles.confirm}
          onClick={handleBook}
          disabled={!day || !time}
          aria-label={`Confirm appointment with Dr. ${selectedDoctor?.name} on ${day} at ${time}`}
        >
          Confirm
        </button>
      </div>
    </div>
  );
});

export default Booking;
