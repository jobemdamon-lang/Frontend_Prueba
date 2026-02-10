import { FC } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from "../../../../../../helpers"
import { IDataRequestChangesOR, estadoAprovador } from "../../Types"
import { ToolTip } from "../../../../../../components/tooltip/ToolTip"

type Props = {
  isDetailVisibility: boolean,
  modalInformation: IDataRequestChangesOR,
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  setShowApproval: React.Dispatch<React.SetStateAction<boolean>>,
  setCanCreate: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPolicies: React.Dispatch<React.SetStateAction<boolean>>,
  setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  setShowEliminationConfirmation: React.Dispatch<React.SetStateAction<boolean>>,
  fetchlistTaskToApprove: any,
  searchTaskOfpolicy: any
}

const RequestChangeHeaderRW: FC<Props> = ({ isDetailVisibility, setIsVisibility, setShowApproval, setCanCreate, setShowPolicies, modalInformation, setShowConfirmation, fetchlistTaskToApprove, searchTaskOfpolicy, setShowEliminationConfirmation }) => {

  const tooltip = (mssg: string) => (
    <Tooltip id="tooltip-disabled"> {mssg}</Tooltip>
  );

  return (
    <>

      <div className={`d-flex flex-direction-row gap-5 ${isDetailVisibility ? "hideContent" : "showContent"}`}>
        {(modalInformation.estado_actual !== estadoAprovador.T && modalInformation.estado_actual !== estadoAprovador.IT) &&
          <OverlayTrigger placement="top" overlay={tooltip("Asignar Responsables")}>
            <button style={{ backgroundColor: "transparent" }} onClick={() => {
              fetchlistTaskToApprove(modalInformation.id_solicitud)
              setShowApproval(true)
            }}>
              <SVG
                width={30}
                height={30}
                src={toAbsoluteUrl('/media/icons/duotune/communication/com014.svg')}
                className="category-item"
              />
              <strong>ASIGNAR</strong>
            </button>
          </OverlayTrigger>
        }
        {modalInformation.estado_actual !== estadoAprovador.T &&
          <OverlayTrigger placement="top" overlay={tooltip("Enviar Solicitud")}>
            <button style={{ backgroundColor: "transparent" }} onClick={() => setShowConfirmation(true)}>
              <SVG
                width={30}
                height={30}
                src={toAbsoluteUrl('/media/icons/duotune/arrows/arr036.svg')}
                className="category-item"
              />
              <strong>ENVIAR</strong>
            </button>
          </OverlayTrigger>
        }
        {(modalInformation.estado_actual !== estadoAprovador.IT && modalInformation.estado_actual !== estadoAprovador.AT && modalInformation.estado_actual !== estadoAprovador.T) &&
          <OverlayTrigger placement="top" overlay={tooltip("Buscar tarea")}>
            <button
              style={{ backgroundColor: "transparent" }}
              onClick={() => {
                setShowPolicies(true)
                //Se llama al endpoint para buscar las tareas de la politica de esa solicitud (opcion,id_equipo,id_solicitud)
                searchTaskOfpolicy("1", "0", modalInformation.id_solicitud?.toString())
              }}>
              <SVG
                width={30}
                height={30}
                src={toAbsoluteUrl('/media/icons/duotune/files/fil024.svg')}
                className="category-item"
              />
              <strong>BUSCAR</strong>
            </button>
          </OverlayTrigger>
        }
        {(modalInformation.estado_actual !== estadoAprovador.IT && modalInformation.estado_actual !== estadoAprovador.AT && modalInformation.estado_actual !== estadoAprovador.T) &&
          <OverlayTrigger placement="top" overlay={tooltip("Nueva Tarea")}>
            <button
              onClick={() => {
                setCanCreate(true)
                setIsVisibility(true)
              }}
              style={{ backgroundColor: "transparent" }}>
              <SVG
                width={30}
                height={30}
                src={toAbsoluteUrl('/media/icons/duotune/files/fil005.svg')}
                className="category-item"
              />
              <strong>NUEVA</strong>
            </button>
          </OverlayTrigger>
        }
        {modalInformation.estado_actual !== estadoAprovador.T &&
          <ToolTip
            message='Cancelar Solicitud'
            placement='top'
          >
            <button
              disabled={false}
              style={{ backgroundColor: "transparent" }}
              onClick={() => {
                setShowEliminationConfirmation(true)
              }}
            >
              <SVG src={toAbsoluteUrl("/media/icons/duotune/general/gen034.svg")} width={30} height={30} />
              <strong>CANCELAR</strong>
            </button>
          </ToolTip>
        }
      </div>
    </>
  )
}
export { RequestChangeHeaderRW }