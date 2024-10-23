/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { AdminOutlet } from "../Components/AdminComponents/AdminOutlet";

export const AdminDashboard = () => {

  const handleAside = () => {
    const adminPanel = document.getElementById("admin-panel");
    if (adminPanel.style.display === "none") {
      adminPanel.style.display = "block";
    } else {
      adminPanel.style.display = "none";
    }
  }
  return (
    <div className="flex">
      <aside  id="admin-panel" className={` w-64 bg-gray-800 text-white min-h-screen`}>
        <div className="flex flex-row justify-between p-4" >
            <h2>Admin Panel</h2>
            <button onClick={handleAside}>Close </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link to="/admin/" className="hover:bg-gray-700 p-2 rounded">
            User Management
          </Link>
          <Link to="/admin/" className="hover:bg-gray-700 p-2 rounded">
            Event Overview
          </Link>
          <Link to="/admin/" className="hover:bg-gray-700 p-2 rounded">
            Availability Overview
          </Link>
        </nav>
      </aside>
      <main className="flex-grow p-6 bg-gray-100">

        <AdminOutlet />
      </main>
    </div>
  );
};
