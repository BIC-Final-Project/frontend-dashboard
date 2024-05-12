import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import RiwayatAset from '../../../features/Riwayat'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Riwayat"}))
      }, [])


    return(
        <RiwayatAset />
    )
}

export default InternalPage