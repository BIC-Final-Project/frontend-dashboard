import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import PerencanaanAset from '../../../features/Perencanaan'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Perencanaan"}))
      }, [])


    return(
        <PerencanaanAset />
    )
}

export default InternalPage