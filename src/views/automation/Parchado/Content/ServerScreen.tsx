import { useState } from "react"
import { useWindowsPatchContext } from "../Context"
import { IModalFunctions, ModalSize } from "../../../../hooks/Types"
import { IListServerAssigned, ModalView } from "../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { minimalistStyles } from "../../../../helpers/tableStyles"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { ServerScreenFilters } from "./ServerScreenFilters"

const ServerScreen = () => {

  const { modalHook, serverHook } = useWindowsPatchContext()
  const [filteredData, setFilterdData] = useState<IListServerAssigned[]>([])

  return (
    <section>
      <ServerScreenFilters
        setFilterdData={setFilterdData}
      />
      <div className="position-relative px-10">
        <DataTable
          columns={ProfileColumn(modalHook)}
          pagination
          highlightOnHover
          persistTableHead
          customStyles={minimalistStyles}
          disabled={serverHook.getServersAssignedLoading}
          noDataComponent={<EmptyData loading={serverHook.getServersAssignedLoading} />}
          data={filteredData}
        />
        {serverHook.getServersAssignedLoading && <LoadingTable description='Cargando' />}
      </div>
    </section>
  )
}
export { ServerScreen }

export const ProfileColumn = (modalFunctions: IModalFunctions): TableColumn<IListServerAssigned>[] => [
  {
    name: 'GRUPO',
    selector: (row: IListServerAssigned) => row.GRUPO ?? "Sin registro"
  },
  {
    name: 'NOMBRE CI',
    selector: (row: IListServerAssigned) => row.NOMBRE_CI ?? "Sin registro"
  },
  {
    name: 'HOSTNAME',
    selector: (row: IListServerAssigned) => row.NOMBRE ?? "Sin registro"
  },
  {
    name: 'FAMILIA',
    selector: (row: IListServerAssigned) => row.FAMILIA ?? "Sin registro"
  },
  {
    name: 'CLASE',
    selector: (row: IListServerAssigned) => row.CLASE ?? "Sin registro"
  },
  {
    name: 'NUMERO IP',
    selector: (row: IListServerAssigned) => row.NRO_IP ?? "Sin registro"
  },
  {
    name: 'NRO. PARCHES HISTORICOS',
    selector: (row: IListServerAssigned) => row.NRO_PARCHES ?? "Sin registro"
  },
  {
    name: 'ESTADO',
    cell: (row: IListServerAssigned) => (

      <div className="d-flex justify-content-around w-100 gap-3">
        <ToolTip
          message="Posee ejecuciones realizadas"
          placement="top-start"
        >
          <div className={`${row.TIENE_EJECUCION === 1 ? "text-success" : "text-danger"} d-flex flex-column align-items-center gap-3`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="bi bi-hand-thumbs-up"
              viewBox="0 0 16 16"
            >
              <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
            </svg>
          </div>
        </ToolTip>
        <ToolTip
          message="Tiene asignada una credencial"
          placement="top-start"
        >
          <div className={`${row.TIENE_CREDENCIAL === 1 ? "text-success" : "text-danger"} d-flex flex-column align-items-center gap-3`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28" height="28"
              fill="currentColor"
              className="bi bi-key-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
          </div>
        </ToolTip>
        <ToolTip
          message="Tiene un grupo asociado"
          placement="top-start"
        >
          <div className={`text-success d-flex flex-column align-items-center gap-3`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              className="bi bi-people-fill"
              viewBox="0 0 16 16"
            >
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
            </svg>
          </div>
        </ToolTip>
      </div>
    )
  }
  ,
  {
    name: 'DETALLES',
    cell: (row: IListServerAssigned) => (
      <div className="d-flex gap-5 justify-content-center align-items-center">
        <ToolTip
          message='Ver Historial de Parches Instalados'
          placement='top'
        >
          <button
            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
            onClick={() => { modalFunctions.openModal(ModalView.HISTORICAL_PATCHES, ModalSize.XL, undefined, row) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
          </button>
        </ToolTip>
        <ToolTip
          message='Ver información del Servidor'
          placement='top'
        >
          <button
            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
            onClick={() => { modalFunctions.openModal(ModalView.SERVER_INFORMATION, ModalSize.XL, undefined, row) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </button>
        </ToolTip>
      </div>
    )
  }
]