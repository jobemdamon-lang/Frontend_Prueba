import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { FC, useEffect } from "react"
import { ICoincidentes, ModalViewForIncident } from "../../../Types"
import { IModalFunctions, ModalSize } from "../../../../../hooks/Types"
import { useIncidentContext } from "../../Context"

type Props = { secondModalHook: IModalFunctions, nroIncident: string }

const Suggestions: FC<Props> = ({ nroIncident, secondModalHook }) => {

    const { useIncidentHook } = useIncidentContext()

    useEffect(() => {
        useIncidentHook.getHistoricIncident(nroIncident)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (

        <div style={{ position: 'relative' }}>
            <DataTable
                columns={relatedIncidents(secondModalHook)}
                pagination
                highlightOnHover
                persistTableHead
                noDataComponent={<EmptyData loading={useIncidentHook.historicIncidentLoading} />}
                data={useIncidentHook.historicIncident}
            />
            {useIncidentHook.historicIncidentLoading && <LoadingTable description='Cargando' />}
        </div>

    )
}

export { Suggestions }

export const relatedIncidents = (secondModalHook: IModalFunctions): TableColumn<ICoincidentes>[] => [
    {
        name: 'NRO TICKET',
        width: '150px',
        selector: (row: ICoincidentes) => row.NRO_TICKET ?? "Sin registro"
    },
    {
        name: 'INICIO DE INDISPONIBLIDAD',
        selector: (row: ICoincidentes) => row.INICIO_INDISPONIBILIDAD ?? "Sin registro"
    },
    {
        name: 'TIEMPO INDISPONIBILIDAD',
        selector: (row: ICoincidentes) => row.TIEMPO_INDISPONIBILIDAD ?? "Sin registro"
    },
    {
        name: 'CIS AFECTADOS',
        selector: (row: ICoincidentes) => row.SERVICIO_APLICATIVO_IMPACTADO ?? "Sin registro"
    },
    {
        name: 'RESUMEN',
        width: '300px',
        cell: (row: ICoincidentes) => row.RESUMEN ?? "Sin registro"
    },
    {
        name: 'SINTOMAS',
        width: '300px',
        cell: (row: ICoincidentes) => row.SINTOMA ?? "Sin registro"
    },
    {
        name: 'CONCLUSION',
        width: '300px',
        cell: (row: ICoincidentes) => row.CONCLUSION?.toString() ?? "Sin registro"
    },
    {
        name: 'ACCIONES REALIZADAS',
        cell: (row: ICoincidentes) => (
            <button
                type="button"
                className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                onClick={() => { secondModalHook.openModal(ModalViewForIncident.HISTORIC_ACTIONS, ModalSize.LG, undefined, row) }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-square-fill" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
            </button>
        )
    }
]
