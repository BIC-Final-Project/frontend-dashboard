import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import BookingViewPage from "../../../features/Booking/BookingView";

function BookingEdit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Detail Booking" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <BookingViewPage />
    </div>
  )
}

export default BookingEdit;
