import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Routes } from 'react-router-dom'
import { actionLogout } from '../../store/auth/AuthSlice'

export function Logout() {
   const dispatch = useDispatch()

   useEffect(() => {
      dispatch(actionLogout())
      document.location.reload()
   }, [dispatch])

   return (
      <Routes>
         <Navigate to='/auth/login' />
      </Routes>
   )
}
