import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import axiosInstance from "./axios";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaFolder,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const SideBar = ({ isSidebarOpen, toggleSidebar }) => {
  const { role } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

 const handleLogout = async () => {
    try {
      // Clear user session
      await axiosInstance.post("/userauthdata/logout");
      
      
      // Redirect to external URL
      window.location.href = "https://shhsgdk.in/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menusByRole = {
    Admin: [
      { title: "Dashboard", icon: <FaChartBar />, path: "/dashboard" },
      { title: "Events", icon: <FaCalendarAlt />, path: "/events" },
      { title: "Circular", icon: <FaFolder />, path: "/circular" },
      { title: "Students", icon: <FaUserCircle />, path: "/student-details" },
      { title: "Teacher Details", icon: <FaUserCircle />, path: "/teacher-details" },
       { title: "Uploading-Attendance", icon: <FaChartBar />, path: "/admin-attendance-upload-details" },
      { title: "Attendance", icon: <FaFolder />, path: "/view-attendance" },
      { title: "Fee", icon: <FaCog />, path: "/fee-details" },
    ],
    ClassTeacher: [
      { title: "View Attendance", icon: <FaFolder />, path: "/view-CT-attendance" },
      { title: "Attendance", icon: <FaFolder />, path: "/attendance-upload" },
      { title: "Marks", icon: <FaFolder />, path: "/marks-upload" },
      { title: "View Marks", icon: <FaCog />, path: "/view-marks" },
    ],
    Teacher: [
      { title: "View Attendance", icon: <FaFolder />, path: "/view-attendance" },
      { title: "View Marks", icon: <FaCog />, path: "/view-marks" },
    ],
    Student: [
      { title: "Attendance Details", icon: <FaFolder />, path: "/view-student-attendance" },
      { title: "Marks", icon: <FaCog />, path: "/Student-Marks" },
    ],
  };

  const Menus = menusByRole[role] || [];

  return (
    <>
      {/* Overlay for small screens when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity md:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar container */}
      <div
        className={`
          fixed z-50 top-0 left-0 h-full w-64 bg-blue-900 text-white transition-transform transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 border-b border-blue-700">
            <FaUserCircle size={28} />
            <h1 className="text-lg font-semibold">{role ? role : "Guest"}</h1>
          </div>

          {/* Navigation Menu */}
          <ul className="mt-4 space-y-2 overflow-y-auto px-2">
            {Menus.map((menu, index) => (
              <li key={index}>
                <Link
                  to={menu.path}
                  className={`flex items-center gap-4 p-3 hover:bg-blue-700 rounded-md ${
                    location.pathname === menu.path ? "bg-blue-700" : ""
                  }`}
                  onClick={() => toggleSidebar()} // close on mobile
                >
                  <span className="text-xl">{menu.icon}</span>
                  <span className="text-sm font-medium">{menu.title}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 p-3 hover:bg-red-600 bg-red-500 rounded-md w-full text-left"
              >
                <span className="text-xl">
                  <FaSignOutAlt />
                </span>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default SideBar;