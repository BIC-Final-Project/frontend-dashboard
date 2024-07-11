import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { NavLink, Routes, Link, useLocation } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const userId = "admin"; // Assume you have a user ID or username for the admin
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }

    // Set random profile image URL for admin
    const storedImageUrl = localStorage.getItem(`profileImage-${userId}`);
    if (storedImageUrl) {
      setProfileImageUrl(storedImageUrl);
    } else {
      const randomImageUrl = `https://picsum.photos/150?random=${Math.floor(
        Math.random() * 1000
      )}`;
      localStorage.setItem(`profileImage-${userId}`, randomImageUrl);
      setProfileImageUrl(randomImageUrl);
    }
  }, [currentTheme, userId]);

  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  function logoutUser() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <>
      <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
        <div className="flex-1">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn drawer-button lg:hidden"
            style={{ backgroundColor: "#3E8D3E", borderColor: "#3E8D3E" }}
          >
            <Bars3Icon className="h-5 w-5" style={{ color: "#fff" }} />
          </label>
          <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={profileImageUrl} alt="profile" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="justify-between">
                <Link to={"/app/settings-profile"}>
                  Profile Settings
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={"/app/settings-billing"}>Bill History</Link>
              </li>
              <div className="divider mt-0 mb-0"></div>
              <li>
                <a onClick={logoutUser}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
