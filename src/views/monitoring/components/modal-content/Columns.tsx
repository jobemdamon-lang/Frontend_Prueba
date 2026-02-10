import { TableColumn } from 'react-data-table-component'
import { IAlertModal } from '../Types'

const columns: TableColumn<IAlertModal>[] = [
   {
      name: 'Fecha',
      maxWidth: '100px',
      wrap: true,
      selector: (row: any) => row.fecha,
   },
   {
      name: 'Alerta estado',
      maxWidth: '110px',
      grow: 1,
      selector: (row: any) => row.alertstate,
   },
   {
      name: 'Motivo alerta',
      minWidth: '300px',
      grow: 3,
      wrap: true,
      selector: (row: any) => row.reason,
   },
   {
      name: 'Descripcion',
      minWidth: '200px',
      grow: 3,
      wrap: true,
      selector: (row: any) => row.description,
   },
   {
      name: 'Tipo alerta',
      minWidth: '80px',
      grow: 0,
      center: true,
      selector: (row: any) => row.itipo,
   },
   {
      name: 'Threshold',
      minWidth: '250px',
      grow: 2,
      wrap: true,
      selector: (row: any) => row.threshold,
   },
   {
      name: 'Etiqueta',
      minWidth: '110px',
      grow: 1,
      selector: (row: any) => row.tags,
   },
   {
      name: 'Equipo',
      minWidth: '150px',
      grow: 1,
      selector: (row: any) => row.hostip,
   },
   {
      name: 'Regla',
      minWidth: '200px',
      grow: 3,
      wrap: true,
      selector: (row: any) => row.rulename,
   },
]

export { columns }
