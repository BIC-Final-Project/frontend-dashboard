import axios from "axios"

const getAllBooking = (page, limit, search) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/booking?page=${page}&limit=${limit}&search=${search}`)
    .then(res => res.data)
}

const getBookingById = (id) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/booking/${id}`)
    .then(res => res.data.data)
}

const getAvailableBookingJam = (id, data) => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/booking/${id}`, data)
    .then(res => res.data.data)
}

const createBooking = (data) => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/booking/dashboard/admin`, data)
    .then(res => res.data)
}

const editBooking = (id, data) => {
    return axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/booking/${id}`, data)
    .then(res => res.data)
}

const deleteBooking = (id) => {
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/booking/${id}`)
    .then(res => res.data.data)
}

export const bookingServices = {
    getAllBooking,
    getBookingById,
    getAvailableBookingJam,
    createBooking,
    editBooking,
    deleteBooking
}