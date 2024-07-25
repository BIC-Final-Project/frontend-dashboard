import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import PaketMembershipAddPage from "../../../features/PaketMembership/PaketMembershipAdd";

function PaketMembershipAdd() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Paket Membership" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <PaketMembershipAddPage />
    </div>
  )
}

export default PaketMembershipAdd;
