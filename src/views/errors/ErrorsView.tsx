/* eslint-disable jsx-a11y/anchor-is-valid */
import { Route, Link, Routes, Outlet } from 'react-router-dom'
import { Error500 } from './components/Error500'
import { Error404 } from './components/Error404'
import { toAbsoluteUrl } from '../../helpers'

const ErrorsLayout = () => {
   return (
      <div className='d-flex flex-column flex-root'>
         <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
            <div className='d-flex flex-column flex-column-fluid text-center p-10 py-lg-20'>
               <a href='/dashboard' className='mb-10 pt-lg-20'>
                  <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo.svg')} className='h-50px mb-5' />
               </a>
               <div className='pt-lg-10 mb-10'>
                  <Outlet />
                  <div className='text-center'>
                     <Link to='/home/menu' className='btn btn-lg btn-primary fw-bolder'>
                        Ir a la página principal
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

const ErrorsView = () => (
   <Routes>
      <Route element={<ErrorsLayout />}>
         <Route path='404' element={<Error404 />} />
         <Route path='500' element={<Error500 />} />
         <Route path='*' element={<Error404 />} />
      </Route>
   </Routes>
)

export { ErrorsView }
