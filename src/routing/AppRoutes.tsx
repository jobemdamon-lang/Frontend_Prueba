import { FC, useEffect } from 'react'
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import { PrivateRoutes } from './PrivateRoutes'
import { ErrorsView } from '../views/errors/ErrorsView'
import { Logout, AuthView } from '../views/auth'
import configStore, { RootState } from '../store/ConfigStore'
import { App } from '../App'
import { IAuthState } from '../store/auth/Types'
import { AnalyticsListener } from '../components/analytics/AnalyticsListener'
import { AnalyticsService } from '../helpers/analytics'

const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {

   const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

   useEffect(() => {
      AnalyticsService.init(configStore)
   }, [])

   return (
      <BrowserRouter basename={PUBLIC_URL}>
         <AnalyticsListener />
         <Routes>
            <Route element={<App />}>
               <Route path='error/*' element={<ErrorsView />} />
               <Route path='logout' element={<Logout />} />
               {user.token !== "" ? (
                  <>
                     <Route path='/*' element={<PrivateRoutes />} />
                     <Route index element={<Navigate to='/home/menu' />} />
                  </>
               ) : (
                  <>
                     <Route path='auth/*' element={<AuthView />} />
                     <Route path='*' element={<Navigate to='/auth' />} />
                  </>
               )}
            </Route>
         </Routes>
      </BrowserRouter>
   )
}

export { AppRoutes }
