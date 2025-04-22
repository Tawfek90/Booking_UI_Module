// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import doctorReducer from "./DoctorsModule/DoctorsModuleSlice";

// Define  reducers
const rootReducer = combineReducers({
  doctors: doctorReducer,
});

// Configure Redux Persist
const persistConfig = {
  key: "root", // Key for the persisted state
  storage, // Storage method (localStorage)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serialization check for Redux Persist
    }),
});

// Export the persisted store
export const persistor = persistStore(store);
