import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { fetchData, postData, updateData, deleteData } from "../../utils/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CircularProgress from "@mui/material/CircularProgress";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/aset`;
const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`;
const ITEMS_PER_PAGE = 20;

function DetailAset() {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
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
    tanggalGaransiMulai: new Date(),
    tanggalGaransiBerakhir: new Date(),
  });
  const [viewAssetData, setViewAssetData] = useState(null);
  const [imageToView, setImageToView] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const modalRef = useRef(null);
  const role = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAssets();
    fetchVendors();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, assets]);

  useEffect(() => {
    if (isEditModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditModalOpen]);

  useEffect(() => {
    if (isViewModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideView);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideView);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideView);
    };
  }, [isViewModalOpen]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeEditModal();
    }
  };

  const handleClickOutsideView = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeViewModal();
    }
  };

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const result = await fetchData(API_URL);
      console.log("API response:", result); // Log response API
      if (result.status === 200) {
        const assetsWithIndex = result.data.map((asset, index) => ({
          ...asset,
          index: index,
        }));

        const sortedAssets = assetsWithIndex.sort((a, b) => b.index - a.index);

        setAssets(sortedAssets);
        setFilteredAssets(sortedAssets);
        setTotalPages(Math.ceil(sortedAssets.length / ITEMS_PER_PAGE));
      } else {
        console.error("API error:", result.message);
      }
    } catch (error) {
      console.error("Fetch assets error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const result = await fetchData(VENDOR_API_URL);
      if (result.status === 200) {
        setVendors(result.data);
      } else {
        console.error("API error:", result.message);
      }
    } catch (error) {
      console.error("Fetch vendors error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getVendor = async (id) => {
    try {
      const result = await fetchData(`${VENDOR_API_URL}/${id}`);
      if (result.status === 200) {
        setVendor(result.data);
        return result.data;
      } else {
        enqueueSnackbar("Vendor tidak ditemukan", { variant: "error" });
        return null;
      }
    } catch (error) {
      enqueueSnackbar("Vendor tidak ditemukan", { variant: "error" });
      return null;
    }
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
    const parseDate = (dateString) => {
      return dateString ? new Date(dateString) : new Date();
    };

    const vendorData = await getVendor(asset.vendor_id);

    setEditFormData({
      _id: asset._id,
      namaAset: asset.nama_aset,
      kategoriAset: asset.kategori_aset,
      merekAset: asset.merek_aset,
      noSeri: asset.kode_produksi || "",
      tahunProduksi: asset.tahun_produksi || "",
      deskripsiAset: asset.deskripsi_aset || "",
      namaVendor: vendorData ? vendorData.nama_vendor : "",
      jumlahAsetMasuk: asset.jumlah_aset || "",
      infoVendor: vendorData ? vendorData.telp_vendor : "",
      tanggalAsetMasuk: parseDate(asset.aset_masuk),
      tanggalGaransiMulai: parseDate(asset.garansi_dimulai),
      tanggalGaransiBerakhir: parseDate(asset.garansi_berakhir),
    });

    setImagePreview(
      asset.gambar_aset.image_url || "https://via.placeholder.com/150"
    );
    setIsEditModalOpen(true);
  };

  const handleViewAsset = async (asset) => {
    const parseDate = (dateString) => {
      return dateString ? new Date(dateString) : new Date();
    };

    const vendorData = await getVendor(asset.vendor_id);

    setEditFormData({
      _id: asset._id,
      namaAset: asset.nama_aset,
      kategoriAset: asset.kategori_aset,
      merekAset: asset.merek_aset,
      noSeri: asset.kode_produksi || "",
      tahunProduksi: asset.tahun_produksi || "",
      deskripsiAset: asset.deskripsi_aset || "",
      namaVendor: vendorData ? vendorData.nama_vendor : "",
      jumlahAsetMasuk: asset.jumlah_aset || "",
      infoVendor: vendorData ? vendorData.telp_vendor : "",
      tanggalAsetMasuk: parseDate(asset.aset_masuk),
      tanggalGaransiMulai: parseDate(asset.garansi_dimulai),
      tanggalGaransiBerakhir: parseDate(asset.garansi_berakhir),
    });

    setImagePreview(
      asset.gambar_aset.image_url || "https://via.placeholder.com/150"
    );
    setIsViewModalOpen(true);
  };

  const handleVendorChange = async (e) => {
    const selectedVendorName = e.target.value;
    const selectedVendor = vendors.find(
      (vendor) => vendor.nama_vendor === selectedVendorName
    );

    if (selectedVendor) {
      setEditFormData((prevState) => ({
        ...prevState,
        namaVendor: selectedVendor.nama_vendor,
        infoVendor: selectedVendor.telp_vendor,
      }));
    }
  };

  const closeDialog = () => {
    setModal({ isOpen: false, id: null });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const result = await deleteData(`${API_URL}/${modal.id}`);
      if (result.status === 200) {
        setAssets(assets.filter((asset) => asset._id !== modal.id));
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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDateChange = (date, name) => {
    setEditFormData({ ...editFormData, [name]: date || new Date() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToUpdate = new FormData();
    const selectedVendor = vendors.find(
      (vendor) => vendor.nama_vendor === editFormData.namaVendor
    );

    dataToUpdate.append(
      "VendorID",
      selectedVendor ? selectedVendor._id : editFormData.namaVendor
    );
    dataToUpdate.append("NamaAset", editFormData.namaAset);
    dataToUpdate.append("kategori", editFormData.kategoriAset);
    dataToUpdate.append("MerekAset", editFormData.merekAset);
    dataToUpdate.append("kode", editFormData.noSeri);
    dataToUpdate.append("TahunProduksi", editFormData.tahunProduksi);
    dataToUpdate.append("deskripsi", editFormData.deskripsiAset);
    dataToUpdate.append("jumlah", editFormData.jumlahAsetMasuk);
    dataToUpdate.append(
      "asetmasuk",
      moment(editFormData.tanggalAsetMasuk).format("YYYY-MM-DD")
    );
    dataToUpdate.append(
      "garansidimulai",
      moment(editFormData.tanggalGaransiMulai).format("YYYY-MM-DD")
    );
    dataToUpdate.append(
      "GaransiBerakhir",
      moment(editFormData.tanggalGaransiBerakhir).format("YYYY-MM-DD")
    );

    if (imageFile) {
      dataToUpdate.append("gambar", imageFile);
    }

    try {
      const result = await updateData(
        `${API_URL}/${editFormData._id}`,
        dataToUpdate,
        true
      );
      if (result.status === 200) {
        const updatedAssets = assets.map((asset) =>
          asset._id === editFormData._id ? result.data : asset
        );
        setAssets(updatedAssets);
        setFilteredAssets(updatedAssets);
        enqueueSnackbar("Aset berhasil diperbarui.", { variant: "success" });
      } else {
        enqueueSnackbar("Gagal memperbarui aset.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Gagal memperbarui aset.", { variant: "error" });
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

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = assets.filter(
      (asset) =>
        asset.nama_aset.toLowerCase().includes(lowercasedQuery) ||
        asset.kategori_aset.toLowerCase().includes(lowercasedQuery) ||
        asset.vendor_id.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredAssets(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1);
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find((vendor) => vendor._id === vendorId);
    return vendor ? vendor.nama_vendor : "Unknown Vendor";
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Foto Aset", dataKey: "gambar_aset" },
      { header: "Nama Aset", dataKey: "namaAset" },
      { header: "Tgl Aset Masuk", dataKey: "tglAsetMasuk" },
      { header: "Masa Garansi Dimulai", dataKey: "masaGaransiDimulai" },
      { header: "Masa Garansi Berakhir", dataKey: "masaGaransiBerakhir" },
      { header: "Nama Vendor", dataKey: "namaVendor" },
      { header: "Kategori", dataKey: "kategori" },
      { header: "Jumlah Aset", dataKey: "jumlahAset" },
    ];

    const rows = filteredAssets.map((asset) => ({
      fotoAset: {
        data: asset.gambar_aset.image_url,
        type: "image",
        width: 20,
        height: 20,
      },
      namaAset: asset.nama_aset,
      tglAsetMasuk: moment(asset.aset_masuk).format("DD MMM YYYY"),
      masaGaransiDimulai: moment(asset.garansi_dimulai).format("DD MMM YYYY"),
      masaGaransiBerakhir: moment(asset.garansi_berakhir).format("DD MMM YYYY"),
      namaVendor: getVendorName(asset.vendor_id),
      kategori: asset.kategori_aset,
      jumlahAset: asset.jumlah_aset,
    }));

    const pageHeight = doc.internal.pageSize.height;
    let cursorY = 10;

    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) =>
        columns.map((col) =>
          col.dataKey === "gambar_aset"
            ? {
                ...row[col.dataKey.image_url],
                cellWidth: "wrap",
                minCellHeight: 20,
              }
            : row[col.dataKey]
        )
      ),
      didDrawCell: (data) => {
        if (
          data.column.dataKey === "gambar_aset" &&
          data.cell.section === "body"
        ) {
          const { data: image_url, width, height } = data.cell.raw;
          console.log(image_url);
          if (image_url) {
            const imgProps = doc.getImageProperties(image_url);
            const imgHeight = (imgProps.height * width) / imgProps.width;
            doc.addImage(
              image_url,
              "JPEG",
              data.cell.x + 2,
              data.cell.y + 2,
              width,
              imgHeight
            );
          }
        }
      },
      startY: cursorY,
      margin: { top: 10 },
      rowPageBreak: "avoid",
    });

    doc.save("assets.pdf");
  };

  const renderAssetForm = (readOnly) => (
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
              readOnly={readOnly}
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
              disabled={readOnly}
            >
              <option value="">Pilih jenis kategori aset</option>
              <option value="Aset Baru">Aset Baru</option>
              <option value="Aset Lama">Aset Lama</option>
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
              readOnly={readOnly}
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
              readOnly={readOnly}
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
              readOnly={readOnly}
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
              readOnly={readOnly}
            />
          </div>
          <div>
            <label htmlFor="tanggalGaransiMulai" className="block font-medium">
              Masa Garansi Dimulai
            </label>
            <DatePicker
              selected={editFormData.tanggalGaransiMulai}
              onChange={(date) => handleDateChange(date, "tanggalGaransiMulai")}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              dateFormat="MMMM d, yyyy"
              wrapperClassName="date-picker"
              readOnly={readOnly}
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
              readOnly={readOnly}
            />
          </div>
        </div>
      </CardInput>

      <CardInput title="Dokumen Aset" className="mt-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className="flex items-center justify-center w-full sm:w-24 h-24 bg-gray-200 rounded cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
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

          {!readOnly && (
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
          )}
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
              onChange={handleVendorChange}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              disabled={readOnly}
            >
              <option value="">Pilih Nama Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor.nama_vendor}>
                  {vendor.nama_vendor}
                </option>
              ))}
            </select>

            <label htmlFor="jumlahAsetMasuk" className="block font-medium mt-4">
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
              readOnly={readOnly}
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
              readOnly
              style={{ backgroundColor: "lightgray" }} // Set background color to indicate non-editable field
            />

            <label
              htmlFor="tanggalAsetMasuk"
              className="block font-medium mt-4"
            >
              Tgl Aset Masuk *
            </label>
            <DatePicker
              selected={editFormData.tanggalAsetMasuk}
              onChange={(date) => handleDateChange(date, "tanggalAsetMasuk")}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              dateFormat="MMMM d, yyyy"
              wrapperClassName="date-picker"
              readOnly={readOnly}
            />
          </div>
        </div>
      </CardInput>

      {!readOnly && (
        <div className="flex justify-end mt-4">
          <Button label="Simpan" onClick={handleSubmit} />
        </div>
      )}
    </form>
  );

  return (
    <>
      <TitleCard title="Detail Aset" topMargin="mt-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center relative">
              <input
                type="text"
                placeholder="Cari Riwayat Pemeliharaan Aset"
                className="input input-bordered w-full max-w-xs"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button label="Cetak Data" onClick={handlePrint} />
            </div>
            <div className="overflow-x-auto w-full">
              <table className="table w-full" id="asset-table">
                <thead>
                  <tr>
                    <th>Foto Aset</th>
                    <th>Nama Aset</th>
                    <th>Tgl Aset Masuk</th>
                    <th>Masa Garansi Dimulai</th>
                    <th>Masa Garansi Berakhir</th>
                    <th>Nama Vendor</th>
                    <th className="whitespace-nowrap">Kategori</th>
                    <th className="whitespace-nowrap text-center">
                      Jumlah Aset
                    </th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets
                      .slice(
                        (currentPage - 1) * ITEMS_PER_PAGE,
                        currentPage * ITEMS_PER_PAGE
                      )
                      .map((asset) => (
                        <tr key={asset._id}>
                          <td>
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={
                                    asset.gambar_aset.image_url ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt="Foto Aset"
                                />
                              </div>
                            </div>
                          </td>
                          <td>{asset.nama_aset}</td>
                          <td>
                            {moment(asset.aset_masuk).format("DD MMM YYYY")}
                          </td>
                          <td>
                            {moment(asset.garansi_dimulai).format(
                              "DD MMM YYYY"
                            )}
                          </td>
                          <td>
                            {moment(asset.garansi_berakhir).format(
                              "DD MMM YYYY"
                            )}
                          </td>
                          <td>{getVendorName(asset.vendor_id)}</td>
                          <td className="whitespace-nowrap">
                            {asset.kategori_aset}
                          </td>
                          <td className="whitespace-nowrap text-center">
                            {asset.jumlah_aset}
                          </td>
                          <td className="flex justify-around items-center">
                            {role.role !== "admin aset" && (
                              <button
                                className="btn btn-square btn-ghost text-red-500"
                                onClick={() => handleDeleteAsset(asset._id)}
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              className="btn btn-square btn-ghost text-yellow-500"
                              onClick={() => handleEditAsset(asset)}
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="btn btn-square btn-ghost text-black"
                              onClick={() => handleViewAsset(asset)}
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center text-gray-500">
                        Tidak ada data aset yang ditemukan.
                      </td>
                    </tr>
                  )}
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
          </>
        )}
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
            ref={modalRef}
            className="modal-box relative max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderAssetForm(false)}
          </div>
        </div>
      )}

      {isViewModalOpen && (
        <div className="modal modal-open" onClick={closeViewModal}>
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
            onClick={closeViewModal}
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
          <div
            ref={modalRef}
            className="modal-box relative max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderAssetForm(true)}
          </div>
        </div>
      )}

      {isImageModalOpen && (
        <div className="modal modal-open" onClick={closeImageModal}>
          <div
            className="modal-box relative max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
              onClick={closeImageModal}
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
            <img
              src={imagePreview}
              alt="Gambar Aset"
              className="object-contain h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default DetailAset;
