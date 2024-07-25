import axios from "axios"

const getAllPromo = (page, pageSize) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/promo-diskon?page=${page}&limit=${pageSize}`)
    .then(res => res.data)
}

const getPromoById = (id) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/promo-diskon/${id}`)
    .then(res => res.data.data)
}

const createPromo = (data) => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/promo-diskon`, data)
    .then(res => res.data)
}

const editPromo = (id, data) => {
    return axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/promo-diskon/${id}`, data)
    .then(res => res.data)
}

const deletePromo = (id) => {
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/promo-diskon/${id}`)
    .then(res => res.data.data)
}

export const promoServices = {
    getAllPromo,
    getPromoById,
    createPromo,
    editPromo,
    deletePromo
}