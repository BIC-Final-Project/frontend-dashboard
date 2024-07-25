import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import ButtonPrimary from "../../components/Button/ButtonPrimary";
import Table from "./components/Table";
import SectionTitle from "../../components/SectionTitle.jsx";
import LoaderFetcher from "../../components/Loader/LoaderFetcher.jsx";
import { useDeleteFasilitas, useGetAllFasilitas } from "../../hooks/services/api/Fasilitas/fasilitas";
import { closeModalDelete } from "../../moduls/operational/helper/utils/handleModal.js";
import { toast } from "react-toastify";
import queryClient from "../../moduls/operational/helper/utils/queryClient.js";
import DeleteDialog from "../../components/Dialog/DeleteDialog.jsx";

function FasilitasPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState('');
  const page = searchParams.get('page') || 1
  const limit = searchParams.get('limit') || 10
  const { data, isFetching } = useGetAllFasilitas(page, limit)
  const {mutate, isPending} = useDeleteFasilitas({
    onSuccess: () => {
        closeModalDelete()
        setSelectedId('')
        toast.success("Delete fasilitas successfully");
        queryClient.invalidateQueries({ queryKey: ['allFasilitas'] })
    },
    onError: (error) => {
        toast.error(error.response?.data?.msg);
    }
})

  const handleDelete = () => {
    mutate(selectedId)
  }

  return (
    <SectionTitle title={'List Fasilitas'}>
        <div className="space-y-6">
            <div className="grid grid-cols-1">
                {/* <label className="input input-bordered flex w-80 items-center gap-2">
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
                    <input type="text" className="grow " placeholder="Search" />
                </label> */}
                <div className="flex items-center gap-3 justify-self-end">
                    <ButtonPrimary onClick={() => navigate("/app/fasilitas/tambah")} variant="primary" className="rounded-md !p-[10px_16px]">
                        <PlusIcon className="h-6 w-6" /> Tambah Fasilitas
                    </ButtonPrimary>
                </div>
            </div>

            {isFetching ? 
            <LoaderFetcher /> :
            <div className="">
                <div className="w-full overflow-x-auto">
                <Table
                    path='fasilitas'
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

export default FasilitasPage;
