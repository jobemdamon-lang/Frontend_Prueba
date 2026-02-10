import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../../helpers";
import SVG from "react-inlinesvg"
import { FC } from "react";
import { ICreateFrecuencyProtection, ICreateHours, ICreateRoutes, ICreateServers, IListFrecuencyProtection, IListHours, IListRoutes, IListServers, IModifyTask, ITask } from "../../Types";
import uniqid from "uniqid";
import { toast } from "react-toastify";

type Props = {
  selectedRows: ITask[],
  setToggleCleared: React.Dispatch<React.SetStateAction<boolean>>,
  setCanCreate: React.Dispatch<React.SetStateAction<boolean>>,
  setWantClone: React.Dispatch<React.SetStateAction<boolean>>,
  toggleCleared: boolean,
  setIsVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  taskCloneFunctions: any
}

const CloneButton: FC<Props> = ({ selectedRows, setToggleCleared, setCanCreate, setWantClone, toggleCleared, setIsVisibility, taskCloneFunctions }) => {

  const tooltip = (mssg: string) => (
    <Tooltip id="tooltip-disabled"> {mssg}</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={tooltip("Clonar Tarea")}>
      <button
        disabled={selectedRows.length >= 2}
        style={{ backgroundColor: "transparent" }}
        onClick={() => {
          setToggleCleared(!toggleCleared);
          if (selectedRows.length === 0) {
            toast.warn("Debe seleccionar una tarea.", {
              position: toast.POSITION.TOP_RIGHT
            })
          } else {
            setCanCreate(false)
            setWantClone(true)
            //Al ser un clonado se reasignan las id de lista ruta y hora a 0 (no existente) es decir nuevos
            let newHoras: ICreateHours[] = selectedRows[0].lista_hora?.map((hour: IListHours) => {
              return { ...hour, idRow: uniqid(), estado: parseInt(hour.estado, 10), id_soli_hora: 0 }
            })
            let newServers: ICreateServers[] = selectedRows[0].lista_server?.map((server: IListServers) => {
              return { ...server, idRow: uniqid(), estado: parseInt(server.estado, 10) }
            })
            let newRoutes: ICreateRoutes[] = selectedRows[0].lista_ruta?.map((route: IListRoutes) => {
              return { ...route, idRow: uniqid(), estado: parseInt(route.estado, 10), id_soli_ruta: 0 }
            })
            let newFrecuencyProtection: ICreateFrecuencyProtection[] = selectedRows[0].lista_proteccion_frecuencia?.map((freqProt: IListFrecuencyProtection) => {
              return { ...freqProt, idRow: uniqid(), estado: parseInt(freqProt.estado, 10), id_soli_tarea_pf: 0 }
            })
            interface detalle_in { detalle_independencia?: string }
            interface IModify extends IModifyTask, detalle_in { }
            const taskToClone: IModify = {
              ...selectedRows[0],
              minuto_estimado: selectedRows[0].minuto_estimado?.toString(),
              hora_estimado: selectedRows[0].hora_estimado?.toString(),
              bks_depend: selectedRows[0].bks_depend.toString(),
              bk_lib_id: selectedRows[0].bk_lib_id.toString(),
              usuario: "",
              lista_hora: newHoras,
              lista_server: newServers,
              lista_ruta: newRoutes,
              lista_proteccion_frecuencia: newFrecuencyProtection
            }
            delete taskToClone["detalle_independencia"]
            taskCloneFunctions.setTaskToClone(taskToClone)
            setIsVisibility(true)
          }
        }}
      >
        <SVG src={toAbsoluteUrl("/media/icons/duotune/general/gen054.svg")} width={40} height={40} />
      </button>
    </OverlayTrigger>
  )
}
export { CloneButton }