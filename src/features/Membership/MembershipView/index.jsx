import React, { useEffect } from 'react'
import MembershipForm from '../components/MembershipForm'
import { useCreateMembership, useEditMembership, useGetMembershipById } from '../../../hooks/services/api/Membership/membership'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { useDispatch, useSelector } from 'react-redux'
import { setWholeMembershipState } from '../../common/membershipSlice'
import MembershipFormView from '../components/MembershipFormView'

const MembershipViewPage = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
  const navigate = useNavigate()
  const {membership_type_id, data_member, usaha_anda, anggota_membership, dokumen_persyaratan} = useSelector((state) => state.membership)
  const {data, isFetching} = useGetMembershipById(id)
  console.log(data);
  const {mutate, isPending} = useEditMembership({
    onSuccess: (data) => {
        toast.success('Update membership successfully')
        queryClient.invalidateQueries({ queryKey: ['allMembership'] })
        queryClient.invalidateQueries({ queryKey: ['membership'] })
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
    formData.append("ktp-passport", typeof dokumen_persyaratan.ktp_passport === 'object' ? '' : dokumen_persyaratan.ktp_passport);
    formData.append("pas-photo", dokumen_persyaratan.pas_photo);
    formData.append("kartu-keluarga", dokumen_persyaratan.kartu_keluarga);

    const payload = {
        data,
        formData
    }

    mutate({id, payload})
  }

  useEffect(() => {
    if (data) {
        dispatch(setWholeMembershipState({data}))
    }
    }, [data])

  return (
    <MembershipFormView
      handleSubmit={handleSubmit}
      isPending={isPending}
      isFetching={isFetching}
      currentState='update'
    />
  )
}

export default MembershipViewPage