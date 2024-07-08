import { useState, useEffect } from "react";
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
import { fetchData, updateData, deleteData } from "../../utils/utils";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/pelihara`;
const DARURAT_URL = `${BASE_URL_API}api/v1/manage-aset/darurat`;
const ITEMS_PER_PAGE = 10;

function PemeliharaanAset() {
  const [assets, setAssets] = useState([]);
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
  const [editFormData, setEditFormData] = useState({
    rencana_id: "",
    kondisi_stlh_perbaikan: "",
    status_pemeliharaan: "",
    penanggung_jawab: "",
    deskripsi: "",
    tgl_dilakukan: new Date(),
    waktu_pemeliharaan: new Date(),
    usia_aset_saat_ini: "",
    maksimal_usia_aset: "",
    tahun_produksi: "",
    vendor_pengelola: "",
    info_vendor: "",
    nama_aset: "",
    deskripsi_aset: "",
    kategori_aset: "",
    merek_aset: "",
    kode_produksi: "",
    jumlah_aset: "",
    aset_masuk: "",
    garansi_dimulai: "",
    garansi_berakhir: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
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
      setAssets(allAssets);
      setTotalPages(Math.ceil(allAssets.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Fetching error:", error.message);
    }
  };

  const fetchAssetById = async (id, status) => {
    const url = status === "Data Darurat" ? DARURAT_URL : API_URL;
    try {
      const response = await fetchData(`${url}/${id}`);
      const data = response.data;
      setEditFormData({
        rencana_id: data.rencana_id || "",
        kondisi_stlh_perbaikan: data.kondisi_stlh_perbaikan || "",
        status_pemeliharaan: data.status_pemeliharaan || "",
        penanggung_jawab: data.penanggung_jawab || "",
        deskripsi: data.deskripsi || "",
        tgl_dilakukan: moment(data.tgl_dilakukan, "DD-MM-YYYY").toDate(),
        waktu_pemeliharaan: moment(
          data.waktu_pemeliharaan,
          "DD-MM-YYYY"
        ).toDate(),
        usia_aset_saat_ini: data.aset.usia_aset_saat_ini || "",
        maksimal_usia_aset: data.aset.maksimal_usia_aset || "",
        tahun_produksi: data.aset.tahun_produksi || "",
        vendor_pengelola: data.vendor.nama_vendor || "",
        info_vendor: data.vendor.telp_vendor || "",
        nama_aset: data.aset.nama_aset || "",
        deskripsi_aset: data.aset.deskripsi_aset || "",
        kategori_aset: data.aset.kategori_aset || "",
        merek_aset: data.aset.merek_aset || "",
        kode_produksi: data.aset.kode_produksi || "",
        jumlah_aset: data.aset.jumlah_aset || "",
        aset_masuk: moment(data.aset.aset_masuk, "YYYY-MM-DD").toDate(),
        garansi_dimulai: moment(
          data.aset.garansi_dimulai,
          "YYYY-MM-DD"
        ).toDate(),
        garansi_berakhir: moment(
          data.aset.garansi_berakhir,
          "YYYY-MM-DD"
        ).toDate(),
      });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Fetching error:", error.message);
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

  const closeDialog = () => {
    setModal({ isOpen: false, id: null, status: "" });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const confirmDelete = async () => {
    const url = modal.status === "Data Darurat" ? DARURAT_URL : API_URL;
    try {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateData(`${API_URL}/${editFormData.rencana_id}`, {
        ...editFormData,
        tgl_dilakukan: moment(editFormData.tgl_dilakukan).format("DD-MM-YYYY"),
        waktu_pemeliharaan: moment(editFormData.waktu_pemeliharaan).format(
          "DD-MM-YYYY"
        ),
      });
      fetchAssets();
      enqueueSnackbar("Data berhasil diperbarui!", { variant: "success" });
      closeEditModal();
    } catch (error) {
      enqueueSnackbar("Gagal memperbarui data!", { variant: "error" });
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
                <th>Aset Setelah Perbaikan</th>
                <th>Status Perbaikan</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.aset.nama_aset}</td>
                  <td>{moment(asset.tgl_dilakukan).format("DD MMM YYYY")}</td>
                  <td>{asset.vendor.nama_vendor}</td>
                  <td>{asset.penanggung_jawab}</td>
                  <td>{asset.kondisi_stlh_perbaikan}</td>
                  <td>{asset.status_pemeliharaan}</td>
                  <td>{asset.status}</td>
                  <td>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDeleteAsset(asset._id, asset.status)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEditAsset(asset._id, asset.status)}
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
                  <input
                    type="text"
                    id="nama_aset"
                    name="nama_aset"
                    value={editFormData.nama_aset}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="kondisi_stlh_perbaikan"
                    className="block font-medium"
                  >
                    Kondisi Setelah Perbaikan *
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
                    <option value="Tidak dapat digunakan">
                      Tidak dapat digunakan
                    </option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Detail aset" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label htmlFor="deskripsi" className="block font-medium">
                    Deskripsi Kerusakan
                  </label>
                  <input
                    type="text"
                    id="deskripsi"
                    name="deskripsi"
                    value={editFormData.deskripsi}
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
                    <option value="Perbaikan berhasil">
                      Perbaikan berhasil
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
                  <input
                    type="text"
                    id="penanggung_jawab"
                    name="penanggung_jawab"
                    value={editFormData.penanggung_jawab}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
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

export default PemeliharaanAset;
