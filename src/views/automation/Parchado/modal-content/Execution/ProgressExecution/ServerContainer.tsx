import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../../store/ConfigStore"
import { IAuthState } from "../../../../../../store/auth/Types"
import { useExecution } from "../../../../hooks/useExecution"
import { ListaRutinaria, ListaServidores } from "../../../../Types"
import { toast } from "react-toastify"
import uniqid from "uniqid"
import { RoutineAwxStep } from "./RoutineAwxStep"
import { useState } from "react"
import { warningNotification } from "../../../../../../helpers/notifications"
import { ToolTip } from "../../../../../../components/tooltip/ToolTip"

const ServerContainer = ({ server, idExecution, listProgressExecution }: { server: ListaServidores, idExecution: number, listProgressExecution: (idExecution: number) => Promise<void> }) => {

  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
  const { restartExecution, restartExecutionLoading, cancelExecution, cancelExecutionLoading, saltarExecution, getMotivoSaltoLoading } = useExecution()
  const [motivo, setMotivo] = useState("")

  //Fijarse cual es la primera rutinaria (step fallida) para reejecutar desde allí
  let lastExecutedRoutine = calculateFirstRoutineFailed(server)
  //Fijarse si todas las tareas esta ejecutadas y no hay errores para poder mostrar el boton de reejecutar
  let allStepsAreExecutedAndNotErrors = canReexecute(server)
  //Fijarse cual es la ejecucion que esta actualmente en ejecución para cancelarla
  let IdRoutineInProgressToCancel = routineActuallyExecuting(server)

  return (
    <div className="accordion my-8" id={`kt_accordion_${server.id_equipo}`}>
      <h4>{server.nombre_equipo}</h4>
      {server.lista_rutinaria.map((step: ListaRutinaria) => (
        <RoutineAwxStep
          step={step}
          key={uniqid()}
          parentID={server.id_equipo}
          idExecution={idExecution}
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
        <ToolTip placement="top-end" message="Esta acción busca el primero proceso erroneo (red) y rejecuta desde el siguiente">
          <button
            className="btn btn-warning"
            disabled={getMotivoSaltoLoading}
            onClick={() => {
              if (motivo === '') {
                toast.warn(`Para poder realizar el salto , primero tiene que llenar el motivo de porque esta sucediendo el salto de la rutinaria.`, {
                  position: toast.POSITION.TOP_RIGHT
                })
              } else {
                if (lastExecutedRoutine !== 0) {
                  saltarExecution(idExecution, lastExecutedRoutine, user.usuario, server.id_equipo, { motivo: motivo }).then(success => {
                    if (success) listProgressExecution(idExecution)
                  })
                } else {
                  toast.warn(`No ha fallado ninguna rutinaria para realizar el salto.`, {
                    position: toast.POSITION.TOP_RIGHT
                  })
                }
              }
            }}
          >
            {getMotivoSaltoLoading ? "Saltando.." : "Saltar"}
          </button>
        </ToolTip>
        <ToolTip placement="top-end" message="Esta acción busca el primer proceso erroneo (red) y reejecuta de ahí en adelante">
          <button
            className="btn btn-warning"
            disabled={restartExecutionLoading || allStepsAreExecutedAndNotErrors}
            onClick={() => {
              if (lastExecutedRoutine !== 0) {
                restartExecution(idExecution, lastExecutedRoutine, user.usuario, server.id_equipo).then(success => {
                  if (success) listProgressExecution(idExecution)
                })
              } else {
                warningNotification('No se encontró ninguna rutinaria fallida para reejecutar')
              }
            }}
          >
            {restartExecutionLoading ? "Reejecutando" : "Reejecutar"}
          </button>
        </ToolTip>
        <ToolTip placement="top-end" message="Esta acción cancela la ejecución actual desde el proceso que se ejecuta hacia adelante">
          <button
            className="btn btn-warning"
            disabled={cancelExecutionLoading}
            onClick={() => {
              if (IdRoutineInProgressToCancel !== 0) {
                cancelExecution(idExecution, IdRoutineInProgressToCancel, user.usuario, server.id_equipo).then(success => {
                  if (success) listProgressExecution(idExecution)
                })
              } else {
                toast.warn(`No se encontró ninguna rutinaria activa para cancelar`, {
                  position: toast.POSITION.TOP_RIGHT
                })
              }
            }}
          >
            {cancelExecutionLoading ? "Cancelando.." : "Cancelar"}
          </button>
        </ToolTip>
      </div>
    </div >
  )
}

export { ServerContainer }

const calculateFirstRoutineFailed = (server: ListaServidores): number => {
  return server.lista_rutinaria.filter(step => step.es_error === 1)[0]?.id_ejecucion_detalle ?? 0
}
const canReexecute = (server: ListaServidores): boolean => {
  return server.lista_rutinaria.every(step => step.is_executed === 1) &&
    !server.lista_rutinaria.some(step => step.es_error === 1) &&
    server.lista_rutinaria.some(step => (step.fecha_fin === undefined || step.fecha_fin === null))
}

const routineActuallyExecuting = (server: ListaServidores): number => {
  return server.lista_rutinaria?.filter(step => step.is_executed === 1 && !step?.fecha_fin)[0]?.id_ejecucion_detalle ?? 0
}