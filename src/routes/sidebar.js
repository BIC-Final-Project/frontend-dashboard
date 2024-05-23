/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import CodeBracketSquareIcon from "@heroicons/react/24/outline/CodeBracketSquareIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import fileSearchIconPath from '../assets/icons/file-search.svg';
import calendar from '../assets/icons/calendar.svg';
import FilePlus from '../assets/icons/file-plus.svg';
import compass from '../assets/icons/compass.svg';
import dashboard from '../assets/icons/dashboard.svg';
import membership from '../assets/icons/membership.svg';
import fasilitas from '../assets/icons/fasilitas.svg';
import bookingfasilitas from '../assets/icons/booking-fasilitas.svg';



const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/app/dashboard",
    icon: <img src={dashboard} className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "", //no url needed as this has submenu
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
    path: "", //no url needed as this has submenu
    icon: <img src={bookingfasilitas} className={`${iconClasses} inline`} />, // icon component
    name: "Booking Fasilitas", // name that appear in Sidebar
    submenu: [
      {
        path: "/404",
        icon: <ArrowRightCircleIcon  className={submenuIconClasses} />,
        name: "Member 1",
      },
      {
        path: "/404",
        icon: <ArrowRightCircleIcon  className={submenuIconClasses} />,
        name: "Member 2",
      },
    ],
  },
  {
    path: "", //no url needed as this has submenu
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
    path: "", //no url needed as this has submenu
    icon: <img src={compass} className={`${iconClasses} inline`} />, // icon component
    name: "Kelola Aset", // name that appear in Sidebar
    submenu: [
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
    ],
  },
  {
    path: "", //no url needed as this has submenu
    icon: <img src={FilePlus} className={`${iconClasses} inline`} />, // icon component
    name: "Perencanaan Aset", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/perencanaan/detail",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Detail Perencanaan Aset",
      },
      {
        path: "/app/perencanaan/pemeliharaan",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Rencana Pemeliharaan",
      },
    ],
  },
  {
    path: "", //no url needed as this has submenu
    icon: <img src={calendar} className={`${iconClasses} inline`} />, // icon component
    name: "Pemeliharaan Aset", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/pemeliharaan/detail",
        icon: <ArrowRightCircleIcon className={submenuIconClasses} />,
        name: "Detail Pemeliharaan",
      },
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
    ],
  },
  {
    path: "/app/riwayat", // url
    icon: <img src={fileSearchIconPath} className={iconClasses} alt="File Search Icon" />, // icon component
    name: "Riwayat Aset", // name that appear in Sidebar
  }
  
  // {
  //   path: "", //no url needed as this has submenu
  //   icon: <DocumentTextIcon className={`${iconClasses} inline`} />, // icon component
  //   name: "Kelola Aset", // name that appear in Sidebar
  //   submenu: [
  //     {
  //       path: "/app/getting-started", // url
  //       icon: <DocumentTextIcon className={submenuIconClasses} />, // icon component
  //       name: "Getting Started", // name that appear in Sidebar
  //     },
  //     {
  //       path: "/app/features",
  //       icon: <TableCellsIcon className={submenuIconClasses} />,
  //       name: "Features",
  //     },
  //     {
  //       path: "/app/components",
  //       icon: <CodeBracketSquareIcon className={submenuIconClasses} />,
  //       name: "Components",
  //     },
  //   ],
  // },
];

export default routes;
