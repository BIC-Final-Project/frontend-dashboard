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

const BookingForm = ({title = 'Tambah', dataBooking, optionFasilitas, setDataBooking, handleChange, handleChangeJam, handleSubmit, isPending, isFetching}) => {
    const navigate = useNavigate()
    const [jamAvailable, setJamAvailable] = useState([])
    const {nama_pemesan, fasilitas_id, no_telp, email, tanggal, total_harga, booking_schedule} = dataBooking
    const {mutate, isPending: isGetJamPending} = useGetAvailableJam({
        onSuccess: (data) => {
            const dataAvailable = data.map((item, i) => {
                const {jam_awal, jam_akhir} = item
                return {
                    label: `${jam_awal} - ${jam_akhir}`,
                    value: item
                }
            })
            setJamAvailable(dataAvailable)
        },
        onError: (error) => {
              console.log(error);
              toast.error(error.response?.data?.msg);
        }
    })

    const handleChangeDate = ([date]) => {
        const selectedDate = moment(date).format('DD/MM/YYYY')
        setDataBooking( preVal => {
            return {
                ...preVal,
                tanggal: selectedDate,
                booking_schedule: []
            }
        })
        mutate({id: fasilitas_id, payload: {tanggal: selectedDate}})
    }
    
  return (
    <SectionTitle title={`${title} Booking`}>
        {isFetching ? <LoaderFetcher /> :
        <form onSubmit={handleSubmit} className='grid grid-cols-1 auto-cols-min gap-5'>
            <CardInput title='Identitas Pemesan' >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Nama*</span>
                        </div>
                        <input type='text' name='nama_pemesan' value={nama_pemesan} onChange={handleChange} placeholder='Nama' className="input input-bordered text-lg w-full" required />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Whatsapp*</span>
                        </div>
                        <input type='tel' name='no_telp' value={no_telp} onChange={handleChange} placeholder='No Whatsapp' className="input input-bordered text-lg w-full" required />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Email*</span>
                        </div>
                        <input type='text' name='email' value={email} onChange={handleChange} placeholder='Email' className="input input-bordered text-lg w-full" required />
                    </label>
                </div>
            </CardInput>
            <CardInput title='Detail Pesanan' >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Fasilitas</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='fasilitas_id' onChange={handleChange} value={fasilitas_id}>
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
                            placeholder='Pilih Tanggal'
                            onChange={handleChangeDate}
                            className='flatpicker rounded-lg w-full border-[1px] px-4 py-2.5 font-medium text-lg cursor-pointer'
                        />
                    </div>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jam</span>
                        </div>
                        {isGetJamPending ? <InputSkeleton /> :
                        <Select
                            onChange={handleChangeJam}
                            options={jamAvailable}
                            isMulti
                            closeMenuOnSelect={false}
                            value={[...booking_schedule]}
                            className={'bg-gray-200 p-0 rounded-lg font-medium text-lg cursor-pointer'}
                            placeholder='Pilih Jam'
                            name='jam'
                            theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                    ...theme.colors
                                    }
                            })}
                        />
                        }
                    </div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Total Harga</span>
                        </div>
                        <input type='text' name='total_harga' value={total_harga} placeholder='Total Harga' className="input input-bordered text-lg w-full" onChange={handleChange} />
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
            <div className='justify-self-end flex gap-4 items-center'>
                <ButtonPrimary className='w-24' onClick={() => window.location.replace('/app/booking')} variant="outline" type="button">
                    Cancel
                </ButtonPrimary>
                <ButtonPrimary type="submit" className="w-24">
                    {isPending ? 
                    <span className="fade-in loading loading-spinner loading-sm"></span> :
                    'Save'
                    }
                </ButtonPrimary>
            </div>
        </form>
    }
    </SectionTitle>
  )
}

export default BookingForm