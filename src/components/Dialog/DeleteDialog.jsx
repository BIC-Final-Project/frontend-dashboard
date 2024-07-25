import { TrashIcon } from "@heroicons/react/24/outline";
import ButtonPrimary from "../Button/ButtonPrimary";

const DeleteDialog = ({ onConfirm, isPending }) => {

  return (
    <dialog id="modal_delete" className="modal">
      <div className="modal-box w-full max-w-[498px] space-y-6 text-center">
        <div className="flex w-full justify-center">
          <div className="rounded-full bg-[#FEEBEB] p-5">
            <TrashIcon className="h-auto w-[38px] text-red-600" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold">Apakah Anda ingin menghapus?</h3>
          <p className="py-4 text-base">
            Jika Anda menghapus item ini maka tidak bisa dipulihkan kembali!
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <form method="dialog">
            {/* if there is a button, it will close the modal */}
            <ButtonPrimary
              variant="outline"
              className={"w-full border border-strokeColor "}
            >
              Batalkan
            </ButtonPrimary>
          </form>
          <ButtonPrimary onClick={onConfirm}>
            {isPending ? 
              <span className="fade-in loading loading-spinner loading-sm"></span> :
              'Konfirmasi'
            }
          </ButtonPrimary>
        </div>
      </div>
    </dialog>
  );
};

export default DeleteDialog;
