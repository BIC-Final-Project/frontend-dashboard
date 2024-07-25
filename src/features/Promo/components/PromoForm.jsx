import React, { useEffect, useState } from 'react'
import LoaderFetcher from '../../../components/Loader/LoaderFetcher.jsx';
import CardInput from '../../../components/Cards/CardInput.js';
import SectionTitle from '../../../components/SectionTitle.jsx/index.jsx';
import ButtonPrimary from '../../../components/Button/ButtonPrimary.jsx';
import { useNavigate } from 'react-router-dom';
import Flatpickr from "react-flatpickr";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import "flatpickr/dist/flatpickr.css";

const PromoForm = ({dataPromo, isFetching, isPending, handleSubmit, handleChange, handleChangeTanggalAwal, handleChangeTanggalAkhir, handleChangeJam}) => {
    const navigate = useNavigate()
    const {nama, kode, diskon, tanggal_awal, tanggal_akhir, jam_awal, jam_akhir} = dataPromo

  return (
    <SectionTitle title='Tambah Promo'>
        {isFetching ? <LoaderFetcher /> :
        <form onSubmit={handleSubmit} className='grid grid-cols-1 auto-cols-min gap-5'>
            <CardInput title='Detail Promo' >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Nama Promo</span>
                        </div>
                        <input type='text' name='nama' value={nama} onChange={handleChange} placeholder='Nama Promo' className="input input-bordered text-lg w-full" />
                </label>
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Kode Promo</span>
                        </div>
                        <input type='text' name='kode' value={kode} onChange={handleChange} placeholder='Kode Promo' className="input input-bordered text-lg w-full" />
                </label>
                <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Tanggal Mulai</span>
                        </div>
                        <Flatpickr      
                            value={tanggal_awal}
                            options={{
                                minDate: "today",
                                dateFormat: "d/m/Y",
                                disableMobile: true
                            }}
                            placeholder='Pilih Tanggal'
                            onChange={handleChangeTanggalAwal}
                            className='flatpicker rounded-lg w-full border-[1px] px-4 py-2.5 font-medium text-lg cursor-pointer'
                        />
                </div>
                <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Tanggal Akhir</span>
                        </div>
                        <Flatpickr      
                            value={tanggal_akhir}
                            options={{
                                dateFormat: "d/m/Y",
                                disableMobile: true
                            }}
                            placeholder='Pilih Tanggal'
                            onChange={handleChangeTanggalAkhir}
                            className='flatpicker rounded-lg w-full border-[1px] px-4 py-2.5 font-medium text-lg cursor-pointer'
                        />
                </div>
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Total Diskon</span>
                        </div>
                        <input type='number' min={1} name='diskon' value={diskon} onChange={handleChange} placeholder='Total Diskon' className="input input-bordered text-lg w-full" />
                </label>
                <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jam Awal</span>
                        </div>
                        <TimePicker value={jam_awal} name='jam_awal' onChange={(newValue) => handleChangeJam(`jam_awal`, newValue)} disableClock={true} className='input w-full shadow rounded-md cursor-pointer' />
                </div>
                <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jam Akhir</span>
                        </div>
                        <TimePicker value={jam_akhir} name='jam_akhir' onChange={(newValue) => handleChangeJam(`jam_akhir`, newValue)} disableClock={true} className='input w-full shadow rounded-md cursor-pointer' />
                </div>
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

export default PromoForm