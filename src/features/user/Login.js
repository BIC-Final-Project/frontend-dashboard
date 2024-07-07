import { useState } from "react";
import { Link } from "react-router-dom";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import LoginImage from "../../assets/Login.png";
import LogoWhite from "../../assets/LogoWhite.svg";
import BASE_URL_API from "../../config";
import axios from 'axios';

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.emailId.trim() === "")
      return setErrorMessage("Email Id is required!");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required!");

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL_API}api/v1/auth/login`, {
        email: loginObj.emailId,
        password: loginObj.password,
      });

      console.log(response.data.token);

      const { token, refresh_token, data } = response.data;

      // Simpan token dan data pengguna di localStorage
      localStorage.setItem("access_token", response.data.token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(data));

      setLoading(false);
      window.location.href = "/app/asset/detail-aset";
    } catch (error) {
      setLoading(false);
      setErrorMessage("Email or Password is wrong!");
      console.error(error);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl">
        <div className="grid md:grid-cols-2 grid-cols-1 shadow-xl bg-base-100 rounded-[80px]">
          <div className="relative">
            <img
              src={LoginImage}
              alt="Login"
              className="object-cover rounded-l-[80px] hidden md:block"
            />
          </div>
          <div className="pb-20 pt-10 px-10">
            <div>
              <img src={LogoWhite} alt="Logo" className="w-[140px] my-3" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Login</h2>
            <p className="text-sm">
              Masuk dengan data Anda yang sudah di daftarkan.
            </p>
            <form onSubmit={submitForm}>
              <div className="mb-4">
                <InputText
                  type="emailId"
                  defaultValue={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn mt-2 w-full text-white bg-[#3A5913] hover:bg-[#617A42]" +
                  (loading ? " loading" : "")
                }
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
