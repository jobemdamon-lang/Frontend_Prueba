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
  taskModifiedFunctions: any
}

const EditButton: FC<Props> = ({ selectedRows, setToggleCleared, setCanCreate, setWantClone, toggleCleared, setIsVisibility, taskModifiedFunctions }) => {

  const tooltip = (mssg: string) => (
    <Tooltip id="tooltip-disabled"> {mssg}</Tooltip>
  );

  return (
    <OverlayTrigger placement="top" overlay={tooltip("Editar Tarea")}>
      <button
        style={{ backgroundColor: "transparent" }}
        disabled={selectedRows.length >= 2}
        onClick={() => {
          setToggleCleared(!toggleCleared);
          //Se le asigna a cada elemento de la lista rutas,Cis y horas un id unico nivel Front para su manejo en las tablas
          if (selectedRows.length === 0) {
            toast.warn("Debe seleccionar una tarea.", {
              position: toast.POSITION.TOP_RIGHT
            })
          } else {
            setCanCreate(false)
            setWantClone(false)
            let newHoras: ICreateHours[] = selectedRows[0].lista_hora?.map((hour: IListHours) => {
              return { ...hour, idRow: uniqid(), estado: parseInt(hour.estado, 10) }
            })
            let newServers: ICreateServers[] = selectedRows[0].lista_server?.map((server: IListServers) => {
              return { ...server, idRow: uniqid(), estado: parseInt(server.estado, 10) }
            })
            let newRoutes: ICreateRoutes[] = selectedRows[0].lista_ruta?.map((route: IListRoutes) => {
              return { ...route, idRow: uniqid(), estado: parseInt(route.estado, 10) }
            })
            let newFrecuencyProtection: ICreateFrecuencyProtection[] = selectedRows[0].lista_proteccion_frecuencia?.map((freqProt: IListFrecuencyProtection) => {
              return { ...freqProt, idRow: uniqid(), estado: parseInt(freqProt.estado, 10) }
            })
            interface detalle_in { detalle_independencia?: string }
            interface IModify extends IModifyTask, detalle_in { }

            const taskToModify: IModify = {
              ...selectedRows[0],
              minuto_estimado: selectedRows[0].minuto_estimado?.toString(),
              hora_estimado: selectedRows[0].hora_estimado?.toString(),
              bks_depend: selectedRows[0].bks_depend.toString(),
              bk_lib_id: selectedRows[0].bk_lib_id.toString(),
              //Se reasigan el dato de detalle independencia a dependencia
              detalle_dependencia: selectedRows[0].detalle_independencia,
              usuario: "",
              lista_hora: newHoras,
              lista_server: newServers,
              lista_ruta: newRoutes,
              lista_proteccion_frecuencia: newFrecuencyProtection
            }
            //La data de la api me viene con detalle independencia pero debe enviar como detalle dependencia - razon de la reasignacion y eliminacion
            delete taskToModify["detalle_independencia"]
            taskModifiedFunctions.setTaskToModified(taskToModify)
            setIsVisibility(true)
          }
        }
        }
      >
        <SVG src={toAbsoluteUrl("/media/icons/duotune/general/gen055.svg")} width={40} height={40} />
      </button>
    </OverlayTrigger>
  )
}
export { EditButton }