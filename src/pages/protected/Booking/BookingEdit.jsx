import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import BookingEditPage from "../../../features/Booking/BookingEdit";

function BookingEdit() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Edit Booking" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <BookingEditPage />
    </div>
  )
}

export default BookingEdit;
