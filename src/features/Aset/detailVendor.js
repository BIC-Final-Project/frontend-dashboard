import { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput"; // Pastikan Anda mengimpor komponen CardInput
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import Button from "../../components/Button";
import DialogComponent from "../../components/Dialog/InformationDialog"; // Sesuaikan path dengan lokasi file DialogComponent

function DetailVendor() {
  const [vendors, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    type: "",
    id: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State untuk mengontrol tampilan DialogComponent
  const [editFormData, setEditFormData] = useState({
    namaVendor: "",
    noTlpVendor: "",
    alamat: "",
    jenisVendor: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchVendors(currentPage);
  }, [currentPage]);

  const fetchVendors = async (page) => {
    try {
      const pageSize = 10;
      const response = await axios.get(
        `URL_API?page=${page}&pageSize=${pageSize}`
      );
      const result = response.data;
      if (result.code === 0) {
        setVendors(result.data);
        const totalData = result.totalCount;
        setTotalPages(Math.ceil(totalData / pageSize));
      } else {
        console.error("API error:", result.info);
        loadDummyData();
      }
    } catch (error) {
      console.error("Axios error:", error.message);
      loadDummyData();
    }
  };

  const loadDummyData = () => {
    const fetchedVendors = [
      {
        id: 1,
        namaVendor: "PT. Sukses Makmur",
        noTlpVendor: "08123456789",
        alamat: "Jl. Raya No. 123, Jakarta",
        jenisVendor: "Elektronik",
      },
      {
        id: 2,
        namaVendor: "CV. Sejahtera",
        noTlpVendor: "08198765432",
        alamat: "Jl. Merdeka No. 456, Bandung",
        jenisVendor: "Peralatan Kantor",
      },
    ];
    setVendors(fetchedVendors);
    setTotalPages(1);
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
      namaVendor: vendor.namaVendor,
      noTlpVendor: vendor.noTlpVendor,
      alamat: vendor.alamat,
      jenisVendor: vendor.jenisVendor,
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
    setIsDialogOpen(false); // Fungsi untuk menutup DialogComponent
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post("URL_DELETE_VENDOR", { id: modal.id });
      if (response.status === 200) {
        setVendors(vendors.filter((vendor) => vendor.id !== modal.id));
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
      // Tambahkan logika untuk menyimpan data vendor yang diubah
      // Contoh panggilan API
      const response = await axios.post("URL_SAVE_VENDOR", editFormData);
      if (response.status === 200) {
        enqueueSnackbar("Vendor berhasil disimpan.", { variant: "success" });
        setIsDialogOpen(true); // Tampilkan dialog konfirmasi
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

  return (
    <>
      <TitleCard title="Detail Vendor" topMargin="mt-2">
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
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.namaVendor}</td>
                  <td>{vendor.noTlpVendor}</td>
                  <td>{vendor.alamat}</td>
                  <td>{vendor.jenisVendor}</td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDeleteVendor(vendor.id)}
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

      <div
        className={`modal ${isEditModalOpen ? "modal-open" : ""}`}
        onClick={closeEditModal}
      >
        <div
          className="modal-box relative max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <CardInput title="Identitas Vendor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="namaVendor" className="block font-medium">
                    Nama Vendor *
                  </label>
                  <input
                    type="text"
                    id="namaVendor"
                    name="namaVendor"
                    value={editFormData.namaVendor}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama Vendor"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="noTlpVendor" className="block font-medium">
                    No Tlp Vendor *
                  </label>
                  <input
                    type="text"
                    id="noTlpVendor"
                    name="noTlpVendor"
                    value={editFormData.noTlpVendor}
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
                  <label htmlFor="alamat" className="block font-medium">
                    Alamat *
                  </label>
                  <input
                    type="text"
                    id="alamat"
                    name="alamat"
                    value={editFormData.alamat}
                    onChange={handleInputChange}
                    placeholder="Masukkan Alamat"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="jenisVendor" className="block font-medium">
                    Jenis Vendor *
                  </label>
                  <input
                    type="text"
                    id="jenisVendor"
                    name="jenisVendor"
                    value={editFormData.jenisVendor}
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

      <DialogComponent isOpen={isDialogOpen} onClose={closeDialogComponent} />
    </>
  );
}

export default DetailVendor;
