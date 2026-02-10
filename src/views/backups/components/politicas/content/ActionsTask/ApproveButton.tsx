import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../helpers";
import SVG from "react-inlinesvg"
import { FC } from "react";
import { ITask } from "../../Types";
import { toast } from "react-toastify";

type Props = {
  approveTask: any,
  selectedRows: ITask[],
  loadingApprove: boolean,
  setToggleCleared: React.Dispatch<React.SetStateAction<boolean>>,
  toggleCleared: boolean,
  setSelectedRows: React.Dispatch<React.SetStateAction<ITask[]>>
}
const ApproveButton: FC<Props> = ({ approveTask, selectedRows, loadingApprove, setToggleCleared, toggleCleared, setSelectedRows }) => {

  const tooltip = (mssg: string) => (
    <Tooltip id="tooltip-disabled"> {mssg}</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={tooltip("Aprobar")}>
      <button
        disabled={loadingApprove}
        style={{ backgroundColor: "transparent" }}
        onClick={() => {
          if (selectedRows.length === 0) {
            toast.warn("Debe seleccionar una tarea.", {
              position: toast.POSITION.TOP_RIGHT
            })
          } else {
            selectedRows.forEach((eachRow: ITask) => {
              approveTask(eachRow.id_solicitud, eachRow.id_soli_tarea)
            })
            setToggleCleared(!toggleCleared)
            setSelectedRows([])
          }
        }}
      >
        <SVG src={toAbsoluteUrl("/media/icons/duotune/general/gen043.svg")} width={40} height={40} />
      </button>
    </OverlayTrigger>
  )
}
export { ApproveButton }