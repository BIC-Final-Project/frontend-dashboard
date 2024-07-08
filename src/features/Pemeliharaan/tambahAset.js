import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { fetchData, postData } from "../../utils/utils";

const API_URL = `${BASE_URL_API}api/v1/manage-aset/pelihara`;
const API_URL_RENCANA = `${BASE_URL_API}api/v1/manage-aset/rencana`;
const VENDOR_API_URL = `${BASE_URL_API}api/v1/manage-aset/vendor`;

function TambahAset() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    rencana_id: "",
    namaAset: "",
    kondisi_stlh_perbaikan: "",
    usiaAsetSaatIni: "",
    maksimalUsiaAset: "",
    tahunProduksi: "",
    tanggalPemeliharaanAset: new Date(),
    deskripsiKerusakan: "",
    status_pemeliharaan: "",
    vendorPengelola: "",
    infoVendor: "",
    penanggung_jawab: "",
    deskripsi: "",
    tgl_dilakukan: new Date(),
    waktu_pemeliharaan: "",
    kondisi_stlh_perbaikan: "",
  });
  const [asetList, setAsetList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [selectedRencana, setSelectedRencana] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const asetResponse = await fetchData(API_URL_RENCANA);
        setAsetList(asetResponse.data);

        const vendorResponse = await fetchData(VENDOR_API_URL);
        setVendorList(vendorResponse.data);

        if (asetResponse.data.length === 0) {
          enqueueSnackbar("Tidak ada aset yang tersedia untuk pemeliharaan!", {
            variant: "info",
          });
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        enqueueSnackbar("Gagal memuat data dropdown!", { variant: "error" });
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

  const handleRencanaChange = (event) => {
    const selectedRencanaId = event.target.value;
    const selectedRencana = asetList.find(
      (aset) => aset._id === selectedRencanaId
    );
    if (selectedRencana) {
      setSelectedRencana(selectedRencana);
      setFormData({
        rencana_id: selectedRencana._id,
        namaAset: selectedRencana.aset.nama_aset,
        kondisi_stlh_perbaikan: selectedRencana.kondisi_aset,
        usiaAsetSaatIni: selectedRencana.usia_aset,
        maksimalUsiaAset: selectedRencana.maks_usia_aset,
        tahunProduksi: selectedRencana.aset.tahun_produksi,
        tanggalPemeliharaanAset: new Date(selectedRencana.tgl_perencanaan),
        deskripsiKerusakan: selectedRencana.deskripsi,
        status_pemeliharaan: "",
        vendorPengelola: selectedRencana.vendor._id,
        infoVendor: selectedRencana.vendor.telp_vendor,
        penanggung_jawab: "",
        deskripsi: "",
        tgl_dilakukan: new Date(),
        waktu_pemeliharaan: "",
        kondisi_stlh_perbaikan: "",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await postData(API_URL, formData);
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
    <TitleCard title="Tambah Pemeliharaan Aset" topMargin="mt-2">
      {asetList.length > 0 ? (
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
                  value={formData.rencanaId}
                  onChange={handleRencanaChange}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                >
                  <option value="">Pilih rencana aset pemeliharaan</option>
                  {asetList.map((aset) => (
                    <option key={aset._id} value={aset._id}>
                      {aset.aset.nama_aset}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="kondisiStlhPerbaikan"
                  className="block font-medium"
                >
                  Kondisi Aset Setelah Perbaikan *
                </label>
                <select
                  id="kondisi_stlh_perbaikan"
                  name="kondisi_stlh_perbaikan"
                  value={formData.kondisi_stlh_perbaikan}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                >
                  <option value="">Pilih jenis kondisi aset</option>
                  <option value="Dapat digunakan">Dapat digunakan</option>
                  <option value="Dalam Perbaikan">Dalam Perbaikan</option>
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
                  className={getInputClassName(!!formData.usiaAsetSaatIni)}
                  disabled={!!formData.usiaAsetSaatIni}
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
                  className={getInputClassName(!!formData.maksimalUsiaAset)}
                  disabled={!!formData.maksimalUsiaAset}
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
                  className={getInputClassName(!!formData.tahunProduksi)}
                  disabled={!!formData.tahunProduksi}
                />
              </div>
              <div>
                <label
                  htmlFor="deskripsiKerusakan"
                  className="block font-medium"
                >
                  Deskripsi Kerusakan
                </label>
                <input
                  type="text"
                  id="deskripsiKerusakan"
                  name="deskripsiKerusakan"
                  value={formData.deskripsiKerusakan}
                  onChange={handleInputChange}
                  placeholder="Masukkan Deskripsi Kerusakan"
                  className={getInputClassName(!!formData.deskripsiKerusakan)}
                  disabled={!!formData.deskripsiKerusakan}
                />
              </div>
              <div>
                <label
                  htmlFor="tanggalPemeliharaanAset"
                  className="block font-medium"
                >
                  Tanggal Rencana Pemeliharaan *
                </label>
                <DatePicker
                  selected={formData.tanggalPemeliharaanAset}
                  onChange={(date) =>
                    handleDateChange(date, "tanggalPemeliharaanAset")
                  }
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                  wrapperClassName="date-picker"
                  dateFormat="MMMM d, yyyy"
                  disabled
                />
              </div>
              <div>
                <label
                  htmlFor="statusPemeliharaan"
                  className="block font-medium"
                >
                  Status Pemeliharaan
                </label>
                <select
                  id="status_pemeliharaan"
                  name="status_pemeliharaan"
                  value={formData.status_pemeliharaan}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                >
                  <option value="">Pilih status pemeliharaan</option>
                  <option value="Perbaikan Berhasil">Perbaikan Berhasil</option>
                  <option value="Dalam Perbaikan ">Dalam Perbaikan </option>
                  <option value="Tidak dapat diperbaiki">
                    Tidak dapat diperbaiki
                  </option>
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
                  className={getInputClassName(!!formData.vendorPengelola)}
                  disabled={!!formData.vendorPengelola}
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
                  Informasi vendor / no telepon
                </label>
                <input
                  type="text"
                  id="infoVendor"
                  name="infoVendor"
                  value={formData.infoVendor}
                  onChange={handleInputChange}
                  placeholder="Masukkan informasi vendor"
                  className={getInputClassName(!!formData.infoVendor)}
                  disabled={!!formData.infoVendor}
                />
              </div>
            </div>
          </CardInput>

          <CardInput title="Informasi Pemeliharaan">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="namaPenanggungJawab"
                  className="block font-medium"
                >
                  Nama Penanggung Jawab
                </label>
                <input
                  type="text"
                  id="penanggung_jawab"
                  name="penanggung_jawab"
                  value={formData.penanggung_jawab}
                  onChange={handleInputChange}
                  placeholder="Nama penanggung jawab"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                />
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
                  id="deskripsi"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleInputChange}
                  placeholder="Masukkan deskripsi pemeliharaan"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label htmlFor="tgl_dilakukan" className="block font-medium">
                  Tanggal Pemeliharaan Dilakukan
                </label>
                <DatePicker
                  selected={formData.tgl_dilakukan}
                  onChange={(date) => handleDateChange(date, "tgl_dilakukan")}
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
                  id="waktu_pemeliharaan"
                  name="waktu_pemeliharaan"
                  value={formData.waktu_pemeliharaan}
                  onChange={handleInputChange}
                  placeholder="Masukkan perkiraan waktu pemeliharaan"
                  className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </CardInput>

          <div className="flex justify-end mt-4">
            <Button label="Simpan" type="submit" />
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500">
          Tidak ada aset untuk diedit.
        </p>
      )}
    </TitleCard>
  );
}

export default TambahAset;
