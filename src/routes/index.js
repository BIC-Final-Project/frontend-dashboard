import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Charts = lazy(() => import("../pages/protected/Charts"));
const Leads = lazy(() => import("../pages/protected/Leads"));
const Integration = lazy(() => import("../pages/protected/Integration"));
const Calendar = lazy(() => import("../pages/protected/Calendar"));
const Team = lazy(() => import("../pages/protected/Team"));
const Transactions = lazy(() => import("../pages/protected/Transactions"));
const Bills = lazy(() => import("../pages/protected/Bills"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);
const GettingStarted = lazy(() => import("../pages/GettingStarted"));
const DocFeatures = lazy(() => import("../pages/DocFeatures"));
const DocComponents = lazy(() => import("../pages/DocComponents"));

const DetailAset = lazy(() => import("../pages/protected/Aset/DetailAset"));
const DetailVendor = lazy(() => import("../pages/protected/Aset/DetailVendor"));
const TambahAset = lazy(() => import("../pages/protected/Aset/TambahAset"));
const TambahVendor = lazy(() => import("../pages/protected/Aset/TambahVendor"));

const Perencanaan = lazy(() =>
  import("../pages/protected/Perencanaan/DetailPerencanaan")
);
const TambahPerencanaan = lazy(() =>
  import("../pages/protected/Perencanaan/TambahPerencanaan")
);

const Pemeliharaan = lazy(() =>
  import("../pages/protected/Pemeliharaan/DetailPemeliharaan")
);
const PemeliharaanTambah = lazy(() =>
  import("../pages/protected/Pemeliharaan/TambahPemeliharaan")
);
const PemeliharaanTambahDanger = lazy(() =>
  import("../pages/protected/Pemeliharaan/TambahPemeliharaanDanger")
);

const Riwayat = lazy(() => import("../pages/protected/Riwayat/DetailRiwayat"));

// Import the new admin form component
const TambahAdminForm = lazy(() =>
  import("../features/akunAdmin/components/TambahAdminForm")
);

const routes = [
  {
    path: "/dashboard", // the url
    component: Page404, // view rendered
  },
  {
    path: "/welcome", // the url
    component: Page404, // view rendered
  },
  {
    path: "/leads",
    component: Page404,
  },
  {
    path: "/asset/detail-aset",
    component: DetailAset,
  },
  {
    path: "/asset/detail-vendor",
    component: DetailVendor,
  },
  {
    path: "/asset/tambah-aset",
    component: TambahAset,
  },
  {
    path: "/asset/tambah-vendor",
    component: TambahVendor,
  },
  {
    path: "/perencanaan/detail",
    component: Perencanaan,
  },
  {
    path: "/perencanaan/pemeliharaan",
    component: TambahPerencanaan,
  },
  {
    path: "/pemeliharaan/detail",
    component: Pemeliharaan,
  },
  {
    path: "/pemeliharaan/tambah",
    component: PemeliharaanTambah,
  },
  {
    path: "/pemeliharaan/darurat",
    component: PemeliharaanTambahDanger,
  },
  {
    path: "/riwayat",
    component: Riwayat,
  },
  {
    path: "/settings-team",
    component: Page404,
  },
  {
    path: "/calendar",
    component: Page404,
  },
  {
    path: "/transactions",
    component: Page404,
  },
  {
    path: "/settings-profile",
    component: Page404,
  },
  {
    path: "/settings-billing",
    component: Page404,
  },
  {
    path: "/getting-started",
    component: Page404,
  },
  {
    path: "/features",
    component: Page404,
  },
  {
    path: "/components",
    component: Page404,
  },
  {
    path: "/integration",
    component: Page404,
  },
  {
    path: "/charts",
    component: Page404,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/admin/tambah", // the new admin form route
    component: TambahAdminForm, // view rendered
  },
];

export default routes;
