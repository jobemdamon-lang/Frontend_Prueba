import { FC } from "react"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import { IListExecutionsLinux, ModalViewForLinuxPatch } from "../../Types"
import { useLinuxPatchContext } from "../Context"
import { useExecution } from "../../hooks/useExecution"
import { ModalSize } from "../../../../hooks/Types"
import { AccessController } from "../../../../components/AccessControler"
import { Loader } from "../../../../components/Loading"
import { LaunchSVG } from "../../../../components/SVGs/LaunchSVG"
import { AnalyticsService } from "../../../../helpers/analytics"

type Props = { row: IListExecutionsLinux }

const ExecutionActions: FC<Props> = ({ row }) => {

    const { rol, modalHook } = useLinuxPatchContext()
    const executionHook = useExecution()

    return (
        <div className="d-flex gap-5 justify-content-center align-items-center">
            {row.ESTADO_EJECUCION === "TERMINADO" &&
                <ToolTip
                    message='Detalle de la Ejecución'
                    placement='top'
                >
                    <button
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                            executionHook.getListExecutionDetailLinux(row.ID_EJECUCION).then(result => {
                                if (result) {
                                    console.log(result)
                                    modalHook.openModal(ModalViewForLinuxPatch.EXECUTION_DETAIL, ModalSize.XL, undefined, result)
                                }
                            })
                        }}
                    >
                        {executionHook.getExecutionLinuxDetailLoading ?
                            <Loader />
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                            </svg>
                        }
                    </button>
                </ToolTip>
            }
            {row.ESTADO_EJECUCION === "PLANIFICADO" &&
                <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
                    <ToolTip
                        message='Editar Configuración'
                        placement='top'
                    >
                        <button
                            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                            onClick={() => {
                                AnalyticsService.event("edit_execution_configuration", { module: "parchado" });
                                executionHook.getConfigurationLinuxOfExecution(row.ID_EJECUCION).then(result => {
                                    if (result) {
                                        modalHook.openModal(ModalViewForLinuxPatch.EXECUTION_SAVED, ModalSize.XL, undefined, result)
                                    }
                                })
                            }}
                        >
                            {executionHook.configurationLinuxLoading ?
                                <Loader />
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                </svg>
                            }
                        </button>
                    </ToolTip>
                </AccessController>
            }
            {true &&
                <ToolTip
                    message='Ver Progreso'
                    placement='top'
                >
                    <button
                        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                            AnalyticsService.event("view_execution_progress", { module: "parchado" });
                            executionHook.listProgressLinuxExecution(row.ID_EJECUCION).then(result => {
                                if (result) {
                                    modalHook.openModal(ModalViewForLinuxPatch.EXECUTION_PROGRESS, ModalSize.XL, undefined, result)
                                }
                            })
                        }}
                    >
                        {executionHook.progressLinuxExecutionLoading ?
                            <Loader />
                            :
                            <LaunchSVG />
                        }
                    </button>
                </ToolTip>
            }
            {row.ESTADO_EJECUCION === "PLANIFICADO" &&
                <ToolTip
                    message='Eliminar Ejecución'
                    placement='top'
                >
                    <button
                        className='btn btn-icon btn-light btn-active-color-danger btn-sm me-1'
                        onClick={() => { modalHook.openModal(ModalViewForLinuxPatch.CONFIRM_DELETE_EXECUTION, ModalSize.SM, undefined, row) }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                </ToolTip>
            }
        </div>
    )
}

export { ExecutionActions }