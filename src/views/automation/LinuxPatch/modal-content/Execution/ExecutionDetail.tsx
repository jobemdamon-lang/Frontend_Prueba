import DataTable, { TableColumn } from "react-data-table-component"
import { KTSVG } from "../../../../../helpers"
import { IDetailOfExecutionLinux } from "../../../Types"
import { secondCustomStyles } from "../../../../../helpers/tableStyles"
import { useLinuxPatchContext } from "../../Context"
import { formatDate } from "../../../../../helpers/general"
import { ExecutionDetailAction } from "./ExecutionDetailAction"

const ExecutionDetail = () => {

    const { modalHook } = useLinuxPatchContext()
    const modalInformation: IDetailOfExecutionLinux[] = modalHook?.modalInformation

    return (
        <>
            <div className='modal-header py-4'>
                <h2>DETALLE DE LA EJECUCIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10'>
                <DataTable
                    columns={HistoricalPatchesColumns}
                    pagination
                    highlightOnHover
                    persistTableHead
                    customStyles={secondCustomStyles}
                    data={modalInformation}
                />
            </div>
        </>
    )
}
export { ExecutionDetail }

export const HistoricalPatchesColumns: TableColumn<IDetailOfExecutionLinux>[] = [
    {
        name: 'Grupo',
        selector: (row: IDetailOfExecutionLinux) => row.NOMBRE_GRUPO ?? "Sin registro"
    },
    {
        name: 'Nombre CI',
        selector: (row: IDetailOfExecutionLinux) => row.NOMBRE_EQUIPO ?? "Sin registro"
    },
    {
        name: 'Fecha Inicio',
        selector: (row: IDetailOfExecutionLinux) => row.FECHA_INICIO ? formatDate(row.FECHA_INICIO) : "Sin registro"
    },
    {
        name: 'Fecha Fin',
        selector: (row: IDetailOfExecutionLinux) => row.FECHA_FIN ? formatDate(row.FECHA_FIN) : "Sin registro"
    },
    {
        name: 'Rutinaria',
        width: '200px',
        selector: (row: IDetailOfExecutionLinux) => row.NOMBRE_RUTINARIA ?? "Sin registro"
    },
    {
        name: 'Status',
        cell: (row: IDetailOfExecutionLinux) => (
            <div
                style={{ color: row.ES_ERROR === 1 ? 'red' : 'green' }}
                className="d-flex justify-content-center gap-2 align-items-center">
                {row.ES_ERROR === 1 ?
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-exclamation-octagon"
                        viewBox="0 0 16 16"
                    >
                        <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z" />
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                    </svg>
                    :
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        className="bi bi-check2-circle"
                        viewBox="0 0 16 16"
                    >
                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                    </svg>
                }
            </div>
        )
    },
    {
        name: 'Files',
        cell: (row: IDetailOfExecutionLinux) => <ExecutionDetailAction row={row}/>
    }
]
