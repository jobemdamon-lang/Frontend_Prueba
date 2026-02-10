import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutProvider, LayoutSplashScreen } from './layout/core'
import { MasterInit } from './layout/MasterInit'
import { ErrorBoundary } from './components/ErrorBoundary'

const App = () => {
   return (
      <ErrorBoundary>
         <Suspense fallback={<LayoutSplashScreen />}>
            <LayoutProvider>
               <Outlet />
               <MasterInit />
            </LayoutProvider>
         </Suspense>
      </ErrorBoundary>
   )
}

export { App }
