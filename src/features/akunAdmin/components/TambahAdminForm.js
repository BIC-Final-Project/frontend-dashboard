// src/features/akunAdmin/components/TambahAdminForm.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import AdminForm from "../index"; // Adjusted path to import from index.js

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Admin" }));
  }, [dispatch]);

  return <AdminForm />;
}

export default InternalPage;
