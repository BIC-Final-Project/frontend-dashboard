import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const checkAuth = () => {
  /*  Getting token value stored in localstorage, if token is not present we will open login page 
    for all internal dashboard routes  */
  const TOKEN = localStorage.getItem("token");

  if (TOKEN) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${TOKEN}`;

    axios.interceptors.request.use(
      function (config) {
        // UPDATE: Add this code to show global loading indicator
        // document.body.classList.add('loading-indicator');
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function (response) {
        // UPDATE: Add this code to hide global loading indicator
        // document.body.classList.remove('loading-indicator');
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // document.body.classList.remove('loading-indicator');
        const decodedToken = jwtDecode(TOKEN);
        const isExpired = decodedToken.exp * 1000 < Date.now();
        if (isExpired) {
          toast.error("Your Session Expired");
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        }
        return Promise.reject(error);
      }
    );

    return TOKEN;
  }
};

export default checkAuth;
