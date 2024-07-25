import axios from "axios"

const getAllMembershipType = (type) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership-type?jenis-paket=${type}`)
    .then(res => res.data.data)
}

const getMembershipTypeById = (id) => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership-type/${id}`)
    .then(res => res.data.data)
}

const createMembershipType = (data) => {
    return axios.post(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership-type`, data)
    .then(res => res.data)
}

const editMembershipType = (id, data) => {
    return axios.put(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership-type/${id}`, data)
    .then(res => res.data)
}

const deletePaketMembership = (id) => {
    return axios.delete(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership-type/${id}`)
    .then(res => res.data.data)
}

export const membershipTypeServices = {
    getAllMembershipType,
    getMembershipTypeById,
    createMembershipType,
    editMembershipType,
    deletePaketMembership
}