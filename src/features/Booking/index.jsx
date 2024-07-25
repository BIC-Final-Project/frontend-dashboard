import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import ButtonPrimary from "../../components/Button/ButtonPrimary";
import Table from "./components/Table";
import SectionTitle from "../../components/SectionTitle.jsx";
import { useDeleteBooking, useGetAllBooking } from "../../hooks/services/api/Booking/booking.js";
import LoaderFetcher from "../../components/Loader/LoaderFetcher.jsx";
import DeleteDialog from "../../components/Dialog/DeleteDialog.jsx";
import { closeModalDelete } from "../../moduls/operational/helper/utils/handleModal.js";
import { toast } from "react-toastify";
import queryClient from "../../moduls/operational/helper/utils/queryClient.js";

function BookingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState('');
  const page = searchParams.get('page') || 1
  const limit = searchParams.get('limit') || 10
  const { data, isFetching } = useGetAllBooking(page, limit, search)
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

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

  const handleDelete = () => {
    mutate(selectedId)
  }

  return (
    <SectionTitle title={'List Booking'}>
        <div className="space-y-6">
            <div className="flex justify-between">
                <label className="input input-bordered flex w-80 items-center gap-2">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
                    <input type="text" className="grow " placeholder="Search" onChange={handleSearch} />
                </label>
                <div className="flex items-center gap-3">
                    <ButtonPrimary onClick={() => navigate("/app/booking/tambah")} variant="primary" className="rounded-md !p-[10px_16px]">
                        <PlusIcon className="h-6 w-6" /> Tambah Booking
                    </ButtonPrimary>
                </div>
            </div>

            {isFetching ? 
            <LoaderFetcher /> :
            <div className="">
                <div className="w-full overflow-x-auto">
                <Table
                    path='booking'
                    data={data?.data || []}
                    pagination={data?.pagination || {}}
                    setSelectedId={setSelectedId}
                />
                </div>
            </div>
            }

            {/* Delete Modal */}
            <DeleteDialog
                isPending={isPending}
                onConfirm={handleDelete}
            />
        </div>
    </SectionTitle>
  );
}

export default BookingPage;
