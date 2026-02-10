/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useContext, useState } from 'react'
import { ActionsMenuWaiting } from './ActionsMenuWaiting'
import { ActionsMenuInProcess } from './ActionsMenuInProcess'
import { ActionsMenuFinalized } from './ActionsMenuFinalized'
import { ActionsMenuClosed } from './ActionsMenuClosed'
import { Context } from '../../Context'
import { IAlert } from '../../Types'
import { ToolTip } from '../../../../../components/tooltip/ToolTip'

type Props = {
   row: IAlert
}

const ActionsCell: FC<Props> = ({ row }) => {
   const { openModal, fetchData } = useContext(Context)
   const [processing, setProcessing] = useState(false)

   const _openModal = () => {
      openModal(row)
   }

   /* actualiza el estado del ticket y vuelve a cargar los datos */
   const _updateState = (state: string) => {
      console.log('start update')

      setProcessing(true)

      setTimeout(async () => {
         console.log('update state')
         await fetchData()
         setProcessing(false)
      }, 20000)
      /*
      try {
         await MonitoringService.monitorState({
            client: row.idmonitor,
            ticketstate: state,
         })
         fetchData()
         setProcessing(false)
      } catch (error) {
         setProcessing(false)
         console.log(error)
      }*/
   }

   return (
      <>
         <ToolTip
            message='Detalle de Alerta'
            placement='top'
         >
            <a
               href='#'
               className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
               onClick={() => _openModal()}
            >
               <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  fill='currentColor'
                  className='bi bi-info-circle'
                  viewBox='0 0 16 16'
               >
                  <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
                  <path d='m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' />
               </svg>
            </a>
         </ToolTip>

         {row.estado.trim() === 'PENDIENTE' && (
            <ActionsMenuWaiting updateState={_updateState} processing={processing} />
         )}
         {row.estado.trim() === 'EN PROCESO' && (
            <ActionsMenuInProcess updateState={_updateState} processing={processing} />
         )}
         {row.estado.trim() === 'FINALIZADO' && (
            <ActionsMenuFinalized updateState={_updateState} processing={processing} />
         )}
         {row.estado.trim() === 'CERRADO' && <ActionsMenuClosed />}
         {row.criticidad !== "" && row.alertseverity !== "" && row.ticketid === "" &&
            <ToolTip
               message='Crear Ticket Semiautomatico'
               placement='top'
            >
               <a
                  href='#'
                  className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                  onClick={() => { }}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="16" height="16"
                     fill="currentColor"
                     className="bi bi-ticket"
                     viewBox="0 0 16 16">
                     <path d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6V4.5ZM1.5 4a.5.5 0 0 0-.5.5v1.05a2.5 2.5 0 0 1 0 4.9v1.05a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-1.05a2.5 2.5 0 0 1 0-4.9V4.5a.5.5 0 0 0-.5-.5h-13Z" />
                  </svg>
               </a>
            </ToolTip>
         }

      </>
   )
}

export { ActionsCell }
