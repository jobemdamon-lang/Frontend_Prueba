import { FC, useEffect, useState } from "react"
import { ExecutionView, ICategories, IGroupsWithServersWithPatchesFront, ModalView } from "../../../Types"
import { Card } from "../../../../../components/Card"
import { unCheckPatche, transformFormat, extractUniqueCategories, unCheckPatcheByCategory } from "./transformFormat"
import { ModalSize } from "../../../../../hooks/Types"
import { CategoryItem } from "./components/CategoryItem"
import { GroupAvailable } from "./components/GroupAvailable"
import { GroupResume } from "./components/GroupResume"
import uniqid from "uniqid"
import { GroupServerPatche } from "./components/GroupServerPatche"
import { useWindowsPatchContext } from "../../Context"
import { useTypedSelector } from "../../../../../store/ConfigStore"

type Props = { setExecutionViewToRender: React.Dispatch<React.SetStateAction<ExecutionView>> }

//Vista dentro del Modal de Ejecuciones para la configuracion de un nuevo Parchado desde 0
const ExecutionNew: FC<Props> = ({ setExecutionViewToRender }) => {

  const { modalHook, executionHook, executionModalFunctions, clientForExecution, groupHook } = useWindowsPatchContext()
  const userName = useTypedSelector(({ auth }) => auth.usuario)
  const [groupsServersPatchesFront, setGroupsServersPatchesFront] = useState<IGroupsWithServersWithPatchesFront[]>([])
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
    //Si el estado a cambiar del check es a unchecked(undefined) se pide motivo
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

  const handleinitSearchPatches = () => {
    executionHook.initSearchPendingPatches({
      usuario: userName,
      cliente: clientForExecution,
      crq: "",
      lista_programacion: groupsServersPatchesFront
        .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
        .map(group => (
          {
            id_grupo: group.ID_GRUPO,
            lista_servidores: group.SERVIDORES.map(server => ({
              id_servidor: server.ID_EQUIPO,
              lista_parches: server.PARCHES.map(patche => ({
                id_parche: patche.ID_PARCHE,
                seleccionado: patche.CHECK ? 1 : 0,
                motivo: patche.UNCHECK_REASON ?? ""
              }))
            }))
          }
        ))
    }).then((response: any) => {
      if (response.success) {
        executionHook.getListExecutions(clientForExecution)
        modalHook.closeModal()
        modalHook.openModal(ModalView.EXECUTION_PROCESS, ModalSize.XL, undefined, { id_ejecucion: response.data })
      }
    })
  }

  const chandleCreateConf = () => {
    executionHook.createConfiguration({
      cliente: clientForExecution,
      usuario: userName,
      lista_programacion: groupsServersPatchesFront
        .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
        .map(group => (
          {
            id_grupo: group.ID_GRUPO,
            lista_servidores: group.SERVIDORES.map(server => ({
              id_servidor: server.ID_EQUIPO,
              lista_parches: server.PARCHES.map(patche => ({
                id_parche: patche.ID_PARCHE,
                seleccionado: patche.CHECK ? 1 : 0,
                motivo: patche.UNCHECK_REASON ?? ""
              }))
            }))
          }
        ))
    }).then(success => {
      if (success) {
        executionHook.getListExecutions(clientForExecution)
        modalHook.closeModal()
      }
    })
  }

  useEffect(() => {
    groupHook.getListGroupsWithServers(clientForExecution, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setGroupsServersPatchesFront(transformFormat(groupHook.groupsServerPatchesData))
  }, [groupHook.groupsServerPatchesData])

  useEffect(() => {
    setUniqueCategories(extractUniqueCategories(groupsServersPatchesFront));
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
              {groupHook.getListGroupsServersPatchesLoading ? <i>Cargando Datos...</i> :
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
              {groupHook.getListGroupsServersPatchesLoading ? <i>Cargando Datos...</i> :
                groupsServersPatchesFront
                  .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
                  .map((group: IGroupsWithServersWithPatchesFront) => (
                    <GroupResume group={group} key={group.ID_GRUPO} />
                  ))}
            </div>
          </Card>
        </div>
        <div className="mh-800px overflow-scroll w-100 p-5 rounded" style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }}>
          <ul>
            {groupHook.getListGroupsServersPatchesLoading ? <i>Cargando Datos...</i> :
              groupsServersPatchesFront
                .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
                .map((group: IGroupsWithServersWithPatchesFront, groupIndex: number) => (
                  <GroupServerPatche key={group.ID_GRUPO} group={group} handleCheckPatche={handleCheckPatche} groupIndex={groupIndex} />
                ))}
          </ul>
        </div>
      </div>
      <div className="d-flex justify-content-end gap-5">
        <button
          className="btn btn-primary"
          disabled={executionHook.createConfigurationLoading}
          onClick={() => chandleCreateConf()}>
          {executionHook.createConfigurationLoading ? "Guardando..." : "Guardar Configuración"}
        </button>
        <button
          className="btn btn-success"
          disabled={executionHook.initSearchPendingPatchLoading}
          onClick={() => handleinitSearchPatches()}
        >
          {executionHook.initSearchPendingPatchLoading ? "Ejecutando..." : "Ejecutar Busqueda"}
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
export { ExecutionNew }