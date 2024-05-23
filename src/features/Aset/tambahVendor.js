import { useState } from "react";
import { useSnackbar } from 'notistack';
import axios from 'axios';
import TitleCard from "../../components/Cards/TitleCard";
import CardInput from "../../components/Cards/CardInput";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import Button from "../../components/Button";

function TambahVendor() {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    namaAset: "",
    phone: "",
    alamatVendor: "",
    jenisVendor: ""
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
      const response = await axios.post('URL_API_VENDOR', formData);
      enqueueSnackbar('Vendor berhasil ditambahkan!', { variant: 'success' });
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
              <label htmlFor="namaAset" className="block font-medium">
                Nama Aset *
              </label>
              <input
                type="text"
                id="namaAset"
                name="namaAset"
                value={formData.namaAset}
                onChange={handleInputChange}
                placeholder="Masukkan Nama Aset"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-medium">
                No Telpon *
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Masukkan No Telpon"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </CardInput>

        <CardInput title="Detail Aset">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="alamatVendor" className="block font-medium">
                Alamat Vendor
              </label>
              <input
                type="text"
                id="alamatVendor"
                name="alamatVendor"
                value={formData.alamatVendor}
                onChange={handleInputChange}
                placeholder="Masukkan Alamat Vendor"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="jenisVendor" className="block font-medium">
                Jenis Vendor
              </label>
              <input
                type="text"
                id="jenisVendor"
                name="jenisVendor"
                value={formData.jenisVendor}
                onChange={handleInputChange}
                placeholder="Masukkan Jenis Vendor"
                className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-900"
              />
            </div>
          </div>
        </CardInput>

        <div className="flex justify-end mt-4">
        <Button
            label="Simpan Aset"
            onClick={() => {}}
          />
        </div>
      </form>
    </TitleCard>
  );
}

export default TambahVendor;
