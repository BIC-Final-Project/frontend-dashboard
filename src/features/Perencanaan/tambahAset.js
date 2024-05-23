import { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";

function TambahAset() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    namaAset: "",
    kondisiAset: "",
    usiaAsetSaatIni: "",
    maksimalUsiaAset: "",
    tahunProduksi: "",
    tanggalRencanaPemeliharaan: new Date(),
    deskripsiKerusakan: "",
    statusPerencanaan: "",
    vendorPengelola: "",
    infoVendor: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("URL_API_POST", formData);
      enqueueSnackbar("Data berhasil disimpan!", { variant: "success" });
    } catch (error) {
      console.error("Error posting data:", error);
      enqueueSnackbar("Gagal menyimpan data!", { variant: "error" });
    }
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
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
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option>Pilih Aset Rencana pemeliharaan</option>
                <option value="Aset1">Aset 1</option>
                <option value="Aset2">Aset 2</option>
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
                <option>Pilih jenis kondisi aset</option>
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
              <label htmlFor="tanggalRencanaPemeliharaan" className="block font-medium">
                Tanggal Rencana Pemeliharaan *
              </label>
              <DatePicker
                selected={formData.tanggalRencanaPemeliharaan}
                onChange={(date) => handleDateChange('tanggalRencanaPemeliharaan', date)}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                dateFormat="MMMM d, yyyy"
                wrapperClassName="date-picker"
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
                <option>Pilih status perencanaan</option>
                <option value="direncanakan">Direncanakan</option>
                <option value="dilaksanakan">Dilaksanakan</option>
                <option value="selesai">Selesai</option>
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
                <option>Pilih vendor</option>
                <option value="Vendor1">Vendor 1</option>
                <option value="Vendor2">Vendor 2</option>
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
        <Button
            label="Simpan"
            onClick={() => {}}
          />
        </div>
      </form>
    </TitleCard>
  );
}

export default TambahAset;
