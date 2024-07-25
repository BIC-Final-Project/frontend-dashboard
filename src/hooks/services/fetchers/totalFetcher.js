import axios from "axios"

const getTotalTransaction = () => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/invoice/total`)
    .then(res => res.data.data)
}

const getTotalBooking = () => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/booking/total/count`)
    .then(res => res.data.data)
}

const getTotalMember = () => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership/total/count`)
    .then(res => res.data.data)
}

const getTotalFasilitas = () => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas/total/count`)
    .then(res => res.data.data)
}

export const totalServices = {
    getTotalTransaction,
    getTotalBooking,
    getTotalMember,
    getTotalFasilitas
}