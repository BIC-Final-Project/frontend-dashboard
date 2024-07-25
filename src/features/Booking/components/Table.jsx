import { useState } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import moment from 'moment';
import 'moment/locale/id'
import { convertToRupiah } from "../../../moduls/operational/helper/utils/convertRupiah";
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
            <th>Kode Book</th>
            <th>Nama</th>
            <th>Fasilitas</th>
            <th>Tanggal</th>
            <th>Jam</th>
            <th>Total Harga</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            const {_id, order_id, nama_pemesan, fasilitas, tanggal, booking_schedule, total_harga, status} = item
            const jam_awal = booking_schedule[0].jam_awal
            const jam_akhir = booking_schedule[booking_schedule.length - 1].jam_akhir
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>{order_id}</td>
                <td>{nama_pemesan}</td>
                <td>{fasilitas[0]?.nama_fasilitas || '-'}</td>
                <td>{moment(tanggal, 'DD/MM/YYYY').format('dddd, DD MMM YYYY')}</td>
                <td>{`${jam_awal}-${jam_akhir}`}</td>
                <td>{total_harga ? convertToRupiah(total_harga) : '-'}</td>
                <td>{status}</td>
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
                        navigate(`/app/booking/edit/${_id}`)
                      }}
                      className="h-5 w-5 cursor-pointer text-yellow-500 transition-all duration-100 hover:scale-125"
                    />
                    <EyeIcon
                    className="w-5 h-5 cursor-pointer text-fontPrimary transition-all duration-100 hover:scale-125" 
                    onClick={() => {
                      navigate(`/app/booking/view/${_id}`)
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
