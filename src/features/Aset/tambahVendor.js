import { useState } from "react";
import { useSnackbar } from 'notistack';
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import Button from "../../components/Button";
import BASE_URL_API from "../../config";
import { postData } from "../../utils/utils";

function TambahVendor() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    nama_vendor: "",
    telp_vendor: "",
    alamat_vendor: "",
    jenis_vendor: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await postData(`${BASE_URL_API}api/v1/manage-aset/vendor`, formData);
      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar('Vendor berhasil ditambahkan!', { variant: 'success' });
      }else{
        enqueueSnackbar('Gagal menambahkan vendor!', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error posting data:', error);
      enqueueSnackbar('Gagal menambahkan vendor!', { variant: 'error' });
    }
  };

  return (
    <TitleCard title="Tambah Vendor" topMargin="mt-2">
      <form onSubmit={handleSubmit}>
        <CardInput title="Identitas Vendor">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nama_vendor" className="block font-medium">
                Nama Vendor *
              </label>
              <input
                type="text"
                id="nama_vendor"
                name="nama_vendor"
                value={formData.nama_vendor}
                onChange={handleInputChange}
                placeholder="Masukkan Nama Vendor"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="telp_vendor" className="block font-medium">
                No Telpon *
              </label>
              <input
                type="text"
                id="telp_vendor"
                name="telp_vendor"
                value={formData.telp_vendor}
                onChange={handleInputChange}
                placeholder="Masukkan No Telpon"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </CardInput>

        <CardInput title="Detail Vendor">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="alamat_vendor" className="block font-medium">
                Alamat Vendor
              </label>
              <input
                type="text"
                id="alamat_vendor"
                name="alamat_vendor"
                value={formData.alamat_vendor}
                onChange={handleInputChange}
                placeholder="Masukkan Alamat Vendor"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="jenis_vendor" className="block font-medium">
                Jenis Vendor
              </label>
              <input
                type="text"
                id="jenis_vendor"
                name="jenis_vendor"
                value={formData.jenis_vendor}
                onChange={handleInputChange}
                placeholder="Masukkan Jenis Vendor"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </CardInput>

        <div className="flex justify-end mt-4">
          <Button
            label="Simpan Vendor"
            type="submit"
          />
        </div>
      </form>
    </TitleCard>
  );
}

export default TambahVendor;
