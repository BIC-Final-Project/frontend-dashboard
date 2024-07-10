import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { fetchData, deleteData } from "../../utils/utils";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/rencana`;
const ASET_API_URL = `${BASE_URL_API}api/v1/manage-aset/aset`;
const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`;
const ITEMS_PER_PAGE = 10;

function DesignAset() {
  const [assets, setAssets] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
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
  const [editFormData, setEditFormData] = useState({
    nama_aset: "",
    kondisiAset: "",
    usiaAsetSaatIni: "",
    maksimalUsiaAset: "",
    tahun_produksi: "",
    deskripsiKerusakan: "",
    tanggalRencanaPemeliharaan: new Date(),
    statusPerencanaan: "",
    vendorPengelola: "",
    infoVendor: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVendors();
    fetchAssets();
    fetchAllAssets();
  }, [searchQuery]);

  const fetchVendors = async () => {
    try {
      const response = await fetchData(VENDOR_API_URL);
      setVendors(response.data);
    } catch (error) {
      console.error("Fetching vendors error:", error.message);
    }
  };

  const fetchAllAssets = async () => {
    try {
      const response = await fetchData(ASET_API_URL);
      setAllAssets(response.data);
    } catch (error) {
      console.error("Fetching all assets error:", error.message);
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await fetchData(API_URL);
      const result = await Promise.all(
        response.data.map(async (item) => {
          const assetResponse = await fetchData(
            `${ASET_API_URL}/${item.aset_id}`
          );
          return {
            ...item,
            nama_vendor: item.vendor?.nama_vendor,
            nama_aset: assetResponse.data?.nama_aset,
            tahun_produksi: assetResponse.data?.tahun_produksi,
          };
        })
      );
      setAssets(result.reverse());
      setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Fetching error:", error.message);
      loadDummyData();
    }
  };

  const loadDummyData = () => {
    const dummyAssets = [
      {
        _id: 1,
        name: "Laptop HP",
        tgl_perencanaan: "2023-05-01",
        vendor_id: "1",
        kondisi_aset: "Baik",
        usia_aset: "2 Bulan",
        status_aset: "Aktif",
      },
      {
        _id: 2,
        name: "Printer Epson",
        tgl_perencanaan: "2023-04-15",
        vendor_id: "2",
        kondisi_aset: "Perlu Perbaikan",
        usia_aset: "4 Bulan",
        status_aset: "Non-Aktif",
      },
    ];
    setAssets(dummyAssets);
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

  const handleEditAsset = async (asset) => {
    try {
      const assetResponse = await fetchData(`${ASET_API_URL}/${asset.aset_id}`);
      setEditFormData({
        _id: asset._id,
        nama_aset: asset.aset_id,
        kondisiAset: asset.kondisi_aset,
        usiaAsetSaatIni: asset.usia_aset,
        maksimalUsiaAset: asset.maks_usia_aset,
        tahun_produksi: assetResponse.data?.tahun_produksi || "",
        deskripsiKerusakan: asset.deskripsi,
        tanggalRencanaPemeliharaan: new Date(asset.tgl_perencanaan),
        statusPerencanaan: asset.status_aset,
        vendorPengelola: assetResponse.data.vendor?._id || "",
        infoVendor: assetResponse.data.vendor?.telp_vendor || "",
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Fetching asset error:", error.message);
    }
  };

  const closeDialog = () => {
    setModal({ isOpen: false, id: null });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteData(`${API_URL}/${modal.id}`);
      if (response) {
        fetchAssets(); // Fetch updated data after deletion
        enqueueSnackbar("Aset berhasil dihapus.", { variant: "success" });
      } else {
        enqueueSnackbar("Gagal menghapus aset.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Gagal menghapus aset.", { variant: "error" });
    }
    closeDialog();
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });

    // Fetch vendor data when nama_aset is changed
    if (name === "nama_aset" && value) {
      try {
        const assetResponse = await fetchData(`${ASET_API_URL}/${value}`);
        setEditFormData((prevData) => ({
          ...prevData,
          vendorPengelola: assetResponse.data.vendor?._id || "",
          infoVendor: assetResponse.data.vendor?.telp_vendor || "",
          tahun_produksi: assetResponse.data.tahun_produksi || "",
        }));
      } catch (error) {
        console.error("Fetching asset error:", error.message);
      }
    }
  };

  const handleDateChange = (name, date) => {
    setEditFormData({ ...editFormData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        aset_id: editFormData.nama_aset,
        vendor_id: editFormData.vendorPengelola,
        kondisi_aset: editFormData.kondisiAset,
        tgl_perencanaan: editFormData.tanggalRencanaPemeliharaan
          .toISOString()
          .split("T")[0],
        status_aset: editFormData.statusPerencanaan,
        usia_aset: editFormData.usiaAsetSaatIni,
        maks_usia_aset: editFormData.maksimalUsiaAset,
        deskripsi: editFormData.deskripsiKerusakan,
      };

      const response = await axios.put(
        `${API_URL}/${editFormData._id}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      fetchAssets(); // Fetch updated data after submission

      enqueueSnackbar("Aset berhasil diperbarui.", { variant: "success" });
      closeEditModal();
    } catch (error) {
      console.error("Error updating asset:", error);
      enqueueSnackbar("Gagal memperbarui aset.", { variant: "error" });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedAssets = assets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <TitleCard title="Detail Perencanaan Aset" topMargin="mt-2">
        <div className="mb-10">
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
                <th>Tanggal Perancangan</th>
                <th>Vendor Pengelola</th>
                <th>Kondisi Aset</th>
                <th>Usia Aset</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.nama_aset}</td>
                  <td>{moment(asset.tgl_perencanaan).format("DD MMM YYYY")}</td>
                  <td>{asset.nama_vendor}</td>
                  <td>{asset.kondisi_aset}</td>
                  <td>{asset.usia_aset}</td>
                  <td>{asset.status_aset}</td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDeleteAsset(asset._id)}
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
                  <label htmlFor="nama_aset" className="block font-medium">
                    Nama Aset *
                  </label>
                  <select
                    id="nama_aset"
                    name="nama_aset"
                    value={editFormData.nama_aset}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih Aset Rencana pemeliharaan</option>
                    {allAssets.map((asset) => (
                      <option key={asset._id} value={asset._id}>
                        {asset.nama_aset}
                      </option>
                    ))}
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
                  <label
                    htmlFor="usiaAsetSaatIni"
                    className="block font-medium"
                  >
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
                  <label
                    htmlFor="maksimalUsiaAset"
                    className="block font-medium"
                  >
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
                  <label htmlFor="tahun_produksi" className="block font-medium">
                    Tahun Produksi
                  </label>
                  <input
                    type="text"
                    id="tahun_produksi"
                    name="tahun_produksi"
                    value={editFormData.tahun_produksi}
                    onChange={handleInputChange}
                    placeholder="Masukkan tahun produksi"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="deskripsiKerusakan"
                    className="block font-medium"
                  >
                    Deskripsi Perencanaan
                  </label>
                  <input
                    type="text"
                    id="deskripsiKerusakan"
                    name="deskripsiKerusakan"
                    value={editFormData.deskripsiKerusakan}
                    onChange={handleInputChange}
                    placeholder="Masukkan Deskripsi Perencanaan"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalRencanaPemeliharaan"
                    className="block font-medium"
                  >
                    Tanggal Rencana Pemeliharaan *
                  </label>
                  <DatePicker
                    selected={editFormData.tanggalRencanaPemeliharaan}
                    onChange={(date) =>
                      handleDateChange("tanggalRencanaPemeliharaan", date)
                    }
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    dateFormat="MMMM d, yyyy"
                    wrapperClassName="date-picker"
                  />
                </div>
                <div>
                  <label
                    htmlFor="statusPerencanaan"
                    className="block font-medium"
                  >
                    Status Perencanaan *
                  </label>
                  <select
                    id="statusPerencanaan"
                    name="statusPerencanaan"
                    value={editFormData.statusPerencanaan}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option>Pilih status perencanaan</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Tidak Diperbaiki">Tidak Diperbaiki</option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Informasi Vendor" className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="vendorPengelola"
                    className="block font-medium"
                  >
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
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.nama_vendor}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="infoVendor" className="block font-medium">
                    Informasi Vendor / No Telepon
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

            <div className="flex justify-end mt-4">
              <Button label="Simpan" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DesignAset;
