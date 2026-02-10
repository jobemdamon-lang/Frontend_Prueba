/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect } from 'react'
import { MenuComponent } from '../../../../../assets/ts/components'
import { Closed } from './menu-links/Closed'
import { Spinner } from './Spinner'
//import { Context } from '../../Context'

type Props = {
   updateState: (state: string) => void
   processing: boolean
}

const ActionsMenuFinalized: FC<Props> = ({ updateState, processing }) => {
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
                  className='bi bi-check-lg'
                  viewBox='0 0 16 16'
               >
                  <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z' />
               </svg>
            )}
         </a>
         <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
            data-kt-menu='true'
            style={processing ? { visibility: 'hidden' } : { visibility: 'visible' }}
         >
            <div className='menu-item px-2'>
               <Closed updateState={updateState} />
            </div>
         </div>
      </>
   )
}

export { ActionsMenuFinalized }
