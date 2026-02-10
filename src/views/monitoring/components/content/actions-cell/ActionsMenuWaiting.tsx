/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect } from 'react'
import { Spinner } from './Spinner'
import { MenuComponent } from '../../../../../assets/ts/components'
import { Closed } from './menu-links/Closed'
import { Finalized } from './menu-links/Finalized'
import { InProcess } from './menu-links/InProcess'

type Props = {
   updateState: (state: string) => void
   processing: boolean
}

const ActionsMenuWaiting: FC<Props> = ({ updateState, processing }) => {
   useEffect(() => {
      MenuComponent.reinitialization()
   }, [])

   return (
      <>
         <a
            href='#'
            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
         >
            {processing ? (
               <Spinner />
            ) : (
               <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  fill='currentColor'
                  className='bi bi-clock'
                  viewBox='0 0 16 16'
               >
                  <path d='M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z' />
                  <path d='M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z' />
               </svg>
            )}
         </a>
         <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
            data-kt-menu='true'
            style={processing ? { visibility: 'hidden' } : { visibility: 'visible' }}
         >
            <div className='menu-item px-2'>
               <InProcess updateState={updateState} />
            </div>
            <div className='menu-item px-2'>
               <Finalized updateState={updateState} />
            </div>
            <div className='menu-item px-2'>
               <Closed updateState={updateState} />
            </div>
         </div>
      </>
   )
}

export { ActionsMenuWaiting }
