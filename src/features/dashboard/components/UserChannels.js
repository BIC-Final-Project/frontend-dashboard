import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../../components/Cards/TitleCard";
import { fetchData } from "../../../utils/utils";
import BASE_URL_API from "../../../config";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/admin`;

function UserChannels() {
  const [users, setUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data } = response;
      setUsers(data);
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data pengguna.", { variant: "error" });
    }
  };

  return (
    <TitleCard title={"Karyawan Batununggal Indah Club"}>
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-center">
                No
              </th>
              <th className="border border-gray-200 px-4 py-2">Nama Lengkap</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Status Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.nama_lengkap}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.role}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Tidak ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}

export default UserChannels;
