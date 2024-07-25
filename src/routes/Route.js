import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Booking = lazy(() => import("../pages/protected/Booking/Booking"));
const BookingAdd = lazy(() => import("../pages/protected/Booking/BookingAdd"));
const BookingEdit = lazy(() => import("../pages/protected/Booking/BookingEdit"));
const BookingView = lazy(() => import("../pages/protected/Booking/BookingView"));

const Fasilitas = lazy(() => import("../pages/protected/Fasilitas/Fasilitas"));
const FasilitasAdd = lazy(() => import("../pages/protected/Fasilitas/FasilitasAdd"));
const FasilitasEdit = lazy(() => import("../pages/protected/Fasilitas/FasilitasEdit"));

const Membership = lazy(() => import("../pages/protected/Membership/Membership"));
const MembershipAdd = lazy(() => import("../pages/protected/Membership/MembershipAdd"));
const MembershipEdit = lazy(() => import("../pages/protected/Membership/MembershipEdit"));
const MembershipView = lazy(() => import("../pages/protected/Membership/MembershipView"));

const PaketMembership = lazy(() => import("../pages/protected/PaketMembership/PaketMembership"));
const PaketMembershipAdd = lazy(() => import("../pages/protected/PaketMembership/PaketMembershipAdd"));
const PaketMembershipEdit = lazy(() => import("../pages/protected/PaketMembership/PaketMembershipEdit"));
const Promo = lazy(() => import("../pages/protected/Promo/Promo"));
const PromoAdd = lazy(() => import("../pages/protected/Promo/PromoAdd"));
const PromoEdit = lazy(() => import("../pages/protected/Promo/PromoEdit"));

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

      {/* Operasional */}
      <Route path="/booking">
        <Route index element={<Booking />} />
        <Route path="tambah" element={<BookingAdd />} />
        <Route path="edit/:id" element={<BookingEdit />} />
        <Route path="view/:id" element={<BookingView />} />
        <Route path="cari" />
      </Route>
      <Route path="/membership">
        <Route index element={<Membership />} />
        <Route path="tambah" element={<MembershipAdd />} />
        <Route path="edit/:id" element={<MembershipEdit />} />
        <Route path="view/:id" element={<MembershipView />} />
      </Route>
      <Route path="paket-membership" >
        <Route index element={<PaketMembership />} />
        <Route path="tambah" element={<PaketMembershipAdd />} />
        <Route path="edit/:id" element={<PaketMembershipEdit />} />
      </Route>
      <Route path="fasilitas" >
        <Route index element={<Fasilitas />} />
        <Route path="tambah" element={<FasilitasAdd />} />
        <Route path="edit/:id" element={<FasilitasEdit />} />
      </Route>
      <Route path="promo" >
        <Route index element={<Promo />} />
        <Route path="tambah" element={<PromoAdd />} />
        <Route path="edit/:id" element={<PromoEdit />} />
      </Route>

      {/* Aset */}
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
