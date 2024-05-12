import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";

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
    // Sediakan data dummy sesuai struktur data yang diinginkan
    setAssets([
      { id: 1, name: 'Laptop HP', maintenanceDate: '2023-05-01', vendor: 'HP Inc.', responsiblePerson: 'John Doe', condition: 'Good', status: 'Completed' },
      { id: 2, name: 'Printer Epson', maintenanceDate: '2023-04-15', vendor: 'Epson', responsiblePerson: 'Jane Doe', condition: 'Needs Repair', status: 'Pending' }
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

  const closeDialog = () => {
    setModal({ isOpen: false, id: null });
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
                      onClick={() => console.log("Edit", asset.id)} // Tambahkan fungsi edit di sini
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
              className="btn"
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
    </>
  );
}

export default PemeliharaanAset;
