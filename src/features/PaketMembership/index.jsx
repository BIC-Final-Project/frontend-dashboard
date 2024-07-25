import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate, useSearchParams } from "react-router-dom";
import ButtonPrimary from "../../components/Button/ButtonPrimary";
import SectionTitle from "../../components/SectionTitle.jsx";
import LoaderFetcher from "../../components/Loader/LoaderFetcher.jsx";
import { useDeletePaketMembership, useGetAllMembershipType } from "../../hooks/services/api/PaketMembership/paketMembership.js";
import CardPaketMembership from "./components/CardPaketMembership.jsx";
import { closeModalDelete } from "../../moduls/operational/helper/utils/handleModal.js";
import { toast } from "react-toastify";
import queryClient from "../../moduls/operational/helper/utils/queryClient.js";
import DeleteDialog from "../../components/Dialog/DeleteDialog.jsx";

function PaketMembershipPage() {
  const navigate = useNavigate();
  const [selectedPaket, setSelectedPaket] = useState('Platinum')
  const { data, isFetching } = useGetAllMembershipType(selectedPaket)
  const [selectedId, setSelectedId] = useState('');
  const {mutate, isPending} = useDeletePaketMembership({
        onSuccess: () => {
            closeModalDelete()
            setSelectedId('')
            toast.success("Delete paket membership successfully");
            queryClient.invalidateQueries({ queryKey: ['allMembershipType'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.msg);
        }
    })

  const handleDelete = () => {
    mutate(selectedId)
  }

  return (
    <SectionTitle title={'List Membership'}>
        <div className="space-y-6">
            <div className="flex justify-between">
                <select className="select select-bordered text-lg font-medium capitalize" onChange={(e) => setSelectedPaket(e.target.value)} value={selectedPaket}>
                    <option disabled value=''>Pilih jenis paket</option>
                    {['Platinum', 'Gold', 'Silver'].map((item, i) => <option key={i} value={item}className='capitalize'>{item}</option>)}
                </select>
                <div className="flex items-center gap-3">
                    <ButtonPrimary onClick={() => navigate("/app/paket-membership/tambah")} variant="primary" className="rounded-md !p-[10px_16px]">
                        <PlusIcon className="h-6 w-6" /> Tambah Paket Membership
                    </ButtonPrimary>
                </div>
            </div>

            {isFetching ? 
            <LoaderFetcher /> :
            <div className="">
                <div className="w-full grid grid-cols-[repeat(3,minmax(300px,1fr))] auto-rows-min gap-10">
                {data.map((item, i) => {
                    return (
                        <CardPaketMembership {...item} key={i} setSelectedId={setSelectedId} />
                    )
                })}
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

export default PaketMembershipPage;
