import { createSlice } from '@reduxjs/toolkit'

const fasilitasState = {
    nama: '',
    gambar: '',
    deskripsi: '',
    data: [
        {
            hari: [],
            jam: [
                { 
                    jam_awal: "", 
                    jam_akhir: "", 
                    harga: 0 
                }
            ]
        }
    ]
}

export const fasilitasSlice = createSlice({
    name: 'fasilitas',
    initialState: {
        ...fasilitasState
    },
    reducers: {
        setNama: (state, action) => {
            const {value} = action.payload
            state.nama = value
        },
        setDeskripsi: (state, action) => {
            const {value} = action.payload
            state.deskripsi = value
        },
        setGambar: (state, action) => {
            const {value} = action.payload
            state.gambar = value
        },
        setHari: (state, action) => {
            const {indexData, value} = action.payload
            if(state.data[indexData].hari.includes(value)) {
                state.data[indexData].hari = state.data[indexData].hari.filter(hari => hari !== value)
            } else {
                state.data[indexData].hari = [...state.data[indexData].hari, value]
            }
        },
        setJam: (state, action) => {
            const {indexData, indexJam, keyState, value} = action.payload
            state.data[indexData].jam[indexJam][keyState] = value
        },
        setHarga: (state, action) => {
            const {indexData, indexJam, value} = action.payload
            state.data[indexData].jam[indexJam].harga = value
        },
        setTambahData: (state, action) => {
            state.data.push({
                hari: [],
                jam: [
                    { 
                        jam_awal: "", 
                        jam_akhir: "", 
                        harga: 0 
                    }
                ]
            })
        },
        setHapusData: (state, action) => {
            const {indexData} = action.payload
            state.data.splice(indexData, 1)
        },
        setTambahJam: (state, action) => {
            const {indexData} = action.payload
            state.data[indexData].jam.push({ 
                jam_awal: "", 
                jam_akhir: "", 
                harga: 0 
            })
        },
        setHapusJam: (state, action) => {
            const {indexData, indexJam} = action.payload
            state.data[indexData].jam.splice(indexJam, 1)
        },
        setWholeFasilitasState: (state, action) => {
            const {dataEditFasilitas} = action.payload
            return {...dataEditFasilitas}
        },
        resetFasilitasState: () => {
            return fasilitasState
        }
    }
})

export const { 
    setWholeFasilitasState,
    setNama,
    setDeskripsi,
    setGambar,
    setHari,
    setJam,
    setHarga,
    setTambahData,
    setHapusData,
    setTambahJam,
    setHapusJam,
    resetFasilitasState
} = fasilitasSlice.actions

export default fasilitasSlice.reducer