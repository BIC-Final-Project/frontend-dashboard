import React, { useEffect, useState } from 'react'
import PaketMembershipForm from '../components/PaketMembershipForm'
import { useGetFasilitasNameOption } from '../../../hooks/services/api/Option/option'
import { useCreateMembershipType } from '../../../hooks/services/api/PaketMembership/paketMembership'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resetFasilitasState } from '../../common/fasilitasSlice'
import { useDispatch } from 'react-redux'

const PaketMembershipAddPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [dataPaket, setDataPaket] = useState({
    jenis_paket: '',
    jenis_keanggotaan: '',
    jumlah_anggota_yang_berlaku: '',
    harga: ''
  })
  const [fasilitasMembership, setFasilitasMembership] = useState([])
  const {data = [], isFetching} = useGetFasilitasNameOption()
  const {mutate, isPending} = useCreateMembershipType({
    onSuccess: (data) => {
        toast.success('Create paket membership successfully')
        queryClient.invalidateQueries({ queryKey: ['allMembershipType'] })
        navigate('/app/paket-membership')
    },
    onError: (error) => {
          console.log(error);
          toast.error(error.response?.data?.msg);
    }
  })


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
      mutate(data)
  }

  // useEffect(() => {
  //   if(data && !isFetching) {
  //     const fasilitasName = data.map(item => {
  //       return {
  //           nama_fasilitas: item,
  //           is_with_members: false
  //       }
  //     })
  //     setFasilitasOption(fasilitasName)
  //   }
  // }, [data])

  useEffect(() => {
    dispatch(resetFasilitasState())
  }, [])

  return (
    <PaketMembershipForm 
      fasilitasOption={data}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleChangeFasilitas={handleChangeFasilitas}
      dataPaket={dataPaket}
      isPending={isPending}
    />
  )
}

export default PaketMembershipAddPage