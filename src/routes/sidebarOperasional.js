import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
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
    icon: <img src={bookingfasilitas} className={`${iconClasses} inline`} />, // icon component
    name: "Booking Fasilitas", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/booking?page=1&limit=10",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "List Booking",
      },
      {
        path: "/app/booking/cari",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Cari Booking",
      },
    ],
  },
  {
    path: "", // no url needed as this has submenu
    icon: <img src={membership} className={`${iconClasses} inline`} />, // icon component
    name: "Membership", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/membership?page=1&limit=10",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "List Member",
      },
      {
        path: "/app/paket-membership",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Paket Membership",
      },
    ],
  },
  {
    path: "/app/fasilitas?page=1&limit=10", // unique path for Fasilitas
    icon: <img src={fasilitas} className={`${iconClasses} inline`} />, // icon component
    name: "Fasilitas", // name that appear in Sidebar
  },
  {
    path: "/app/promo?page=1&limit=10", // unique path for Promo & Diskon
    icon: <img src={promo} className={`${iconClasses} inline`} />, // icon component
    name: "Promo & Diskon", // name that appear in Sidebar
  },
];

export default sidebarRoutes;
