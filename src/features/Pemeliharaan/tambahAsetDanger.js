import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";

const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`;
const API_URL_ASSET = `${BASE_URL_API}api/v1/manage-aset/aset?limit=10&page=1`;
const API_URL_POST = `${BASE_URL_API}api/v1/manage-aset/darurat`;
const ADMIN_API_URL = `${BASE_URL_API}api/v1/manage-aset/admin`;

function TambahAsetDanger() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    namaAset: "",
    usiaAsetSaatIni: "",
    maksimalUsiaAset: "",
    tahunProduksi: "",
    tanggalPemeliharaanAset: new Date(),
    deskripsiKerusakan: "",
    statusPemeliharaan: "",
    vendorPengelola: "",
    infoVendor: "",
    namaPenanggungJawab: "",
    deskripsiPemeliharaan: "",
    tanggalPemeliharaan: new Date(),
    perkiraanWaktuPemeliharaan: "",
    kondisiStlhPerbaikan: "",
    admin_id: "",
    pengawas: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);

  const [asetList, setAsetList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [adminList, setAdminList] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const asetResponse = await axios.get(API_URL_ASSET);
        setAsetList(asetResponse.data.data || []);

        const vendorResponse = await axios.get(VENDOR_API_URL);
        setVendorList(vendorResponse.data.data || []);

        const adminResponse = await axios.get(ADMIN_API_URL);
        setAdminList(adminResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        enqueueSnackbar("Gagal memuat data aset!", { variant: "error" });
      }
    };

    fetchDropdownData();
  }, [enqueueSnackbar]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleAsetChange = (event) => {
    const selectedAsetId = event.target.value;
    const selectedAset = asetList.find((aset) => aset._id === selectedAsetId);
    if (selectedAset) {
      setFormData((prev) => ({
        ...prev,
        namaAset: selectedAsetId,
        usiaAsetSaatIni: "", // This should be fetched from relevant data if available
        maksimalUsiaAset: "", // This should be fetched from relevant data if available
        tahunProduksi: selectedAset.tahun_produksi,
        vendorPengelola: selectedAset.vendor_id,
        infoVendor: selectedAset.vendor ? selectedAset.vendor.telp_vendor : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        namaAset: "",
        usiaAsetSaatIni: "",
        maksimalUsiaAset: "",
        tahunProduksi: "",
        vendorPengelola: "",
        infoVendor: "",
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("AsetID", formData.namaAset);
    formDataToSend.append("VendorID", formData.vendorPengelola);
    formDataToSend.append(
      "KondisiStlhPerbaikan",
      formData.kondisiStlhPerbaikan
    );
    formDataToSend.append("StatusPemeliharaan", formData.statusPemeliharaan);
    formDataToSend.append("PenanggungJawab", formData.pengawas);
    formDataToSend.append("Deskripsi", formData.deskripsiPemeliharaan);
    formDataToSend.append(
      "TanggalDilakukan",
      formData.tanggalPemeliharaanAset.toISOString().split("T")[0]
    );
    formDataToSend.append(
      "WaktuPemeliharaan",
      formData.perkiraanWaktuPemeliharaan
    );
    formDataToSend.append("AdminID", formData.namaPenanggungJawab);
    formDataToSend.append("gambar", file);

    try {
      await axios.post(API_URL_POST, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      enqueueSnackbar("Data berhasil disimpan!", { variant: "success" });
    } catch (error) {
      console.error("Error posting data:", error);
      enqueueSnackbar("Gagal menyimpan data!", { variant: "error" });
    }
  };

  const getInputClassName = (isDisabled) =>
    `w-full p-2 border rounded text-gray-900 ${
      isDisabled ? "bg-gray-200 border-gray-400" : "bg-gray-50 border-gray-300"
    }`;

  return (
    <TitleCard title="Tambah Pemeliharaan Aset Darurat" topMargin="mt-2">
      <form onSubmit={handleSubmit}>
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
                <option value="">Pilih aset</option>
                {asetList.map((aset) => (
                  <option key={aset._id} value={aset._id}>
                    {aset.nama_aset}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="kondisiStlhPerbaikan"
                className="block font-medium"
              >
                Kondisi Setelah Perbaikan *
              </label>
              <select
                id="kondisiStlhPerbaikan"
                name="kondisiStlhPerbaikan"
                value={formData.kondisiStlhPerbaikan}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih jenis kondisi aset</option>
                <option value="Dapat digunakan">Dapat digunakan</option>
                <option value="Dalam perbaikan">Dalam Perbaikan</option>
                <option value="Tidak dapat diperbaiki">
                  Tidak dapat diperbaiki
                </option>
              </select>
            </div>
          </div>
        </CardInput>

        <CardInput title="Detail Aset">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className={getInputClassName(!!formData.namaAset)}
                readOnly={!!formData.namaAset}
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
                htmlFor="tanggalPemeliharaanAset"
                className="block font-medium"
              >
                Tgl Pemeliharaan Aset *
              </label>
              <DatePicker
                selected={formData.tanggalPemeliharaanAset}
                onChange={(date) =>
                  handleDateChange(date, "tanggalPemeliharaanAset")
                }
                className={getInputClassName(!!formData.namaAset)}
                wrapperClassName="date-picker"
                dateFormat="MMMM d, yyyy"
                disabled={!!formData.namaAset}
              />
            </div>
            <div>
              <label htmlFor="statusPemeliharaan" className="block font-medium">
                Status Pemeliharaan*
              </label>
              <select
                id="statusPemeliharaan"
                name="statusPemeliharaan"
                value={formData.statusPemeliharaan}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih status pemeliharaan</option>
                <option value="Selesai">Selesai</option>
                <option value="Sedang berlangsung">Sedang berlangsung</option>
                <option value="Perbaikan gagal">Perbaikan gagal</option>
              </select>
            </div>
          </div>
        </CardInput>

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
                className={getInputClassName(!!formData.namaAset)}
                readOnly={!!formData.namaAset}
              >
                <option value="">Pilih vendor</option>
                {Array.isArray(vendorList) &&
                  vendorList.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.nama_vendor}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="infoVendor" className="block font-medium">
                Informasi vendor / no telepon
              </label>
              <input
                type="text"
                id="infoVendor"
                name="infoVendor"
                value={formData.infoVendor}
                onChange={handleInputChange}
                placeholder="Masukkan informasi vendor"
                className={getInputClassName(!!formData.namaAset)}
                readOnly={true}
              />
            </div>
          </div>
        </CardInput>

        <CardInput title="Informasi Pemeliharaan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="namaPenanggungJawab"
                className="block font-medium"
              >
                Nama Penanggung Jawab *
              </label>
              <select
                id="namaPenanggungJawab"
                name="namaPenanggungJawab"
                value={formData.namaPenanggungJawab}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih penanggung jawab</option>
                {adminList.map((admin) => (
                  <option key={admin._id} value={admin._id}>
                    {admin.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pengawas" className="block font-medium">
                Pengawas
              </label>
              <select
                id="pengawas"
                name="pengawas"
                value={formData.pengawas}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih pengawas</option>
                {adminList.map((admin) => (
                  <option key={admin._id} value={admin.nama_lengkap}>
                    {admin.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="deskripsiPemeliharaan"
                className="block font-medium"
              >
                Deskripsi Pemeliharaan
              </label>
              <input
                type="text"
                id="deskripsiPemeliharaan"
                name="deskripsiPemeliharaan"
                value={formData.deskripsiPemeliharaan}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi pemeliharaan"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="tanggalPemeliharaan"
                className="block font-medium"
              >
                Tanggal Pemeliharaan Dilakukan
              </label>
              <DatePicker
                selected={formData.tanggalPemeliharaan}
                onChange={(date) =>
                  handleDateChange(date, "tanggalPemeliharaan")
                }
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                dateFormat="MMMM d, yyyy"
                wrapperClassName="date-picker"
              />
            </div>
            <div>
              <label
                htmlFor="perkiraanWaktuPemeliharaan"
                className="block font-medium"
              >
                Perkiraan Waktu Pemeliharaan
              </label>
              <input
                type="text"
                id="perkiraanWaktuPemeliharaan"
                name="perkiraanWaktuPemeliharaan"
                value={formData.perkiraanWaktuPemeliharaan}
                onChange={handleInputChange}
                placeholder="Masukkan perkiraan waktu pemeliharaan"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </CardInput>

        <CardInput title="Dokumen Kerusakan">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center justify-center w-full sm:w-24 h-24 bg-gray-200 rounded">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-12 w-12 text-gray-400 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7h18M3 12h18m-9 5h9"
                  />
                </svg>
              )}
            </div>

            <div className="flex items-center w-full sm:w-auto p-2 rounded">
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-green-500 hover:text-green-600 border border-green-500 font-medium py-2 px-6 rounded bg-white flex-grow sm:flex-grow-0"
              >
                Choose File
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <span className="ml-2 text-sm text-gray-500" id="file-chosen">
                {imagePreview ? fileName : "No File Chosen"}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center sm:text-left">
            Anda bisa mengunggah satu foto kerusakan aset di sini.
          </p>
        </CardInput>

        <div className="flex justify-end mt-4">
          <Button label="Simpan" type="submit" />
        </div>
      </form>
    </TitleCard>
  );
}

export default TambahAsetDanger;
