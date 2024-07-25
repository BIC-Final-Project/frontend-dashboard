import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PaketMembershipAddPage from "../../../features/PaketMembership/PaketMembershipAdd";
import PaketMembershipEditPage from "../../../features/PaketMembership/PaketMembershipEdit";

function PaketMembershipEdit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Paket Membership" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <PaketMembershipEditPage />
    </div>
  )
}

export default PaketMembershipEdit;
