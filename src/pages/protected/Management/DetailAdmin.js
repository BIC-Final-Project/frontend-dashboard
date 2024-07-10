import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import DetailAdmin from "../../../features/akunAdmin/index";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Detail Admin" }));
  }, []);

  return <DetailAdmin />;
}

export default InternalPage;
