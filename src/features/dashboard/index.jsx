import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import DoughnutChart from "./components/DoughnutChart";
import { showNotification } from "../common/headerSlice";
import iconBooking from '../../assets/icons/total-booking.svg'
import iconFasilitas from '../../assets/icons/total-fasilitas.svg'
import iconMember from '../../assets/icons/total-member.svg'
import DashboardTransactionStats from "./components/DashboardTransactionStats";
import ButtonPrimary from "../../components/Button/ButtonPrimary";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import TableBookingDashboard from "./components/Table";
import { useGetTotalStats } from "../../hooks/services/api/Total/total";
import { useDeleteBooking, useGetAllBooking } from "../../hooks/services/api/Booking/booking";
import LoaderFetcher from "../../components/Loader/LoaderFetcher";
import DeleteDialog from "../../components/Dialog/DeleteDialog";
import { closeModalDelete } from "../../moduls/operational/helper/utils/handleModal";
import queryClient from "../../moduls/operational/helper/utils/queryClient";

const options = ['booking', 'membership']

function Dashboard() {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState('')
  const {data, isFetching} = useGetTotalStats()
  const {data: dataBooking, isFetching: isFetchingBooking } = useGetAllBooking(1, 10, '')
  const {mutate, isPending} = useDeleteBooking({
    onSuccess: () => {
        closeModalDelete()
        setSelectedId('')
        toast.success("Delete booking successfully");
        queryClient.invalidateQueries({ queryKey: ['allBooking'] })
    },
    onError: (error) => {
        toast.error(error.response?.data?.msg);
    }
  })

  const handleDelete = () => {
    mutate(selectedId)
  }

  useEffect(() => {
    // Cek apakah login berhasil
    const loginSuccess = localStorage.getItem("login_success");
    if (loginSuccess) {
      // Tampilkan notifikasi
      toast.success("Login Berhasil!");

      // Hapus status login berhasil dari localStorage
      localStorage.removeItem("login_success");
    }
  }, []);

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  return (
    <div className="grid grid-cols-1 auto-cols-min gap-10">
      {/* <ToastContainer /> */}
      {/** ---------------------- Select Period Content ------------------------- */}
      {/* <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} /> */}

      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">
        <DashboardTransactionStats 
          title='Total Transaksi' 
          desc='Gabungan Total Transaksi' 
          data={data?.totalTransaction || ''} 
          isFetching={isFetching} 
        />
        <DashboardStats 
          title='Total Booking' 
          desc='Booking Fasilitas' 
          icon={iconBooking} 
          data={data?.totalBooking || ''} 
          isFetching={isFetching} 
        />
        <DashboardStats 
          title='Total Member' 
          desc='Member Terdaftar' 
          icon={iconMember} 
          data={data?.totalMember || ''} 
          isFetching={isFetching} 
        />
        <DashboardStats 
          title='Total Fasilitas' 
          desc='Fasilitas Saat Ini'
          icon={iconFasilitas} 
          data={data?.totalFasilitas || ''} 
          isFetching={isFetching} 
        />
      </div>

      <div className="grid grid-cols-[repeat(2,1fr)_300px] gap-4">
        <label className="form-control w-full">
          <select className="select rounded-md border-borderGreen text-fontGrey text-base font-medium capitalize" name='transaksi' onChange={''} value={''}>
            <option disabled value=''>Pilih jenis transaksi</option>
              {options.map((item, i) => <option key={i} value={item} className='capitalize'>{item}</option>)}
          </select>
        </label>
        <Flatpickr        
          value={''}
          options={{
            dateFormat: "d/m/Y",
            disableMobile: true
          }}
          placeholder='Pilih Tanggal'
          // onChange={''}
          className='flatpicker rounded-md w-full border-[1px] placeholder:text-fontGrey !text-fontGrey border-borderGreen bg-white px-4 py-2.5 font-medium text-base cursor-pointer'
          />
          <ButtonPrimary type='button'>Cetak Rekap Transaksi</ButtonPrimary>
      </div>

      <div className="bg-white px-4 py-6 rounded-md">
      {isFetchingBooking ? 
        <LoaderFetcher /> :
        <TableBookingDashboard 
          data={dataBooking?.data || []} 
          setSelectedId={setSelectedId}
          isPending={isPending}
        />
      }
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <LineChart />
        <BarChart />
      </div> */}

      {/** ---------------------- Different stats content 2 ------------------------- */}
      <div className="grid grid-cols-1 gap-6">
        {/* <AmountStats /> */}
        <PageStats />
      </div>

      {/** ---------------------- User source channels table  ------------------------- */}
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div>

      {/* Delete Modal */}
      <DeleteDialog
        isPending={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Dashboard;
