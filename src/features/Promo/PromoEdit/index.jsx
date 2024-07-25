import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { useCreatePromo, useGetPromoById, useUpdatePromo } from '../../../hooks/services/api/Promo/promo'
import PromoForm from '../components/PromoForm'
import moment from 'moment'
import PromoEditForm from '../components/PromoEditForm'

const PromoEditPage = () => {
    const {id} = useParams()
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
  const { data, isFetching } = useGetPromoById(id)
  const {mutate, isPending} = useUpdatePromo({
    onSuccess: (data) => {
        toast.success('Update promo successfully')
        queryClient.invalidateQueries({ queryKey: ['allPromo'] })
        queryClient.invalidateQueries({ queryKey: ['promo'] })
        setTimeout(() => {
          navigate('/app/promo')
        }, 1000)
    },
    onError: (error) => {
          console.log(error);
          toast.error(error.response?.data?.msg);
    }
  })

  console.log(data);

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
    mutate({id, payload: dataPromo})
  }

  useEffect(() => {
    if (data) {
        const { nama, kode, diskon, tanggal_awal, tanggal_akhir, jam_awal, jam_akhir} = data
        setDataPromo({
            nama, 
            kode, 
            diskon, 
            tanggal_awal, 
            tanggal_akhir, 
            jam_awal, 
            jam_akhir
        })
    }
    }, [data])

  return (
    <PromoEditForm 
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

export default PromoEditPage