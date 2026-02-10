import { FC } from "react"
import { ButtonProps } from "../../helpers/Types"
import { Spinner } from "react-bootstrap"
import { ToolTip } from "../tooltip/ToolTip"

const InfomonButton: FC<ButtonProps> = ({ tooltipmssg = "Por favor si no encuentra un equipo en la última política implementada comunicarse con Team Monitoreo/Innovation", loading = false, ...props }) => {
    return (
        <ToolTip message={tooltipmssg} placement="top-start">
            <button
                {...props}
                className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                disabled={loading}
            >
                {loading ?
                    <Spinner animation="border" role="status">
                    </Spinner>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-raised-hand" viewBox="0 0 16 16">
                    <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a1 1 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207"/>
                    <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                  </svg>
                }
            </button>
        </ToolTip>
    )
}
export { InfomonButton }