import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { minimalistStyles } from "../../../../helpers/tableStyles"
import { useLinuxPatchContext } from "../Context"
import { IListExecutionsLinux, executionStates } from "../../Types"
import { getPercentInt } from "../../utils"
import { FC } from "react"
import { ExecutionActions } from "./ExecutionActions"
import { formatDate } from "../../../../helpers/general"

type Props = { filteredExecutions: IListExecutionsLinux[] }

const ExecutionTable: FC<Props> = ({ filteredExecutions }) => {

    const { executionHook } = useLinuxPatchContext()
    return (
        <div className="position-relative w-100">
            <DataTable
                columns={ExecutionsColumns()}
                pagination
                highlightOnHover
                persistTableHead
                paginationPerPage={30}
                customStyles={minimalistStyles}
                disabled={executionHook.getListExecutionsLinuxLoading}
                noDataComponent={
                    <EmptyData
                        loading={executionHook.getListExecutionsLinuxLoading}
                        message="Ingrese un cliente para mostrar las ejecuciones"
                    />}
                data={filteredExecutions}
            />
            {
                executionHook.getListExecutionsLinuxLoading &&
                <LoadingTable description='Cargando' />
            }
        </div>
    )
}

export { ExecutionTable }


const ExecutionsColumns = (): TableColumn<IListExecutionsLinux>[] => [
    {
        name: 'NOMBRE EJECUCIÓN',
        cell: (row: IListExecutionsLinux) => row.NOMBRE ?? "Sin registro"
    },
    {
        name: 'NRO SERVIDORES',
        selector: (row: IListExecutionsLinux) => row.NRO_SERVIDORES ?? "Sin registro"
    },
    {
        name: 'SERVIDORES EXITOSOS',
        selector: (row: IListExecutionsLinux) => row.SERVIDORES_EXITOSOS ?? "Sin registro"
    },
    {
        name: ' NRO TICKET',
        selector: (row: IListExecutionsLinux) => row.CRQ ?? "Sin registro"
    },
    {
        name: 'FECHA EJECUCIÓN',
        sortable: true,
        selector: (row: IListExecutionsLinux) => row.FECHA_INICIO ? formatDate(row.FECHA_INICIO) : "Sin registro"
    },
    {
        name: 'FECHA FINALIZACIÓN',
        sortable: true,
        selector: (row: IListExecutionsLinux) => row.FECHA_FIN ? formatDate(row.FECHA_FIN) : "Sin registro"
    },
    {
        name: 'ESTADO',
        cell: (row: IListExecutionsLinux) => (
            <span
                className={`badge fs-8 badge-${executionStates[(row.ESTADO_EJECUCION ?? '').toUpperCase().split(" ").join("")]}`}
            >
                {row.ESTADO_EJECUCION === 'INICIADO' &&
                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                }
                &nbsp;
                {row.ESTADO_EJECUCION}
            </span>
        )
    },
    {
        name: 'EJECUTOR',
        selector: (row: IListExecutionsLinux) => row.USUARIO_EJECUTOR ?? "Sin registro"
    },
    {
        name: 'CUMPLIMIENTO',
        cell: (row: IListExecutionsLinux) => <span className={`badge fs-7 badge-${getPercentInt(row.CUMPLIMIENTO) === 0 ? 'secondary' : getPercentInt(row.CUMPLIMIENTO) ? 'success' : 'danger'}`}>{row.CUMPLIMIENTO ?? 'Pendiente'}</span>
    },
    {
        name: 'OPCIONES  ',
        cell: (row: IListExecutionsLinux) => (
            <ExecutionActions row={row} />
        )
    }
]
