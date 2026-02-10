import { FC } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from "../../../../../../helpers"
import { IDataRequestChangesOR } from "../../Types"

type Props = {
  isDetailVisibility: boolean,
  setOpenLogModal: React.Dispatch<React.SetStateAction<boolean>>,
  fetchLogsRequest:any,
  modalInformation:IDataRequestChangesOR
}

const RequestChangeHeader: FC<Props> = ({ isDetailVisibility,setOpenLogModal, fetchLogsRequest, modalInformation }) => {

  const tooltip = (mssg: string) => (
    <Tooltip id="tooltip-disabled"> {mssg}</Tooltip>
  );

  return (
    <>
      <div className={`${isDetailVisibility ? "hideContent" : "showContent"}`}>
        <OverlayTrigger placement="top" overlay={tooltip("Visualizar Logs de Aprobaciones")}>
          <button 
            onClick={()=>{
              fetchLogsRequest(modalInformation.id_solicitud)
              setOpenLogModal(true)
            }}
            style={{ backgroundColor: "transparent" }}>
            <SVG
              width={30}
              height={30}
              src={toAbsoluteUrl('/media/icons/duotune/general/gen059.svg')}
              className="category-item"
            />
            <strong> &nbsp; LOGS</strong>
          </button>
        </OverlayTrigger>
      </div>
    </>
  )
}
export { RequestChangeHeader }