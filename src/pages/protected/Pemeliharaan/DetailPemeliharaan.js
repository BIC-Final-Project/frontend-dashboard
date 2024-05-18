import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import Pemeliharaan from '../../../features/Pemeliharaan'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Pemeliharaan Aset"}))
      }, [])


    return(
        <Pemeliharaan />
    )
}

export default InternalPage