import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import { TrashIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../../components/Button";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import DialogComponent from "../../components/Dialog/InformationDialog";
import BASE_URL_API from "../../config";
import { fetchData, postData, updateData, deleteData } from "../../utils/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

function DetailVendor() {
  const { enqueueSnackbar } = useSnackbar();
  const tableRef = useRef();
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
    _id: "",
    nama_vendor: "",
    telp_vendor: "",
    alamat_vendor: "",
    jenis_vendor: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const role = JSON.parse(localStorage.getItem("user"));

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
          index,
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

  const closeDialog = () => setModal({ isOpen: false, id: null });

  const closeEditModal = () => setIsEditModalOpen(false);

  const closeDialogComponent = () => setIsDialogOpen(false);

  const confirmDelete = async () => {
    try {
      const response = await deleteData(
        `${BASE_URL_API}api/v1/manage-aset/vendor/${modal.id}`
      );
      if (response.status === 200) {
        const updatedVendors = vendors.filter(
          (vendor) => vendor._id !== modal.id
        );
        setVendors(updatedVendors);
        setAllVendors(updatedVendors);
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

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Nama Vendor", "No Tlp Vendor", "Alamat", "Jenis Vendor"]],
      body: allVendors.map((vendor) => [
        vendor.nama_vendor,
        vendor.telp_vendor,
        vendor.alamat_vendor,
        vendor.jenis_vendor,
      ]),
    });
    doc.save("vendors.pdf");
  };

  const paginatedVendors = vendors.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

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
          <Button label="Cetak Data" onClick={handlePrint} className="ml-2" />
        </div>
        <div className="overflow-x-auto w-full">
          {vendors.length === 0 ? (
            <div className="text-center py-4">
              Tidak ada data vendor yang ditemukan.
            </div>
          ) : (
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
                      {role.role !== "admin aset" && (
                        <button
                          className="btn btn-square btn-ghost"
                          onClick={() => handleDeleteVendor(vendor._id)}
                        >
                          <TrashIcon className="w-5 h-5 text-red-500" />
                        </button>
                      )}
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => handleEditVendor(vendor)}
                      >
                        <PencilIcon className="w-5 h-5 text-yellow-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <button
              className="text-green-900 border border-green-900 hover:bg-green-100 px-4 py-2 rounded w-28"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="bg-[#3A5913] text-white hover:bg-[#293F0D] px-4 py-2 rounded ml-2 w-28"
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
                      className="input input-bordered w-full"
                      value={editFormData.nama_vendor}
                      onChange={handleInputChange}
                      required
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
                      className="input input-bordered w-full"
                      value={editFormData.telp_vendor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="alamat_vendor"
                      className="block font-medium"
                    >
                      Alamat Vendor *
                    </label>
                    <input
                      type="text"
                      id="alamat_vendor"
                      name="alamat_vendor"
                      className="input input-bordered w-full"
                      value={editFormData.alamat_vendor}
                      onChange={handleInputChange}
                      required
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
                      className="input input-bordered w-full"
                      value={editFormData.jenis_vendor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </CardInput>
              <div className="flex justify-end mt-4">
                <Button type="submit" label="Simpan" />
              </div>
            </form>
          </div>
        </div>
      )}
      <DialogComponent
        isOpen={isDialogOpen}
        onClose={closeDialogComponent}
        title="Information"
        message="Proses sedang dilakukan. Harap tunggu sebentar."
      />
    </>
  );
}

export default DetailVendor;
