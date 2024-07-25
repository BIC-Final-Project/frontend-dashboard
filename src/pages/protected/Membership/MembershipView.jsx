import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import MembershipViewPage from "../../../features/Membership/MembershipView";

function MembershipEdit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Detail Membership" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <MembershipViewPage />
    </div>
  )
}

export default MembershipEdit;
