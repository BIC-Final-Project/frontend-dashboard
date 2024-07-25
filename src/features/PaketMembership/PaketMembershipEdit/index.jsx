import React, { useEffect, useState } from 'react'
import PaketMembershipForm from '../components/PaketMembershipForm'
import { useGetFasilitasNameOption } from '../../../hooks/services/api/Option/option'
import { useCreateMembershipType, useGetMembershipTypeById, useUpdateMembershipType } from '../../../hooks/services/api/PaketMembership/paketMembership'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetMembershipById } from '../../../hooks/services/api/Membership/membership'

const PaketMembershipEditPage = () => {
    const {id} = useParams()
  const navigate = useNavigate()
  const [dataPaket, setDataPaket] = useState({
    jenis_paket: '',
    jenis_keanggotaan: '',
    jumlah_anggota_yang_berlaku: '',
    harga: ''
  })
  const [fasilitasMembership, setFasilitasMembership] = useState([])
  const {data = []} = useGetFasilitasNameOption()
  const {data: membershipTypeData, isFetching} = useGetMembershipTypeById(id)
  const {mutate, isPending} = useUpdateMembershipType({
    onSuccess: (data) => {
        toast.success('Update paket membership successfully')
        queryClient.invalidateQueries({ queryKey: ['allMembershipType'] })
        queryClient.invalidateQueries({ queryKey: ['membershipType'] })
        navigate('/app/paket-membership')
    },
    onError: (error) => {
          console.log(error);
          toast.error(error.response?.data?.msg);
    }
  })

  console.log(membershipTypeData);


  const handleChange = (e) => {
      const {name, value} = e.target
      setDataPaket(preVal => {
        return {
          ...preVal,
          [name]: name === 'jumlah_anggota_yang_berlaku' ? +value : value
        }
      })
  }

  const handleChangeFasilitas = (e) => {
      const {name, value} = e.target
      if(fasilitasMembership.includes(value)) {
          setFasilitasMembership(preVal => {
            return preVal.filter(item => item !== value)
          })
      } else {
          const data = [...fasilitasMembership, value]
          setFasilitasMembership(data)
      }
  }

  const handleSubmit = (e) => {
      e.preventDefault()
      const formattedFasilitas = fasilitasMembership.map(item => {
        return {
          nama_fasilitas: item
        }
      })
      const data = {
          ...dataPaket,
          fasilitas_membership: formattedFasilitas
      }
      mutate({id, payload: data})
  }

    useEffect(() => {
        if (data) {
            setDataPaket({
                ...dataPaket,
                harga: membershipTypeData?.harga || '',
                jenis_paket: membershipTypeData?.jenis_paket || '',
                jenis_keanggotaan: membershipTypeData?.jenis_keanggotaan || '',
                jumlah_anggota_yang_berlaku: membershipTypeData?.jumlah_anggota_yang_berlaku || ''
            })
        }
    }, [isFetching])

  return (
    <PaketMembershipForm 
      fasilitasOption={data}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleChangeFasilitas={handleChangeFasilitas}
      dataPaket={dataPaket}
      isPending={isPending}
      isFetching={isFetching}
      title='Edit'
    />
  )
}

export default PaketMembershipEditPage