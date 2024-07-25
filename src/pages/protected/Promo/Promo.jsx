import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PromoPage from "../../../features/Promo";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Promo" }));
  }, []);

  return <PromoPage />;
}

export default InternalPage;
