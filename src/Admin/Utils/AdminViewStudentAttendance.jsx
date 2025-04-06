import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../Common/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AdminViewStudentAttendance = () => {
  const [classId, setClassId] = useState("10");
  const [classSection, setClassSection] = useState("A");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [date, setDate] = useState(getTodayDate()); // Initialize with today's date
  const [loading, setLoading] = useState(false);

  // Fetch attendance records when classId, classSection, or date changes
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!classId || !classSection || !date) {
        toast.warning("Class, section, or date details are missing.");
        return;
      }
      setLoading(true);
      try {
        const { data, status } = await axiosInstance.get(
          `/student/attendance/byClass/${classId}/${classSection}/date/${date}`
        );
        if (status === 200) {
          console.log("Attendance Records:", data);
          setAttendanceRecords(data);
        } else {
          console.warn("Unexpected response:", status);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast.error("Error fetching attendance. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId, classSection, date]);

  // Handle date change
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <ToastContainer autoClose={3000} />

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Student Attendance</h1>

      {/* Class and Section Selectors */}
      <div className="flex gap-4 mb-4">
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        >
          {["Nursery", "LKG", "UKG", ...Array.from({ length: 10 }, (_, i) => (i + 1).toString())].map(
            (option) => (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </select>
        <select
          value={classSection}
          onChange={(e) => setClassSection(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2"
        >
          {["A", "B", "C"].map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
          Select Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Attendance Table */}
      {loading ? (
        <p className="text-center text-gray-600">Loading attendance records...</p>
      ) : attendanceRecords.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left font-bold text-gray-800">Student Info</th>
              <th className="py-2 px-4 text-center font-bold text-gray-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-gray-800">
                  {record.regNo} - {record.firstName} {record.lastName}
                </td>
                <td className="py-2 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      record.status ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {record.status ? "Present" : "Absent"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">
          No attendance records found for the selected date.
        </p>
      )}
    </div>
  );
};

export default AdminViewStudentAttendance;
