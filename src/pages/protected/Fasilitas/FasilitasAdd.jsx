import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import FasilitasAddPage from "../../../features/Fasilitas/FasilitasAdd";

function FasilitasAdd() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Fasilitas" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <FasilitasAddPage />
    </div>
  )
}

export default FasilitasAdd;
