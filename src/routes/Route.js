import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
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
const TambahAdminForm = lazy(() =>
  import("../pages/protected/Management/TambahAdminForm")
);
const DetailAdmin = lazy(() =>
  import("../pages/protected/Management/DetailAdmin")
);

const RouteSuper = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/asset">
        <Route path="detail-aset" element={<DetailAset />} />
        <Route path="detail-vendor" element={<DetailVendor />} />
        <Route path="tambah-aset" element={<TambahAset />} />
        <Route path="tambah-vendor" element={<TambahVendor />} />
      </Route>
      <Route path="/perencanaan">
        <Route path="detail" element={<Perencanaan />} />
        <Route path="pemeliharaan" element={<TambahPerencanaan />} />
      </Route>
      <Route path="/pemeliharaan">
        <Route path="detail" element={<Pemeliharaan />} />
        <Route path="tambah" element={<PemeliharaanTambah />} />
        <Route path="darurat" element={<PemeliharaanTambahDanger />} />
      </Route>
      <Route path="/riwayat" element={<Riwayat />} />
      <Route path="/admin">
        <Route path="tambah" element={<TambahAdminForm />} />
        <Route path="detail" element={<DetailAdmin />} />
      </Route>
    </Routes>
  );
};

export default RouteSuper;
