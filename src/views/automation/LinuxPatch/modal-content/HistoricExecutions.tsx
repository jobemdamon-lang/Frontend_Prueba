import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IExecutionHistoryByServer, IListServerAssignedLinux } from "../../Types"
import { useLinuxPatchContext } from "../Context"
import DataTable, { TableColumn } from "react-data-table-component"
import { notNull, textDateToNumericDate } from "../../../../helpers/general"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { minimalistStyles } from "../../../../helpers/tableStyles"

type ModalInfo = {
    rowInformation: IListServerAssignedLinux,
    historicalExecutions: IExecutionHistoryByServer[]
}

const HistoricExecutions = () => {

    const { modalHook } = useLinuxPatchContext()
    const { historicalExecutions, rowInformation } = modalHook.modalInformation as ModalInfo

    return (
        <>
            <div className='modal-header py-4'>
                <h2>EJECUCIONES REALIZADAS EN {rowInformation.NOMBRE_CI.toUpperCase()}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10'>
                <div className="position-relative">
                    <DataTable
                        columns={ExecutionHistoricalColumns()}
                        pagination
                        highlightOnHover
                        persistTableHead
                        customStyles={minimalistStyles}
                        noDataComponent={<EmptyData loading={false} message="No existen ejecuciones para este servidor." />}
                        data={historicalExecutions.reverse()}
                    />
                </div>
            </div>
        </>
    )
}
export { HistoricExecutions }

export const ExecutionHistoricalColumns = (): TableColumn<IExecutionHistoryByServer>[] => [
    {
        name: 'NOMBRE EJECUCIÓN',
        selector: (row: IExecutionHistoryByServer) => notNull(row.NOMBRE)
    },
    {
        name: 'NRO TICKET',
        selector: (row: IExecutionHistoryByServer) => notNull(row.CRQ)
    },
    {
        name: 'USUARIO CREACIÓN',
        selector: (row: IExecutionHistoryByServer) => notNull(row.USUARIO_CREACION)
    },
    {
        name: 'USUARIO EJECUTOR',
        selector: (row: IExecutionHistoryByServer) => notNull(row.USUARIO_EJECUTOR)
    },
    {
        name: 'ESTADO',
        selector: (row: IExecutionHistoryByServer) => notNull(row.ESTADO_EJECUCION)
    },
    {
        name: 'FECHA CREACIÓN',
        selector: (row: IExecutionHistoryByServer) => textDateToNumericDate(row.FECHA_CREACION ?? '')
    }

]