/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect } from 'react'
import { MenuComponent } from '../../../../../assets/ts/components'
import { Closed } from './menu-links/Closed'
import { Finalized } from './menu-links/Finalized'
import { Spinner } from './Spinner'

type Props = {
   updateState: (state: string) => void
   processing: boolean
}

const ActionsMenuInProcess: FC<Props> = ({ updateState, processing }) => {
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
                  width='19'
                  height='19'
                  fill='currentColor'
                  className='bi bi-gear'
                  viewBox='0 0 16 16'
               >
                  <path d='M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z' />
                  <path d='M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z' />
               </svg>
            )}
         </a>
         <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
            data-kt-menu='true'
            style={processing ? { visibility: 'hidden' } : { visibility: 'visible' }}
         >
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

export { ActionsMenuInProcess }
