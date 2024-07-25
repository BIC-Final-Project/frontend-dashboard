import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import 'moment/locale/id'

const membershipState = {
    membership_type_id: '',
    data_member: {
        paket: "",
        jenis_keanggotaan: "",
        no_ktp: "",
        nama_lengkap: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
        alamat_rumah: "",
        kota: "",
        no_wa: "",
        email: ""
    },
    usaha_anda: {
        nama_perusahaan: "",
        bidang_usaha: "",
        jabatan: "",
        alamat_kantor: "",
        telp: "",
        kartu_kredit: "",
        no_kartu_kredit: ""
    },
    anggota_membership: [''],
    dokumen_persyaratan: {
        ktp_passport: '',
        pas_photo: '',
        kartu_keluarga: '',
        kims: '',
        rekening_bank: '',
        rekom_perusahaan: ''
    },
}

export const membershipSlice = createSlice({
    name: 'membership',
    initialState: {
        ...membershipState
    },
    reducers: {
        setIdMembershipType: (state, action) => {
            const {id} = action.payload
            state.membership_type_id = id
        },
        setDataMembership: (state, action) => {
            const {keyState, name, value} = action.payload
                state[keyState][name] = value
        },
        setAnggotaMembership: (state, action) => {
            const {index, value} = action.payload
            state.anggota_membership[index] = value
        },
        setTambahAnggotaMembership: (state, action) => {
            state.anggota_membership.push('')
        },
        setHapusAnggotaMembership: (state, action) => {
            const {index} = action.payload
            state.anggota_membership.splice(index, 1)
        },
        setLimitAnggotaMembership: (state, action) => {
            const {limit} = action.payload
            state.limit_anggota = limit
        },
        setDataDokumen: (state, action) => {
            const {keyState, name, value} = action.payload
            state[keyState][name] = value
        },
        setHargaMembership: (state, action) => {
            const {value} = action.payload
            state.harga_3_bulan = value * 3
        },
        setWholeMembershipState: (state, action) => {
            const {data} = action.payload
            const editData = {
                ...data            
            }
            return editData
        },
        resetMembershipState: () => {
            return membershipState
        }
    }
})

export const { setWholeMembershipState, setIdMembershipType, setDataMembership, setAnggotaMembership, setTambahAnggotaMembership, setHapusAnggotaMembership, setLimitAnggotaMembership, setDataDokumen, setHargaMembership, resetMembershipState } = membershipSlice.actions

export default membershipSlice.reducer