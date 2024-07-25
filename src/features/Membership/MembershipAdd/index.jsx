import React from 'react'
import MembershipForm from '../components/MembershipForm'
import { useCreateMembership } from '../../../hooks/services/api/Membership/membership'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { useSelector } from 'react-redux'

const MembershipAddPage = () => {
  const navigate = useNavigate()
  const {membership_type_id, data_member, usaha_anda, anggota_membership, dokumen_persyaratan} = useSelector((state) => state.membership)
  const {mutate, isPending} = useCreateMembership({
    onSuccess: (data) => {
      console.log(data);
        toast.success('Create membership successfully')
        queryClient.invalidateQueries({ queryKey: ['allMembership'] })
        navigate('/app/membership')
    },
    onError: (error) => {
          console.log(error);
          toast.error(error.response?.data?.msg);
    }
})

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      membership_type_id,
      data_member,
      usaha_anda,
      anggota_membership,
    }
    const formData = new FormData()
    formData.append("ktp-passport", dokumen_persyaratan.ktp_passport);
    formData.append("pas-photo", dokumen_persyaratan.pas_photo);
    formData.append("kartu-keluarga", dokumen_persyaratan.kartu_keluarga);

    const payload = {
        data,
        formData
    }
    mutate(payload)
  }

  return (
    <MembershipForm 
      handleSubmit={handleSubmit}
      isPending={isPending}
    />
  )
}

export default MembershipAddPage