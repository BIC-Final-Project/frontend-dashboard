import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { fetchData, postData, updateData, deleteData } from "../../utils/utils";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/rencana`;
const API_URL_ASET = `${BASE_URL_API}api/v1/manage-aset/aset`;
const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`;

function TambahAset() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    namaAset: "",
    kondisiAset: "",
    usiaAsetSaatIni: "",
    maksimalUsiaAset: "",
    tahunProduksi: "",
    tanggalRencanaPemeliharaan: null,
    deskripsiKerusakan: "",
    statusPerencanaan: "",
    vendorPengelola: "",
    infoVendor: "",
  });
  const [asetList, setAsetList] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  useEffect(() => {
    fetchAset();
    fetchVendor();
  }, []);

  const fetchAset = async () => {
    try {
      const response = await fetchData(API_URL_ASET);
      const sortedData = response.data.sort(
        (a, b) => new Date(b.aset_masuk) - new Date(a.aset_masuk)
      );
      setAsetList(sortedData);
    } catch (error) {
      console.error("Error fetching aset data:", error);
      enqueueSnackbar("Gagal mengambil data aset!", { variant: "error" });
    }
  };

  const fetchVendor = async () => {
    try {
      const response = await fetchData(VENDOR_API_URL);
      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setVendorList(sortedData);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      enqueueSnackbar("Gagal mengambil data vendor!", { variant: "error" });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAsetChange = (event) => {
    const selectedAset = asetList.find(
      (aset) => aset._id === event.target.value
    );
    if (selectedAset) {
      setFormData((prev) => ({
        ...prev,
        namaAset: selectedAset._id,
        tahunProduksi: selectedAset.tahun_produksi,
        vendorPengelola: selectedAset.vendor._id,
        infoVendor: selectedAset.vendor.telp_vendor,
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, tanggalRencanaPemeliharaan: date }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestData = {
      AsetID: formData.namaAset,
      VendorID: formData.vendorPengelola,
      KondisiAset: formData.kondisiAset,
      TglPerencanaan: formData.tanggalRencanaPemeliharaan
        ? formData.tanggalRencanaPemeliharaan.toISOString().split("T")[0]
        : null,
      StatusAset: formData.statusPerencanaan,
      UsiaAset: formData.usiaAsetSaatIni,
      MaksUsiaAset: formData.maksimalUsiaAset,
      deskripsi: formData.deskripsiKerusakan,
    };

    try {
      console.log("Sending request data:", requestData);
      const response = await postData(API_URL, requestData);
      console.log("API response:", response);
      enqueueSnackbar("Data berhasil disimpan!", { variant: "success" });

      // Refresh the vendor list and add the new vendor to the top
      const newVendor = vendorList.find(
        (vendor) => vendor._id === formData.vendorPengelola
      );
      setVendorList((prevVendorList) => {
        const updatedVendorList = prevVendorList.filter(
          (vendor) => vendor._id !== newVendor._id
        );
        return [newVendor, ...updatedVendorList];
      });

      // Refresh the asset list to show the new asset at the top
      fetchAset();
    } catch (error) {
      console.error("Error posting data:", error);
      enqueueSnackbar("Gagal menyimpan data!", { variant: "error" });
    }
  };

  return (
    <TitleCard title="Rencana Pemeliharaan" topMargin="mt-2">
      <form onSubmit={handleSubmit}>
        {/* Bagian Identitas Aset menggunakan CardInput */}
        <CardInput title="Identitas Aset">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="namaAset" className="block font-medium">
                Nama Aset *
              </label>
              <select
                id="namaAset"
                name="namaAset"
                value={formData.namaAset}
                onChange={handleAsetChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih Aset Rencana pemeliharaan</option>
                {asetList.map((aset) => (
                  <option key={aset._id} value={aset._id}>
                    {aset.nama_aset}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="kondisiAset" className="block font-medium">
                Kondisi Aset *
              </label>
              <select
                id="kondisiAset"
                name="kondisiAset"
                value={formData.kondisiAset}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih jenis kondisi aset</option>
                <option value="Baik">Baik</option>
                <option value="Rusak">Rusak</option>
              </select>
            </div>
          </div>
        </CardInput>

        {/* Bagian Detail Aset menggunakan CardInput */}
        <CardInput title="Detail Aset">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="usiaAsetSaatIni" className="block font-medium">
                Usia Aset Saat Ini *
              </label>
              <input
                type="text"
                id="usiaAsetSaatIni"
                name="usiaAsetSaatIni"
                value={formData.usiaAsetSaatIni}
                onChange={handleInputChange}
                placeholder="Masukkan usia aset saat ini"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="maksimalUsiaAset" className="block font-medium">
                Maksimal Usia Aset *
              </label>
              <input
                type="text"
                id="maksimalUsiaAset"
                name="maksimalUsiaAset"
                value={formData.maksimalUsiaAset}
                onChange={handleInputChange}
                placeholder="Masukkan maksimal usia aset"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="tahunProduksi" className="block font-medium">
                Tahun Produksi
              </label>
              <input
                type="text"
                id="tahunProduksi"
                name="tahunProduksi"
                value={formData.tahunProduksi}
                onChange={handleInputChange}
                placeholder="Masukkan tahun produksi"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="deskripsiKerusakan" className="block font-medium">
                Deskripsi Kerusakan
              </label>
              <input
                type="text"
                id="deskripsiKerusakan"
                name="deskripsiKerusakan"
                value={formData.deskripsiKerusakan}
                onChange={handleInputChange}
                placeholder="Masukkan Deskripsi Kerusakan"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="tanggalRencanaPemeliharaan"
                className="block font-medium"
              >
                Tanggal Rencana Pemeliharaan *
              </label>
              <DatePicker
                selected={formData.tanggalRencanaPemeliharaan}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                dateFormat="MMMM d, yyyy"
                wrapperClassName="date-picker"
                placeholderText="Pilih rencana tanggal Pemeliharaan"
              />
            </div>
            <div>
              <label htmlFor="statusPerencanaan" className="block font-medium">
                Status Perencanaan *
              </label>
              <select
                id="statusPerencanaan"
                name="statusPerencanaan"
                value={formData.statusPerencanaan}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih status perencanaan</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Tidak Diperbaiki">Tidak Diperbaiki</option>
              </select>
            </div>
          </div>
        </CardInput>

        {/* Bagian Informasi Vendor menggunakan CardInput */}
        <CardInput title="Informasi Vendor">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="vendorPengelola" className="block font-medium">
                Vendor Pengelola *
              </label>
              <select
                id="vendorPengelola"
                name="vendorPengelola"
                value={formData.vendorPengelola}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih vendor</option>
                {vendorList.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.nama_vendor}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="infoVendor" className="block font-medium">
                Informasi Vendor / No Telepon
              </label>
              <input
                type="text"
                id="infoVendor"
                name="infoVendor"
                value={formData.infoVendor}
                onChange={handleInputChange}
                placeholder="Masukkan informasi vendor"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </CardInput>

        <div className="flex justify-end mt-4">
          <Button label="Simpan" type="submit" />
        </div>
      </form>
    </TitleCard>
  );
}

export default TambahAset;
