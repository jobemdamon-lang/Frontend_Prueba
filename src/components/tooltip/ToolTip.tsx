import { FC } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap"

const tooltip = (mssg: string) => (
  <Tooltip id="tooltip-actions"> {mssg}</Tooltip>
);

type Props = {
  children: any,
  message: string,
  placement: 	'auto-start' | 'auto' | 'auto-end' | 'top-start' | 'top' | 'top-end' | 'right-start' | 'right' | 'right-end' | 'bottom-end' | 'bottom' | 'bottom-start' | 'left-end' | 'left' | 'left-start'
}

export const ToolTip:FC<Props> = ({children, message, placement}) => {
  return (
    <OverlayTrigger placement={placement} overlay={tooltip(message)}>
      {children}
    </OverlayTrigger>
  )
} 