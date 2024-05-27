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

function DetailAset() {
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
    kategoriAset: "",
    merekAset: "",
    noSeri: "",
    tahunProduksi: "",
    deskripsiAset: "",
    namaVendor: "",
    jumlahAsetMasuk: "",
    infoVendor: "",
    tanggalAsetMasuk: new Date(),
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    fetchAssets(currentPage);
  }, [currentPage]);

  const fetchAssets = async (page) => {
    try {
      const pageSize = 10;
      const response = await axios.get(
        `URL_API?page=${page}&pageSize=${pageSize}`
      );
      const result = response.data;
      if (result.code === 0) {
        setAssets(result.data);
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
    const fetchedAssets = [
      {
        id: 1,
        name: "Laptop",
        dateEntered: "2023-05-01",
        vendorName: "Dell",
        category: "Elektronik",
        quantity: 10,
        image: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "Printer",
        dateEntered: "2023-05-02",
        vendorName: "HP",
        category: "Perkantoran",
        quantity: 5,
        image: "https://via.placeholder.com/150",
      },
    ];
    setAssets(fetchedAssets);
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
      ...editFormData,
      namaAset: asset.name,
      kategoriAset: asset.category,
      merekAset: asset.vendorName,
      noSeri: asset.serialNumber,
      tahunProduksi: asset.productionYear,
      deskripsiAset: asset.description,
      namaVendor: asset.vendorName,
      jumlahAsetMasuk: asset.quantity,
      infoVendor: asset.vendorInfo,
      tanggalAsetMasuk: new Date(asset.dateEntered),
      tanggalGaransiMulai: new Date(asset.warrantyStart),
      tanggalGaransiBerakhir: new Date(asset.warrantyEnd),
    });
    setImagePreview(asset.image);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDateChange = (date) => {
    setEditFormData({ ...editFormData, tanggalAsetMasuk: date });
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
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  

  return (
    <>
      <TitleCard title="Detail Aset" topMargin="mt-2">
      <div className="mb-4 flex justify-between items-center relative">
      <input
            type="text"
            placeholder="Cari Riwayat Pemeliharaan Aset"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={handleSearchChange}
          />
      </div>
      
        <div className="overflow-x-auto w-full">
        
          <table className="table w-full">
            <thead>
              <tr>
                <th>Foto Aset</th>
                <th>Nama Aset</th>
                <th>Tgl Aset Masuk</th>
                <th>Masa Garansi Dimulai</th>
                <th>Masa Garansi Berakhir</th>
                <th>Nama Vendor</th>
                <th>Kategori</th>
                <th>Jumlah Aset</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={asset.image} alt="Foto Aset" />
                      </div>
                    </div>
                  </td>
                  <td>{asset.name}</td>
                  <td>{moment(asset.dateEntered).format("DD MMM YYYY")}</td>
                  <td>{moment(asset.warrantyStart).format("DD MMM YYYY")}</td>
                  <td>{moment(asset.warrantyEnd).format("DD MMM YYYY")}</td>
                  <td>{asset.vendorName}</td>
                  <td>{asset.category}</td>
                  <td>{asset.quantity}</td>
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
                  <input
                    type="text"
                    id="namaAset"
                    name="namaAset"
                    value={editFormData.namaAset}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama Aset"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="kategoriAset" className="block font-medium">
                    Kategori Aset *
                  </label>
                  <select
                    id="kategoriAset"
                    name="kategoriAset"
                    value={editFormData.kategoriAset}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih jenis kategori aset</option>
                    <option value="Elektronik">Elektronik</option>
                    <option value="Perkantoran">Perkantoran</option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Detail Aset" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="merekAset" className="block font-medium">
                    Merek Aset *
                  </label>
                  <input
                    type="text"
                    id="merekAset"
                    name="merekAset"
                    value={editFormData.merekAset}
                    onChange={handleInputChange}
                    placeholder="Masukkan Merek Aset"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="noSeri" className="block font-medium">
                    No. Seri / Kode Produksi
                  </label>
                  <input
                    type="text"
                    id="noSeri"
                    name="noSeri"
                    value={editFormData.noSeri}
                    onChange={handleInputChange}
                    placeholder="Masukkan No. Seri / Kode Produksi"
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
                  <label htmlFor="deskripsiAset" className="block font-medium">
                    Deskripsi Aset
                  </label>
                  <input
                    type="text"
                    id="deskripsiAset"
                    name="deskripsiAset"
                    value={editFormData.deskripsiAset}
                    onChange={handleInputChange}
                    placeholder="Masukkan Deskripsi Aset"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalGaransiMulai"
                    className="block font-medium"
                  >
                    Masa Garansi Dimulai
                  </label>
                  <DatePicker
                    selected={editFormData.tanggalGaransiMulai}
                    onChange={(date) =>
                      handleDateChange(date, "tanggalGaransiMulai")
                    }
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    dateFormat="MMMM d, yyyy"
                    wrapperClassName="date-picker"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalGaransiBerakhir"
                    className="block font-medium"
                  >
                    Masa Garansi Berakhir
                  </label>
                  <DatePicker
                    selected={editFormData.tanggalGaransiBerakhir}
                    onChange={(date) =>
                      handleDateChange(date, "tanggalGaransiBerakhir")
                    }
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    dateFormat="MMMM d, yyyy"
                    wrapperClassName="date-picker"
                  />
                </div>
              </div>
            </CardInput>

            <CardInput title="Dokumen Aset" className="mt-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center justify-center w-full sm:w-24 h-24 bg-gray-200 rounded">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-12 w-12 text-gray-400 mx-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h18M3 12h18m-9 5h9"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex items-center w-full sm:w-auto p-2 rounded">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-green-500 hover:text-green-600 border border-green-500 font-medium py-2 px-6 rounded bg-white flex-grow sm:flex-grow-0"
                  >
                    Choose File
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                  <span className="ml-2 text-sm text-gray-500" id="file-chosen">
                    {imagePreview ? "File chosen" : "No File Chosen"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center sm:text-left">
                Anda bisa mengunggah satu foto utama aset di sini.
              </p>
            </CardInput>

            <CardInput title="Vendor Aset" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="namaVendor" className="block font-medium">
                    Nama Vendor *
                  </label>
                  <select
                    id="namaVendor"
                    name="namaVendor"
                    value={editFormData.namaVendor}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih vendor</option>
                    <option value="olahragaMantap">Olahraga Mantap</option>
                    <option value="basketRing">Basket Ring</option>
                  </select>

                  <label
                    htmlFor="jumlahAsetMasuk"
                    className="block font-medium mt-4"
                  >
                    Jumlah Aset Masuk *
                  </label>
                  <input
                    type="text"
                    id="jumlahAsetMasuk"
                    name="jumlahAsetMasuk"
                    value={editFormData.jumlahAsetMasuk}
                    onChange={handleInputChange}
                    placeholder="Masukkan jumlah aset masuk"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
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

                  <label
                    htmlFor="tanggalAsetMasuk"
                    className="block font-medium mt-4"
                  >
                    Tgl Aset Masuk *
                  </label>
                  <DatePicker
                    selected={editFormData.tanggalAsetMasuk}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    dateFormat="MMMM d, yyyy"
                    wrapperClassName="date-picker"
                  />
                </div>
              </div>
            </CardInput>

            <div className="flex justify-end mt-4">
              <Button label="Simpan" onClick={() => {}} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default DetailAset;
