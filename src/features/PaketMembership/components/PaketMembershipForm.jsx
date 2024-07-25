import React, { useEffect, useState } from 'react'
import LoaderFetcher from '../../../components/Loader/LoaderFetcher.jsx';
import CardInput from '../../../components/Cards/CardInput.js';
import SectionTitle from '../../../components/SectionTitle.jsx/index.jsx';
import { useGetFasilitasNameOption, useGetMembershipTypeOption } from '../../../hooks/services/api/Option/option.js';
import ButtonPrimary from '../../../components/Button/ButtonPrimary.jsx';
import { useNavigate } from 'react-router-dom';
import { jenisKeanggotaan } from '../constants/paketMembership.js';

const PaketMembershipForm = ({title = 'Tambah', isFetching, isPending, handleSubmit, fasilitasOption, handleChange, handleChangeFasilitas, dataPaket}) => {
    const navigate = useNavigate()
    const {jenis_paket, jenis_keanggotaan, jumlah_anggota_yang_berlaku, harga} = dataPaket

  return (
    <SectionTitle title={`${title} Paket Membership`}>
        {isFetching ? <LoaderFetcher /> :
        <form onSubmit={handleSubmit} className='grid grid-cols-1 auto-cols-min gap-5'>
            <CardInput title='Paket Membership' >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Paket</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='jenis_paket' onChange={handleChange} value={jenis_paket}>
                            <option disabled value=''>Pilih paket</option>
                            {['Platinum', 'Gold', 'Silver'].map((item, i) => <option key={i} value={item} className='capitalize'>{item}</option>)}
                        </select>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jenis Keanggotaan</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='jenis_keanggotaan' onChange={handleChange} value={jenis_keanggotaan}>
                            <option disabled value=''>Pilih keanggotaan</option>
                            {jenisKeanggotaan.map((item, i) => <option key={i} value={item} className='capitalize'>{item}</option>)}
                        </select>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jumlah Anggota yang Berlaku</span>
                        </div>
                        <input type='number' min={1} name='jumlah_anggota_yang_berlaku' value={jumlah_anggota_yang_berlaku} onChange={handleChange} placeholder='Jumlah Anggota' className="input input-bordered text-lg w-full" />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Harga/Bulan</span>
                        </div>
                        <input type='number' min={1} name='harga' value={harga} onChange={handleChange} placeholder='Harga per Bulan' className="input input-bordered text-lg w-full" />
                    </label>
                </div>
            </CardInput>
            <CardInput title='Fasilitas Membership' >
                <label className="form-control w-full">
                        <div className='flex flex-col gap-2'>
                            {fasilitasOption.map((item, i) => {
                                return (
                                    <div className='flex items-center gap-2' key={i}>
                                        <input type='text' name='' value={item} className="input input-bordered text-lg w-full" readOnly />
                                        <input type="checkbox" value={item} className="checkbox" name='toggle_input' onChange={handleChangeFasilitas} />
                                    </div>
                                )
                            })}
                        </div>
                </label>
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

export default PaketMembershipForm