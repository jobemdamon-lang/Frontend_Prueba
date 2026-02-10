import clsx from 'clsx'
import { FC } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { IAuthState } from '../../../store/auth/Types'
import { RootState } from '../../../store/ConfigStore'
import { UserMenu } from './UserMenu'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
   toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px'

const Topbar: FC = () => {
   const user: IAuthState= useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState 

   return (
      <div className='d-flex align-items-stretch flex-shrink-0'>
         {/* begin::User */}
         <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)} id='kt_header_user_menu_toggle'>
            {/* begin::Toggle */}
            <div className='las la-user fs-2 mx-2 pb-1'>
               <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  fill='currentColor'
                  className='bi bi-person-fill'
                  viewBox='0 0 16 16'
               >
                  <path d='M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' />
               </svg>
            </div>
            <div
               className={clsx('btn btn-link text-dark fs-6 text-hover-primary', toolbarUserAvatarHeightClass)}
               data-kt-menu-trigger='click'
               data-kt-menu-attach='parent'
               data-kt-menu-placement='bottom-end'
               data-kt-menu-flip='bottom'
            >
               {user.usuario}
            </div>
            <UserMenu />
            {/* end::Toggle */}
         </div>
         {/* end::User */}
      </div>
   )
}

export { Topbar }
