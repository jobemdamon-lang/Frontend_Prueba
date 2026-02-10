import { TableColumn } from 'react-data-table-component'
import { IAlert } from '../Types'
import { toAbsoluteUrl } from '../../../../helpers'
import clsx from 'clsx'
import { TicketTooltip } from './TicketTooltip'
import { ActionsCell } from './actions-cell/ActionsCell'

const severity: any = {
   FATAL: 'badge badge-light-danger',
   CRITICAL: 'badge badge-light-warning',
   WARNING: 'badge badge-light-info',
}

const criticidad: any = {
   Critico: 'badge badge-light-danger',
   Medio: 'badge badge-light-warning'
/*    WARNING: 'badge badge-light-info', */
}

const priority: any = {
   LOW: 'badge badge-light-warning',
   CRITICAL: 'badge badge-light-danger',
   HIGH: 'badge badge-light-warning',
}

const priority_translate: any = {
   LOW: 'BAJA',
   CRITICAL: 'CRÍTICO',
   HIGH: 'ALTA',
}

const tool: any = {
   PANDORA: 'PANDORA.png',
   ELASTIC: 'ELASTIC.png',
   SOLARWINDS: 'SOLARWINDS.png',
}

const columns: TableColumn<IAlert>[] = [
   {
      name: 'Monitor',
      minWidth: '40px',
      cell: (row: any) => (
         <a href={row.incidenturl} target='_blank' rel='noreferrer'>
            <img alt='Logo' src={toAbsoluteUrl(`/media/tools/${tool[row.tool]}`)} className='h-30px' />
         </a>
      ),
   },
   {
      name: 'Fecha',
      minWidth: '100px',
      wrap: true,
      selector: (row: any) => row.fecha,
      sortable: true,
   },
   {
      name: 'Cliente',
      minWidth: '160px',
      grow: 1,
      wrap: true,
      selector: (row: any) => row.client,
      sortable: true,
   },
   {
      name: 'Urgencia',
      minWidth: '100px',
      grow: 1,
      cell: (row: any) => (
         <span className={clsx('text-bold', severity[row.alertseverity.trim()])}>{row.alertseverity}</span>
      ),
      sortable: true,
   },
   {
      name: 'Impacto',
      minWidth: '100px',
      grow: 1,
      cell: (row: any) => (
         <span className={clsx('text-bold', criticidad[row.criticidad.trim().slice(2,)])}>{row.criticidad}</span>
      ),
      sortable: true,
   },
   {
      name: 'Ticket',
      minWidth: '130px',
      grow: 1,
      cell: (row: any) => row.ticketid && <TicketTooltip row={[row]} />,
      sortable: true,
   },
   {
      name: 'Ticket prioridad',
      minWidth: '90px',
      grow: 1,
      cell: (row: any) => (
         <span className={clsx('text-bold', priority[row.priority.trim()])}>
            {priority_translate[row.priority.trim()]}
         </span>
      ),
      sortable: true,
   },
   {
      name: 'Dispositivo',
      minWidth: '190px',
      grow: 4,
      wrap: true,
      selector: (row: any) => row.hostip,
      sortable: true,
   },
   {
      name: 'Descripción',
      minWidth: '260px',
      grow: 8,
      wrap: true,
      selector: (row: any) => row.description,
      sortable: true,
   },
   {
      name: 'Acciones',
      minWidth: '100px',
      button: true,
      cell: (row: any) => <ActionsCell row={row} />,
   },
]

export { columns }
