/* eslint-disable jsx-a11y/anchor-is-valid */
type Props = {
   row: any
}

const TicketTooltip = ({ row }: Props) => {
   const _row = row[0]
   const menuTrigger = "{default: 'hover'}"

   const redirect = () => {
      window.open(_row.ticketurl, '_blank')
   }

   return (
      <>
         <div data-kt-menu-trigger={menuTrigger} data-kt-menu-attach='parent' data-kt-menu-placement='top-end'>
            <a href='#' onClick={() => redirect()}>
               {_row.ticketid}
            </a>
         </div>
         <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 fw-semibold py-3 fs-base w-200px'
            data-kt-menu='true'
         >
            <div className='menu-item px-3 pb-2 border-bottom'>
               <span>Ticket:</span>
               <span className='menu-title ps-2'>{_row.ticketid}</span>
            </div>
            <div className='py-2'>
               <div className='menu-item px-3 py-1'>
                  <span>Estado:</span>
                  <span className='menu-title ps-2'>{_row.ticketstate}</span>
               </div>
               <div className='menu-item px-3 py-1'>
                  <span>Propietario:</span>
                  <span className='menu-title ps-2'>{_row.ownergroup}</span>
               </div>
            </div>
         </div>
      </>
   )
}

export { TicketTooltip }
