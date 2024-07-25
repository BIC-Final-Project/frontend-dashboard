import React, { useEffect, useState } from 'react'
import LoaderFetcher from '../../../components/Loader/LoaderFetcher.jsx';
import CardInput from '../../../components/Cards/CardInput.js';
import SectionTitle from '../../../components/SectionTitle.jsx/index.jsx';
import ButtonPrimary from '../../../components/Button/ButtonPrimary.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setDeskripsi, setGambar, setHapusData, setHapusJam, setHarga, setHari, setJam, setNama, setTambahData, setTambahJam } from '../../common/fasilitasSlice.js';
import iconCross from '../../../assets/icons/cross.svg'
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

const days = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"]

const FasilitasForm = ({title = 'Tambah', required = true, currentState, isFetching, isPending, handleSubmit}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {nama, gambar, deskripsi, data} = useSelector((state) => state.fasilitas)

    const handleChangeJam = (indexData, indexJam, value, keyState) => {
        dispatch(setJam({indexData, indexJam, value, keyState}))
    }

    const handleChangeHarga = (indexData, indexJam, value) => {
        dispatch(setHarga({indexData, indexJam, value}))
    }

    const handleChangeFile = (e) => {
        const file = e.target.files[0]
        dispatch(setGambar({value: file}))
    }

  return (
    <SectionTitle title={`${title} Fasilitas`}>
        {isFetching ? <LoaderFetcher /> :
        <form onSubmit={handleSubmit} className='grid grid-cols-1 auto-cols-min gap-5'>
            <CardInput title='Detail Fasilitas' >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Nama Fasilitas</span>
                        </div>
                        <input type='text' name='nama' value={nama} onChange={(e) => dispatch(setNama({value: e.target.value}))} placeholder='Nama Fasilitas' className="input input-bordered text-lg w-full" required={required} />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-fontGreen text-lg font-medium">Gambar Fasilitas</span>
                        </div>
                        <input type="file" accept=".png,.jpg,.jpeg,.pdf" name='gambar' onChange={handleChangeFile} className="file-input file-input-bordered border-borderGreen w-full" required={required} />
                        {currentState === 'update' && <img src={gambar} alt='' className="w-24 object-cover rounded-md mt-2" />}
                        <span className='text-base font-medium italic'>{gambar.name || '-'}</span>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Deskripsi Fasilitas</span>
                        </div>
                        <input type='text' name='deskripsi' value={deskripsi} onChange={(e) => dispatch(setDeskripsi({value: e.target.value}))} placeholder='Deskripsi Fasilitas' className="input input-bordered text-lg w-full" required={required} />
                    </label>
                </div>
            </CardInput>
            <CardInput title='Harga Fasilitas' >
                <div className="grid grid-cols-1 gap-8 auto-rows-min">
                    {data.map((item, indexData) => {
                        const {hari: dataHari, jam} = item
                        return (
                            <>
                            <div className='grid grid-cols-1 gap-4' key={indexData}>
                                {/* Hari */}
                                <div className='grid grid-cols-1 auto-rows-min gap-4'>
                                    <div className="label">
                                        <span className="label-text text-lg font-medium">Hari</span>
                                    </div>
                                    <div className='flex gap-4'>
                                        {days.map((hari, i) => {
                                            return (
                                                <div className='w-full' key={i}>
                                                    <input 
                                                    type="checkbox" 
                                                    checked={dataHari.includes(hari)}
                                                    id={`hari-${i}-${indexData}`} 
                                                    value={hari} 
                                                    name={`hari-${i}-${indexData}`} 
                                                    className="input-hari" 
                                                    onChange={() => dispatch(setHari({indexData, value: hari}))} hidden />
                                                    <label htmlFor={`hari-${i}-${indexData}`} className='label-hari inline-block text-center w-full px-4 py-1 border-2 border-borderGreen rounded-md text-fontGrey cursor-pointer capitalize'>{hari}</label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                {/* Jam */}
                                <div className='grid grid-cols-1 gap-4'>                                            
                                    {jam.map((itemJam, indexJam) => {
                                        const {jam_awal, jam_akhir, harga} = itemJam
                                        return (
                                            <div className='grid grid-cols-[repeat(2,300px)_1fr_max-content] auto-rows-min gap-4' key={indexJam}>
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text text-lg font-medium">Jam Awal</span>
                                                    </div>
                                                    <TimePicker value={jam_awal} name='jam_awal' onChange={(newValue) => handleChangeJam(indexData, indexJam, newValue, 'jam_awal')} disableClock={true} className='input w-full shadow rounded-md cursor-pointer' />
                                                </label>
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text text-lg font-medium">Jam Akhir</span>
                                                    </div>
                                                    <TimePicker value={jam_akhir} name='jam_akhir' onChange={(newValue) => handleChangeJam(indexData, indexJam, newValue, 'jam_akhir')} disableClock={true} className='input w-full shadow rounded-md cursor-pointer' />
                                                </label>
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text text-lg font-medium">Harga</span>
                                                    </div>
                                                    <input type='number' name='harga' value={harga} onChange={(e) => handleChangeHarga(indexData, indexJam, e.target.value)} placeholder='Harga' className="input input-bordered text-lg w-full" />
                                                </label>
                                                <div className={`border input-bordered hover:border-gray-500 duration-100 p-2 rounded-full cursor-pointer self-end -translate-y-2 ${indexJam === 0 && 'invisible'} `} onClick={() => dispatch(setHapusJam({indexData, indexJam}))}>
                                                    <img src={iconCross} alt="" className='w-5' />
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div className="grid grid-cols-1 gap-4">
                                        <ButtonPrimary variant='outline' className='w-full' onClick={() => dispatch(setTambahJam({indexData}))} type="button">Tambah Jam</ButtonPrimary>
                                        {indexData !== 0 && 
                                        <ButtonPrimary variant='custom' className='w-full' onClick={() => dispatch(setHapusData({indexData}))} type="button">Hapus Jam</ButtonPrimary>
                                        }
                                    </div>
                                </div>
                            </div>
                            {indexData !== data.length - 1 && <div className="divider"></div>}
                            </>
                        )
                    })}
                    <ButtonPrimary className='w-full' onClick={() => dispatch(setTambahData())} type="button">Tambah Data</ButtonPrimary>
                </div>
            </CardInput>
            <div className='justify-self-end flex gap-4 items-center'>
                <ButtonPrimary className='w-24' onClick={() => window.location.replace('/app/paket-membership')} variant="outline" type="button">
                    Cancel
                </ButtonPrimary>
                <ButtonPrimary type="submit" className='w-24'>
                    {isPending ? 
                    <span className="fade-in loading loading-spinner loading-sm"></span> :
                    'Save'
                    }
                </ButtonPrimary>
            </div>
        </form>
        }
    </SectionTitle>
  )
}

export default FasilitasForm