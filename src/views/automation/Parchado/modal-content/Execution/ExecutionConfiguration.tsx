import { FC, useEffect, useState } from "react"
import { ExecutionView, ICategories, IGroupsWithServersWithPatchesFront, IListExecutions, ModalView } from "../../../Types"
import { Card } from "../../../../../components/Card"
import { unCheckPatche, extractUniqueCategories, unCheckPatcheByCategory, conciliateInfoGroupAndConfiguration, resumeDataNeccesary } from "./transformFormat"
import { ModalSize } from "../../../../../hooks/Types"
import { CategoryItem } from "./components/CategoryItem"
import { GroupAvailable } from "./components/GroupAvailable"
import { GroupResume } from "./components/GroupResume"
import uniqid from "uniqid"
import { GroupServerPatche } from "./components/GroupServerPatche"
import { useWindowsPatchContext } from "../../Context"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { toast } from "react-toastify"
import { AnalyticsService } from "../../../../../helpers/analytics"

type Props = { setExecutionViewToRender: React.Dispatch<React.SetStateAction<ExecutionView>> }

//Vista dentro del Modal de Ejecuciones para la configuracion de un nuevo Parchado desde 0
const ExecutionConfiguration: FC<Props> = ({ setExecutionViewToRender }) => {

  const { modalHook, executionHook, executionModalFunctions, clientForExecution, groupHook } = useWindowsPatchContext()
  const userName = useTypedSelector(({ auth }) => auth.usuario)
  const modalInformation: IListExecutions = modalHook.modalInformation.executionInformation

  const [groupsServersPatchesFront, setGroupsServersPatchesFront] = useState<IGroupsWithServersWithPatchesFront[]>([])
  const [crqAssociated, setCrqAssociated] = useState("")
  const [uniqueCategories, setUniqueCategories] = useState<ICategories[]>([]);

  const handleCheckCategory = (nextCheckedState: boolean, categoryName: string) => {
    //Si el estado a cambiar del check es a unchecked(false) se pide motivo
    if (!nextCheckedState) {
      executionModalFunctions.openModal(ModalView.UNCHECK_CONFIRMATION_BYCATEGORY, ModalSize.SM, undefined, {
        setGroupsServersPatchesFront,
        categoryName: categoryName
      })
    } else {
      setGroupsServersPatchesFront((prev) => (
        unCheckPatcheByCategory(prev, categoryName, "", true)
      ))
    }
  }

  const handleCheckPatche = (nextCheckedState: boolean, groupIndex: number, serverIndex: number, patcheIndex: number) => {
    //Si el estado a cambiar del check es a unchecked(false) se pide motivo
    if (!nextCheckedState) {
      executionModalFunctions.openModal(ModalView.UNCHECK_CONFIRMATION_BYONE, ModalSize.SM, undefined, {
        setGroupsServersPatchesFront,
        groupIndex,
        serverIndex,
        patcheIndex
      })
    } else {
      setGroupsServersPatchesFront((prev) => (
        unCheckPatche(prev, groupIndex, serverIndex, patcheIndex, "")
      ))
    }
  }

  const handleUpdate = () => {
    executionHook.updateConfiguration(modalInformation.ID_EJECUCION, {
      cliente: clientForExecution,
      usuario: userName,
      lista_programacion: resumeDataNeccesary(
        groupsServersPatchesFront.filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
      )
    }).then(success => {
      if (success) {
        modalHook.closeModal()
        executionHook.getListExecutions(clientForExecution)
      }
    })
  }

  const handleExecutePatch = () => {
    if (crqAssociated === "") {
      toast.warn("Ingrese un CQR válido para iniciar la Ejecución", { position: toast.POSITION.TOP_RIGHT })
      return
    }
    AnalyticsService.event("execute_patch", { module: "parchado" });
    executionHook.initPatching({
      usuario: userName,
      cliente: clientForExecution,
      crq: crqAssociated,
      lista_programacion: resumeDataNeccesary(groupsServersPatchesFront.filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK))
    }, modalInformation.ID_EJECUCION).then(success => {
      if (success) {
        executionHook.getListExecutions(clientForExecution)
        modalHook.closeModal()
        modalHook.openModal(ModalView.EXECUTION_PROCESS, ModalSize.XL, undefined, { id_ejecucion: modalInformation.ID_EJECUCION })
      }
    })
  }

  useEffect(() => {
    executionHook.getListConfigurationOfExecution(modalInformation.ID_EJECUCION)
    groupHook.getListGroupsWithServers(clientForExecution, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setGroupsServersPatchesFront(conciliateInfoGroupAndConfiguration(groupHook.groupsServerPatchesData, executionHook.configurationOfExecution))
  }, [groupHook.groupsServerPatchesData, executionHook.configurationOfExecution])

  useEffect(() => {
    setUniqueCategories(extractUniqueCategories(groupsServersPatchesFront))
  }, [groupsServersPatchesFront])

  return (
    <div className="d-flex flex-column gap-5">
      <h5 className="text-center m-0 p-0">CATEGORIAS</h5>
      <div className="d-flex justify-content-around gap-5 overflow-scroll py-2">
        {uniqueCategories.map((category: ICategories) => (
          <CategoryItem
            key={uniqid()}
            category={category}
            handleCheckCategory={handleCheckCategory}
          />
        ))}
      </div>
      <div className="d-flex justify-content-center gap-5">
        <div className="d-flex justify-content-center flex-column align-items-center justify-content-between gap-5">
          <Card
            className="w-350px mh-400px"
            bodyclassName="overflow-scroll"
            cardTitle="LISTA DE GRUPOS"
            cardDetail="Seleccione un grupos disponibles para el Parchado"
          >
            <ul className="d-flex flex-column gap-2">
              {groupHook.getListGroupsServersPatchesLoading || executionHook.configurationLoading ? <i>Cargando Datos...</i> :
                groupsServersPatchesFront.map((group: IGroupsWithServersWithPatchesFront, groupIndex: number) => (
                  <GroupAvailable
                    key={group.ID_GRUPO}
                    group={group}
                    groupIndex={groupIndex}
                    setGroupsServersPatchesFront={setGroupsServersPatchesFront}
                  />
                ))
              }
            </ul>
          </Card>
          <Card
            className="w-350px mh-400px"
            bodyclassName="overflow-scroll"
            cardTitle="RESUMEN"
            cardDetail="Resumen de los parches que serán instalados en cada Servidor."
          >
            <div>
              {groupHook.getListGroupsServersPatchesLoading || executionHook.configurationLoading ? <i>Cargando Datos...</i> :
                groupsServersPatchesFront
                  .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
                  .map((group: IGroupsWithServersWithPatchesFront) => (
                    <GroupResume group={group} key={group.ID_GRUPO} />
                  ))}
            </div>
          </Card>
        </div>
        <div className="mh-800px overflow-scroll w-100">
          <ul className="w-100">
            {groupHook.getListGroupsServersPatchesLoading || executionHook.configurationLoading ? <i>Cargando Datos...</i> :
              groupsServersPatchesFront
                .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
                .map((group: IGroupsWithServersWithPatchesFront, groupIndex: number) => (
                  <GroupServerPatche key={group.ID_GRUPO} group={group} handleCheckPatche={handleCheckPatche} groupIndex={groupIndex} />
                ))}
          </ul>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-5 align-items-end">
        <button
          className="btn btn-primary"
          disabled={executionHook.updateConfigurationLoading}
          onClick={() => handleUpdate()}>
          {executionHook.updateConfigurationLoading ? "Actualizando..." : "Actualizar Configuración"}
        </button>
        <div>
          <label className="form-label">CRQ Asociado</label>
          <input
            type="text"
            value={crqAssociated}
            className="form-control"
            onChange={(value) => setCrqAssociated(value.target.value)}
            placeholder="CRQ7854548"
          />
        </div>
        <button
          className="btn btn-success"
          disabled={executionHook.initPatchingLoading}
          onClick={() => handleExecutePatch()}
        >
          {executionHook.initPatchingLoading ? "Iniciando Ejecución" : "Ejecutar Rutinaria"}
        </button>
        <button
          className="btn btn-danger"
          onClick={() => modalHook.closeModal()}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
export { ExecutionConfiguration }
