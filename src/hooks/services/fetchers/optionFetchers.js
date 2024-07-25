import axios from "axios"

const getFasilitasOption = () => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas`)
    .then(res => res.data.data)
}

const getMembershipTypeOption = () => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/membership-type/filter/jenis-paket`)
    .then(res => res.data.data)
}

const getFasilitasNameOption = () => {
    return axios(`${process.env.REACT_APP_BASE_URL}/api/v1/operational/fasilitas/name`)
    .then(res => res.data.data)
}

export const optionServices = {
    getFasilitasOption,
    getMembershipTypeOption,
    getFasilitasNameOption
}