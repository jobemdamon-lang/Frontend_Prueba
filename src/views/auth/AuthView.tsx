/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { Login } from './components/Login'
import { toAbsoluteUrl } from '../../helpers'

const AuthLayout = () => {
   useEffect(() => {
      document.body.classList.add('bg-white')
      return () => {
         document.body.classList.remove('bg-white')
      }
   }, [])

   return (
      <div className='d-flex flex-column flex-column-fluid'>
         {/* begin::Content */}
         <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
            {/* begin::Logo */}
            <a href='#' className='mb-12'>
               <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo.svg')} className='h-45px' />
            </a>
            {/* end::Logo */}
            {/* begin::Wrapper */}
            <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
               <Outlet />
            </div>
            {/* end::Wrapper */}
         </div>
         {/* end::Content */}
      </div>
   )
}

const AuthView = () => (
   <Routes>
      <Route element={<AuthLayout />}>
         <Route path='login' element={<Login />} />
         <Route index element={<Login />} />
      </Route>
   </Routes>
)

export { AuthView }
