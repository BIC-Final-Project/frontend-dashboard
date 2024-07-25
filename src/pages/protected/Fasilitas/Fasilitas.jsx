import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import FasilitasPage from "../../../features/Fasilitas";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Fasilitas" }));
  }, []);

  return <FasilitasPage />;
}

export default InternalPage;
