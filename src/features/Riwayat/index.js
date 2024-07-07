import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import CardInput from "../../components/Cards/CardInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FunnelIcon } from "@heroicons/react/24/outline"; // Use the correct icon

function RiwayatAset() {
  const [assets, setAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState({
    kondisi: "",
    status: "",
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

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    setFilterConditions((prevState) => ({
      ...prevState,
      [name]: checked ? value : "",
    }));
  };

  const handleFilterApply = () => {
    // Apply filtering logic here
    setIsFilterOpen(false);
  };

  return (
    <>
      <TitleCard title="Riwayat Pemeliharaan Aset" topMargin="mt-2">
        <div className="mb-4 flex justify-between items-center relative">
          <input
            type="text"
            placeholder="Cari Riwayat Pemeliharaan Aset"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button
            className="btn btn-white flex items-center"
            onClick={handleFilterClick}
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Tambahkan Filter
          </button>
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
              className="btn ml-5"
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

      {isFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-[465px] h-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-center w-full">
                Filter Kategori
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <p className="mb-4 text-gray-500 text-center">
              Filter kategori dapat melakukan seleksi dari aset
            </p>
            <div className="mb-4 flex items-center border rounded-lg p-2">
              <input
                type="checkbox"
                id="statusBerhasil"
                name="status"
                value="Perbaikan Berhasil"
                onChange={handleFilterChange}
                className="form-checkbox h-4 w-4 text-[#4A5B34] rounded-md"
                checked={filterConditions.status === "Perbaikan Berhasil"}
              />
              <label htmlFor="statusBerhasil" className="cursor-pointer ml-2">
                Perbaikan Berhasil
              </label>
            </div>
            <div className="mb-4 flex items-center border rounded-lg p-2">
              <input
                type="checkbox"
                id="statusGagal"
                name="status"
                value="Perbaikan Gagal"
                onChange={handleFilterChange}
                className="form-checkbox h-4 w-4 text-[#4A5B34] rounded-md"
                checked={filterConditions.status === "Perbaikan Gagal"}
              />
              <label htmlFor="statusGagal" className="cursor-pointer ml-2">
                Perbaikan Gagal
              </label>
            </div>
            <button
              className="btn bg-[#4A5B34] text-white w-full h-[50px] text-lg hover:bg-[#354824]"
              onClick={handleFilterApply}
            >
              Konfirmasi
            </button>
          </div>
        </div>
      )}

      <div
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
        onClick={handleCloseModal}
      >
        <div
          className="modal-box relative max-w-4xl p-4"
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
                  value={selectedAsset?.name || ""}
                  onChange={() => {}}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
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
                  value={selectedAsset?.condition || ""}
                  onChange={() => {}}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                >
                  <option>Pilih jenis kondisi aset</option>
                  <option value="Baik">Baik</option>
                  <option value="Rusak">Rusak</option>
                </select>
              </div>
            </div>
          </CardInput>

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
                  value={selectedAsset?.age || ""}
                  onChange={() => {}}
                  placeholder="Masukkan usia aset saat ini"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
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
                  value={selectedAsset?.maxAge || ""}
                  onChange={() => {}}
                  placeholder="Masukkan maksimal usia aset"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
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
                  value={selectedAsset?.productionYear || ""}
                  onChange={() => {}}
                  placeholder="Masukkan tahun produksi"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
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
                  value={selectedAsset?.damageDescription || ""}
                  onChange={() => {}}
                  placeholder="Masukkan Deskripsi Kerusakan"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
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
                  selected={selectedAsset?.maintenanceDate || new Date()}
                  onChange={() => {}}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  dateFormat="MMMM d, yyyy"
                  wrapperClassName="date-picker"
                  disabled
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
                  value={selectedAsset?.status || ""}
                  onChange={() => {}}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                >
                  <option>Pilih status perencanaan</option>
                  <option value="direncanakan">Direncanakan</option>
                  <option value="dilaksanakan">Dilaksanakan</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>
          </CardInput>

          <CardInput title="Informasi Vendor">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vendorPengelola" className="block font-medium">
                  Vendor Pengelola *
                </label>
                <select
                  id="vendorPengelola"
                  name="vendorPengelola"
                  value={selectedAsset?.vendor || ""}
                  onChange={() => {}}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
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
                  value={selectedAsset?.vendorInfo || ""}
                  onChange={() => {}}
                  placeholder="Masukkan informasi vendor"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
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
