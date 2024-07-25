import { useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import moment from 'moment';
import 'moment/dist/locale/id'
import { convertToRupiah } from "../../../moduls/operational/helper/utils/convertRupiah";
import { convertFullDate } from "../../../moduls/operational/helper/utils/convertDate";
import { useNavigate } from "react-router-dom";
import TableFooter from "../../../components/Table/TableFooter";
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
            <th>Nama Promo</th>
            <th>Kode Promo</th>
            <th>Mulai Promo</th>
            <th>Akhir Promo</th>
            <th>Total Diskon</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            const {id, nama, kode, waktu_awal, waktu_akhir, diskon} = item
            
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{nama}</td>
                <td>{kode}</td>
                <td>{convertFullDate(waktu_awal)}</td>
                <td>{convertFullDate(waktu_akhir)}</td>
                <td>{convertToRupiah(diskon)}</td>
                <td>
                  <div className="flex space-x-2">
                    <TrashIcon
                      onClick={() => {
                        setSelectedId(id);
                        showModalDelete()
                      }}
                      className="h-5 w-5 cursor-pointer text-red-500 transition-all duration-100 hover:scale-125"
                    />
                    <PencilIcon
                      onClick={() => {
                        navigate(`/app/promo/edit/${id}`)
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
