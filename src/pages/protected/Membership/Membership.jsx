import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import MembershipPage from "../../../features/Membership";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Membership" }));
  }, []);

  return <MembershipPage />;
}

export default InternalPage;
