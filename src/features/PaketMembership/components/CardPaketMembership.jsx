import React from 'react'
import ButtonPrimary from '../../../components/Button/ButtonPrimary'
import { convertToRupiah } from '../../../moduls/operational/helper/utils/convertRupiah'
import { getMembershipIcon } from '../constants/paketMembership'
import iconChecklist from '../../../assets/icons/checklist.svg'
import { useNavigate } from 'react-router-dom'
import { showModalDelete } from '../../../moduls/operational/helper/utils/handleModal'

const CardPaketMembership = ({_id, harga, jenis_keanggotaan, jumlah_anggota_yang_berlaku, fasilitas_membership = [], setSelectedId}) => {
    const navigate = useNavigate()
  return (
    <div className='grid grid-cols-1 auto-rows-min border-2 border-borderGreen rounded-xl overflow-hidden'>
        <div className='flex flex-col items-center gap-4 px-3 py-6 text-fontGreen'>
            <img src={getMembershipIcon(jenis_keanggotaan)} alt="" />
            <h2 className='text-fontGreen text-xl font-semibold'>{jenis_keanggotaan}</h2>
            <h1 className='text-fontGreen text-3xl font-bold'>
                {convertToRupiah(harga)} <span className='text-sm'>/ bulan</span>
            </h1>
            <span className='text-fontGrey'>Berlaku Untuk {jumlah_anggota_yang_berlaku} Orang</span>
        </div>
        <div className='py-3 text-center bg-lightGreen text-fontBlue border-y-[1px] border-borderGreen'>
            <span className='font-semibold text-fontBlue'>Durasi 3 Bulan</span>
        </div>
        <div className='flex flex-col gap-4 px-4 py-6'>
            <ul className='grid grid-cols-[max-content] justify-center auto-rows-min gap-4'>
                {fasilitas_membership.map((item, i) => {
                    return (
                        <li key={i} className='flex items-center gap-2'>
                            <img src={iconChecklist} alt="" />
                            {`${item.nama_fasilitas} ${item.is_with_members ? '*' : ''}`}
                        </li>
                    )
                })}
            </ul>
            <span className='text-fontGrey text-center'>*khusus sesama anggota</span>
        </div>
        <div className='grid grid-cols-2 items-center gap-2 px-4 py-6 bg-lightGreen text-center'>
            <ButtonPrimary className='bg-[#D92D20] hover:!bg-[#D92D20] border-transparent hover:border-transparent text-white' variant="outline" type="button"
            onClick={() => {
                setSelectedId(_id)
                showModalDelete()
            }}
            >Hapus</ButtonPrimary>
            <ButtonPrimary className='' type="button" onClick={() => navigate(`/app/paket-membership/edit/${_id}`)}>Edit</ButtonPrimary>
        </div>
    </div>
  )
}

export default CardPaketMembership