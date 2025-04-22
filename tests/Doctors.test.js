// __tests__/Doctors.test.js

// Mock react‑redux before importing the component
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import Doctors from "@/components/doctors/Doctors";
import generateMockDoctors from "@/app/_lib/fakerData";
import {
  clearAppointments,
  setDoctors,
  setShowAppointments,
} from "@/redux/DoctorsModule/DoctorsModuleSlice";

// Mock your data generators and slice action‑creators
jest.mock("@/app/_lib/fakerData");
jest.mock("@/redux/DoctorsModule/DoctorsModuleSlice", () => ({
  clearAppointments: jest.fn(() => ({ type: "doctors/clearAppointments" })),
  setDoctors: jest.fn((payload) => ({ type: "doctors/setDoctors", payload })),
  setShowAppointments: jest.fn((visible) => ({
    type: "doctors/setShowAppointments",
    payload: visible,
  })),
}));

describe("Doctors component", () => {
  let dispatchMock;

  const fakeDoctors = [
    {
      id: "1",
      name: "Dr. Alice",
      specialty: "Cardiology",
      availability: [{ day: "Monday" }],
    },
    {
      id: "2",
      name: "Dr. Bernard",
      specialty: "Dermatology",
      availability: [{ day: "Tuesday" }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // make generateMockDoctors return our fake data
    generateMockDoctors.mockReturnValue(fakeDoctors);

    // set up useDispatch()/useSelector()
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation((selector) =>
      selector({ doctors: { doctors: fakeDoctors, booking: false } })
    );
  });

  it("dispatches setDoctors(generateMockDoctors(50)) on mount", () => {
    render(<Doctors />);
    expect(generateMockDoctors).toHaveBeenCalledWith(50);
    expect(dispatchMock).toHaveBeenCalledWith(setDoctors(fakeDoctors));
  });
});
