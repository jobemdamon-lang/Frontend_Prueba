import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from '../../../../../../helpers/AssetHelpers'

type Props = {
  tooltipInfo: string,
  svgPath: string,
  disabled?: boolean,
  onClickFunc?: React.MouseEventHandler<HTMLButtonElement>
}

const ActionButton = (props:Props) => {
  
  const buttonStyle = {
    backgroundColor: "transparent",
    width: "fit-content"
  }

  const tooltipActions = (mensaje: string) => (
    <Tooltip id="tooltip-failed-upload" className="tooltip-info-bulkload">
      {mensaje}
    </Tooltip>
  );

  return (
    <div>
    <OverlayTrigger placement="bottom" overlay={tooltipActions(props.tooltipInfo)}>
      <button 
        style={buttonStyle}
        onClick={props.onClickFunc}
        disabled={props.disabled}
      >
        <SVG
          width={35}
          height={35}
          description={props.tooltipInfo}
          src={toAbsoluteUrl(props.svgPath)}
          className="category-item"
        />
      </button>
    </OverlayTrigger>
  </div>
  )
}
export { ActionButton }