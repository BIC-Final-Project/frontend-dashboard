import React, { useState } from 'react'
import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { useNavigate } from 'react-router-dom'
import SectionTitle from '../../../components/SectionTitle.jsx'
import CardInput from '../../../components/Cards/CardInput.js'
import { useGetAvailableJam } from '../../../hooks/services/api/Booking/booking.js'
import ButtonPrimary from '../../../components/Button/ButtonPrimary.jsx'
import moment from 'moment'
import { toast } from 'react-toastify';
import LoaderFetcher from '../../../components/Loader/LoaderFetcher.jsx';
import InputSkeleton from './InputSkeleton.jsx';
import { convertToRupiah } from '../../../moduls/operational/helper/utils/convertRupiah.js';

const BookingFormView = ({title = 'Tambah', dataBooking, optionFasilitas, isFetching}) => {
    const navigate = useNavigate()
    const {nama_pemesan, fasilitas_id, no_telp, email, tanggal, total_harga, booking_schedule} = dataBooking
    
  return (
    <SectionTitle title={`${title} Booking`}>
        {isFetching ? <LoaderFetcher /> :
        <form className='grid grid-cols-1 auto-cols-min gap-5'>
            <CardInput title='Identitas Pemesan' >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Nama*</span>
                        </div>
                        <input type='text' name='nama_pemesan' value={nama_pemesan}  placeholder='Nama' className="input input-bordered text-lg w-full" required readOnly />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Whatsapp*</span>
                        </div>
                        <input type='tel' name='no_telp' value={no_telp}  placeholder='No Whatsapp' className="input input-bordered text-lg w-full" required readOnly />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Email*</span>
                        </div>
                        <input type='text' name='email' value={email}  placeholder='Email' className="input input-bordered text-lg w-full" required readOnly />
                    </label>
                </div>
            </CardInput>
            <CardInput title='Detail Pesanan' >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Fasilitas</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='fasilitas_id'  value={fasilitas_id} disabled>
                            <option disabled value=''>Pilih fasilitas</option>
                            {optionFasilitas.map((item, i) => <option key={i} value={item._id} className='capitalize'>{item.nama_fasilitas}</option>)}
                        </select>
                    </label>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Tanggal</span>
                        </div>
                        <Flatpickr        
                            value={tanggal}
                            options={{
                                minDate: "today",
                                dateFormat: "d/m/Y",
                                disableMobile: true
                            }}
                            disabled
                            placeholder='Pilih Tanggal'
                            className='flatpicker rounded-lg w-full border-[1px] px-4 py-2.5 font-medium text-lg cursor-pointer'
                        />
                    </div>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jam</span>
                        </div>
                        <Select
                            
                            isMulti
                            closeMenuOnSelect={false}
                            value={[...booking_schedule]}
                            className={'bg-gray-200 p-0 rounded-lg font-medium text-lg cursor-pointer'}
                            placeholder='Pilih Jam'
                            name='jam'
                            isDisabled
                            theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                    ...theme.colors
                                    }
                            })}
                        />
                    </div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Total Harga</span>
                        </div>
                        <input type='text' name='total_harga' value={convertToRupiah(total_harga)} placeholder='Total Harga' className="input input-bordered text-lg w-full"  readOnly />
                    </label>
                    {/* <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Status Pemesan</span>
                        </div>
                        <select className="select select-bordered text-fontGrey text-base font-medium capitalize" name='status_pemesan' onChange={handleChange} value={status_pemesan}>
                            <option disabled value=''>Pilih status pemesan</option>
                            {pemesanOptions.map((item, i) => <option key={i} value={item} className='capitalize'>{item}</option>)}
                        </select>
                    </label> */}
                </div>
            </CardInput>
        </form>
    }
    </SectionTitle>
  )
}

export default BookingFormView