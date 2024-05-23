import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput"; // Pastikan Anda mengimpor komponen CardInput
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";

function PemeliharaanAset() {
  const [assets, setAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    type: "",
    id: null,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    namaAset: "",
    kondisiAset: "",
    usiaAsetSaatIni: "",
    maksimalUsiaAset: "",
    tahunProduksi: "",
    deskripsiKerusakan: "",
    tanggalPemeliharaanAset: new Date(),
    statusPemeliharaan: "",
    vendorPengelola: "",
    infoVendor: "",
    namaPenanggungJawab: "",
    deskripsiPemeliharaan: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssets(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchAssets = async (page, query) => {
    try {
      const pageSize = 10;
      const response = await axios.get(
        `URL_API?page=${page}&pageSize=${pageSize}&search=${query}`
      );
      const result = response.data;
      if (result.code === 0) {
        setAssets(result.data);
        setTotalPages(Math.ceil(result.totalCount / pageSize));
      } else {
        throw new Error("API error: " + result.info);
      }
    } catch (error) {
      console.error("Fetching error:", error.message);
      loadDummyData();
    }
  };

  const loadDummyData = () => {
    setAssets([
      {
        id: 1,
        name: "Laptop HP",
        maintenanceDate: "2023-05-01",
        vendor: "HP Inc.",
        responsiblePerson: "John Doe",
        condition: "Good",
        status: "Completed",
      },
      {
        id: 2,
        name: "Printer Epson",
        maintenanceDate: "2023-04-15",
        vendor: "Epson",
        responsiblePerson: "Jane Doe",
        condition: "Needs Repair",
        status: "Pending",
      },
    ]);
    setTotalPages(1);
  };

  const handleDeleteAsset = (id) => {
    setModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus aset ini?",
      type: "delete",
      id,
    });
  };

  const handleEditAsset = (asset) => {
    setEditFormData({
      namaAset: asset.name,
      kondisiAset: asset.condition,
      usiaAsetSaatIni: "", // Sesuaikan dengan data yang ada
      maksimalUsiaAset: "", // Sesuaikan dengan data yang ada
      tahunProduksi: "", // Sesuaikan dengan data yang ada
      deskripsiKerusakan: "", // Sesuaikan dengan data yang ada
      tanggalPemeliharaanAset: new Date(asset.maintenanceDate),
      statusPemeliharaan: asset.status,
      vendorPengelola: asset.vendor,
      infoVendor: "", // Sesuaikan dengan data yang ada
      namaPenanggungJawab: asset.responsiblePerson,
      deskripsiPemeliharaan: "", // Sesuaikan dengan data yang ada
    });
    setIsEditModalOpen(true);
  };

  const closeDialog = () => {
    setModal({ isOpen: false, id: null });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.post("URL_DELETE_ASSET", { id: modal.id });
      if (response.status === 200) {
        setAssets(assets.filter((asset) => asset.id !== modal.id));
        enqueueSnackbar("Aset berhasil dihapus.", { variant: "success" });
      } else {
        enqueueSnackbar("Gagal menghapus aset.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Gagal menghapus aset.", { variant: "error" });
    }
    closeDialog();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDateChange = (date) => {
    setEditFormData({ ...editFormData, tanggalPemeliharaanAset: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tambahkan logika untuk menyimpan data aset yang diubah
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <TitleCard title="Pemeliharaan Aset" topMargin="mt-2">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari aset..."
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Aset</th>
                <th>Tgl Pemeliharaan</th>
                <th>Vendor Pengelola</th>
                <th>Penanggung Jawab</th>
                <th>Kondisi Aset</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.name}</td>
                  <td>{moment(asset.maintenanceDate).format("DD MMM YYYY")}</td>
                  <td>{asset.vendor}</td>
                  <td>{asset.responsiblePerson}</td>
                  <td>{asset.condition}</td>
                  <td>{asset.status}</td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEditAsset(asset)}
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
            <CardInput title="Identitas Aset">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="namaAset" className="block font-medium">
                    Nama Aset *
                  </label>
                  <select
                    id="namaAset"
                    name="namaAset"
                    value={editFormData.namaAset}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option>Pilih Aset yang akan melakukan pemeliharaan</option>
                    {/* Tambahkan opsi dinamis dari backend atau nilai statis */}
                  </select>
                </div>
                <div>
                  <label htmlFor="kondisiAset" className="block font-medium">
                    Kondisi Aset *
                  </label>
                  <select
                    id="kondisiAset"
                    name="kondisiAset"
                    value={editFormData.kondisiAset}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option>Pilih jenis kondisi aset</option>
                    <option value="Baik">Baik</option>
                    <option value="Rusak">Rusak</option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Detail Aset" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="usiaAsetSaatIni" className="block font-medium">
                    Usia Aset Saat Ini *
                  </label>
                  <input
                    type="text"
                    id="usiaAsetSaatIni"
                    name="usiaAsetSaatIni"
                    value={editFormData.usiaAsetSaatIni}
                    onChange={handleInputChange}
                    placeholder="Masukkan usia aset saat ini"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="maksimalUsiaAset" className="block font-medium">
                    Maksimal Usia Aset *
                  </label>
                  <input
                    type="text"
                    id="maksimalUsiaAset"
                    name="maksimalUsiaAset"
                    value={editFormData.maksimalUsiaAset}
                    onChange={handleInputChange}
                    placeholder="Masukkan maksimal usia aset"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="tahunProduksi" className="block font-medium">
                    Tahun Produksi
                  </label>
                  <input
                    type="text"
                    id="tahunProduksi"
                    name="tahunProduksi"
                    value={editFormData.tahunProduksi}
                    onChange={handleInputChange}
                    placeholder="Masukkan tahun produksi"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="deskripsiKerusakan" className="block font-medium">
                    Deskripsi Kerusakan
                  </label>
                  <input
                    type="text"
                    id="deskripsiKerusakan"
                    name="deskripsiKerusakan"
                    value={editFormData.deskripsiKerusakan}
                    onChange={handleInputChange}
                    placeholder="Masukkan Deskripsi Kerusakan"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalPemeliharaanAset"
                    className="block font-medium"
                  >
                    Tgl Pemeliharaan Aset *
                  </label>
                  <DatePicker
                    selected={editFormData.tanggalPemeliharaanAset}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    wrapperClassName="date-picker"
                    dateFormat="MMMM d, yyyy"
                  />
                </div>
                <div>
                  <label htmlFor="statusPemeliharaan" className="block font-medium">
                    Status Pemeliharaan
                  </label>
                  <select
                    id="statusPemeliharaan"
                    name="statusPemeliharaan"
                    value={editFormData.statusPemeliharaan}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option>Pilih status pemeliharaan</option>
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Dilaksanakan">Dilaksanakan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Informasi Vendor" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vendorPengelola" className="block font-medium">
                    Vendor Pengelola *
                  </label>
                  <select
                    id="vendorPengelola"
                    name="vendorPengelola"
                    value={editFormData.vendorPengelola}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option>Pilih vendor</option>
                    <option value="Vendor1">Vendor 1</option>
                    <option value="Vendor2">Vendor 2</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="infoVendor" className="block font-medium">
                    Informasi vendor / no telepon
                  </label>
                  <input
                    type="text"
                    id="infoVendor"
                    name="infoVendor"
                    value={editFormData.infoVendor}
                    onChange={handleInputChange}
                    placeholder="Masukkan informasi vendor"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </CardInput>

            <CardInput title="Informasi Pemeliharaan" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="namaPenanggungJawab"
                    className="block font-medium"
                  >
                    Nama Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    id="namaPenanggungJawab"
                    name="namaPenanggungJawab"
                    value={editFormData.namaPenanggungJawab}
                    onChange={handleInputChange}
                    placeholder="Nama penanggung jawab"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="deskripsiPemeliharaan"
                    className="block font-medium"
                  >
                    Deskripsi Pemeliharaan
                  </label>
                  <input
                    type="text"
                    id="deskripsiPemeliharaan"
                    name="deskripsiPemeliharaan"
                    value={editFormData.deskripsiPemeliharaan}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi pemeliharaan"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </CardInput>

            <div className="flex justify-end mt-4">
            <Button
            label="Simpan"
            onClick={() => {}}
          />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PemeliharaanAset;
