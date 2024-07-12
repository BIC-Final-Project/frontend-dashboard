import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import fileSearchIconPath from "../assets/icons/file-search.svg";
import calendar from "../assets/icons/calendar.svg";
import FilePlus from "../assets/icons/file-plus.svg";
import compass from "../assets/icons/compass.svg";
import dashboard from "../assets/icons/dashboard.svg";
import membership from "../assets/icons/membership.svg";
import fasilitas from "../assets/icons/fasilitas.svg";
import bookingfasilitas from "../assets/icons/booking-fasilitas.svg";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const sidebarRoutes = [
  {
    path: "/app/dashboard",
    icon: <img src={dashboard} className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "", // no url needed as this has submenu
    icon: <img src={membership} className={`${iconClasses} inline`} />, // icon component
    name: "Membership", // name that appear in Sidebar
    submenu: [
      {
        path: "/404",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Member 1",
      },
      {
        path: "/404",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Member 2",
      },
    ],
  },
  {
    path: "", // no url needed as this has submenu
    icon: <img src={bookingfasilitas} className={`${iconClasses} inline`} />, // icon component
    name: "Booking Fasilitas", // name that appear in Sidebar
    submenu: [
      {
        path: "/404",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Member 1",
      },
      {
        path: "/404",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Member 2",
      },
    ],
  },
  {
    path: "", // no url needed as this has submenu
    icon: <img src={fasilitas} className={`${iconClasses} inline`} />, // icon component
    name: "Fasilitas", // name that appear in Sidebar
    submenu: [
      {
        path: "/404",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Member 1",
      },
      {
        path: "/404",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Member 2",
      },
    ],
  },
];

export default sidebarRoutes;
