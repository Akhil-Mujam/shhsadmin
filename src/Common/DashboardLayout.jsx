import React, { useState } from 'react';
import SideBar from './SideBar'; // Import the sidebar component
import Header from './Header';
import { Outlet } from 'react-router-dom'; // For nested routing

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:w-64`}
      >
        <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 shadow-lg rounded-lg">
          <Outlet />
        </main>
      </div>

      {/* Overlay for Sidebar (on mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
