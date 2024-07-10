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
  {
    path: "", // no url needed as this has submenu
    icon: <img src={compass} className={`${iconClasses} inline`} />, // icon component
    name: "Kelola Aset", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/asset/tambah-aset",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Tambah Aset",
      },
      {
        path: "/app/asset/tambah-vendor",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Tambah Vendor",
      },
      {
        path: "/app/asset/detail-aset",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Detail Aset",
      },
      {
        path: "/app/asset/detail-vendor",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Detail Vendor",
      },
    ],
  },
  {
    path: "", // no url needed as this has submenu
    icon: <img src={FilePlus} className={`${iconClasses} inline`} />, // icon component
    name: "Perencanaan Aset", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/perencanaan/pemeliharaan",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Rencana Pemeliharaan",
      },
      {
        path: "/app/perencanaan/detail",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Detail Perencanaan Aset",
      },
    ],
  },
  {
    path: "", // no url needed as this has submenu
    icon: <img src={calendar} className={`${iconClasses} inline`} />, // icon component
    name: "Pemeliharaan Aset", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/pemeliharaan/tambah",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Tambah Pemeliharaan",
      },
      {
        path: "/app/pemeliharaan/darurat",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Pemeliharaan Darurat",
      },
      {
        path: "/app/pemeliharaan/detail",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Detail Pemeliharaan",
      },
    ],
  },
  {
    path: "/app/riwayat", // url
    icon: (
      <img
        src={fileSearchIconPath}
        className={iconClasses}
        alt="File Search Icon"
      />
    ), // icon component
    name: "Riwayat Aset", // name that appear in Sidebar
  },
  {
    path: "", // no url needed as this has submenu
    icon: <UsersIcon className={`${iconClasses} inline`} />, // icon component
    name: "Management Admin", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/admin/tambah",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Tambah Admin",
      },
      {
        path: "/app/admin/detail",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Detail Admin",
      }
    ],
  },
];

export default sidebarRoutes;
