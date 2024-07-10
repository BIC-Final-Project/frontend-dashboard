import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
import { useState } from "react";

const statsData = [
  {
    title: "Total Transaksi",
    value: "Rp. 100.000.000",
    icon: <CreditCardIcon className="w-8 h-8" />,
    description: "Gabungan Total Transaksi",
  },
  {
    title: "Total Booking",
    value: "15",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5h11.25m-11.25 4.5h11.25M8.25 13.5h11.25M8.25 18h11.25M3 6h.007v.008H3V6zm0 9h.007v.008H3V15zm0 3h.007v.008H3V18z"
        />
      </svg>
    ),
    description: "Booking Fasilitas",
  },
  {
    title: "Total Fasilitas",
    value: "10",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8.25h2.25v2.25H3V8.25zm0 4.5h2.25v2.25H3v-2.25zM3 17.25h2.25v2.25H3v-2.25zM6.75 4.5h10.5v3H6.75v-3zm0 6.75h10.5v3H6.75v-3zm0 6.75h10.5v3H6.75v-3zm-3-13.5h16.5v1.5H3.75v-1.5zm0 6.75h16.5v1.5H3.75v-1.5zm0 6.75h16.5v1.5H3.75v-1.5z"
        />
      </svg>
    ),
    description: "Saat ini",
  },
  {
    title: "Total Member",
    value: "2,420",
    icon: <UsersIcon className="w-8 h-8" />,
    description: "Terdaftar",
  },
];

function Dashboard() {
  const dispatch = useDispatch();

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <>
      {/** ---------------------- Select Period Content ------------------------- */}
      <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <LineChart />
        <BarChart />
      </div>

      {/** ---------------------- Different stats content 2 ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <AmountStats />
        <PageStats />
      </div>

      {/** ---------------------- User source channels table  ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div>
    </>
  );
}

export default Dashboard;
