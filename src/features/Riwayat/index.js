import React, { useState, useEffect } from "react";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FunnelIcon } from "@heroicons/react/24/outline";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { fetchData } from "../../utils/utils";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/pelihara`;
const RENCANA_URL = `${BASE_URL_API}api/v1/manage-aset/rencana`;
const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`;
const ADMIN_API_URL = `${BASE_URL_API}api/v1/manage-aset/admin`;
const ITEMS_PER_PAGE = 10;

const getTagStyle = (status) => {
  return tagStyles[status] || {};
};

const tagStyles = {
  "Dapat digunakan": {
    backgroundColor: "rgba(160 254 208)",
    color: "black",
  },
  "Tidak dapat diperbaiki": {
    backgroundColor: "rgba(255 177 169)",
    color: "black",
  },
  Selesai: { backgroundColor: "rgba(160 254 208)", color: "black" },
  "Perbaikan gagal": {
    backgroundColor: "rgba(255 177 169)",
    color: "black",
  },
};

function RiwayatAset() {
  const [assets, setAssets] = useState([]);
  const [rencanaData, setRencanaData] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewFormData, setViewFormData] = useState({
    asset_id: "",
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
    gambar_aset: "",
    status: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState({
    selesai: false,
    perbaikanGagal: false,
  });

  useEffect(() => {
    fetchAssets();
    fetchRencanaData();
    fetchVendorData();
    fetchAdminData();
  }, [searchQuery, filterStatus, filterDate, filterConditions]);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

      // Sort data by date in descending order
      allAssets.sort(
        (a, b) => new Date(b.tgl_dilakukan) - new Date(a.tgl_dilakukan)
      );

      const filteredAssets = allAssets.filter(
        (asset) =>
          (filterStatus === "All" || asset.status === filterStatus) &&
          ((asset.kondisi_stlh_perbaikan === "Tidak dapat diperbaiki" &&
            asset.status_pemeliharaan === "Perbaikan gagal") ||
            (asset.kondisi_stlh_perbaikan === "Dapat digunakan" &&
              asset.status_pemeliharaan === "Selesai")) &&
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
                .includes(searchQuery.toLowerCase()))) &&
          (!filterDate || moment(asset.tgl_dilakukan).isSame(filterDate, "day"))
      );

      const furtherFilteredAssets = filteredAssets.filter((asset) => {
        if (filterConditions.selesai && filterConditions.perbaikanGagal) {
          return true;
        } else if (filterConditions.selesai) {
          return asset.status_pemeliharaan === "Selesai";
        } else if (filterConditions.perbaikanGagal) {
          return asset.status_pemeliharaan === "Perbaikan gagal";
        } else {
          return true;
        }
      });

      setAssets(furtherFilteredAssets);
      setTotalPages(Math.ceil(furtherFilteredAssets.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data aset.", { variant: "error" });
    }
  };

  const fetchRencanaData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(RENCANA_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRencanaData(response.data);
    } catch (error) {
      console.error("Fetching rencana error:", error.message);
      enqueueSnackbar("Gagal memuat data rencana.", { variant: "error" });
    }
  };

  const fetchVendorData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(VENDOR_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendorList(response.data);
    } catch (error) {
      console.error("Fetching vendor error:", error.message);
      enqueueSnackbar("Gagal memuat data vendor.", { variant: "error" });
    }
  };

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(ADMIN_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminList(response.data);
    } catch (error) {
      console.error("Fetching admin error:", error.message);
      enqueueSnackbar("Gagal memuat data admin.", { variant: "error" });
    }
  };

  const fetchRencanaById = async (rencana_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(`${RENCANA_URL}/${rencana_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Fetching rencana error:", error.message);
      enqueueSnackbar("Gagal memuat data rencana.", { variant: "error" });
      throw error;
    }
  };

  const fetchAssetById = async (id, status, viewOnly = false) => {
    try {
      const token = localStorage.getItem("token");
      const url =
        status === "Data Darurat"
          ? `${BASE_URL_API}api/v1/manage-aset/darurat/${id}`
          : `${API_URL}/${id}`;
      const response = await fetchData(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      console.log("Fetched data:", data);

      const rencanaData = data.rencana_id
        ? await fetchRencanaById(data.rencana_id)
        : null;

      if (status === "Data Pemeliharaan") {
        setViewFormData({
          asset_id: data._id,
          rencana_id: data.rencana_id || "",
          kondisi_stlh_perbaikan: data.kondisi_stlh_perbaikan || "",
          status_pemeliharaan: data.status_pemeliharaan || "",
          penanggung_jawab: data.admin._id || "",
          pengawas:
            adminList.find((admin) => admin._id === data.penanggung_jawab)
              ?.nama_lengkap || data.penanggung_jawab,
          deskripsi_pemeliharaan: data.deskripsi || "",
          deskripsi_kerusakan: rencanaData ? rencanaData.deskripsi : "",
          tgl_dilakukan: data.tgl_dilakukan
            ? moment(data.tgl_dilakukan).toDate()
            : new Date(),
          waktu_pemeliharaan: data.waktu_pemeliharaan || "",
          usia_aset_saat_ini: rencanaData ? rencanaData.usia_aset : "",
          maksimal_usia_aset: rencanaData ? rencanaData.maks_usia_aset : "",
          tahun_produksi: rencanaData ? rencanaData.aset.tahun_produksi : "",
          vendor_pengelola: rencanaData ? rencanaData.vendor.nama_vendor : "",
          info_vendor: rencanaData ? rencanaData.vendor.telp_vendor : "",
          nama_aset: rencanaData ? rencanaData.aset.nama_aset : "",
          kategori_aset: rencanaData ? rencanaData.aset.kategori_aset : "",
          merek_aset: rencanaData ? rencanaData.aset.merek_aset : "",
          kode_produksi: rencanaData ? rencanaData.aset.kode_produksi : "",
          jumlah_aset: rencanaData ? rencanaData.aset.jumlah_aset : "",
          aset_masuk: rencanaData
            ? moment(rencanaData.aset.aset_masuk).toDate()
            : new Date(),
          garansi_dimulai: rencanaData
            ? moment(rencanaData.aset.garansi_dimulai).toDate()
            : new Date(),
          garansi_berakhir: rencanaData
            ? moment(rencanaData.aset.garansi_berakhir).toDate()
            : new Date(),
          status,
        });
      } else if (status === "Data Darurat") {
        setViewFormData({
          asset_id: data._id,
          rencana_id: data.rencana_id || "",
          kondisi_stlh_perbaikan: data.kondisi_stlh_perbaikan || "",
          status_pemeliharaan: data.status_pemeliharaan || "",
          penanggung_jawab: data.admin._id || "",
          pengawas:
            adminList.find((admin) => admin._id === data.penanggung_jawab)
              ?.nama_lengkap || data.penanggung_jawab,
          deskripsi_pemeliharaan: "",
          deskripsi_kerusakan: data.deskripsi_kerusakan || "",
          tgl_dilakukan: data.tgl_dilakukan
            ? moment(data.tgl_dilakukan).toDate()
            : new Date(),
          waktu_pemeliharaan: data.waktu_pemeliharaan || "",
          usia_aset_saat_ini: "",
          maksimal_usia_aset: "",
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
          gambar_aset: data.gambar_darurat?.image_url || "",
          status,
        });
      }

      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data aset.", { variant: "error" });
    }
  };

  const handleViewAsset = (id, status) => {
    fetchAssetById(id, status, true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
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

  const handleDateChange = (date) => {
    setFilterDate(date);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterConditionsChange = (e) => {
    const { name, checked } = e.target;
    setFilterConditions((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleFilterApply = () => {
    setIsFilterOpen(false);
    fetchAssets();
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.text("Riwayat Pemeliharaan Aset", 10, 10);
    const tableColumn = [
      "Nama Aset",
      "Tanggal Pemeliharaan",
      "Vendor Pengelola",
      "Penanggung Jawab",
      "Kondisi Setelah Perbaikan",
      "Status Perbaikan",
      "Status",
    ];
    const tableRows = [];
    assets.forEach((asset) => {
      const assetData = [
        asset.aset.nama_aset,
        moment(asset.tgl_dilakukan).format("DD MMM YYYY"),
        asset.vendor.nama_vendor,
        adminList.find((admin) => admin._id === asset.penanggung_jawab)
          ?.nama_lengkap || asset.penanggung_jawab,
        asset.kondisi_stlh_perbaikan,
        asset.status_pemeliharaan,
        asset.status,
      ];
      tableRows.push(assetData);
    });
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("riwayat_pemeliharaan_aset.pdf");
  };

  const filteredAssets = assets.filter(
    (asset) =>
      (filterStatus === "All" || asset.status === filterStatus) &&
      ((asset.kondisi_stlh_perbaikan === "Tidak dapat diperbaiki" &&
        asset.status_pemeliharaan === "Perbaikan gagal") ||
        (asset.kondisi_stlh_perbaikan === "Dapat digunakan" &&
          asset.status_pemeliharaan === "Selesai")) &&
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
          asset.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!filterDate || moment(asset.tgl_dilakukan).isSame(filterDate, "day"))
  );

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
          <div className="flex">
            <Button label="Cetak Data" onClick={handlePrint} className="ml-2" />
            <button
              className="btn btn-white flex items-center ml-2"
              onClick={handleFilterClick}
            >
              <FunnelIcon className="w-5 h-5 mr-2" />
              Tambahkan Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-4">
              Tidak ada riwayat aset yang ditemukan.
            </div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Nama Aset</th>
                  <th>Tanggal Pemeliharaan</th>
                  <th>Vendor Pengelola</th>
                  <th>Penanggung Jawab</th>
                  <th>Kondisi Setelah Perbaikan</th>
                  <th>Status Perbaikan</th>
                  <th>Data Perbaikan</th>
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
                      {adminList.find(
                        (admin) => admin._id === asset.penanggung_jawab
                      )?.nama_lengkap || asset.penanggung_jawab}
                    </td>
                    <td className="overflow-hidden overflow-ellipsis">
                      <span
                        style={{
                          ...getTagStyle(asset.kondisi_stlh_perbaikan),
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {asset.kondisi_stlh_perbaikan}
                      </span>
                    </td>
                    <td className="overflow-hidden overflow-ellipsis">
                      <span
                        style={{
                          ...getTagStyle(asset.status_pemeliharaan),
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {asset.status_pemeliharaan}
                      </span>
                    </td>
                    <td className="overflow-hidden overflow-ellipsis">
                      {asset.status}
                    </td>
                    <td className="overflow-hidden overflow-ellipsis flex">
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
                id="statusSelesai"
                name="selesai"
                onChange={handleFilterConditionsChange}
                className="form-checkbox h-4 w-4 text-[#4A5B34] rounded-md"
                checked={filterConditions.selesai}
              />
              <label htmlFor="statusSelesai" className="cursor-pointer ml-2">
                Selesai
              </label>
            </div>
            <div className="mb-4 flex items-center border rounded-lg p-2">
              <input
                type="checkbox"
                id="perbaikanGagal"
                name="perbaikanGagal"
                onChange={handleFilterConditionsChange}
                className="form-checkbox h-4 w-4 text-[#4A5B34] rounded-md"
                checked={filterConditions.perbaikanGagal}
              />
              <label htmlFor="perbaikanGagal" className="cursor-pointer ml-2">
                Perbaikan gagal
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
                <label htmlFor="view_rencana_id" className="block font-medium">
                  Nama Aset
                </label>
                <input
                  type="text"
                  id="view_rencana_id"
                  name="view_rencana_id"
                  value={viewFormData.nama_aset}
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
                  value={viewFormData.kondisi_stlh_perbaikan}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
            </div>
          </CardInput>

          <CardInput title="Detail Aset" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewFormData.status === "Data Pemeliharaan" && (
                <>
                  <div>
                    <label
                      htmlFor="view_usia_aset_saat_ini"
                      className="block font-medium"
                    >
                      Usia Aset Saat Ini
                    </label>
                    <input
                      type="number"
                      id="view_usia_aset_saat_ini"
                      name="view_usia_aset_saat_ini"
                      value={viewFormData.usia_aset_saat_ini}
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="view_maksimal_usia_aset"
                      className="block font-medium"
                    >
                      Maksimal Usia Aset
                    </label>
                    <input
                      type="number"
                      id="view_maksimal_usia_aset"
                      name="view_maksimal_usia_aset"
                      value={viewFormData.maksimal_usia_aset}
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                      disabled
                    />
                  </div>
                </>
              )}
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
                  value={viewFormData.tahun_produksi}
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
                  value={viewFormData.deskripsi_kerusakan}
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
                  value={moment(viewFormData.tgl_dilakukan).format(
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
                  value={viewFormData.status_pemeliharaan}
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
                  value={viewFormData.vendor_pengelola}
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
                  value={viewFormData.info_vendor}
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
                  value={
                    adminList.find(
                      (admin) => admin._id === viewFormData.penanggung_jawab
                    )?.nama_lengkap || viewFormData.penanggung_jawab
                  }
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="view_pengawas" className="block font-medium">
                  Pengawas
                </label>
                <input
                  type="text"
                  id="view_pengawas"
                  name="view_pengawas"
                  value={viewFormData.pengawas}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              {viewFormData.status !== "Data Darurat" && (
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
                    value={viewFormData.deskripsi_pemeliharaan}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    disabled
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="view_tgl_dilakukan"
                  className="block font-medium"
                >
                  Tanggal Pemeliharaan Dilakukan
                </label>
                <input
                  type="text"
                  id="view_tgl_dilakukan"
                  name="view_tgl_dilakukan"
                  value={moment(viewFormData.tgl_dilakukan).format(
                    "DD MMM YYYY"
                  )}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="view_waktu_pemeliharaan"
                  className="block font-medium"
                >
                  Perkiraan Waktu Pemeliharaan
                </label>
                <input
                  type="text"
                  id="view_waktu_pemeliharaan"
                  name="view_waktu_pemeliharaan"
                  value={viewFormData.waktu_pemeliharaan}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  disabled
                />
              </div>
            </div>
          </CardInput>

          {viewFormData.status === "Data Darurat" && (
            <CardInput title="Dokumen Aset" className="mt-4">
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <img
                    src={viewFormData.gambar_aset || "/default-image.png"}
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

export default RiwayatAset;
