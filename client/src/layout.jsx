import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="content mt-2">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
