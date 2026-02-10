import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../helpers";
import SVG from "react-inlinesvg"
import { ITask } from "../../Types";
import { FC } from "react";
import { toast } from "react-toastify";

type Props = {
  selectedRows: ITask[],
  disapproveTask: any,
  loadingDisapprove: boolean,
  setToggleCleared: React.Dispatch<React.SetStateAction<boolean>>,
  toggleCleared: boolean,
  setSelectedRows: React.Dispatch<React.SetStateAction<ITask[]>>
}

const DisapproveButton: FC<Props> = ({ selectedRows, disapproveTask, loadingDisapprove, setToggleCleared, toggleCleared, setSelectedRows }) => {

  const tooltip = (mssg: string) => (
    <Tooltip id="tooltip-disabled"> {mssg}</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={tooltip("Desaprobar")}>
      <button
        disabled={loadingDisapprove}
        style={{ backgroundColor: "transparent" }}
        onClick={() => {
          if (selectedRows.length === 0) {
            toast.warn("Debe seleccionar una tarea.", {
              position: toast.POSITION.TOP_RIGHT
            })
          } else {
            selectedRows.forEach((eachRow: ITask) => {
              disapproveTask(eachRow.id_solicitud, eachRow.id_soli_tarea)
            })
            setToggleCleared(!toggleCleared)
            setSelectedRows([])
          }

        }}
      >
        <SVG src={toAbsoluteUrl("/media/icons/duotune/general/gen040.svg")} width={40} height={40} />
      </button>
    </OverlayTrigger>
  )
}
export { DisapproveButton }