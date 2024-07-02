import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard"; // Adjusted path
import CardInput from "../../components/Cards/CardInput"; // Adjusted path
import Button from "../../components/Button"; // Adjusted path
import ErrorText from "../../components/Typography/ErrorText"; // Adjusted path
import InputText from "../../components/Input/InputText"; // Adjusted path
import BASE_URL_API from "../../config"; // Adjusted path
import axios from "axios";

const AdminForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const INITIAL_ADMIN_OBJ = {
    name: "",
    emailId: "",
    phoneNumber: "",
    password: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [adminObj, setAdminObj] = useState(INITIAL_ADMIN_OBJ);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    let timer;
    if (errorMessage) {
      timer = setTimeout(() => {
        setErrorMessage("");
      }, 2000); // Clear error message after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (adminObj.name.trim() === "")
      return setErrorMessage("Name is required!");
    if (adminObj.emailId.trim() === "")
      return setErrorMessage("Email is required!");
    if (adminObj.phoneNumber.trim() === "")
      return setErrorMessage("Phone Number is required!");
    if (adminObj.password.trim() === "")
      return setErrorMessage("Password is required!");

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL_API}api/v1/auth/register`, {
        nama_lengkap: adminObj.name,
        email: adminObj.emailId,
        no_handphone: adminObj.phoneNumber,
        password: adminObj.password,
        role: "admin",
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
      setErrorMessage("Registration failed!");
      enqueueSnackbar("Registration failed!", { variant: "error" });
      console.error(error);
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
              />
            </div>
            <div>
              <label htmlFor="emailId" className="block font-medium">
                Email *
              </label>
              <InputText
                defaultValue={adminObj.emailId}
                updateType="emailId"
                containerStyle=""
                updateFormValue={updateFormValue}
                placeholder="Masukan email admin"
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
                placeholder="Masukan nomor telepon admin"
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
                placeholder="Masukan password"
              />
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
        {errorMessage && (
          <div className="p-4 my-4 text-lg rounded-md bg-red-100 text-red-700 animate-slide-in">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-4 my-4 text-lg rounded-md bg-green-100 text-green-700 animate-slide-in">
            {successMessage}
          </div>
        )}
        {currentTime && (
          <div className="p-4 my-4 text-lg rounded-md bg-blue-100 text-blue-700 animate-slide-in">
            Form submitted at: {currentTime}
          </div>
        )}
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
