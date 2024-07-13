import React, { useState, useEffect } from "react";
import { fetchData } from "../../../utils/utils"; // Adjust the path as needed
import BASE_URL_API from "../../../config"; // Adjust the path as needed
import TotalAssetsIcon from "../../../assets/icons/Total Aset.svg"; // Path to your Total Assets icon
import TotalVendorsIcon from "../../../assets/icons/Totalvendor.svg"; // Path to your Total Vendors icon

const ASSET_API_URL = `${BASE_URL_API}api/v1/manage-aset/aset`; // API endpoint for assets
const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`; // API endpoint for vendors

function PageStats() {
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalVendors, setTotalVendors] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTotalAssets();
    fetchTotalVendors();
  }, []);

  const fetchTotalAssets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(ASSET_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalAssets(response.data.length); // Get the total number of assets
      setIsLoading(false);
    } catch (error) {
      console.error("Fetching error:", error.message);
      setIsLoading(false);
    }
  };

  const fetchTotalVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(VENDOR_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalVendors(response.data.length); // Get the total number of vendors
      setIsLoading(false);
    } catch (error) {
      console.error("Fetching error:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="stats bg-base-100 shadow-lg rounded-lg p-6 flex space-x-6">
      <div className="stat bg-white rounded-md p-4 shadow-md flex-1 flex items-center justify-between">
        <div>
          <div className="text-gray-600 text-lg">Total Assets</div>
          <div className="text-3xl font-bold">
            {isLoading ? "Loading..." : totalAssets}
          </div>
          <div className="text-gray-500 text-sm">
            Jumlah aset yang terdaftar
          </div>
        </div>
        <img
          src={TotalAssetsIcon}
          alt="Total Assets Icon"
          className="w-12 h-12"
        />
      </div>

      <div className="stat bg-white rounded-md p-4 shadow-md flex-1 flex items-center justify-between">
        <div>
          <div className="text-gray-600 text-lg">Total Vendors</div>
          <div className="text-3xl font-bold">
            {isLoading ? "Loading..." : totalVendors}
          </div>
          <div className="text-gray-500 text-sm">
            Jumlah vendor yang terdaftar
          </div>
        </div>
        <img
          src={TotalVendorsIcon}
          alt="Total Vendors Icon"
          className="w-12 h-12"
        />
      </div>
    </div>
  );
}

export default PageStats;
