"use client";
import React from "react";
import styles from "./cart.module.scss";
import Image from "next/image";
import { useDispatch } from "react-redux";
import {
  setBooking,
  setSelectedDoctor,
} from "@/redux/DoctorsModule/DoctorsModuleSlice";

export default function Card({
  id,
  availability,
  location,
  name,
  photo,
  rating,
  specialty,
  handleBookingClick,
}) {
  const dispatch = useDispatch();

  // unique days array
  const uniqueDays = Array.from(new Set(availability.map((slot) => slot.day)));

  const onBook = () => {
    dispatch(setBooking(true));
    dispatch(
      setSelectedDoctor({
        id,
        name,
        photo,
        location,
        rating,
        specialty,
        availability,
        days: uniqueDays,
      })
    );
    handleBookingClick();
  };

  // IDs for ARIA
  const nameId = `doctor-${id}-name`;
  const locId = `doctor-${id}-location`;
  const ratingId = `doctor-${id}-rating`;
  const specId = `doctor-${id}-specialty`;
  const availId = `doctor-${id}-availability`;

  return (
    <article
      className={styles.card}
      role="listitem"
      aria-labelledby={nameId}
      aria-describedby={`${locId} ${ratingId} ${specId} ${availId}`}
    >
      <Image
        src={photo}
        width={200}
        height={100}
        alt={`Photo of Dr. ${name}`}
        quality={100}
      />

      <div className={styles.content}>
        <h2 id={nameId}>{name}</h2>

        <p id={locId}>
          <strong>Location:</strong> {location}
        </p>
        <p id={ratingId}>
          <strong>Rating:</strong> {rating} / 5
        </p>
        <p id={specId}>
          <strong>Specialty:</strong> {specialty}
        </p>

        <div className={styles.availability}>
          <h3 id={availId}>Availability</h3>
          {uniqueDays?.length > 0 ? (
            <ul>
              {uniqueDays.map((day, idx) => (
                <li key={idx} className=" inline">
                  {day},
                </li>
              ))}
            </ul>
          ) : (
            <p>Not available</p>
          )}
        </div>
      </div>

      <button
        className={styles.book}
        onClick={onBook}
        disabled={uniqueDays?.length === 0}
        aria-label={
          uniqueDays?.length === 0
            ? `No appointments available for Dr. ${name}`
            : `Book an appointment with Dr. ${name} on ${uniqueDays.join(", ")}`
        }
      >
        {uniqueDays?.length === 0 ? "Not available" : "Book an appointment"}
      </button>
    </article>
  );
}
