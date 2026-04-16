import React, { createContext, useState } from "react";
import { getMyAttendance } from "../api/attendanceApi";

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [records, setRecords] = useState([]);

  // Call this function to refresh attendance records from backend API
  const refresh = async () => {
    try {
      const data = await getMyAttendance(); // use your existing API function
      setRecords(data);
    } catch (err) {
      console.error("Failed to refresh attendance", err);
    }
  };

  return (
    <AttendanceContext.Provider value={{ records, setRecords, refresh }}>
      {children}
    </AttendanceContext.Provider>
  );
};