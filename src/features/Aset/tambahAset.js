import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { postData, fetchData } from "../../utils/utils";
import moment from "moment"; // pastikan untuk mengimpor moment

function TambahAset() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    NamaAset: "",
    merekAset: "",
    kategoriAset: "",
    jumlahAset: "",
    deskripsiAset: "",
    VendorID: "",
    infoVendor: "",
    tahunProduksi: "",
    jumlahAsetMasuk: "",
    tanggalAsetMasuk: new Date(),
    tanggalGaransiMulai: new Date(),
    tanggalGaransiBerakhir: new Date(),
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [vendors, setVendors] = useState([]);

  console.log(formData);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetchData(
          `${BASE_URL_API}api/v1/manage-aset/vendor`
        );
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
        enqueueSnackbar("Gagal memuat data vendor!", { variant: "error" });
      }
    };

    fetchVendors();
  }, [enqueueSnackbar]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "VendorID") {
      const selectedVendor = vendors.find(vendor => vendor._id === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        infoVendor: selectedVendor ? selectedVendor.telp_vendor : ""
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedVendor = vendors.find(
      (vendor) => vendor.nama_vendor === formData.namaVendor
    );
    console.log(selectedVendor);

    const dataToSubmit = new FormData();
    dataToSubmit.append("VendorID", formData.VendorID);
    dataToSubmit.append("NamaAset", formData.NamaAset);
    dataToSubmit.append("kategori", formData.kategoriAset);
    dataToSubmit.append("MerekAset", formData.merekAset);
    dataToSubmit.append("kode", formData.noSeri);
    dataToSubmit.append("TahunProduksi", formData.tahunProduksi);
    dataToSubmit.append("deskripsi", formData.deskripsiAset);
    dataToSubmit.append("jumlah", formData.jumlahAsetMasuk);
    dataToSubmit.append(
      "asetmasuk",
      moment(formData.tanggalAsetMasuk).format("YYYY-MM-DD")
    );
    dataToSubmit.append(
      "garansidimulai",
      moment(formData.tanggalGaransiMulai).format("YYYY-MM-DD")
    );
    dataToSubmit.append(
      "Garansiberakhir",
      moment(formData.tanggalGaransiBerakhir).format("YYYY-MM-DD")
    );

    if (imageFile) {
      dataToSubmit.append("gambar", imageFile, fileName);
    }

    try {
      const result = await postData(
        `${BASE_URL_API}api/v1/manage-aset/aset`,
        dataToSubmit,
        true
      );
      if (result.status === 200 || result.status === 201) {
        enqueueSnackbar("Aset berhasil disimpan.", { variant: "success" });
        // Reset form
        setFormData({
          namaAset: "",
          merekAset: "",
          kategoriAset: "",
          jumlahAset: "",
          deskripsiAset: "",
          namaVendor: "",
          infoVendor: "",
          jumlahAsetMasuk: "",
          tanggalAsetMasuk: new Date(),
          tanggalGaransiMulai: new Date(),
          tanggalGaransiBerakhir: new Date(),
        });
        setImageFile(null);
        setImagePreview(null);
        setFileName("");
      } else {
        enqueueSnackbar("Gagal menyimpan aset.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Gagal menyimpan aset.", { variant: "error" });
    }
  };

  const handleDateChange = (date, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: date }));
  };

  return (
    <TitleCard title="Tambah Aset" topMargin="mt-2">
      <form onSubmit={handleSubmit}>
        {/* Bagian Identitas Aset menggunakan CardInput */}
        <CardInput title="Identitas Aset">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="namaAset" className="block font-medium">
                Nama Aset *
              </label>
              <input
                type="text"
                id="NamaAset"
                name="NamaAset"
                value={formData.namaAset}
                onChange={handleInputChange}
                placeholder="Masukkan Nama Aset"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="kategoriAset" className="block font-medium">
                Kategori Aset *
              </label>
              <select
                id="kategoriAset"
                name="kategoriAset"
                value={formData.kategoriAset}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih jenis kategori aset</option>
                <option value="asetLama">Aset Lama</option>
                <option value="asetBaru">Aset Baru</option>
              </select>
            </div>
          </div>
        </CardInput>

        {/* Bagian Detail Aset menggunakan CardInput */}
        <CardInput title="Detail Aset">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="merekAset" className="block font-medium">
                Merek Aset *
              </label>
              <input
                type="text"
                id="merekAset"
                name="merekAset"
                value={formData.merekAset}
                onChange={handleInputChange}
                placeholder="Masukkan Merek Aset"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="noSeri" className="block font-medium">
                No. Seri / Kode Produksi
              </label>
              <input
                type="text"
                id="noSeri"
                name="noSeri"
                value={formData.noSeri}
                onChange={handleInputChange}
                placeholder="Masukkan No. Seri / Kode Produksi"
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
              <label htmlFor="deskripsiAset" className="block font-medium">
                Deskripsi Aset
              </label>
              <input
                type="text"
                id="deskripsiAset"
                name="deskripsiAset"
                value={formData.deskripsiAset}
                onChange={handleInputChange}
                placeholder="Masukkan Deskripsi Aset"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="tanggalGaransiMulai"
                className="block font-medium"
              >
                Masa Garansi Aset Dimulai
              </label>
              <DatePicker
                selected={formData.tanggalGaransiMulai}
                onChange={(date) =>
                  handleDateChange(date, "tanggalGaransiMulai")
                }
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                dateFormat="MMMM d, yyyy"
                wrapperClassName="date-picker"
              />
            </div>
            <div>
              <label
                htmlFor="tanggalGaransiBerakhir"
                className="block font-medium"
              >
                Masa Garansi Aset Berakhir
              </label>
              <DatePicker
                selected={formData.tanggalGaransiBerakhir}
                onChange={(date) =>
                  handleDateChange(date, "tanggalGaransiBerakhir")
                }
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                dateFormat="MMMM d, yyyy"
                wrapperClassName="date-picker"
              />
            </div>
          </div>
        </CardInput>

        <CardInput title="Dokumen Aset">
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
            Anda bisa mengunggah satu foto utama aset di sini.
          </p>
        </CardInput>

        <CardInput title="Vendor Aset">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="namaVendor" className="block font-medium">
                Nama Vendor *
              </label>
              <select
                id="VendorID"
                name="VendorID"
                value={formData.namaVendor}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              >
                <option value="">Pilih vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.nama_vendor}
                  </option>
                ))}
              </select>

              <label
                htmlFor="jumlahAsetMasuk"
                className="block font-medium mt-4"
              >
                Jumlah Aset Masuk *
              </label>
              <input
                type="text"
                id="jumlahAsetMasuk"
                name="jumlahAsetMasuk"
                value={formData.jumlahAsetMasuk}
                onChange={handleInputChange}
                placeholder="Masukkan jumlah aset masuk"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
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

              <label htmlFor="tglAsetMasuk" className="block font-medium mt-4">
                Tgl Aset Masuk *
              </label>
              <DatePicker
                selected={formData.tanggalAsetMasuk}
                onChange={(date) => handleDateChange(date, "tanggalAsetMasuk")}
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                dateFormat="MMMM d, yyyy"
                wrapperClassName="date-picker"
              />
            </div>
          </div>
        </CardInput>

        <div className="flex justify-end mt-4">
          <Button label="Simpan Aset" onClick={handleSubmit} />
        </div>
      </form>
    </TitleCard>
  );
}

export default TambahAset;
