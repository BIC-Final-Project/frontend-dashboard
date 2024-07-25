import React, { useEffect, useState } from 'react'
import { useGetBookingById } from '../../../hooks/services/api/Booking/booking'
import BookingFormView from '../components/BookingFormView'
import { useGetFasilitasOption } from '../../../hooks/services/api/Option/option'
import { useParams } from 'react-router-dom'

const BookingViewPage = () => {
    const {id} = useParams()
    const [dataBooking, setDataBooking] = useState({
        nama_pemesan: '',
        fasilitas_id: '',
        no_telp: '',
        email: '',
        tanggal: '',
        booking_schedule: [],
        total_harga: 0,
        is_onsite: true
    })
    const {data, isFetching} = useGetBookingById(id)
    const {data: optionFasilitas = []} = useGetFasilitasOption()
    console.log(data);
    
    useEffect(() => {
        if (data) {
            const jamAvailable = data?.booking_schedule.map((item, i) => {
                const {jam_awal, jam_akhir} = item
                return {
                    label: `${jam_awal} - ${jam_akhir}`,
                    value: item
                }
            })
            setDataBooking({
                ...dataBooking,
                nama_pemesan: data?.nama_pemesan || '',
                fasilitas_id: data?.fasilitas_id || '',
                no_telp: data?.no_telp || '',
                email: data?.email || '',
                tanggal: data?.tanggal || '',
                booking_schedule: jamAvailable || [],
                total_harga: data?.total_harga || '',
            })
        }
    }, [data])

  return (
    <BookingFormView
        dataBooking={dataBooking}
        optionFasilitas={optionFasilitas}
        isFetching={isFetching}
        title='Detail'
    />
  )
}

export default BookingViewPage