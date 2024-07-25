import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { NavLink, Routes, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import iconSetting from '../assets/icons/setting.svg'
import iconLogout from '../assets/icons/logout.svg'
import profilDefault from '../assets/icons/profil-default.png'

const dropdownLinks = [
  {
    path: "/app/settings-profile",
    title: "Setting Profile",
    icon: iconSetting,
  },
  {
    path: "",
    title: "Log Out",
    icon: iconLogout,
  },
];

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
    window.location.reload();
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
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg">{JSON.parse(localStorage.getItem('user'))?.nama_lengkap || ''}</h2>
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={profilDefault} alt="profile" />
                </div>
              </label>
            </div>
            <ul
              tabIndex={0}
              className="menu-compact menu dropdown-content mt-3 w-52 overflow-hidden rounded-box bg-base-100 px-0 py-2 text-sm font-medium text-black-secondary shadow"
            >
              {dropdownLinks.map((item, i) => {
                const { path, title, icon } = item;
                return (
                  <>
                    <li className="">
                      {path ? (
                        <Link to={path} className="rounded-none py-[10px] hover:!bg-gray-200 active:!bg-gray-300 active:!text-secondary">
                          <img src={icon} alt="" className='w-4 h-4' />
                          {title}
                        </Link>
                      ) : (
                        <button className="rounded-none py-[10px] text-[#AB3027] hover:!bg-gray-200 active:!bg-gray-300 active:!text-[#AB3027]" type="button" 
                        onClick={logoutUser}>
                          <img src={icon} alt="" className='w-4 h-4' />
                          {title}
                        </button>
                      )}
                    </li>
                    {i !== dropdownLinks.length - 1 ? (
                      <div className="h-[1px] w-full bg-base-300"></div>
                    ) : null}
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
