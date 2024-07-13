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

ChartJS.register(ArcElement, Tooltip, Legend, Filler);

const API_URL = `${BASE_URL_API}api/v1/manage-aset/pelihara`;

function DoughnutChart() {
  const [chartData, setChartData] = useState({});
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
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(255, 206, 86, 0.8)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartData);
    } catch (error) {
      console.error("Fetching error:", error.message);
      enqueueSnackbar("Gagal memuat data pemeliharaan.", { variant: "error" });
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <TitleCard title={"Status Pemeliharaan"}>
      {chartData.labels ? (
        <Doughnut options={options} data={chartData} />
      ) : (
        <p>Loading...</p>
      )}
    </TitleCard>
  );
}

export default DoughnutChart;
