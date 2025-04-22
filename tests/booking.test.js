/**
 * __tests__/Booking.test.js
 */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// 1) Mock react‑redux hooks
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// 2) Mock next/image to a simple <img>
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

// 3) Mock your slice action-creators
jest.mock("@/redux/DoctorsModule/DoctorsModuleSlice", () => ({
  setBooking: jest.fn((payload) => ({ type: "setBooking", payload })),
  setDoctors: jest.fn((payload) => ({ type: "setDoctors", payload })),
  setSelectedDoctor: jest.fn((payload) => ({
    type: "setSelectedDoctor",
    payload,
  })),
  addAppointment: jest.fn((payload) => ({ type: "addAppointment", payload })),
}));

import Booking from "@/components/booking/Booking";
import {
  setBooking,
  setDoctors,
  setSelectedDoctor,
  addAppointment,
} from "@/redux/DoctorsModule/DoctorsModuleSlice";

describe("Booking component", () => {
  let dispatchMock;
  const fakeDoctor = {
    id: "1",
    name: "Dr. Test",
    photo: "test.jpg",
    availability: [
      { day: "Monday", time: "09:00" },
      { day: "Tuesday", time: "10:00" },
    ],
    days: ["Monday", "Tuesday"],
  };

  beforeEach(() => {
    jest.useFakeTimers();
    dispatchMock = jest.fn();
    const { useDispatch, useSelector } = require("react-redux");

    // useDispatch → our mock
    useDispatch.mockReturnValue(dispatchMock);

    // useSelector → state.doctors = { booking, selectedDoctor, doctors }
    useSelector.mockImplementation((selector) =>
      selector({
        doctors: {
          booking: true,
          selectedDoctor: fakeDoctor,
          doctors: [fakeDoctor],
        },
      })
    );

    jest.clearAllMocks();
  });

  function renderWithRef() {
    const ref = { current: { focus: jest.fn() } };
    render(<Booking ref={ref} />);
    return { ref };
  }

  it("focuses the dialog when booking opens", () => {
    const { ref } = renderWithRef();
    expect(ref.current.focus).toHaveBeenCalled();
  });

  it("dispatches setBooking(false) on Escape key", () => {
    renderWithRef();
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(dispatchMock).toHaveBeenCalledWith(setBooking(false));
  });

  it("only enables Confirm after day & time are selected, and books correctly", () => {
    renderWithRef();

    // Grab the buttons and selects
    const confirmBtn = screen.getByText("Confirm");
    const daySelect = screen.getByLabelText(/Select booking day/i);

    // initially disabled
    expect(confirmBtn).toBeDisabled();

    // pick a day
    fireEvent.change(daySelect, { target: { value: "Monday" } });
    expect(confirmBtn).toBeDisabled();

    // pick a time
    const timeSelect = screen.getByLabelText(/Select booking time/i);
    fireEvent.change(timeSelect, { target: { value: "09:00" } });
    expect(confirmBtn).toBeEnabled();

    // click Confirm
    fireEvent.click(confirmBtn);

    // should dispatch in order: setDoctors, setSelectedDoctor, addAppointment
    expect(dispatchMock).toHaveBeenCalledWith(setDoctors(expect.any(Array)));
    expect(dispatchMock).toHaveBeenCalledWith(
      setSelectedDoctor(
        expect.objectContaining({
          availability: expect.not.arrayContaining([
            { day: "Monday", time: "09:00" },
          ]),
        })
      )
    );
    expect(dispatchMock).toHaveBeenCalledWith(
      addAppointment(expect.objectContaining({ day: "Monday", time: "09:00" }))
    );

    // confirmation banner appears
    expect(screen.getByRole("status")).toHaveTextContent(
      /Appointment booked successfully/i
    );

    // advance the 3s timeout
    act(() => jest.advanceTimersByTime(3000));

    // should close booking
    expect(dispatchMock).toHaveBeenCalledWith(setBooking(false));

    // confirmation banner is gone
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("renders the doctor photo when present", () => {
    renderWithRef();
    const img = screen.getByAltText(`Photo of Dr. ${fakeDoctor.name}`);
    expect(img).toHaveAttribute("src", fakeDoctor.photo);
  });
});
