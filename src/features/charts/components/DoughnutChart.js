import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";
import { fetchData } from "../../../utils/utils";
import BASE_URL_API from "../../../config";
import { useSnackbar } from "notistack";
import Spinner from "../../../components/Spinner"; // Add the Spinner component

ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const API_URL = `${BASE_URL_API}api/v1/manage-aset/pelihara`;

function DoughnutChart() {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [statusCounts, setStatusCounts] = useState({
    Selesai: 0,
    "Sedang berlangsung": 0,
    "Perbaikan gagal": 0,
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchData(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data_darurat, data_pemeliharaan } = response;

      // Merge the two datasets
      const allData = [...data_darurat, ...data_pemeliharaan];

      console.log("Fetched data:", allData); // Log the fetched data to verify

      // Initialize status counts with all possible statuses
      const statusCounts = {
        Selesai: 0,
        "Sedang berlangsung": 0,
        "Perbaikan gagal": 0,
      };

      // Process the data to get the count of each status
      allData.forEach((item) => {
        if (statusCounts[item.status_pemeliharaan] !== undefined) {
          statusCounts[item.status_pemeliharaan] += 1;
        }
      });

      console.log("Processed status counts:", statusCounts); // Log the processed status counts

      // Prepare chart data
      const labels = Object.keys(statusCounts);
      const counts = Object.values(statusCounts);

      const chartData = {
        labels,
        datasets: [
          {
            label: "# of Pemeliharaan",
            data: counts,
            backgroundColor: [
              "rgba(160, 254, 208, 0.8)", // Color for Selesai
              "rgba(255, 233, 158, 0.8)", // Color for Sedang berlangsung
              "rgba(255, 146, 134, 0.8)", // Color for Perbaikan gagal
            ],
            borderColor: [
              "rgba(160, 254, 208, 1)", // Border color for Selesai
              "rgba(255, 233, 158, 1)", // Border color for Sedang berlangsung
              "rgba(255, 146, 134, 1)", // Border color for Perbaikan gagal
            ],
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartData);
      setStatusCounts(statusCounts); // Set status counts
      setIsLoading(false); // Set loading state to false
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data pemeliharaan.", { variant: "error" });
      setIsLoading(false); // Set loading state to false
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true, // Use point style for legend
          boxWidth: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
    animation: {
      duration: 1500, // Set animation duration
    },
  };

  return (
    <TitleCard title={"Status Pemeliharaan"}>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner /> {/* Display a spinner while loading */}
        </div>
      ) : (
        <>
          <div className="p-4">
            <Doughnut options={options} data={chartData} />
          </div>
          <div className="p-4 mt-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">
              Rincian Status Pemeliharaan
            </h3>
            <ul className="list-none space-y-2">
              <li className="flex items-center space-x-2">
                <span className="block w-4 h-4 bg-green-200 rounded-full"></span>
                <span className="font-semibold">Selesai:</span>{" "}
                <span>{statusCounts.Selesai}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="block w-4 h-4 bg-yellow-200 rounded-full"></span>
                <span className="font-semibold">Sedang berlangsung:</span>{" "}
                <span>{statusCounts["Sedang berlangsung"]}</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="block w-4 h-4 bg-red-200 rounded-full"></span>
                <span className="font-semibold">Perbaikan gagal:</span>{" "}
                <span>{statusCounts["Perbaikan gagal"]}</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </TitleCard>
  );
}

export default DoughnutChart;
