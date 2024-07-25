import React, { lazy, Suspense, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import checkAuth from "./app/auth";
import initializeApp from "./app/init";
import PrivateLayout from "./components/Layout/PrivateLayout";
import SuspenseContent from "./containers/SuspenseContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importing pages
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Documentation = lazy(() => import("./pages/Documentation"));

// Initializing different libraries
initializeApp();

// Check for login and initialize axios
checkAuth();

function App() {
  // useEffect(() => {
  //   if (!localStorage.getItem("theme")) {
  //     localStorage.setItem("theme", "light");
  //   }
  //   // 👆 daisy UI themes initialization
  //   themeChange(false);
  // }, []);

  return (
    <>
      <Router>
        <ToastContainer />

        <Suspense fallback={<SuspenseContent />}>
          <Routes>
            <Route path="/login" index element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/documentation" element={<Documentation />} />

            {/* Place new routes over this */}
            <Route element={<PrivateLayout />}>
              <Route path="/app/*" element={<Layout />} />
            </Route>

            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
