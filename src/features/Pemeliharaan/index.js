import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { fetchData, updateData, deleteData } from "../../utils/utils";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/pelihara`;
const DARURAT_URL = `${BASE_URL_API}api/v1/manage-aset/darurat`;
const RENCANA_URL = `${BASE_URL_API}api/v1/manage-aset/rencana`;
const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`;
const ADMIN_API_URL = `${BASE_URL_API}api/v1/manage-aset/admin`;
const ITEMS_PER_PAGE = 10;

function PemeliharaanAset() {
  const [assets, setAssets] = useState([]);
  const [rencanaData, setRencanaData] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    type: "",
    id: null,
    status: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    asset_id: "", // Added to track current asset ID
    rencana_id: "",
    kondisi_stlh_perbaikan: "",
    status_pemeliharaan: "",
    penanggung_jawab: "",
    pengawas: "",
    deskripsi_pemeliharaan: "",
    deskripsi_kerusakan: "",
    tgl_dilakukan: new Date(),
    waktu_pemeliharaan: "",
    usia_aset_saat_ini: "",
    maksimal_usia_aset: "",
    tahun_produksi: "",
    vendor_pengelola: "",
    info_vendor: "",
    nama_aset: "",
    kategori_aset: "",
    merek_aset: "",
    kode_produksi: "",
    jumlah_aset: "",
    aset_masuk: "",
    garansi_dimulai: "",
    garansi_berakhir: "",
    gambar_aset: "", // Added to handle asset image
    status: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAssets();
    fetchRencanaData();
    fetchVendorData();
    fetchAdminData();
  }, [searchQuery, filterStatus]); // Add dependencies

  const fetchAssets = async () => {
    try {
      // Ensure you have the token
      const response = await fetchData(API_URL);
      const dataDarurat = response.data_darurat
        ? response.data_darurat.map((item) => ({
            ...item,
            status: "Data Darurat",
          }))
        : [];
      const dataPemeliharaan = response.data_pemeliharaan
        ? response.data_pemeliharaan.map((item) => ({
            ...item,
            status: "Data Pemeliharaan",
          }))
        : [];
      const allAssets = [...dataDarurat, ...dataPemeliharaan];
      allAssets.sort(
        (a, b) => new Date(b.tgl_dilakukan) - new Date(a.tgl_dilakukan)
      );
      const filteredAssets = allAssets.filter(
        (asset) =>
          (filterStatus === "All" || asset.status === filterStatus) &&
          ((asset.rencana_id &&
            asset.rencana_id
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
            (asset.kondisi_stlh_perbaikan &&
              asset.kondisi_stlh_perbaikan
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (asset.status_pemeliharaan &&
              asset.status_pemeliharaan
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (asset.penanggung_jawab &&
              asset.penanggung_jawab
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (asset.deskripsi &&
              asset.deskripsi
                .toLowerCase()
                .includes(searchQuery.toLowerCase())))
      );

      setAssets(filteredAssets);
      setTotalPages(Math.ceil(filteredAssets.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data aset.", { variant: "error" });
    }
  };

  const fetchRencanaData = async () => {
    try {
      // Ensure you have the token
      const response = await fetchData(RENCANA_URL);
      setRencanaData(response.data);
    } catch (error) {
      console.error("Fetching rencana error:", error.message);
      enqueueSnackbar("Gagal memuat data rencana.", { variant: "error" });
    }
  };

  const fetchVendorData = async () => {
    try {
      // Ensure you have the token
      const response = await fetchData(VENDOR_API_URL);
      setVendorList(response.data);
    } catch (error) {
      console.error("Fetching vendor error:", error.message);
      enqueueSnackbar("Gagal memuat data vendor.", { variant: "error" });
    }
  };

  const fetchAdminData = async () => {
    try {
      // Ensure you have the token
      const response = await fetchData(ADMIN_API_URL);
      setAdminList(response.data);
    } catch (error) {
      console.error("Fetching admin error:", error.message);
      enqueueSnackbar("Gagal memuat data admin.", { variant: "error" });
    }
  };

  const fetchRencanaById = async (rencana_id) => {
    try {
      // Ensure you have the token
      const response = await fetchData(`${RENCANA_URL}/${rencana_id}`);
      return response.data;
    } catch (error) {
      console.error("Fetching rencana error:", error.message);
      enqueueSnackbar("Gagal memuat data rencana.", { variant: "error" });
      throw error;
    }
  };

  const fetchAssetById = async (id, status, viewOnly = false) => {
    const url = status === "Data Darurat" ? DARURAT_URL : API_URL;
    try {
      // Ensure you have the token
      const response = await fetchData(`${url}/${id}`);
      const data = response.data;
      console.log("Fetched data:", data);

      if (status === "Data Pemeliharaan") {
        const rencanaData = await fetchRencanaById(data.rencana_id);

        setEditFormData({
          asset_id: data._id, // Set asset ID for later use
          rencana_id: data.rencana_id || "",
          kondisi_stlh_perbaikan: data.kondisi_stlh_perbaikan || "",
          status_pemeliharaan: data.status_pemeliharaan || "",
          penanggung_jawab: data.penanggung_jawab || "",
          pengawas: data.admin ? data.admin.nama_lengkap : "",
          deskripsi_pemeliharaan: data.deskripsi || "",
          deskripsi_kerusakan: rencanaData.deskripsi || "",
          tgl_dilakukan: data.tgl_dilakukan
            ? moment(data.tgl_dilakukan).toDate()
            : new Date(),
          waktu_pemeliharaan: data.waktu_pemeliharaan || "",
          usia_aset_saat_ini: rencanaData.usia_aset || "",
          maksimal_usia_aset: rencanaData.maks_usia_aset || "",
          tahun_produksi: rencanaData.aset.tahun_produksi || "",
          vendor_pengelola: rencanaData.vendor.nama_vendor || "",
          info_vendor: rencanaData.vendor.telp_vendor || "",
          nama_aset: rencanaData.aset.nama_aset || "",
          kategori_aset: rencanaData.aset.kategori_aset || "",
          merek_aset: rencanaData.aset.merek_aset || "",
          kode_produksi: rencanaData.aset.kode_produksi || "",
          jumlah_aset: rencanaData.aset.jumlah_aset || "",
          aset_masuk: rencanaData.aset.aset_masuk
            ? moment(rencanaData.aset.aset_masuk).toDate()
            : new Date(),
          garansi_dimulai: rencanaData.aset.garansi_dimulai
            ? moment(rencanaData.aset.garansi_dimulai).toDate()
            : new Date(),
          garansi_berakhir: rencanaData.aset.garansi_berakhir
            ? moment(rencanaData.aset.garansi_berakhir).toDate()
            : new Date(),
          status, // simpan status data
        });
      } else if (status === "Data Darurat") {
        setEditFormData({
          asset_id: data._id, // Set asset ID for later use
          rencana_id: data.rencana_id || "",
          kondisi_stlh_perbaikan: data.kondisi_stlh_perbaikan || "",
          status_pemeliharaan: data.status_pemeliharaan || "",
          penanggung_jawab: data.penanggung_jawab || "",
          pengawas: data.admin ? data.admin.nama_lengkap : "",
          deskripsi_pemeliharaan: data.deskripsi || "",
          deskripsi_kerusakan: data.deskripsi_kerusakan || "",
          tgl_dilakukan: data.tgl_dilakukan
            ? moment(data.tgl_dilakukan).toDate()
            : new Date(),
          waktu_pemeliharaan: data.waktu_pemeliharaan || "",
          usia_aset_saat_ini: "", // Data Darurat doesn't have this field
          maksimal_usia_aset: "", // Data Darurat doesn't have this field
          tahun_produksi: data.aset.tahun_produksi || "",
          vendor_pengelola: data.vendor.nama_vendor || "",
          info_vendor: data.vendor.telp_vendor || "",
          nama_aset: data.aset.nama_aset || "",
          kategori_aset: data.aset.kategori_aset || "",
          merek_aset: data.aset.merek_aset || "",
          kode_produksi: data.aset.kode_produksi || "",
          jumlah_aset: data.aset.jumlah_aset || "",
          aset_masuk: data.aset.aset_masuk
            ? moment(data.aset.aset_masuk).toDate()
            : new Date(),
          garansi_dimulai: data.aset.garansi_dimulai
            ? moment(data.aset.garansi_dimulai).toDate()
            : new Date(),
          garansi_berakhir: data.aset.garansi_berakhir
            ? moment(data.aset.garansi_berakhir).toDate()
            : new Date(),
          gambar_aset: data.gambar_darurat.image_url || "", // Set asset image
          status, // simpan status data
        });
      }

      if (viewOnly) {
        setIsViewModalOpen(true);
      } else {
        setIsEditModalOpen(true);
      }
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data aset.", { variant: "error" });
    }
  };

  const handleDeleteAsset = (id, status) => {
    setModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus aset ini?",
      type: "delete",
      id,
      status,
    });
  };

  const handleEditAsset = (id, status) => {
    fetchAssetById(id, status);
  };

  const handleViewAsset = (id, status) => {
    fetchAssetById(id, status, true);
  };

  const closeDialog = () => {
    setModal({ isOpen: false, id: null, status: "" });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  const confirmDelete = async () => {
    const url = modal.status === "Data Darurat" ? DARURAT_URL : API_URL;
    try {
      // Ensure you have the token
      await deleteData(`${url}/${modal.id}`);
      setAssets(assets.filter((asset) => asset._id !== modal.id));
      enqueueSnackbar("Aset berhasil dihapus.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Gagal menghapus aset.", { variant: "error" });
    }
    closeDialog();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleDateChange = (date, name) => {
    setEditFormData({ ...editFormData, [name]: date });
  };

  const handleRencanaChange = async (e) => {
    const rencana_id = e.target.value;
    const rencana = await fetchRencanaById(rencana_id);
    setEditFormData({
      ...editFormData,
      rencana_id,
      deskripsi_kerusakan: rencana.deskripsi || "",
      usia_aset_saat_ini: rencana.usia_aset || "",
      maksimal_usia_aset: rencana.maks_usia_aset || "",
      tahun_produksi: rencana.aset.tahun_produksi || "",
      vendor_pengelola: rencana.vendor.nama_vendor || "",
      info_vendor: rencana.vendor.telp_vendor || "",
      nama_aset: rencana.aset.nama_aset || "",
      kategori_aset: rencana.aset.kategori_aset || "",
      merek_aset: rencana.aset.merek_aset || "",
      kode_produksi: rencana.aset.kode_produksi || "",
      jumlah_aset: rencana.aset.jumlah_aset || "",
      aset_masuk: rencana.aset.aset_masuk
        ? moment(rencana.aset.aset_masuk).toDate()
        : new Date(),
      garansi_dimulai: rencana.aset.garansi_dimulai
        ? moment(rencana.aset.garansi_dimulai).toDate()
        : new Date(),
      garansi_berakhir: rencana.aset.garansi_berakhir
        ? moment(rencana.aset.garansi_berakhir).toDate()
        : new Date(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      rencana_id: editFormData.rencana_id,
      kondisi_stlh_perbaikan: editFormData.kondisi_stlh_perbaikan,
      status_pemeliharaan: editFormData.status_pemeliharaan,
      penanggung_jawab: editFormData.pengawas, // Update for pengawas
      deskripsi: editFormData.deskripsi_pemeliharaan,
      tgl_dilakukan: moment(editFormData.tgl_dilakukan).format("YYYY-MM-DD"),
      waktu_pemeliharaan: editFormData.waktu_pemeliharaan,
      admin_id: editFormData.penanggung_jawab, // Add admin_id for penanggung_jawab
    };
    console.log("Payload data:", payload);
    try {
      // Ensure you have the token
      const url =
        editFormData.status === "Data Darurat"
          ? `${DARURAT_URL}/${editFormData.asset_id}`
          : `${API_URL}/${editFormData.asset_id}`;
      const response = await updateData(url, payload);
      console.log("Response data:", response);
      fetchAssets();
      enqueueSnackbar("Data berhasil diperbarui!", { variant: "success" });
      closeEditModal();
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        enqueueSnackbar(
          `Gagal memperbarui data! ${error.response.data.message}`,
          { variant: "error" }
        );
      } else {
        console.error("Error posting data:", error.message);
        enqueueSnackbar("Gagal memperbarui data!", { variant: "error" });
      }
    }
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

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredAssets = assets.filter(
    (asset) =>
      (filterStatus === "All" || asset.status === filterStatus) &&
      ((asset.rencana_id &&
        asset.rencana_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (asset.kondisi_stlh_perbaikan &&
          asset.kondisi_stlh_perbaikan
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (asset.status_pemeliharaan &&
          asset.status_pemeliharaan
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (asset.penanggung_jawab &&
          asset.penanggung_jawab
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        (asset.deskripsi &&
          asset.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <TitleCard title="Detail Pemeliharaan Aset" topMargin="mt-2">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Cari aset..."
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="select select-bordered"
          >
            <option value="All">Semua Status</option>
            <option value="Data Pemeliharaan">Data Pemeliharaan</option>
            <option value="Data Darurat">Data Darurat</option>
          </select>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Aset</th>
                <th>Tanggal Pemeliharaan</th>
                <th>Vendor Pengelola</th>
                <th>Penanggung Jawab</th>
                <th>Kondisi Setelah Perbaikan</th>
                <th>Status Perbaikan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset._id} className="whitespace-nowrap">
                  <td className="overflow-hidden overflow-ellipsis">
                    {asset.aset.nama_aset}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {moment(asset.tgl_dilakukan).format("DD MMM YYYY")}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {asset.vendor.nama_vendor}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {asset.penanggung_jawab}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {asset.kondisi_stlh_perbaikan}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {asset.status_pemeliharaan}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {asset.status}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis flex">
                    <button
                      className="btn btn-square btn-ghost text-red-500"
                      onClick={() => handleDeleteAsset(asset._id, asset.status)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost text-yellow-500"
                      onClick={() => handleEditAsset(asset._id, asset.status)}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost text-black"
                      onClick={() => handleViewAsset(asset._id, asset.status)}
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
                  <label htmlFor="rencana_id" className="block font-medium">
                    Nama Aset *
                  </label>
                  <select
                    id="rencana_id"
                    name="rencana_id"
                    value={editFormData.rencana_id}
                    onChange={handleRencanaChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih Nama Aset</option>
                    {rencanaData.map((rencana) => (
                      <option key={rencana._id} value={rencana._id}>
                        {rencana.aset.nama_aset}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="kondisi_stlh_perbaikan"
                    className="block font-medium"
                  >
                    Kondisi Aset Setelah Perbaikan *
                  </label>
                  <select
                    id="kondisi_stlh_perbaikan"
                    name="kondisi_stlh_perbaikan"
                    value={editFormData.kondisi_stlh_perbaikan}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih jenis kondisi aset</option>
                    <option value="Dapat digunakan">Dapat digunakan</option>
                    <option value="Dalam perbaikan">Dalam Perbaikan</option>
                    <option value="Tidak dapat diperbaiki">
                      Tidak dapat diperbaiki
                    </option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Detail Aset" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editFormData.status === "Data Pemeliharaan" && (
                  <>
                    <div>
                      <label
                        htmlFor="usia_aset_saat_ini"
                        className="block font-medium"
                      >
                        Usia Aset Saat Ini *
                      </label>
                      <input
                        type="number"
                        id="usia_aset_saat_ini"
                        name="usia_aset_saat_ini"
                        value={editFormData.usia_aset_saat_ini}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="maksimal_usia_aset"
                        className="block font-medium"
                      >
                        Maksimal Usia Aset *
                      </label>
                      <input
                        type="number"
                        id="maksimal_usia_aset"
                        name="maksimal_usia_aset"
                        value={editFormData.maksimal_usia_aset}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                      />
                    </div>
                  </>
                )}
                <div>
                  <label htmlFor="tahun_produksi" className="block font-medium">
                    Tahun Produksi
                  </label>
                  <input
                    type="number"
                    id="tahun_produksi"
                    name="tahun_produksi"
                    value={editFormData.tahun_produksi}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="deskripsi_kerusakan"
                    className="block font-medium"
                  >
                    Deskripsi Kerusakan
                  </label>
                  <input
                    type="text"
                    id="deskripsi_kerusakan"
                    name="deskripsi_kerusakan"
                    value={editFormData.deskripsi_kerusakan}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="tgl_dilakukan" className="block font-medium">
                    Tanggal Pemeliharaan *
                  </label>
                  <DatePicker
                    selected={editFormData.tgl_dilakukan}
                    onChange={(date) => handleDateChange(date, "tgl_dilakukan")}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    wrapperClassName="date-picker"
                    dateFormat="MMMM d, yyyy"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status_pemeliharaan"
                    className="block font-medium"
                  >
                    Status Pemeliharaan *
                  </label>
                  <select
                    id="status_pemeliharaan"
                    name="status_pemeliharaan"
                    value={editFormData.status_pemeliharaan}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih status pemeliharaan</option>
                    <option value="Selesai">Perbaikan berhasil</option>
                    <option value="Sedang berlangsung">
                      Sedang berlangsung
                    </option>
                    <option value="Perbaikan gagal">Perbaikan gagal</option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Informasi Vendor Pengelola" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="vendor_pengelola"
                    className="block font-medium"
                  >
                    Vendor Pengelola *
                  </label>
                  <input
                    type="text"
                    id="vendor_pengelola"
                    name="vendor_pengelola"
                    value={editFormData.vendor_pengelola}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="info_vendor" className="block font-medium">
                    Informasi vendor / no telpon
                  </label>
                  <input
                    type="text"
                    id="info_vendor"
                    name="info_vendor"
                    value={editFormData.info_vendor}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </CardInput>

            <CardInput title="Informasi Pemeliharaan" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="penanggung_jawab"
                    className="block font-medium"
                  >
                    Nama Penanggung Jawab *
                  </label>
                  <select
                    id="penanggung_jawab"
                    name="penanggung_jawab"
                    value={editFormData.penanggung_jawab}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih penanggung jawab</option>
                    {adminList.map((admin) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.nama_lengkap}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="pengawas" className="block font-medium">
                    Pengawas
                  </label>
                  <select
                    id="pengawas"
                    name="pengawas"
                    value={editFormData.pengawas}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  >
                    <option value="">Pilih pengawas</option>
                    {adminList.map((admin) => (
                      <option key={admin._id} value={admin.nama_lengkap}>
                        {admin.nama_lengkap}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="deskripsi_pemeliharaan"
                    className="block font-medium"
                  >
                    Deskripsi Pemeliharaan
                  </label>
                  <input
                    type="text"
                    id="deskripsi_pemeliharaan"
                    name="deskripsi_pemeliharaan"
                    value={editFormData.deskripsi_pemeliharaan}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="tgl_dilakukan" className="block font-medium">
                    Tanggal Pemeliharaan Dilakukan
                  </label>
                  <DatePicker
                    selected={editFormData.tgl_dilakukan}
                    onChange={(date) => handleDateChange(date, "tgl_dilakukan")}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    dateFormat="MMMM d, yyyy"
                    wrapperClassName="date-picker"
                  />
                </div>
                <div>
                  <label
                    htmlFor="waktu_pemeliharaan"
                    className="block font-medium"
                  >
                    Perkiraan Waktu Pemeliharaan
                  </label>
                  <input
                    type="text"
                    id="waktu_pemeliharaan"
                    name="waktu_pemeliharaan"
                    value={editFormData.waktu_pemeliharaan}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            </CardInput>

            {editFormData.status === "Data Darurat" && (
              <CardInput title="Dokumen Aset" className="mt-4">
                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    <img
                      src={editFormData.gambar_aset || "/default-image.png"}
                      alt="Asset"
                      className="w-24 h-24 object-cover"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          gambar_aset: URL.createObjectURL(e.target.files[0]),
                        })
                      }
                      className="hidden"
                      id="file-input"
                    />
                    <label
                      htmlFor="file-input"
                      className="btn btn-outline btn-secondary"
                    >
                      Choose File
                    </label>
                    <span className="ml-2">
                      {editFormData.gambar_aset
                        ? "File Selected"
                        : "No File Chosen"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Anda bisa mengunggah satu foto utama aset di sini.
                  </p>
                </div>
              </CardInput>
            )}

            <div className="flex justify-end mt-4">
              <Button label="Simpan" type="submit" />
            </div>
          </form>
        </div>
      </div>

      {/* View Modal */}
      <div
        className={`modal ${isViewModalOpen ? "modal-open" : ""}`}
        onClick={closeViewModal}
      >
        <div
          className="modal-box relative max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <CardInput title="Identitas Aset">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="view_nama_aset" className="block font-medium">
                  Nama Aset
                </label>
                <input
                  type="text"
                  id="view_nama_aset"
                  name="view_nama_aset"
                  value={editFormData.nama_aset}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="view_kondisi_stlh_perbaikan"
                  className="block font-medium"
                >
                  Kondisi Setelah Perbaikan
                </label>
                <input
                  type="text"
                  id="view_kondisi_stlh_perbaikan"
                  name="view_kondisi_stlh_perbaikan"
                  value={editFormData.kondisi_stlh_perbaikan}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
            </div>
          </CardInput>

          <CardInput title="Detail Aset" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="view_tahun_produksi"
                  className="block font-medium"
                >
                  Tahun Produksi
                </label>
                <input
                  type="number"
                  id="view_tahun_produksi"
                  name="view_tahun_produksi"
                  value={editFormData.tahun_produksi}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="view_deskripsi_kerusakan"
                  className="block font-medium"
                >
                  Deskripsi Kerusakan
                </label>
                <input
                  type="text"
                  id="view_deskripsi_kerusakan"
                  name="view_deskripsi_kerusakan"
                  value={editFormData.deskripsi_kerusakan}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="view_tgl_dilakukan"
                  className="block font-medium"
                >
                  Tanggal Pemeliharaan
                </label>
                <input
                  type="text"
                  id="view_tgl_dilakukan"
                  name="view_tgl_dilakukan"
                  value={moment(editFormData.tgl_dilakukan).format(
                    "DD MMM YYYY"
                  )}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="view_status_pemeliharaan"
                  className="block font-medium"
                >
                  Status Pemeliharaan
                </label>
                <input
                  type="text"
                  id="view_status_pemeliharaan"
                  name="view_status_pemeliharaan"
                  value={editFormData.status_pemeliharaan}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
            </div>
          </CardInput>

          <CardInput title="Informasi Vendor Pengelola" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="view_vendor_pengelola"
                  className="block font-medium"
                >
                  Vendor Pengelola
                </label>
                <input
                  type="text"
                  id="view_vendor_pengelola"
                  name="view_vendor_pengelola"
                  value={editFormData.vendor_pengelola}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="view_info_vendor" className="block font-medium">
                  Informasi vendor / no telpon
                </label>
                <input
                  type="text"
                  id="view_info_vendor"
                  name="view_info_vendor"
                  value={editFormData.info_vendor}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
            </div>
          </CardInput>

          <CardInput title="Informasi Pemeliharaan" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="view_penanggung_jawab"
                  className="block font-medium"
                >
                  Nama Penanggung Jawab
                </label>
                <input
                  type="text"
                  id="view_penanggung_jawab"
                  name="view_penanggung_jawab"
                  value={editFormData.penanggung_jawab}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="view_deskripsi_pemeliharaan"
                  className="block font-medium"
                >
                  Deskripsi Pemeliharaan
                </label>
                <input
                  type="text"
                  id="view_deskripsi_pemeliharaan"
                  name="view_deskripsi_pemeliharaan"
                  value={editFormData.deskripsi_pemeliharaan}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
            </div>
          </CardInput>

          {editFormData.status === "Data Darurat" && (
            <CardInput title="Dokumen Aset" className="mt-4">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <img
                    src={editFormData.gambar_aset || "/default-image.png"}
                    alt="Asset"
                    className="w-24 h-24 object-cover"
                  />
                </div>
              </div>
            </CardInput>
          )}

          <div className="flex justify-end mt-4">
            <Button label="Tutup" onClick={closeViewModal} />
          </div>
        </div>
      </div>
    </>
  );
}

export default PemeliharaanAset;
