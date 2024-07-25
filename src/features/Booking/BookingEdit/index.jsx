import React, { useEffect, useState } from 'react'
import BookingForm from '../components/BookingForm'
import { useGetFasilitasOption } from '../../../hooks/services/api/Option/option'
import { useCreateBooking, useGetBookingById, useUpdateBooking } from '../../../hooks/services/api/Booking/booking'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'

const BookingEditPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
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
    const {booking_schedule} = dataBooking
    const formattedSchedule = booking_schedule.map(item => item.value)
    const {data: optionFasilitas = []} = useGetFasilitasOption()
    const {data, isFetching} = useGetBookingById(id)
    const {mutate: updateBooking, isPending} = useUpdateBooking({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['allBooking'] })
            queryClient.invalidateQueries({ queryKey: ['booking'] })
            toast.success('Update booking successfully')
            navigate('/app/booking')
        },
        onError: (error) => {
              console.log(error);
              toast.error(error.response?.data?.msg);
        }
    })

    console.log(data);
    console.log({optionFasilitas});

    const handleChange = (e) => {
        if(e.target.name === 'fasilitas_id') {
            setDataBooking(preVal => {
                return {
                    ...preVal,
                    [e.target.name]: e.target.value,
                    tanggal: '',
                    booking_schedule: []
                }
            })
        } else {
            setDataBooking({
                ...dataBooking,
                [e.target.name]: e.target.name === 'total_harga' ? +e.target.value : e.target.value
            })
        }
    }

    const handleChangeJam = (selectedState) => {
        setDataBooking({
            ...dataBooking,
            booking_schedule: selectedState
        })
    }

    const handleUpdateBooking = (e) => {
        e.preventDefault()
        const payload = {
            ...dataBooking,
            booking_schedule: formattedSchedule
        }
        
        updateBooking({id, payload})
    }
    
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
    <BookingForm 
        dataBooking={dataBooking}
        optionFasilitas={optionFasilitas}
        setDataBooking={setDataBooking}
        handleChange={handleChange}
        handleChangeJam={handleChangeJam}
        handleSubmit={handleUpdateBooking}
        isPending={isPending}
        isFetching={isFetching}
        title='Edit'
    />
  )
}

export default BookingEditPage