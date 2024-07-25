import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import FasilitasEditPage from "../../../features/Fasilitas/FasilitasEdit";

function FasilitasEdit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Fasilitas" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <FasilitasEditPage />
    </div>
  )
}

export default FasilitasEdit;
