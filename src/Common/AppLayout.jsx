import React, { useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
      <SideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
