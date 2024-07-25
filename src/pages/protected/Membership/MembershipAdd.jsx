import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import MembershipAddPage from "../../../features/Membership/MembershipAdd";

function MembershipAdd() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Membership" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <MembershipAddPage />
    </div>
  )
}

export default MembershipAdd;
