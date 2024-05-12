import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TambahAset from '../../../features/Pemeliharaan/tambahAsetDanger'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Pemeliharaan"}))
      }, [])


    return(
        <TambahAset />
    )
}

export default InternalPage