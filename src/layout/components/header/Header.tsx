/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import { useLayout } from '../../core'
import { Topbar } from './Topbar'

const Header: FC = () => {
   const { classes, attributes } = useLayout()

   return (
      <div
         id='kt_header'
         className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
         {...attributes.headerMenu}
      >
         <div className={clsx(classes.headerContainer.join(' '), 'd-flex align-items-stretch justify-content-between')}>
            {/* begin::Aside mobile toggle */}
            <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
               <div
                  className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
                  id='kt_aside_mobile_toggle'
               >
                  <KTSVG path='/media/icons/duotune/abstract/abs015.svg' className='svg-icon-2x mt-1' />
               </div>
            </div>
            {/* end::Aside mobile toggle */}

            <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
               <Link to='/' className='d-lg-none'>
                  <img
                     alt='Logo'
                     src={toAbsoluteUrl('/media/logos/logo.svg')}
                     style={{ width: '100%', height: '22px', marginLeft: '5px' }}
                  />
               </Link>
            </div>

            {/* begin::Wrapper */}
            <div className='d-flex align-items-stretch justify-content-end flex-lg-grow-1'>
               <div className='d-flex align-items-stretch flex-shrink-0'>
                  <Topbar />
               </div>
            </div>
            {/* end::Wrapper */}
         </div>
      </div>
   )
}

export { Header }
