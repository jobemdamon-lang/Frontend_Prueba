import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AsideDefault } from './components/aside/AsideDefault'
import { Footer } from './components/Footer'
import { Header } from './components/header/Header'
import { Toolbar } from './components/toolbar/Toolbar'
import { ScrollTop } from './components/ScrollTop'
import { Content } from './components/Content'
import { PageDataProvider } from './core'
import { useLocation } from 'react-router-dom'
import { ThemeModeProvider } from '../components/theme-mode/ThemeModeProvider'
import { MenuComponent } from '../assets/ts/components'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

const MasterLayout = () => {
   const location = useLocation()
   useEffect(() => {
      setTimeout(() => {
         MenuComponent.reinitialization()
      }, 500)
   }, [])

   useEffect(() => {
      setTimeout(() => {
         MenuComponent.reinitialization()
      }, 500)
   }, [location.key])

   return (
      <PageDataProvider>
         <ThemeModeProvider>
            <div className='page d-flex flex-row flex-column-fluid'>
               <AsideDefault />
               <div className='wrapper d-flex flex-column flex-row-fluid' id='kt_wrapper'>
                  <Header />

                  <div id='kt_content' className='content d-flex flex-column flex-column-fluid'>
                     <Toolbar />
                     <div className='post d-flex flex-column-fluid' id='kt_post'>
                        <Content>
                           <Outlet />
                        </Content>
                     </div>
                  </div>
                  <Footer />
               </div>
            </div>
            <ScrollTop />
            <ToastContainer />
         </ThemeModeProvider>
      </PageDataProvider>
   )
}

export { MasterLayout }
