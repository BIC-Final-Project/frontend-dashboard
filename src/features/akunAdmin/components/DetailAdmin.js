import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../../components/Cards/TitleCard";
import CardInput from "../../../components/Cards/CardInput";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import ConfirmDialog from "../../../components/Dialog/ConfirmDialog";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import Button from "../../../components/Button";
import BASE_URL_API from "../../../config";
import { fetchData, updateData, deleteData } from "../../../utils/utils";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/admin`;
const ITEMS_PER_PAGE = 10;

const DetailAdmin = () => {
  const [admins, setAdmins] = useState([]);
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
    _id: "",
    nama_lengkap: "",
    no_handphone: "",
    email: "",
    role: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAdmins();
  }, [searchQuery, currentPage]);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(
        `${API_URL}?limit=${ITEMS_PER_PAGE}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { data, pagination } = response;

      // Reverse the data array to make the most recent entries appear first
      const reversedData = data.reverse();

      setAdmins(reversedData);
      setTotalPages(pagination.max_page);
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data admin.", { variant: "error" });
    }
  };

  const handleDeleteAdmin = (id) => {
    setModal({
      isOpen: true,
      message: "Apakah Anda yakin ingin menghapus admin ini?",
      type: "delete",
      id,
    });
  };

  const handleEditAdmin = (id) => {
    const admin = admins.find((admin) => admin._id === id);
    setEditFormData({ ...admin });
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
      const token = localStorage.getItem("token");
      await deleteData(`${API_URL}/${modal.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(admins.filter((admin) => admin._id !== modal.id));
      enqueueSnackbar("Admin berhasil dihapus.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Gagal menghapus admin.", { variant: "error" });
    }
    closeDialog();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nama_lengkap: editFormData.nama_lengkap,
      no_handphone: editFormData.no_handphone,
      email: editFormData.email,
      role: editFormData.role,
    };
    try {
      const token = localStorage.getItem("token");
      await updateData(`${API_URL}/${editFormData._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAdmins();
      enqueueSnackbar("Data admin berhasil diperbarui!", {
        variant: "success",
      });
      closeEditModal();
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(
          `Gagal memperbarui data admin! ${error.response.data.message}`,
          { variant: "error" }
        );
      } else {
        enqueueSnackbar("Gagal memperbarui data admin!", { variant: "error" });
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

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.no_handphone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <TitleCard title="Detail Admin Aset" topMargin="mt-2">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Cari admin..."
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>No Handphone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmins.map((admin) => (
                <tr key={admin._id} className="whitespace-nowrap">
                  <td className="overflow-hidden overflow-ellipsis">
                    {admin.nama_lengkap}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {admin.no_handphone}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {admin.email}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis">
                    {admin.role}
                  </td>
                  <td className="overflow-hidden overflow-ellipsis flex">
                    <button
                      className="btn btn-square btn-ghost text-red-500"
                      onClick={() => handleDeleteAdmin(admin._id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost text-yellow-500"
                      onClick={() => handleEditAdmin(admin._id)}
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
            <CardInput title="Detail Admin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nama_lengkap" className="block font-medium">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="nama_lengkap"
                    name="nama_lengkap"
                    value={editFormData.nama_lengkap}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="no_handphone" className="block font-medium">
                    No Handphone *
                  </label>
                  <input
                    type="text"
                    id="no_handphone"
                    name="no_handphone"
                    value={editFormData.no_handphone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block font-medium">
                    Role *
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={editFormData.role}
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
};

export default DetailAdmin;
