import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllMembershipType } from '../../../hooks/services/api/PaketMembership/paketMembership'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import { setAnggotaMembership, setDataMembership, setHapusAnggotaMembership, setIdMembershipType, setTambahAnggotaMembership } from '../../common/membershipSlice';
import iconCross from '../../../assets/icons/cross.svg'
import iconPlus from '../../../assets/icons/plus.svg'
import moment from 'moment';
import 'moment/locale/id'
import LoaderFetcher from '../../../components/Loader/LoaderFetcher';
import CardInput from '../../../components/Cards/CardInput';
import SectionTitle from '../../../components/SectionTitle.jsx';
import { useGetMembershipTypeOption } from '../../../hooks/services/api/Option/option.js';
import ButtonPrimary from '../../../components/Button/ButtonPrimary.jsx';
import { useNavigate } from 'react-router-dom';

const MembershipForm = ({title, currentState, isFetching, isPending, handleSubmit}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [opsiKeanggotaan, setOpsiKeanggotaan] = useState([])
    const {data_member, usaha_anda, dokumen_persyaratan, anggota_membership} = useSelector(state => state.membership)
    const {paket, jenis_keanggotaan, no_ktp, nama_lengkap, jenis_kelamin, tanggal_lahir, alamat_rumah, kota, no_wa, email} = data_member
    const {nama_perusahaan, bidang_usaha, jabatan, alamat_kantor, telp, kartu_kredit, no_kartu_kredit} = usaha_anda
    const {ktp_passport, pas_photo, kartu_keluarga} = dokumen_persyaratan
    const {data: membershipTypeOption = [], isFetching: isFetchingOption} = useGetMembershipTypeOption()
    const opsiPaket = membershipTypeOption.map(item => item.jenis_paket)

    const handleFilterKeanggotaan = (paket) => {
        const data = membershipTypeOption.find(item => item.jenis_paket === paket)
        console.log({membershipTypeOption});
        setOpsiKeanggotaan(data.jenis_keanggotaan)
    }

    const handleChangeAnggota = (e, index) => {
        const {value} = e.target
        dispatch(setAnggotaMembership({index, value}))
    }

    const handleChangeFile = (e) => {
        const name = e.target.name
        const file = e.target.files[0]
        dispatch(setDataMembership({keyState: 'dokumen_persyaratan', name, value: file}))
    }

    const handleChange = (e, keyState) => {
        const {name, value} = e.target
        dispatch(setDataMembership({keyState, name, value}))
    }

    const handleChangePaket = (e, keyState) => {
        const {name, value} = e.target
        handleFilterKeanggotaan(value)
        dispatch(setDataMembership({keyState, name, value}))
    }

    const handleChangeKeanggotaan = (e, keyState) => {
        const {name, value} = e.target
        const idMembershipType = opsiKeanggotaan.find(item => item.nama === value)
        dispatch(setIdMembershipType({id: idMembershipType._id}))
        dispatch(setDataMembership({keyState, name, value}))
    }

    const handleChangeDate = ([date]) => {
        dispatch(setDataMembership({keyState: 'data_member', name: 'tanggal_lahir', value: moment(date).format('DD/MM/YYYY')}))
    }

    useEffect(() => {
        if(membershipTypeOption.length !== 0) {
            handleFilterKeanggotaan(paket)
        }
    }, [isFetchingOption])

  return (
    <SectionTitle title={`${title} Membership`}>
        {isFetching ? <LoaderFetcher /> :
        <form onSubmit={handleSubmit} className='grid grid-cols-1 auto-cols-min gap-5'>
            <CardInput title='Paket Membership' >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Paket</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='paket' onChange={(e) => handleChangePaket(e, 'data_member')} value={paket}>
                            <option disabled value=''>Pilih paket</option>
                            {opsiPaket.map((item, i) => <option key={i} value={item} className='capitalize'>{item}</option>)}
                        </select>
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jenis Keanggotaan</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='jenis_keanggotaan' onChange={(e) => handleChangeKeanggotaan(e, 'data_member')} value={jenis_keanggotaan}>
                            <option disabled value=''>Pilih keanggotaan</option>
                            {opsiKeanggotaan.map((item, i) => <option key={i} value={item.nama} className='capitalize'>{item.nama}</option>)}
                        </select>
                    </label>
                </div>
            </CardInput>
            <CardInput title='Data Diri' >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">No KTP*</span>
                        </div>
                        <input type='text' name='no_ktp' value={no_ktp} onChange={(e) => handleChange(e, 'data_member')} placeholder='No KTP' className="input input-bordered text-lg w-full" required />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Nama lengkap*</span>
                        </div>
                        <input type='text' name='nama_lengkap' value={nama_lengkap} onChange={(e) => handleChange(e, 'data_member')} placeholder='Nama Lengkap' className="input input-bordered text-lg w-full" required />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jenis Kelamin</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='jenis_kelamin' onChange={(e) => handleChange(e, 'data_member')} value={jenis_kelamin}>
                            <option disabled value=''>Pilih jenis kelamin</option>
                            {['laki-laki', 'perempuan'].map((item, i) => <option key={i} value={item} className='capitalize'>{item}</option>)}
                        </select>
                    </label>
                    <div className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Tanggal Lahir</span>
                        </div>
                        <Flatpickr     
                            value={tanggal_lahir}
                            options={{
                                dateFormat: "d/m/Y",
                                disableMobile: true
                            }}
                            placeholder='Pilih Tanggal'
                            onChange={handleChangeDate}
                            name='tanggal_lahir'
                            className='flatpicker rounded-lg w-full border-[1px] px-4 py-2.5 font-medium text-lg cursor-pointer'
                        />
                    </div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Kota</span>
                        </div>
                        <input type='text' name='kota' value={kota} onChange={(e) => handleChange(e, 'data_member')} placeholder='Kota' className="input input-bordered text-lg w-full" />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Alamat</span>
                        </div>
                        <input type='text' name='alamat_rumah' value={alamat_rumah} onChange={(e) => handleChange(e, 'data_member')} placeholder='Alamat Rumah' className="input input-bordered text-lg w-full" />
                    </label>
                </div>
            </CardInput>
            <CardInput title='Informasi Kontak' >
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">No Whatsapp*</span>
                        </div>
                        <input type='text' name='no_wa' value={no_wa} onChange={(e) => handleChange(e, 'data_member')} placeholder='No Whatsapp' className="input input-bordered text-lg w-full" required />
                </label> 
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Email*</span>
                        </div>
                        <input type='text' name='email' value={email} onChange={(e) => handleChange(e, 'data_member')} placeholder='Email' className="input input-bordered text-lg w-full" required />
                </label>
            </CardInput>
            <CardInput title='Data Usaha' >
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Nama Perusahaan</span>
                        </div>
                        <input type='text' name='nama_perusahaan' value={nama_perusahaan} onChange={(e) => handleChange(e, 'usaha_anda')} placeholder='Nama Perusahaan' className="input input-bordered text-lg w-full" />
                </label> 
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Bidang Usaha</span>
                        </div>
                        <input type='text' name='bidang_usaha' value={bidang_usaha} onChange={(e) => handleChange(e, 'usaha_anda')} placeholder='Bidang Usaha' className="input input-bordered text-lg w-full" />
                </label> 
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Jabatan</span>
                        </div>
                        <input type='text' name='jabatan' value={jabatan} onChange={(e) => handleChange(e, 'usaha_anda')} placeholder='Jabatan' className="input input-bordered text-lg w-full" />
                </label> 
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Alamat Kantor</span>
                        </div>
                        <input type='text' name='alamat_kantor' value={alamat_kantor} onChange={(e) => handleChange(e, 'usaha_anda')} placeholder='Alamat Kantor' className="input input-bordered text-lg w-full" />
                </label> 
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Telepon</span>
                        </div>
                        <input type='tel' name='telp' value={telp} onChange={(e) => handleChange(e, 'usaha_anda')} placeholder='Telepon' className="input input-bordered text-lg w-full" />
                </label> 
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Kartu Kredit</span>
                        </div>
                        <select className="select select-bordered text-lg font-medium capitalize" name='kartu_kredit' onChange={(e) => handleChange(e, 'usaha_anda')} value={kartu_kredit}>
                            <option disabled value=''>Pilih kartu kredit</option>
                            {['Master', 'Visa', 'Amex'].map((item, i) => <option key={i} value={item} className='capitalize'>{item}</option>)}
                        </select>
                </label>
                <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text text-lg font-medium">Nomor Kartu Kredit</span>
                        </div>
                        <input type='text' name='no_kartu_kredit' value={no_kartu_kredit} onChange={(e) => handleChange(e, 'usaha_anda')} placeholder='Nomor Kartu Kredit' className="input input-bordered text-lg w-full" />
                </label> 
            </CardInput>
            <CardInput title='Dokumen Persyaratan' >
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text text-fontGreen text-lg font-medium">KTP / Passport*</span>
                    </div>
                    <input type="file" accept=".png,.jpg,.jpeg,.pdf" name={'ktp_passport'} onChange={handleChangeFile} className="file-input file-input-bordered border-borderGreen w-full" required={currentState !== 'update'} />
                    {currentState === 'update' && <img src={ktp_passport?.image_url} alt='' className="w-24 object-cover rounded-md" />}
                    <span className='text-base font-medium italic'>{ktp_passport?.name || '-'}</span>
                </label>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text text-fontGreen text-lg font-medium">Pas Photo*</span>
                    </div>
                    <input type="file" accept=".png,.jpg,.jpeg,.pdf" name={'pas_photo'} onChange={handleChangeFile} className="file-input file-input-bordered border-borderGreen w-full" required={currentState !== 'update'} />
                    {currentState === 'update' && <img src={pas_photo?.image_url} alt='' className="w-24 object-cover rounded-md" />}
                    <span className='text-base font-medium italic'>{pas_photo?.name || '-'}</span>
                </label>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text text-fontGreen text-lg font-medium">Kartu Keluarga*</span>
                    </div>
                    <input type="file" accept=".png,.jpg,.jpeg,.pdf" name={'kartu_keluarga'} onChange={handleChangeFile} className="file-input file-input-bordered border-borderGreen w-full" required={currentState !== 'update'} />
                    {currentState === 'update' && <img src={kartu_keluarga?.image_url} alt='' className="w-24 object-cover rounded-md" />}
                    <span className='text-base font-medium italic'>{kartu_keluarga?.name || '-'}</span>
                </label>
            </CardInput>
            <CardInput title='Anggota Tambahan' >
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text text-fontGreen text-lg font-medium">
                            Anggota Tambahan
                        </span>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                            {anggota_membership.map((item, i) => {
                                return (
                                    <div className='flex items-center gap-4'>
                                        <span className='text-base font-medium w-6'>
                                            {i+1}.
                                        </span>
                                        <input key={i} className={`grow input input-bordered text-fontGrey font-medium px-4 rounded-[4px]`} type='text' placeholder='Masukkan anggota tambahan' id="nama" name='nama' value={item} onChange={(e) => handleChangeAnggota(e, i)} />                 
                                        {/* Remove Anggota Membership    */}
                                        <div className={`border input-bordered hover:border-gray-500 duration-100 p-2 rounded-full cursor-pointer ${i === 0 && 'invisible'}`} 
                                        onClick={() => dispatch(setHapusAnggotaMembership({index: i}))}>
                                            <img src={iconCross} alt="" className='w-5' />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <ButtonPrimary type="button" onClick={() => dispatch(setTambahAnggotaMembership())}>
                            <img src={iconPlus} alt="" />
                            Tambahkan anggota lainnya
                        </ButtonPrimary>
                    </div>
                </label>
            </CardInput>
            <div className='justify-self-end flex gap-4 items-center'>
                <ButtonPrimary className='w-24' onClick={() => window.location.replace('/app/membership')} variant="outline" type="button">
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

export default MembershipForm