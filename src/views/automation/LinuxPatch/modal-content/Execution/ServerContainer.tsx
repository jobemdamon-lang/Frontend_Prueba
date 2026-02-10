import { warningNotification } from "../../../../../helpers/notifications"
import { ListaRutinariaLinux, ListaServidoresLinux } from "../../../Types"
import { FC, useState } from "react"
import { RoutineAWX } from "./RoutineAWX"
import uniqid from "uniqid"
import { useLinuxPatchContext } from "../../Context"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"

type ServerProps = {
    server: ListaServidoresLinux,
    executionID: number,
    nroTicket: string | null,
    handleDebounceFetchData: Function
}

const ServerContainer: FC<ServerProps> = ({ server, executionID, nroTicket, handleDebounceFetchData }) => {

    const [motivo, setMotivo] = useState("")
    const { executionHook } = useLinuxPatchContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)

    return (
        <div className="accordion my-8" id={`kt_accordion_${server.id_equipo}`}>
            <h4
                className="fw-normal fs-4 mb-4 ps-6"
                style={{ color: '#3D3B40' }}
            >
                {server.nombre_equipo.toUpperCase()}
            </h4>
            {server.lista_rutinaria.map((step: ListaRutinariaLinux) => (
                <RoutineAWX
                    nroTicket={nroTicket}
                    routine={step}
                    key={uniqid()}
                    serverID={server.id_equipo}
                    executionID={executionID}
                />
            ))}
            <div className="d-flex justify-content-end mt-3 gap-5">
                <input
                    type="text"
                    name="motivo"
                    className="form-control"
                    id="" value={motivo}
                    onChange={(event) => { setMotivo(event.target.value) }}
                />
                <ToolTip placement="top-end" message="Esta acción cancela el proceso en ejecucion actual y continua ejecutando desde el siguiente hacia delante">
                    <button
                        className="btn btn-outline-primary border border-secondary"
                        disabled={executionHook.skipExecutionLinuxLoading}
                        onClick={() => {
                            if (motivo === '') {
                                warningNotification('Para poder realizar el salto , primero tiene que llenar el motivo de porque esta sucediendo el salto de la rutinaria')
                            } else {
                                executionHook.skipExecutionLinux(executionID, userName, server.id_equipo, { motivo: motivo }).then(result => {
                                    if (result) handleDebounceFetchData()
                                })
                            }
                        }}
                    >
                        {executionHook.skipExecutionLinuxLoading &&
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        }
                        {executionHook.skipExecutionLinuxLoading ? ' Saltando' : 'Saltar'}
                    </button>
                </ToolTip>
                <ToolTip placement="top-end" message="Esta acción busca el primer proceso erroneo (red) y reejecuta de ahí en adelante">
                    <button
                        className="btn btn-outline-primary border border-secondary"
                        disabled={executionHook.rerunExecutionLinuxLoading}
                        onClick={() => {
                            executionHook.rerunExecutionLinux(executionID, userName, server.id_equipo).then(result => {
                                if (result) handleDebounceFetchData()
                            })
                        }}
                    >
                        {executionHook.rerunExecutionLinuxLoading &&
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        }
                        {executionHook.rerunExecutionLinuxLoading ? ' Reejecutando' : 'Reejecutar'}
                    </button>
                </ToolTip>
                <ToolTip placement="top-end" message="Esta acción cancela la ejecución del servidor desde el proceso que se esta ejecutando hacia adelante">
                    <button
                        className="btn btn-outline-primary border border-secondary"
                        disabled={executionHook.cancelExecutionLinuxLoading}
                        onClick={() => {
                            executionHook.cancelExecutionLinux(executionID, userName, server.id_equipo).then(result => {
                                if (result) handleDebounceFetchData()
                            })
                        }}
                    >
                        {executionHook.cancelExecutionLinuxLoading &&
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        }
                        {executionHook.cancelExecutionLinuxLoading ? ' Cancelando' : 'Cancelar'}
                    </button>
                </ToolTip>
            </div>
        </div>
    )
}

export { ServerContainer }
