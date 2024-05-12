import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";

import CardInput from "../../components/Cards/CardInput";
import DatePicker from "react-datepicker";

function RiwayatAset() {
  const [assets, setAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [formData, setFormData] = useState({
    namaAset: "",
    kondisiAset: "",
    usiaAsetSaatIni: "",
    maksimalUsiaAset: "",
    tahunProduksi: "",
    deskripsiKerusakan: "",
    tanggalRencanaPemeliharaan: new Date(),
    statusPerencanaan: "",
    vendorPengelola: "",
    infoVendor: "",
  });

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
        setAssets(result.data.assets);
        setTotalPages(Math.ceil(result.data.totalCount / pageSize));
      } else {
        throw new Error("API error: " + result.message);
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

  const handleViewDetail = (id) => {
    const asset = assets.find((asset) => asset.id === id);
    setSelectedAsset(asset);
    setIsModalOpen(true);
    enqueueSnackbar("Menampilkan detail aset.", { variant: "info" });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: date,
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
      <TitleCard title="Riwayat Pemeliharaan Aset" topMargin="mt-2">
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
                <th>Tanggal Pemeliharaan</th>
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
                      onClick={() => handleViewDetail(asset.id)}
                    >
                      <EyeIcon className="w-5 h-5" />
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
              Sebelumnya
            </button>
            <button
              className="btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Selanjutnya
            </button>
          </div>
          <div>
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>
      </TitleCard>

      <div
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
        onClick={handleCloseModal}
      >
        <div
          className="modal-box relative max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <CardInput title="Identitas Aset">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="namaAset" className="block font-medium">
                  Nama Aset *
                </label>
                <select
                  id="namaAset"
                  name="namaAset"
                  value={formData.namaAset}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                >
                  <option>Pilih Aset Rencana pemeliharaan</option>
                  <option value="Aset1">Aset 1</option>
                  <option value="Aset2">Aset 2</option>
                </select>
              </div>
              <div>
                <label htmlFor="kondisiAset" className="block font-medium">
                  Kondisi Aset *
                </label>
                <select
                  id="kondisiAset"
                  name="kondisiAset"
                  value={formData.kondisiAset}
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

          {/* Bagian Detail Aset menggunakan CardInput */}
          <CardInput title="Detail Aset">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="usiaAsetSaatIni" className="block font-medium">
                  Usia Aset Saat Ini *
                </label>
                <input
                  type="text"
                  id="usiaAsetSaatIni"
                  name="usiaAsetSaatIni"
                  value={formData.usiaAsetSaatIni}
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
                  value={formData.maksimalUsiaAset}
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
                  value={formData.tahunProduksi}
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
                  Deskripsi Kerusakan
                </label>
                <input
                  type="text"
                  id="deskripsiKerusakan"
                  name="deskripsiKerusakan"
                  value={formData.deskripsiKerusakan}
                  onChange={handleInputChange}
                  placeholder="Masukkan Deskripsi Kerusakan"
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
                  selected={formData.tanggalRencanaPemeliharaan}
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
                  value={formData.statusPerencanaan}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                >
                  <option>Pilih status perencanaan</option>
                  <option value="direncanakan">Direncanakan</option>
                  <option value="dilaksanakan">Dilaksanakan</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>
          </CardInput>

          {/* Bagian Informasi Vendor menggunakan CardInput */}
          <CardInput title="Informasi Vendor">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vendorPengelola" className="block font-medium">
                  Vendor Pengelola *
                </label>
                <select
                  id="vendorPengelola"
                  name="vendorPengelola"
                  value={formData.vendorPengelola}
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
                  Informasi Vendor / No Telepon
                </label>
                <input
                  type="text"
                  id="infoVendor"
                  name="infoVendor"
                  value={formData.infoVendor}
                  onChange={handleInputChange}
                  placeholder="Masukkan informasi vendor"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </CardInput>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleCloseModal}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RiwayatAset;
