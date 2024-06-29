import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import LoginImage from "../../assets/Login.png";
import LogoWhite from "../../assets/LogoWhite.svg";
import BASE_URL_API from "../../config";
import axios from 'axios';

function Register() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    emailId: "",
    phoneNumber: "",
    password: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (registerObj.name.trim() === "")
      return setErrorMessage("Name is required!");
    if (registerObj.emailId.trim() === "")
      return setErrorMessage("Email Id is required!");
    if (registerObj.phoneNumber.trim() === "")
      return setErrorMessage("Phone Number is required!");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Password is required!");

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL_API}api/v1/auth/register`, {
        nama_lengkap: registerObj.name,
        email: registerObj.emailId,
        no_handphone: registerObj.phoneNumber,
        password: registerObj.password,
        role: "user",
      });

      const { message } = response.data;

      alert(message);
      setLoading(false);
      window.location.href = "/app/asset/detail-aset";
    } catch (error) {
      setLoading(false);
      setErrorMessage("Registration failed!");
      console.error(error);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl">
        <div className="grid md:grid-cols-2 grid-cols-1 shadow-xl bg-base-100 rounded-[80px]">
          <div className="relative">
            <img
              src={LoginImage}
              alt="Register"
              className="object-cover rounded-l-[80px] hidden md:block"
            />
          </div>
          <div className="pb-20 pt-10 px-10">
            <div>
              <img src={LogoWhite} alt="Logo" className="w-[140px] my-3" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Register</h2>
            <p className="text-sm mb-4">
              Daftar dengan data Anda yang valid.
            </p>
            <form onSubmit={submitForm}>
              <div className="mb-4 space-y-4">
                <InputText
                  defaultValue={registerObj.name}
                  updateType="name"
                  containerStyle=""
                  labelTitle="Name"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.emailId}
                  updateType="emailId"
                  containerStyle=""
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.phoneNumber}
                  updateType="phoneNumber"
                  containerStyle=""
                  labelTitle="Phone Number"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.password}
                  type="password"
                  updateType="password"
                  containerStyle=""
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn mt-2 w-full text-white bg-[#3A5913] hover:bg-[#617A42]" +
                  (loading ? " loading" : "")
                }
              >
                Register
              </button>

              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Login
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
