import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import BASE_URL_API from "../../config";
import { fetchData } from "../../utils/utils";
import jsPDF from "jspdf";
import "jspdf-autotable";

function RiwayatAset() {
  const { enqueueSnackbar } = useSnackbar();
  const [assets, setAssets] = useState([]);
  const [allAssets, setAllAssets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    filterAssets();
  }, [searchQuery]);

  const fetchAssets = async () => {
    try {
      const response = await fetchData(
        `${BASE_URL_API}api/v1/manage-aset/riwayat`
      );
      if (response && response.data) {
        const assetsWithIndex = response.data.map((asset, index) => ({
          ...asset,
          index,
        }));
        const sortedAssets = assetsWithIndex.sort((a, b) => b.index - a.index);

        setAllAssets(sortedAssets);
        setAssets(sortedAssets);
        setTotalPages(Math.ceil(sortedAssets.length / 10));
      } else {
        console.error("API error:", response.info);
      }
    } catch (error) {
      console.error("Axios error:", error.message);
    }
  };

  const filterAssets = () => {
    const filteredAssets = allAssets.filter((asset) =>
      asset.aset.nama_aset.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setAssets(filteredAssets);
    setTotalPages(Math.ceil(filteredAssets.length / 10));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handlePrint = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "Nama Aset",
          "Tanggal Pemeliharaan",
          "Vendor Pengelola",
          "Penanggung Jawab",
          "Aset Setelah Perbaikan",
          "Status Perbaikan",
        ],
      ],
      body: allAssets.map((asset) => [
        asset.aset.nama_aset,
        new Date(asset.tgl_dilakukan).toLocaleDateString(),
        asset.vendor.nama_vendor,
        asset.penanggung_jawab,
        asset.kondisi_stlh_perbaikan,
        asset.status_pemeliharaan,
      ]),
    });
    doc.save("assets_history.pdf");
  };

  const paginatedAssets = assets.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <TitleCard title="Riwayat Aset" topMargin="mt-2">
        <div className="mb-4 flex justify-between items-center relative">
          <input
            type="text"
            placeholder="Cari Aset"
            className="input input-bordered w-full max-w-xs"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button onClick={handlePrint} className="ml-2 btn btn-primary">
            Cetak Data
          </button>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama Aset</th>
                <th>Tanggal Pemeliharaan</th>
                <th>Vendor Pengelola</th>
                <th>Penanggung Jawab</th>
                <th>Aset Setelah Perbaikan</th>
                <th>Status Perbaikan</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAssets.map((asset) => (
                <tr key={asset._id}>
                  <td>{asset.aset.nama_aset}</td>
                  <td>{new Date(asset.tgl_dilakukan).toLocaleDateString()}</td>
                  <td>{asset.vendor.nama_vendor}</td>
                  <td>{asset.penanggung_jawab}</td>
                  <td>{asset.kondisi_stlh_perbaikan}</td>
                  <td>{asset.status_pemeliharaan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <button
              className="text-green-900 border border-green-900 hover:bg-green-100 px-4 py-2 rounded w-28"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="bg-[#3A5913] text-white hover:bg-[#293F0D] px-4 py-2 rounded ml-2 w-28"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default RiwayatAset;
