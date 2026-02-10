import { FC } from 'react'
import { ExportExcel } from '../../../../../components/excel/ExportExcel'
import { IAlertModal } from '../../Types'

type Props = {
   data: Array<IAlertModal>
}

const Export: FC<Props> = ({ data }) => {
   const excelHeads = [
      { label: 'Fecha', name: 'fecha' },
      { label: 'Alerta estado', name: 'alertstate' },
      { label: 'Motivo alerta', name: 'reason' },
      { label: 'Descripcion', name: 'description' },
      { label: 'Tipo alerta', name: 'itipo' },
      { label: 'Threshold', name: 'threshold' },
      { label: 'Etiqueta', name: 'tags' },
      { label: 'Equipo', name: 'hostip' },
      { label: 'Regla', name: 'rulename' },
   ]

   const ExportButton: FC = () => (
      <button type='button' className='btn btn-sm btn-secondary'>
         Exportar a excel
      </button>
   )

   return <ExportExcel data={data} head={excelHeads} wrapComponent={ExportButton}/>
}

export { Export }
