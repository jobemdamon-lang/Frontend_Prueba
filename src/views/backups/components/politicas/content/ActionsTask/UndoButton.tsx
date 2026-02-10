import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../helpers";
import SVG from "react-inlinesvg"
import { FC } from "react";
import { ITask } from "../../Types";

type Props = {
  selectedRows: ITask[],
}

const UndoButton:FC<Props> = ({selectedRows}) => {

  const tooltip = (mssg: string) => (
    <Tooltip id="tooltip-disabled"> {mssg}</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={tooltip("Deshacer cambios")}>
      <button
        style={{ backgroundColor: "transparent" }}
        onClick={() => {

        }}
      >
        <SVG src={toAbsoluteUrl("/media/icons/duotune/arrows/arr029.svg")} width={40} height={40} />
      </button>
    </OverlayTrigger>
  )
}
export { UndoButton }