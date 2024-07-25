import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PaketMembershipPage from "../../../features/PaketMembership";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Paket Membership" }));
  }, []);

  return <PaketMembershipPage />;
}

export default InternalPage;
