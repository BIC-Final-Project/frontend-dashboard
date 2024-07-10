import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import AdminForm from "../../../features/akunAdmin/TambahAdmin"; // Pastikan jalur ini benar

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Detail Admin" }));
  }, [dispatch]);

  return <AdminForm />;
}

export default InternalPage;
