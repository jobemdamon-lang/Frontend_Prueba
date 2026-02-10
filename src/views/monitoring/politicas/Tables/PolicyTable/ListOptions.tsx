import { useContext } from "react"
import { ContextPolitica } from "../../ContextPolitica"
import { ModalSize, ModalView, IMonitoringPolicyVersions } from "../../Types"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { useExport } from "../../hooks/useExport"

const ListOptions = ({ rowInformation }: { rowInformation: IMonitoringPolicyVersions }) => {

  const { openModal } = useContext(ContextPolitica)
  const { getExportFile, loadingExport } = useExport()

  return (
    <div className="d-flex justify-content-center align-items-center ">
      {/* <ToolTip
        message='Versiones'
        placement='top'
      >
        <button
          className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
          onClick={() => { }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-file-binary" viewBox="0 0 16 16">
            <path d="M5.526 13.09c.976 0 1.524-.79 1.524-2.205 0-1.412-.548-2.203-1.524-2.203-.978 0-1.526.79-1.526 2.203 0 1.415.548 2.206 1.526 2.206zm-.832-2.205c0-1.05.29-1.612.832-1.612.358 0 .607.247.733.721L4.7 11.137a6.749 6.749 0 0 1-.006-.252zm.832 1.614c-.36 0-.606-.246-.732-.718l1.556-1.145c.003.079.005.164.005.249 0 1.052-.29 1.614-.829 1.614zm5.329.501v-.595H9.73V8.772h-.69l-1.19.786v.688L8.986 9.5h.05v2.906h-1.18V13h3z" />
            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
          </svg>
        </button>
      </ToolTip> */}
      {rowInformation.ESTADO_POLITICA !== "CANCELADO" &&
        <>
          <ToolTip
            message='Detalles'
            placement='top'
          >
            <button
              className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
              //El parametro true es si quieres el modal FullSize
              onClick={() => { openModal(ModalView.DETAIL_POLICY, ModalSize.LG, rowInformation, true) }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-file-earmark-text" viewBox="0 0 16 16">
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
              </svg>
            </button>
          </ToolTip>
          <ToolTip
            message='Exportar'
            placement='top'
          >
            <button
              className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
              disabled={loadingExport}
              onClick={() => { getExportFile(rowInformation.ID_POLITICA.toString(), rowInformation.NRO_VERSION.toString()) }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-file-earmark-arrow-up-fill" viewBox="0 0 16 16">
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
              </svg>
            </button>
          </ToolTip>
        </>
      }
      {/* {(rowInformation.ESTADO_POLITICA !== "IMPLEMENTADO") && (rowInformation.ESTADO_POLITICA !== "EN PROCESO") &&
        <ToolTip
          message='Actualizar'
          placement='top'
        >
          <button
            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
            //El parametro true es si quieres el modal FullSize
            onClick={() => { openModal(ModalView.UPDATE_CURRENT_POLICY, ModalSize.XL, rowInformation, true) }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
          </button>
        </ToolTip>
      } */}
    </div>
  )
}
export { ListOptions }