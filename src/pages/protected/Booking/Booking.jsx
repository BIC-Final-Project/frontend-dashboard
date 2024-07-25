import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import BookingPage from "../../../features/Booking";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Booking" }));
  }, []);

  return <BookingPage />;
}

export default InternalPage;
