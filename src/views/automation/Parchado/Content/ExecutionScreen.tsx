import { useEffect, useState } from "react";
import { useWindowsPatchContext } from "../Context";
import { IModalFunctions, ModalSize, Role } from "../../../../hooks/Types";
import DataTable, { TableColumn } from "react-data-table-component";
import { ToolTip } from "../../../../components/tooltip/ToolTip";
import { minimalistStyles } from "../../../../helpers/tableStyles";
import { EmptyData } from "../../../../components/datatable/EmptyData";
import { LoadingTable } from "../../../../components/loading/LoadingTable";
import { ExecutionScreenFilters } from "./ExecutionScreenFilters";
import { IListExecutions, ModalSubView, ModalView, executionStates } from "../../Types";
import { useClient } from "../../../../hooks/useClient";
import { DataList } from "../../../../components/Inputs/DataListInput";
import { AccessController } from "../../../../components/AccessControler";
import { LaunchSVG } from "../../../../components/SVGs/LaunchSVG";
import { notNull } from "../../../../helpers/general";

const ExecutionScreen = () => {

  const { modalHook, executionHook, rol, clientForExecution, setSelectedClientForExecution } = useWindowsPatchContext()
  const { getClientsWithCMDBD, clientsWithCMDB } = useClient()
  const [filteredExecutions, setFilteredExecutions] = useState<IListExecutions[]>([])

  useEffect(() => {
    getClientsWithCMDBD()
    executionHook.getListExecutions('CANVIA')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="d-flex flex-column gap-5 px-10">
      <ExecutionScreenFilters
        setFilteredExecutions={setFilteredExecutions}
        executionsData={executionHook.executionsData}
      />
      <div className="d-flex justify-content-end align-items-end gap-5">
        <DataList
          label="Nombre del Cliente"
          value={clientForExecution}
          items={clientsWithCMDB}
          onChange={(client) => {
            setSelectedClientForExecution(client)
            executionHook.getListExecutions(clientForExecution === '' ? 'CANVIA' : clientForExecution)
          }}
        />
        <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
          <div className="d-flex flex-column gap-1">
            {clientForExecution === "" && <i className="text-center">Seleccione un Cliente</i>}
            <button
              disabled={clientForExecution === ""}
              onClick={() => {
                modalHook.openModal(ModalView.EXECUTION_MAIN, ModalSize.XL, undefined, { execution_view: ModalSubView.NEW_EXECUTION })
              }}
              className="btn btn-success">
              <span className="me-2">Ejecutar Rutinaria</span>
              <LaunchSVG />
            </button>

          </div>
        </AccessController>
        <div className="d-flex flex-column justify-content-center gap-1">
          <ToolTip
            message="Actualizar Datos"
            placement="top-end"
          >
            <button
              onClick={() => executionHook.getListExecutions('CANVIA')}
              className="btn btn-primary">
              <i className="bi bi-arrow-clockwise fs-1"></i>
            </button>
          </ToolTip>
        </div>
      </div>
      <div className="position-relative">
        <DataTable
          columns={ExecutionsColumns(modalHook, rol)}
          pagination
          highlightOnHover
          persistTableHead
          paginationPerPage={30}
          customStyles={minimalistStyles}
          disabled={executionHook.getListExecutionsLoading}
          noDataComponent={<EmptyData loading={executionHook.getListExecutionsLoading} />}
          data={filteredExecutions.reverse()}
        />
        {executionHook.getListExecutionsLoading && <LoadingTable description='Cargando' />}
      </div>
    </section>
  )
}
export { ExecutionScreen }

export const ExecutionsColumns = (
  modalFunctions: IModalFunctions,
  rol: Role
): TableColumn<IListExecutions>[] => [
    {
      name: 'NOMBRE EJECUCIÓN',
      cell: (row: IListExecutions) => notNull(row.NOMBRE)
    },
    {
      name: 'NRO SERVIDORES',
      selector: (row: IListExecutions) => notNull(row.NRO_SERVIDORES?.toString())
    },
    {
      name: 'SERVIDORES EXITOSOS',
      selector: (row: IListExecutions) => notNull(row.SERVIDORES_EXITOSOS?.toString())
    },
    {
      name: 'NRO TICKET',
      cell: (row: IListExecutions) => notNull(row.CUMPLIMIENTO)
    },
    {
      name: 'FECHA EJECUCIÓN',
      sortable: true,
      selector: (row: IListExecutions) => notNull(row.FECHA_INICIO)
    },
    {
      name: 'FECHA FINALIZACIÓN',
      sortable: true,
      cell: (row: IListExecutions) => notNull(row.FECHA_FIN)
    },
    {
      name: 'ESTADO',
      cell: (row: IListExecutions) => <span className={`badge fs-8 badge-${executionStates[(row.ESTADO_EJECUCION ?? '').toUpperCase().split(" ").join("")]}`}>{row.ESTADO_EJECUCION}</span>
    },
    {
      name: 'USUARIO EJECUTOR',
      selector: (row: IListExecutions) => notNull(row.USUARIO_EJECUTOR)
    },
    {
      name: 'CUMPLIMIENTO',
      selector: (row: IListExecutions) => row.CUMPLIMIENTO ?? 'Pendiente'
    },
    {
      name: 'OPCIONES  ',
      cell: (row: IListExecutions) => (
        <div className="d-flex gap-5 justify-content-center align-items-center">
          {row.ESTADO_EJECUCION === "TERMINADO" &&
            <ToolTip
              message='Detalle de la Ejecución'
              placement='top'
            >
              <button
                className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                onClick={() => { modalFunctions.openModal(ModalView.EXECUTION_DETAIL, ModalSize.XL, undefined, row) }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
                  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </button>
            </ToolTip>
          }
          {row.ESTADO_EJECUCION === "PLANIFICADO" &&
            <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
              <ToolTip
                message='Editar Configuración'
                placement='top'
              >
                <button
                  className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                  onClick={() => { modalFunctions.openModal(ModalView.EXECUTION_MAIN, ModalSize.XL, undefined, { execution_view: ModalSubView.EXECUTION_ALREADY_CONFIGURED, executionInformation: row }) }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                  </svg>
                </button>
              </ToolTip>
            </AccessController>
          }
          {true &&
            <ToolTip
              message='Ver Progreso'
              placement='top'
            >
              <button
                className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                onClick={() => { modalFunctions.openModal(ModalView.EXECUTION_PROCESS, ModalSize.XL, undefined, { id_ejecucion: row.ID_EJECUCION }) }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-rocket-takeoff" viewBox="0 0 16 16">
                  <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362.798-.799.96-1.932.362-2.531-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532Z" />
                  <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9.42 9.42 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a9.556 9.556 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093.067.017.12.033.16.045.184.06.279.13.351.295l.029.073a3.475 3.475 0 0 1 .157.721c.055.485.051 1.178-.159 2.065Zm-4.828 7.475.04-.04-.107 1.081a1.536 1.536 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a8.548 8.548 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006ZM5.205 5c-.625.626-.94 1.351-1.004 2.09a8.497 8.497 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107-.04.039Zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a2.835 2.835 0 0 0-.045-.283 3.078 3.078 0 0 0-.3-.041Z" />
                  <path d="M7.009 12.139a7.632 7.632 0 0 1-1.804-1.352A7.568 7.568 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z" />
                </svg>
              </button>
            </ToolTip>
          }
          {row.ESTADO_EJECUCION !== "TERMINADO" &&
            <ToolTip
              message='Eliminar Ejecución'
              placement='top'
            >
              <button
                className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                onClick={() => { modalFunctions.openModal(ModalView.CONFIRM_DELETE_EXECUTION, ModalSize.SM, undefined, row) }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>
            </ToolTip>
          }
        </div>
      )
    }
  ]