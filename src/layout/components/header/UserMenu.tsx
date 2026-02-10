/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { IAuthState } from '../../../store/auth/Types'
import { actionLogout } from '../../../store/auth/AuthSlice'
import { RootState } from '../../../store/ConfigStore'
import { useNavigate } from 'react-router-dom'
import { openOffCanvas } from '../../../store/offcanvasSlice'
import defaultIMg from "./blank.svg"
import SVG from "react-inlinesvg"

const UserMenu: FC = () => {
   const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const logout = () => {
      dispatch(actionLogout())
   }

   return (
      <div
         className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
         data-kt-menu='true'
      >
         <div className='menu-item px-3'>
            <div className='menu-content d-flex align-items-center px-3'>
               <div className='mx-2'>
                  {user.foto === "" ?
                  <SVG src={defaultIMg} className="category-item" height={55} width={55}/>
                  :
                  <img width={55} height={55} src={`data:image/jpeg;base64,${user.foto}`} alt="imagen de Usuario" />
                  }
               </div>
               <div className='d-flex flex-column'>
                  <div className='fw-bolder d-flex align-items-center fs-5'>
                     {user?.nombre}
                  </div>
                  <a href='#' className='fw-bold text-muted text-hover-primary fs-7'>
                     {user?.cargo}
                  </a>
               </div>
            </div>
         </div>

         <div className='separator my-2'></div>
         <div className='menu-item px-5'>
            <a onClick={()=>{navigate("/home/profile")}} className='menu-link px-5'>
               Mi perfil
            </a>
         </div>
         <div className='menu-item px-5'>
            <a onClick={()=>{
               navigate("/backups/politicas")
               dispatch(openOffCanvas())
            }} className='menu-link px-5'>
               Mis Solicitudes
            </a>
         </div>
         <div className='menu-item px-5'>
            <a onClick={logout} className='menu-link px-5'>
               Cerrar sesión
            </a>
         </div>
      </div>
   )
}

export { UserMenu }
