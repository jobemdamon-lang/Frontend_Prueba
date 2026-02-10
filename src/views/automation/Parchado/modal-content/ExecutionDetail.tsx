import { useEffect } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useWindowsPatchContext } from "../Context"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { secondCustomStyles } from "../../../../helpers/tableStyles"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { IDetailOfExecution, IListExecutions } from "../../Types"

const ExecutionDetail = () => {

  const { modalHook, executionHook } = useWindowsPatchContext()
  const modalInformation: IListExecutions = modalHook.modalInformation

  useEffect(() => {
    executionHook.getListExecutionDetail(modalInformation.ID_EJECUCION)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>DETALLE DE LA EJECUCIÓN</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <div style={{ position: 'relative' }}>
          <DataTable
            columns={HistoricalPatchesColumns}
            pagination
            highlightOnHover
            persistTableHead
            customStyles={secondCustomStyles}
            disabled={executionHook.getExecutionDetailLoading}
            noDataComponent={<EmptyData loading={executionHook.getExecutionDetailLoading} />}
            data={executionHook.executionDetailData}
          />
          {executionHook.getExecutionDetailLoading && <LoadingTable description='Cargando' />}
        </div>
      </div>
    </>
  )
}
export { ExecutionDetail }

export const HistoricalPatchesColumns: TableColumn<IDetailOfExecution>[] = [
  {
    name: 'Grupo',
    selector: (row: IDetailOfExecution) => row.NOMBRE_GRUPO ?? "Sin registro"
  },
  {
    name: 'Nombre CI',
    selector: (row: IDetailOfExecution) => row.NOMBRE_EQUIPO ?? "Sin registro"
  },
  {
    name: 'Fecha Inicio',
    cell: (row: IDetailOfExecution) => row.FECHA_FIN ?? "Sin registro"
  },
  {
    name: 'Fecha Fin',
    cell: (row: IDetailOfExecution) => row.FECHA_FIN ?? "Sin registro"
  },
  {
    name: 'Nro. Intento',
    selector: (row: IDetailOfExecution) => row.NRO_INTENTO ?? "Sin registro"
  },
  {
    name: 'Es Error',
    selector: (row: IDetailOfExecution) => row.ES_ERROR ?? "Sin registro"
  },
  {
    name: 'Documentos',
    selector: (row: IDetailOfExecution) => "Sin registro"
  },
  {
    name: 'Resultados',
    cell: (row: IDetailOfExecution) => row.RESULTADO ?? "Sin registro"
  }
]