import { FC, useContext } from 'react'
import { ExportExcel } from '../../../../../components/excel/ExportExcel'
import { Context } from '../../Context'

const Export: FC = () => {
   const { filteredData } = useContext(Context)

   const excelHeads = [
      { label: 'Fecha', name: 'fecha' },
      { label: 'Cliente', name: 'client' },
      { label: 'Alerta criticidad', name: 'alertseverity' },
      { label: 'Ticket', name: 'ticketid' },
      { label: 'Ticket prioridad', name: 'priority' },
      { label: 'Dispositivo', name: 'hostip' },
      { label: 'Descripción', name: 'description' },
   ]

   const ExportButton: FC = () => (
      <button type='button' className='btn btn-sm btn-secondary'>
         Exportar a excel
      </button>
   )

   return <ExportExcel data={filteredData} head={excelHeads} wrapComponent={ExportButton}/>
}

export { Export }
