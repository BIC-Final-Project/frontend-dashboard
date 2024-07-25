import axios from "axios"

const getAllFasilitas = (page, pageSize) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas?page=${page}&limit=${pageSize}`)
    .then(res => res.data)
}

const getFasilitasById = (id) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas/${id}`)
    .then(res => res.data.data)
}

const createFasilitas = (data) => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas`, data)
    .then(res => res.data)
}

const editFasilitas = (id, data) => {
    return axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas/${id}`, data)
    .then(res => res.data)
}

const deleteFasilitas = (id) => {
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas/${id}`)
    .then(res => res.data.data)
}

export const fasilitasServices = {
    getAllFasilitas,
    getFasilitasById,
    createFasilitas,
    editFasilitas,
    deleteFasilitas
}