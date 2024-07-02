import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import DetailVendor from "../../../features/Aset/detailVendor";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Kelola Aset" }));
  }, []);

  return <DetailVendor />;
}

export default InternalPage;
