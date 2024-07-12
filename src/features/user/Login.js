import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputText from "../../components/Input/InputText";
import LoginImage from "../../assets/Login.svg"; // Update path if needed
import LogoWhite from "../../assets/LogoBlack.svg";
import BASE_URL_API from "../../config";
import axios from "axios";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = async (e) => {
    e.preventDefault();

    if (loginObj.emailId.trim() === "") {
      const message = "Email Id dibutuhkan!";
      toast.error(message);
      return;
    }
    if (loginObj.password.trim() === "") {
      const message = "Password dibutuhkan!";
      toast.error(message);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL_API}api/v1/auth/login`, {
        email: loginObj.emailId,
        password: loginObj.password,
      });

      console.log(response.data);

      const { token, data } = response.data;

      // Simpan token dan data pengguna di localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      setLoading(false);

      // Simpan status login berhasil di localStorage
      localStorage.setItem("login_success", "true");

      // Alihkan pengguna ke dashboard
      window.location.href = "/app/dashboard";
    } catch (error) {
      setLoading(false);
      const message = "Email atau Password salah!";
      toast.error(message);
      console.error(error);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <ToastContainer />
      <div className="card mx-auto w-full max-w-5xl">
        <div className="grid md:grid-cols-2 grid-cols-1 shadow-xl bg-base-100 rounded-[80px] overflow-hidden">
          <div className="relative">
            <img
              src={LoginImage}
              alt="Login"
              className="object-cover w-full h-full md:h-[700px]"
              style={{
                borderTopLeftRadius: "70px",
                borderBottomLeftRadius: "70px",
              }}
            />
          </div>
          <div>
            <img
              src={LogoWhite}
              alt="Logo"
              className="w-[250px]"
              style={{ padding: "32px" }}
            />
            <div
              className="pb-20 px-8 flex flex-col justify-center relative"
              style={{ padding: "32px" }}
            >
              <div className="flex justify-center mb-6"></div>
              <h2 className="text-3xl font-semibold mb-2 text-center md:text-left">
                Login
              </h2>
              <p className="text-sm text-center md:text-left mb-6">
                Masuk dengan data Anda yang sudah di daftarkan.
              </p>
              <form onSubmit={submitForm}>
                <div className="mb-4">
                  <InputText
                    type="emailId"
                    defaultValue={loginObj.emailId}
                    updateType="emailId"
                    containerStyle="mt-4"
                    labelTitle="Email"
                    updateFormValue={updateFormValue}
                    placeholder="Masukkan username atau email anda"
                  />

                  <InputText
                    defaultValue={loginObj.password}
                    type="password"
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                    placeholder="Masukkan kata sandi anda"
                  />
                </div>

                <button
                  type="submit"
                  className="btn mt-2 w-full text-white bg-[#3A5913] hover:bg-[#617A42]"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
