import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import MembershipEditPage from "../../../features/Membership/MembershipEdit";

function MembershipEdit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Membership" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <MembershipEditPage />
    </div>
  )
}

export default MembershipEdit;
