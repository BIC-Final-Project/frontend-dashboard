import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../../components/Button";
import DialogComponent from "../../components/Dialog/InformationDialog";
import BASE_URL_API from "../../config";
import { fetchData, postData, updateData, deleteData } from "../../utils/utils";

function DetailVendor() {
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    type: "",
    id: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nama_vendor: "",
    telp_vendor: "",
    alamat_vendor: "",
    jenis_vendor: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [searchQuery]);

  const fetchVendors = async () => {
    try {
      const response = await fetchData(
        `${BASE_URL_API}api/v1/manage-aset/vendor`
      );
      if (response && response.data) {
        const vendorsWithIndex = response.data.map((vendor, index) => ({
          ...vendor,
          index: index,
        }));

        const sortedVendors = vendorsWithIndex.sort(
          (a, b) => b.index - a.index
        );

        setAllVendors(sortedVendors);
        setVendors(sortedVendors);
        setTotalPages(Math.ceil(sortedVendors.length / 10));
      } else {
        console.error("API error:", response.info);
      }
    } catch (error) {
      console.error("Axios error:", error.message);
    }
  };

  const filterVendors = () => {
    const filteredVendors = allVendors.filter((vendor) =>
      vendor.nama_vendor.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setVendors(filteredVendors);
    setTotalPages(Math.ceil(filteredVendors.length / 10));
    setCurrentPage(1);
  };

  const handleDeleteVendor = (id) => {
    setModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus vendor ini?",
      type: "delete",
      id,
    });
  };

  const handleEditVendor = (vendor) => {
    setEditFormData({
      _id: vendor._id,
      nama_vendor: vendor.nama_vendor,
      telp_vendor: vendor.telp_vendor,
      alamat_vendor: vendor.alamat_vendor,
      jenis_vendor: vendor.jenis_vendor,
    });
    setIsEditModalOpen(true);
  };

  const closeDialog = () => {
    setModal({ isOpen: false, id: null });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeDialogComponent = () => {
    setIsDialogOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteData(
        `${BASE_URL_API}api/v1/manage-aset/vendor/${modal.id}`
      );
      if (response.status === 200) {
        setVendors(vendors.filter((vendor) => vendor._id !== modal.id));
        setAllVendors(allVendors.filter((vendor) => vendor._id !== modal.id));
        enqueueSnackbar("Vendor berhasil dihapus.", { variant: "success" });
      } else {
        enqueueSnackbar("Gagal menghapus vendor.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Gagal menghapus vendor.", { variant: "error" });
    }
    closeDialog();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDialogOpen(true);
    try {
      const response = await updateData(
        `${BASE_URL_API}api/v1/manage-aset/vendor/${editFormData._id}`,
        editFormData
      );
      if (response.status === 200) {
        enqueueSnackbar("Vendor berhasil disimpan.", { variant: "success" });
        setIsDialogOpen(true);
        fetchVendors();
      } else {
        enqueueSnackbar("Gagal menyimpan vendor.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Gagal menyimpan vendor.", { variant: "error" });
    }
    closeEditModal();
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const paginatedVendors = vendors.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <>
      <TitleCard title="Detail Vendor" topMargin="mt-2">
        <div className="mb-4 flex justify-between items-center relative">
          <input
            type="text"
            placeholder="Cari Vendor"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Vendor</th>
                <th>No Tlp Vendor</th>
                <th>Alamat</th>
                <th>Jenis Vendor</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.nama_vendor}</td>
                  <td>{vendor.telp_vendor}</td>
                  <td>{vendor.alamat_vendor}</td>
                  <td>{vendor.jenis_vendor}</td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDeleteVendor(vendor._id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEditVendor(vendor)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <button
              className="btn"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn ml-5"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </TitleCard>
      <ConfirmDialog
        isOpen={modal.isOpen}
        onClose={closeDialog}
        onConfirm={confirmDelete}
      />

      {isEditModalOpen && (
        <div className="modal modal-open" onClick={closeEditModal}>
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
            onClick={closeEditModal}
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
          <div
            className="modal-box relative max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <CardInput title="Identitas Vendor">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nama_vendor" className="block font-medium">
                      Nama Vendor *
                    </label>
                    <input
                      type="text"
                      id="nama_vendor"
                      name="nama_vendor"
                      value={editFormData.nama_vendor}
                      onChange={handleInputChange}
                      placeholder="Masukkan Nama Vendor"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="telp_vendor" className="block font-medium">
                      No Tlp Vendor *
                    </label>
                    <input
                      type="text"
                      id="telp_vendor"
                      name="telp_vendor"
                      value={editFormData.telp_vendor}
                      onChange={handleInputChange}
                      placeholder="Masukkan No Tlp Vendor"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </CardInput>
              <CardInput title="Detail Vendor">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="alamat_vendor"
                      className="block font-medium"
                    >
                      Alamat *
                    </label>
                    <input
                      type="text"
                      id="alamat_vendor"
                      name="alamat_vendor"
                      value={editFormData.alamat_vendor}
                      onChange={handleInputChange}
                      placeholder="Masukkan Alamat"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="jenis_vendor" className="block font-medium">
                      Jenis Vendor *
                    </label>
                    <input
                      type="text"
                      id="jenis_vendor"
                      name="jenis_vendor"
                      value={editFormData.jenis_vendor}
                      onChange={handleInputChange}
                      placeholder="Masukkan Jenis Vendor"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </CardInput>
              <div className="flex justify-end mt-4">
                <Button label="Simpan Vendor" onClick={handleSubmit} />
              </div>
            </form>
          </div>
        </div>
      )}

      <DialogComponent isOpen={isDialogOpen} onClose={closeDialogComponent} />
    </>
  );
}

export default DetailVendor;
