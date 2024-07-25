import axios from "axios"

const getAllMembership = (page, limit, search) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership?page=${page}&limit=${limit}&search=${search}`)
    .then(res => res.data)
}

const getMembershipById = (id) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership/${id}`)
    .then(res => res.data.data)
}

const createMembership = (data) => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership`, data)
    .then(res => res.data.data)
}

const createDokumenMembership = (id, data) => {
    return axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership/dokumen-persyaratan/admin/${id}`, data)
    .then(res => res.data.data)
}

const editMembership = (id, data) => {
    return axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership/${id}`, data)
    .then(res => res.data.data)
}

const editDokumenMembership = (id, data) => {
    return axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership/dokumen-persyaratan/update/${id}`, data)
    .then(res => res.data.data)
}

const deleteMembership = (id) => {
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership/${id}`)
    .then(res => res.data.data)
}

export const membershipServices = {
    getAllMembership,
    getMembershipById,
    createMembership,
    createDokumenMembership,
    editMembership,
    editDokumenMembership,
    deleteMembership
}