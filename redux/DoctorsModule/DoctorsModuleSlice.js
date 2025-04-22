// redux/DoctorsModuleSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctors: [], // ← start empty
  booking: false,
  selectedDoctor: {},
  appointments: [],
  showAppointments: false,
};

const doctorsModuleSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
    setBooking: (state, action) => {
      state.booking = action.payload;
    },
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
    addAppointment: (state, action) => {
      console.log("payload", action.payload);

      if (!Array.isArray(state.appointments)) {
        state.appointments = [];
      }
      state.appointments.push(action.payload);
    },
    setShowAppointments: (state, action) => {
      state.showAppointments = action.payload;
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
  },
});

export const {
  setDoctors,
  setBooking,
  setSelectedDoctor,
  addAppointment,
  setShowAppointments,
  clearAppointments,
} = doctorsModuleSlice.actions;
export default doctorsModuleSlice.reducer;
