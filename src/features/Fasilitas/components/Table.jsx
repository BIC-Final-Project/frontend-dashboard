import { useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import moment from 'moment';
import 'moment/dist/locale/id'
import { convertToRupiah } from "../../../moduls/operational/helper/utils/convertRupiah";
import TableFooter from "../../../components/Table/TableFooter";
import { useNavigate } from "react-router-dom";
import { showModalDelete } from "../../../moduls/operational/helper/utils/handleModal";

const Table = ({
    data,
    path,
    pagination,
    setSelectedId,
}) => {
  const navigate = useNavigate()

  return (
    <>
      <table className="table table-zebra w-full" >
        <thead className="bg-white">
          <tr className="text-sm">
            <th>No</th>
            <th>Gambar</th>
            <th>Nama Fasilitas</th>
            <th>Deskripsi</th>
            <th>Harga</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            const {_id, nama_fasilitas, deskripsi_fasilitas, gambar_fasilitas, harga_fasilitas} = item
            const hargaMulai = convertToRupiah(harga_fasilitas[0].jam[0].harga)
            const hargaAkhir = convertToRupiah(harga_fasilitas[harga_fasilitas.length - 1].jam[0].harga)
            
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>
                  <img src={gambar_fasilitas.image_url} alt={nama_fasilitas} className="w-28 rounded-md aspect-video" />
                </td>
                <td>{nama_fasilitas}</td>
                <td className="truncate">{deskripsi_fasilitas}</td>
                <td>{`${hargaMulai} - ${hargaAkhir}`}</td>
                <td>
                  <div className="flex space-x-2">
                    <TrashIcon
                      onClick={() => {
                        setSelectedId(_id);
                        showModalDelete()
                      }}
                      className="h-5 w-5 cursor-pointer text-red-500 transition-all duration-100 hover:scale-125"
                    />
                    <PencilIcon
                      onClick={() => {
                        navigate(`/app/fasilitas/edit/${_id}`)
                      }}
                      className="h-5 w-5 cursor-pointer text-yellow-500 transition-all duration-100 hover:scale-125"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <TableFooter {...pagination} path={path} />
    </>
  );
};

export default Table;
