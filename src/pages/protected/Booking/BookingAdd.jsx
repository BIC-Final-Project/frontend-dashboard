import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../features/common/headerSlice";
import BookingAddPage from "../../../features/Booking/BookingAdd";

function BookingAdd() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Tambah Booking" }));
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8">
        <BookingAddPage />
    </div>
  )
}

export default BookingAdd;
