import { FC } from "react"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { ModalViewForIncident } from "../../Types"
import { useIncidentContext } from "../Context"
import { Spinner } from "react-bootstrap"
import { ModalSize } from "../../../../hooks/Types"
import { IncidentItem } from "../../Types"
import { useIncident } from "../../hooks/useIncident"

type Props = { rowInformation: IncidentItem }

const Options: FC<Props> = ({ rowInformation }) => {

    const { modalHook } = useIncidentContext()
    const { getInfoIncidentByNroTicket, incidentInfoLoading } = useIncident()

    return (
        <div className="d-flex justify-content-center align-items-center ">
            {/* Solo se muestra la opción de ver Seguimiento para aquellos tickets que ya tengan un proceso inciado en el Incident Center */}
            {(rowInformation.IS_INICIADO === "INICIADO" || rowInformation.IS_INICIADO === "EN WAR ROOM" || rowInformation.IS_INICIADO === "DESPRIORIZADO") &&
                <button
                    className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                    disabled={incidentInfoLoading}
                    onClick={() => {
                        getInfoIncidentByNroTicket(rowInformation.TicketIdentifier).then(response => {
                            //Si encuentra el ticket se abre el modal
                            if (response?.success) modalHook.openModal(ModalViewForIncident.TRACKING_PANEL, ModalSize.SM, true, response.data)
                        })
                    }}
                >
                    {incidentInfoLoading ?
                        <Spinner animation="border" role="status">
                        </Spinner>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    }
                </button>
            }
            {/* Solo se muestra la opción de inciar Seguimiento para aquellos tickets que tengan un estado NO INICIADO Y sea P1 */}
            {rowInformation.IS_INICIADO === "NO INICIADO" && rowInformation.PriorityCode === "1" &&
                <ToolTip
                    message='Iniciar Seguimiento'
                    placement='top'
                >
                    <button
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                        onClick={() => { modalHook.openModal(ModalViewForIncident.START_TRACKING_CONFIRMATION, ModalSize.SM, undefined, rowInformation) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-patch-plus" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z" />
                            <path d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z" />
                        </svg>
                    </button>
                </ToolTip>
            }
            {/* SOlo se muestra si el incidente es un Prioridad 2 */}
            {rowInformation.PriorityCode === "2" &&
                <ToolTip
                    message='Priorizar'
                    placement='top'
                >
                    <button
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                        onClick={() => { modalHook.openModal(ModalViewForIncident.PRIORIZATION_CONFIRM, ModalSize.SM, undefined, rowInformation) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hand-index-thumb" viewBox="0 0 16 16">
                            <path d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 0 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 1 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.118a.5.5 0 0 1-.447-.276l-1.232-2.465-2.512-4.185a.517.517 0 0 1 .809-.631l2.41 2.41A.5.5 0 0 0 6 9.5V1.75A.75.75 0 0 1 6.75 1zM8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v6.543L3.443 6.736A1.517 1.517 0 0 0 1.07 8.588l2.491 4.153 1.215 2.43A1.5 1.5 0 0 0 6.118 16h6.302a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5.114 5.114 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.632 2.632 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046l-.048.002zm2.094 2.025z" />
                        </svg>
                    </button>
                </ToolTip>
            }
            {/* SOlo se muestra si el incidente es un Prioridad 1 */}
            {rowInformation.PriorityCode === "1" &&
                <ToolTip
                    message='Despriorizar'
                    placement='top'
                >
                    <button
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                        onClick={() => { modalHook.openModal(ModalViewForIncident.DESPRIORIZATION_CONFIRM, ModalSize.SM, undefined, rowInformation) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                            <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z" />
                        </svg>
                    </button>
                </ToolTip>
            }
        </div>
    )
}

const ReopenButton = ({ rowInformation }: { rowInformation: IncidentItem }) => {

    const { modalHook } = useIncidentContext()
    const { getInfoIncidentByNroTicket, incidentInfoLoading } = useIncident()

    return (
        <div className="d-flex justify-content-center align-items-center ">
            {((rowInformation.IS_INICIADO === "INICIADO" ||
                rowInformation.IS_INICIADO === "EN WAR ROOM" ||
                rowInformation.IS_INICIADO === "FINALIZADO" ||
                rowInformation.IS_INICIADO === "DESPRIORIZADO") &&
                (rowInformation.TicketStatus === "Resuelto" || rowInformation.TicketStatus === "Resolved")) &&
                <button
                    className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                    disabled={incidentInfoLoading}
                    onClick={() => {
                        getInfoIncidentByNroTicket(rowInformation.TicketIdentifier).then(response => {
                            //Si encuentra el ticket se abre el modal
                            if (response?.success) modalHook.openModal(ModalViewForIncident.TRACKING_PANEL, ModalSize.SM, true, response.data)
                        })
                    }}
                >
                    {incidentInfoLoading ?
                        <Spinner animation="border" role="status">
                        </Spinner>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    }
                </button>
            }

            {(rowInformation.TicketStatus === "Resuelto" || rowInformation.TicketStatus === "Resolved") &&
                <ToolTip
                    message='Reabrir Ticket'
                    placement='top'
                >
                    <button
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                            modalHook.openModal(ModalViewForIncident.REOPEN_CONFIRMATION, ModalSize.SM, undefined, rowInformation)
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-folder2-open" viewBox="0 0 16 16">
                            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5zM2 6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5a.5.5 0 0 0-.5.5V6zm-.367 1a.5.5 0 0 0-.496.562l.64 5.124A1.5 1.5 0 0 0 3.266 14h9.468a1.5 1.5 0 0 0 1.489-1.314l.64-5.124A.5.5 0 0 0 14.367 7H1.633z" />
                        </svg>
                    </button>
                </ToolTip>
            }
        </div>
    )
}

export { Options, ReopenButton }