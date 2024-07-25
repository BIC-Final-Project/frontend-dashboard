import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { useCreatePromo } from '../../../hooks/services/api/Promo/promo'
import PromoForm from '../components/PromoForm'
import moment from 'moment'

const PromoAddPage = () => {
  const navigate = useNavigate()
  const [dataPromo, setDataPromo] = useState({
    nama: "",
    kode: "",
    diskon: 0,
    tanggal_awal: '',
    tanggal_akhir: "",
    jam_awal: "",
    jam_akhir: ""
  })
  const {mutate, isPending} = useCreatePromo({
    onSuccess: (data) => {
        toast.success('Create promo successfully')
        queryClient.invalidateQueries({ queryKey: ['allPromo'] })
        navigate('/app/promo')
    },
    onError: (error) => {
          console.log(error);
          toast.error(error.response?.data?.msg);
    }
  })

    const handleChange = (e) => {
        const {name, value} = e.target
        setDataPromo(preVal => {
            return {
                ...preVal,
                [name]: name === 'diskon' ? +value : value
            }
        })
    }

    const handleChangeJam = (name, value) => {
      setDataPromo(preVal => {
          return {
              ...preVal,
              [name]: value
          }
      })
  }

    const handleChangeTanggalAwal = ([date]) => {
        setDataPromo(preVal => {
            return {
                ...preVal,
                tanggal_awal: moment(date).format('DD-MM-YYYY')
            }
        })
    }
    const handleChangeTanggalAkhir = ([date]) => {
      setDataPromo(preVal => {
          return {
              ...preVal,
              tanggal_akhir: moment(date).format('DD-MM-YYYY')
          }
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate(dataPromo)
  }

  return (
    <PromoForm 
      dataPromo={dataPromo}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      handleChangeTanggalAwal={handleChangeTanggalAwal}
      handleChangeTanggalAkhir={handleChangeTanggalAkhir}
      handleChangeJam={handleChangeJam}
      isPending={isPending}
    />
  )
}

export default PromoAddPage