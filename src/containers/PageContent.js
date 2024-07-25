import Header from "./Header";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import routes from "../routes";
import { Suspense, lazy } from "react";
import SuspenseContent from "./SuspenseContent";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import RouteAset from "../routes/RouteAset";
import RouteSuper from "../routes/Route";

const Page404 = lazy(() => import("../pages/protected/404"));

function PageContent() {
  const mainContentRef = useRef(null);
  const { pageTitle } = useSelector((state) => state.header);
  const role = JSON.parse(localStorage.getItem("user"))?.role || "";

  const setRoutesRole = () => {
    if (role === "admin aset") {
      return <RouteAset />;
    } else if (role === "admin operasional") {
      return <RouteSuper />;
    } else {
      return <RouteSuper />;
    }
  };

  // Scroll back to top on new page load
  useEffect(() => {
    mainContentRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [pageTitle]);

  return (
    <div className="drawer-content flex flex-col ">
      <Header />
      <main
        className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6 bg-base-200 text-fontPrimary"
        ref={mainContentRef}
      >
        <Suspense fallback={<SuspenseContent />}>
            {setRoutesRole()}
        </Suspense>
        <div className="h-16"></div>
      </main>
    </div>
  );
}

export default PageContent;
