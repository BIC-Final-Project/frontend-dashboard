import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PromoEditPage from "../../../features/Promo/PromoEdit";

function PromoEdit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Promo" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <PromoEditPage />
    </div>
  )
}

export default PromoEdit;
