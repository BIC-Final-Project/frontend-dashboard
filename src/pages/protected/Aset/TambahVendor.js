import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import TambahVendor from '../../../features/Aset/tambahVendor'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Asset"}))
      }, [])


    return(
        <TambahVendor />
    )
}

export default InternalPage