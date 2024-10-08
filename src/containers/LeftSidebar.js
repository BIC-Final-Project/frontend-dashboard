import React from "react";
import routes from "../routes/sidebar";
import { NavLink, Link, useLocation } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useDispatch } from "react-redux";
import logoPath from "../assets/icons/Logo.svg";
import sidebarAset from "../routes/sidebarAset";
import sidebar from "../routes/sidebar";

function LeftSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const role = JSON.parse(localStorage.getItem("user"))?.role || "";

  const setSidebarRole = () => {
    if (role === "admin aset") {
      return sidebarAset;
    } else if (role === "admin operasional") {
      return sidebar;
    } else {
      return sidebar;
    }
  };

  const close = (e) => {
    document.getElementById("left-sidebar-drawer").click();
  };

  return (
    <div className="drawer-side z-30">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
        <button
          className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={() => close()}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>
        <li
          className="mb-2 font-semibold text-xl flex justify-center items-center"
          style={{ padding: "0", margin: "0" }}
        >
          <Link
            to={"/app/dashboard"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <img
              src={logoPath}
              alt="Logo"
              className="w-48 h-20"
              style={{ margin: "0", padding: "0" }}
            />
          </Link>
        </li>
        {setSidebarRole().map((route, k) => (
          <li key={k}>
            {route.submenu ? (
              <SidebarSubmenu {...route} />
            ) : (
              <NavLink
                end
                to={route.path}
                className={({ isActive }) =>
                  `${isActive ? "font-semibold bg-base-200" : "font-normal"}`
                }
              >
                {route.icon} {route.name}
                {location.pathname === route.path ? (
                  <span
                    className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md"
                    style={{ backgroundColor: "#3E8D3E" }}
                    aria-hidden="true"
                  ></span>
                ) : null}
              </NavLink>
            )}
          </li>
        ))}
        {/* Add profile section at the bottom */}
        {/* <li className="mt-auto p-4">
          <div className="flex items-center">
            <div className="avatar">
              <div className="rounded-full w-10 h-10 m-1">
                <img src="https://placehold.jp/150x150.png" alt="Admin" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-semibold">Admin</div>
              <div className="text-xs text-gray-600">BIC@gmail.com</div>
            </div>
          </div>
        </li> */}
      </ul>
    </div>
  );
}

export default LeftSidebar;
