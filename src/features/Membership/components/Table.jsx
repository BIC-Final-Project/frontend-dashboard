import { useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import moment from 'moment';
import 'moment/locale/id'
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
            <th>ID Member</th>
            <th>Nama</th>
            <th>Paket Membership</th>
            <th>Keanggotaan</th>
            <th>Mulai</th>
            <th>Berakhir</th>
            <th>Status Member</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            const {_id, data_member, tanggal_mulai, tanggal_berakhir, is_active} = item
            
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{_id}</td>
                <td>{data_member?.nama_lengkap || '-'}</td>
                <td>{data_member?.paket || '-'}</td>
                <td>{data_member?.jenis_keanggotaan || ''}</td>
                <td>{convertFullDate(tanggal_mulai) || ''}</td>
                <td>{convertFullDate(tanggal_berakhir) || ''}</td>
                <td>{is_active ? 'Aktif' : 'Non-Aktif'}</td>
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
                        navigate(`/app/membership/edit/${_id}`)
                      }}
                      className="h-5 w-5 cursor-pointer text-yellow-500 transition-all duration-100 hover:scale-125"
                    />
                    <EyeIcon 
                      className="w-5 h-5 cursor-pointer text-fontPrimary transition-all duration-100 hover:scale-125" 
                      onClick={() => {
                        navigate(`/app/membership/view/${_id}`)
                      }}
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
