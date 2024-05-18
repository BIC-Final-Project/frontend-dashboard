import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../features/common/headerSlice'
import DetailAset from '../../../features/Aset'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Detail Asset"}))
      }, [])


    return(
        <DetailAset />
    )
}

export default InternalPage