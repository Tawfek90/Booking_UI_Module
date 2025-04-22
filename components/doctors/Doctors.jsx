"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import generateMockDoctors from "@/app/_lib/fakerData";
import {
  clearAppointments,
  setDoctors,
  setShowAppointments,
} from "@/redux/DoctorsModule/DoctorsModuleSlice";
import styles from "./doctors.module.scss";
import Card from "../doctorCard/Card";
import Booking from "../booking/Booking";
import AppointmentsList from "../appointments/AppointmentsList";

export default function Doctors() {
  const dispatch = useDispatch();
  const { doctors, booking } = useSelector((state) => state.doctors);
  const [specialityOptions, setSpecialityOptions] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [uniqueAvailability, setUniqueAvailability] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const bookingRef = useRef(null);

  // 1) Load mock doctors once
  useEffect(() => {
    dispatch(setDoctors(generateMockDoctors(50)));
  }, [dispatch]);

  // 2) Build specialty list & extract unique day-names
  useEffect(() => {
    setFilteredItems(doctors);
    const specs = Array.from(new Set(doctors.map((d) => d.specialty)));
    setSpecialityOptions(specs);
    const allSlots = doctors.flatMap((d) => d.availability);
    const deduped = Array.from(
      new Set(allSlots.map((s) => JSON.stringify(s)))
    ).map((j) => JSON.parse(j));
    const days = Array.from(new Set(deduped.map((s) => s.day)));
    setUniqueAvailability(days);
  }, [doctors]);

  // 3) Filter by specialty
  useEffect(() => {
    let items = doctors;
    if (selectedSpeciality) {
      items = items?.filter((d) => d.specialty === selectedSpeciality);
    }
    setFilteredItems(items);
    setSelectedAvailability("");
  }, [selectedSpeciality, doctors]);

  // 4) Filter by availability
  useEffect(() => {
    let items = doctors;
    if (selectedSpeciality) {
      items = items?.filter((d) => d.specialty === selectedSpeciality);
    }
    if (selectedAvailability) {
      items = items?.filter((d) =>
        d.availability.some((a) => a.day === selectedAvailability)
      );
    }
    setFilteredItems(items);
  }, [selectedAvailability, selectedSpeciality, doctors]);

  // booking popup positioning
  const handleBookingClick = () => {
    bookingRef.current.style.top = `${window.scrollY + 300}px`;
  };

  return (
    <section className={styles.pageWrapper} aria-labelledby="doctors-heading">
      <h1 id="doctors-heading" className={styles.welcome}>
        Welcome!
      </h1>

      <AppointmentsList />

      {/* Filter controls grouped in a form-like fieldset */}
      <fieldset className={styles.filterBy}>
        <legend className="sr-only">Filter doctors by specialty and day</legend>

        {/* Specialty filter */}
        <div className="filter-group">
          <label htmlFor="filter-speciality" className="sr-only">
            Specialty
          </label>
          <select
            id="filter-speciality"
            value={selectedSpeciality}
            onChange={(e) => setSelectedSpeciality(e.target.value)}
            aria-describedby="filter-speciality-desc"
          >
            <option value="">— all specialties —</option>
            {specialityOptions.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <span id="filter-speciality-desc" className="sr-only">
            Choose a medical specialty to filter by
          </span>
        </div>

        {/* Availability filter */}
        <div className="filter-group">
          <label htmlFor="filter-availability" className="sr-only">
            Day of week
          </label>
          <select
            id="filter-availability"
            value={selectedAvailability}
            onChange={(e) => setSelectedAvailability(e.target.value)}
            aria-describedby="filter-availability-desc"
          >
            <option value="">— all days —</option>
            {uniqueAvailability.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span id="filter-availability-desc" className="sr-only">
            Choose a day of the week to filter available appointments
          </span>
        </div>

        {/* Show appointments button */}
        <button
          className={styles.appointment}
          onClick={() => dispatch(setShowAppointments(true))}
          aria-label="View my appointments"
        >
          My appointments
        </button>
      </fieldset>

      {/* Doctors list */}
      <div
        className={styles.doctorsWrapper}
        role="list"
        aria-label="Available doctors"
      >
        {filteredItems.map((doc) => (
          <Card
            key={doc.id}
            role="listitem"
            handleBookingClick={handleBookingClick}
            {...doc}
          />
        ))}
      </div>

      <Booking ref={bookingRef} />
    </section>
  );
}
