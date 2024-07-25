import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PromoAddPage from "../../../features/Promo/PromoAdd";

function PromoAdd() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Promo" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <PromoAddPage />
    </div>
  )
}

export default PromoAdd;
