import React, { useEffect } from 'react'
import FasilitasForm from '../components/FasilitasForm'
import { useGetFasilitasById, useUpdateFasilitas } from '../../../hooks/services/api/Fasilitas/fasilitas'
import { useDispatch, useSelector } from 'react-redux'
import queryClient from '../../../moduls/operational/helper/utils/queryClient'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { setWholeFasilitasState } from '../../common/fasilitasSlice'

const FasilitasEditPage = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {data, nama, deskripsi, gambar} = useSelector((state) => state.fasilitas)
    const {data: dataFasilitas, isFetching} = useGetFasilitasById(id)
    const {mutate, isPending} = useUpdateFasilitas({
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['allFasilitas'] })
            queryClient.invalidateQueries({ queryKey: ['fasilitas'] })
            toast.success('Update fasilitas successfully')
            navigate('/app/fasilitas')
        },
        onError: (error) => {
              console.log(error);
              toast.error(error.response?.data?.msg);
        }
    })

    console.log(dataFasilitas);

  const handleSubmit = (e) => {
      e.preventDefault()
      const dataHarga = JSON.stringify(data)
      const payload = new FormData()
      payload.append('harga', dataHarga)
      payload.append('nama', nama)
      payload.append('deskripsi', deskripsi)
      payload.append('gambar', gambar instanceof File ? gambar : '')
      mutate({id, payload})
  }

  useEffect(() => {
    if (data) {
        const dataEditFasilitas = {
            nama: dataFasilitas?.nama_fasilitas || '',
            deskripsi: dataFasilitas?.deskripsi_fasilitas || '',
            gambar: dataFasilitas?.gambar_fasilitas?.image_url || '',
            data: dataFasilitas?.harga_fasilitas || []
        }
        dispatch(setWholeFasilitasState({dataEditFasilitas}))
    }
    }, [isFetching])

  return (
    <FasilitasForm 
      isPending={isPending}
      handleSubmit={handleSubmit}
      currentState='update'
      isFetching={isFetching}
      required={false}
      title='Edit'
    />
  )
}

export default FasilitasEditPage