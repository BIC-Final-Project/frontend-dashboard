import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateLayout = () => {
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();
      console.log({ isExpired });
      if (isExpired) {
        setIsTokenExpired(isExpired);
        // toast.error('Your Session Expired')
        localStorage.clear();
      }
    }
  }, []);

  return (
    <>
      {!token || isTokenExpired ? <Navigate to="/login" replace /> : <Outlet />}
    </>
  );
};

export default PrivateLayout;
