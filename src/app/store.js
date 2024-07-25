import { configureStore } from '@reduxjs/toolkit'
import headerSlice from '../features/common/headerSlice'
import modalSlice from '../features/common/modalSlice'
import rightDrawerSlice from '../features/common/rightDrawerSlice'
import leadsSlice from '../features/leads/leadSlice'
import membershipSlice from '../features/common/membershipSlice'
import fasilitasSlice from '../features/common/fasilitasSlice'

const combinedReducer = {
  header : headerSlice,
  rightDrawer : rightDrawerSlice,
  modal : modalSlice,
  lead : leadsSlice,
  membership : membershipSlice,
  fasilitas: fasilitasSlice
}

const store =  configureStore({
    reducer: combinedReducer
})

store.subscribe(() => {
  console.log('Store changes', store.getState())
})

export default store