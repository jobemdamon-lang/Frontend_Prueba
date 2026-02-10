/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import { useLayout } from '../../core'
import { DefaultTitle } from './page-title/DefaultTitle'

const Toolbar = () => {
   const { classes } = useLayout()

   return (
      <>
         <div className='toolbar' id='kt_toolbar'>
            {/* begin::Container */}
            <div id='kt_toolbar_container' className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}>
               <DefaultTitle />
            </div>
            {/* end::Container */}
         </div>
      </>
   )
}

export { Toolbar }
