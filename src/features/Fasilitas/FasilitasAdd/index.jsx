import React, { useEffect } from 'react'
import FasilitasForm from '../components/FasilitasForm'
import { useCreateFasilitas } from '../../../hooks/services/api/Fasilitas/fasilitas'
import { useDispatch, useSelector } from 'react-redux'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { resetFasilitasState } from '../../common/fasilitasSlice'

const FasilitasAddPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {data, nama, deskripsi, gambar} = useSelector((state) => state.fasilitas)
    const {mutate, isPending} = useCreateFasilitas({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['allFasilitas'] })
            toast.success('Create fasilitas successfully')
            navigate('/app/fasilitas')
        },
        onError: (error) => {
              console.log(error);
              toast.error(error.response?.data?.msg);
        }
    })

  const handleSubmit = (e) => {
      e.preventDefault()
      const dataHarga = JSON.stringify(data)
      const payload = new FormData()
      payload.append('harga', dataHarga)
      payload.append('nama', nama)
      payload.append('deskripsi', deskripsi)
      payload.append('gambar', gambar)
      mutate(payload)
  }

  useEffect(() => {
    dispatch(resetFasilitasState())
  }, [])

  return (
    <FasilitasForm 
      isPending={isPending}
      handleSubmit={handleSubmit}
    />
  )
}

export default FasilitasAddPage