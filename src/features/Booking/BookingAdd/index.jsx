import React, { useState } from 'react'
import BookingForm from '../components/BookingForm'
import { useGetFasilitasOption } from '../../../hooks/services/api/Option/option'
import { useCreateBooking } from '../../../hooks/services/api/Booking/booking'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'

const BookingAddPage = () => {
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
    const {mutate: createBooking, isPending} = useCreateBooking({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['allBooking'] })
            toast.success('Create booking successfully')
            navigate('/app/booking')
        },
        onError: (error) => {
              console.log(error);
              toast.error(error.response?.data?.msg);
        }
    })

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

    const handleCreateBooking = (e) => {
        e.preventDefault()
        const payload = {
            ...dataBooking,
            booking_schedule: formattedSchedule
        }
        createBooking(payload)
    }
    

  return (
    <BookingForm 
        dataBooking={dataBooking}
        optionFasilitas={optionFasilitas}
        setDataBooking={setDataBooking}
        handleChange={handleChange}
        handleChangeJam={handleChangeJam}
        handleSubmit={handleCreateBooking}
        isPending={isPending}
    />
  )
}

export default BookingAddPage