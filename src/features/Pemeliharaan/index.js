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
      const dataDarurat = response.data_darurat.map((item) => ({
        ...item,
        status: "Data Darurat",
      }));
      const dataPemeliharaan = response.data_pemeliharaan.map((item) => ({
        ...item,
        status: "Data Pemeliharaan",
      }));
      const allAssets = [...dataDarurat, ...dataPemeliharaan];
      allAssets.sort((a, b) => new Date(b.tgl_dilakukan) - new Date(a.tgl_dilakukan));
      setAssets(allAssets);
      setTotalPages(Math.ceil(allAssets.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Fetching error:", error.message);
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

  const handleEditAsset = (asset) => {
    setEditFormData({
      rencana_id: asset.rencana_id,
      kondisi_stlh_perbaikan: asset.kondisi_stlh_perbaikan,
      status_pemeliharaan: asset.status_pemeliharaan,
      penanggung_jawab: asset.penanggung_jawab,
      deskripsi: asset.deskripsi,
      tgl_dilakukan: moment(asset.tgl_dilakukan, "DD-MM-YYYY").toDate(),
      waktu_pemeliharaan: moment(asset.waktu_pemeliharaan, "DD-MM-YYYY").toDate(),
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
      await deleteData(`${API_URL}/${modal.id}`);
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
              className="bg-green-900 text-white hover:bg-green-700 px-4 py-2 rounded ml-2 w-28"
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
                  <input
                    type="text"
                    id="rencana_id"
                    name="rencana_id"
                    value={editFormData.rencana_id}
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
                    <option value="can be used">can be used</option>
                    <option value="Tidak dapat digunakan">
                      Tidak dapat digunakan
                    </option>
                  </select>
                </div>
              </div>
            </CardInput>

            <CardInput title="Detail Aset" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option value="Accepted">Accepted</option>
                    <option value="Perbaikan berhasil">
                      Perbaikan berhasil
                    </option>
                    <option value="Perbaikan gagal">Perbaikan gagal</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="penanggung_jawab"
                    className="block font-medium"
                  >
                    Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    id="penanggung_jawab"
                    name="penanggung_jawab"
                    value={editFormData.penanggung_jawab}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama penanggung jawab"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="deskripsi" className="block font-medium">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    id="deskripsi"
                    name="deskripsi"
                    value={editFormData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi"
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="tgl_dilakukan" className="block font-medium">
                    Tanggal Dilakukan *
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
                    htmlFor="waktu_pemeliharaan"
                    className="block font-medium"
                  >
                    Waktu Pemeliharaan *
                  </label>
                  <DatePicker
                    selected={editFormData.waktu_pemeliharaan}
                    onChange={(date) =>
                      handleDateChange(date, "waktu_pemeliharaan")
                    }
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                    wrapperClassName="date-picker"
                    dateFormat="MMMM d, yyyy"
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
