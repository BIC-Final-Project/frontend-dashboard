import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard"; // Pastikan jalur ini benar
import CardInput from "../../components/Cards/CardInput"; // Pastikan jalur ini benar
import Button from "../../components/Button"; // Pastikan jalur ini benar
import InputText from "../../components/Input/InputText"; // Pastikan jalur ini benar
import BASE_URL_API from "../../config"; // Pastikan jalur ini benar
import axios from "axios";

const AdminForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const INITIAL_ADMIN_OBJ = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "", // Default value for role
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [adminObj, setAdminObj] = useState(INITIAL_ADMIN_OBJ);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 2000); // Clear error message after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (adminObj.name.trim() === "")
      return enqueueSnackbar("Name is required!", { variant: "error" });
    if (adminObj.email.trim() === "")
      return enqueueSnackbar("Email is required!", { variant: "error" });
    if (adminObj.phoneNumber.trim() === "")
      return enqueueSnackbar("Phone number is required!", { variant: "error" });
    if (adminObj.password.trim() === "")
      return enqueueSnackbar("Password is required!", { variant: "error" });
    if (adminObj.role.trim() === "")
      return enqueueSnackbar("Role is required!", { variant: "error" });

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL_API}api/v1/auth/register`, {
        nama_lengkap: adminObj.name,
        no_handphone: adminObj.phoneNumber,
        email: adminObj.email,
        password: adminObj.password,
        role: adminObj.role,
      });

      const { message } = response.data;

      enqueueSnackbar(message, { variant: "success" });
      setLoading(false);
      setSuccessMessage("User created");

      // Reset form
      setAdminObj(INITIAL_ADMIN_OBJ);

      // Update the current time
      const currentTimeString = new Date().toLocaleString();
      setCurrentTime(currentTimeString);
    } catch (error) {
      setLoading(false);
      const errorMsg = error.response
        ? error.response.data.message
        : error.message;
      setErrorMessage(errorMsg);
      enqueueSnackbar(`Registration failed: ${errorMsg}`, { variant: "error" });
      console.error(errorMsg);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setSuccessMessage("");
    setAdminObj({ ...adminObj, [updateType]: value });
  };

  return (
    <TitleCard title="Tambah Akun Admin" topMargin="mt-2">
      <form onSubmit={submitForm}>
        <CardInput title="Admin Details" className="rounded-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium">
                Name *
              </label>
              <InputText
                defaultValue={adminObj.name}
                updateType="name"
                containerStyle=""
                updateFormValue={updateFormValue}
                placeholder="Masukkan nama admin"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium">
                Email *
              </label>
              <InputText
                defaultValue={adminObj.email}
                updateType="email"
                containerStyle=""
                updateFormValue={updateFormValue}
                placeholder="Masukkan email admin"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block font-medium">
                Phone Number *
              </label>
              <InputText
                defaultValue={adminObj.phoneNumber}
                updateType="phoneNumber"
                containerStyle=""
                updateFormValue={updateFormValue}
                placeholder="Masukkan nomor telepon admin"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-medium">
                Password *
              </label>
              <InputText
                defaultValue={adminObj.password}
                type="password"
                updateType="password"
                containerStyle=""
                updateFormValue={updateFormValue}
                placeholder="Masukkan password"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block font-medium">
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={adminObj.role}
                onChange={(e) =>
                  updateFormValue({
                    updateType: "role",
                    value: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                required
              >
                <option value="">Pilih role yang akan ditambahkan</option>
                <option value="admin aset">Admin Aset</option>
                <option value="admin operasional">Admin Operasional</option>
                <option value="super admin">Super Admin</option>
              </select>
            </div>
          </div>
        </CardInput>

        <div className="flex justify-end mt-4">
          <Button
            label={loading ? "Creating..." : "Tambah Admin"}
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
      `}</style>
    </TitleCard>
  );
};

export default AdminForm;
