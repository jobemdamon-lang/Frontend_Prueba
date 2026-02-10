import { useCallback, useContext, useState } from "react"
import { BackupService } from "../../../services/Backup.service"
import { ICreateHours, ICreateRoutes, ICreateServers, ICreateTask, IDataTableRowsHours, IDataTableRowsServers, IDataTableRowsRoutes, ITask, ICreateFrecuencyProtection, IDataTableRowsFrecuencyProtection } from "../components/politicas/Types"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../store/ConfigStore"
import { useRequestTasks } from "./useRequestTasks"
import { Context } from "../components/politicas/Context"
import { initialTaskCreate } from "./initialTask"
import { toast } from "react-toastify"
import { IAuthState } from "../../../store/auth/Types"

const useTaskClone = (setIsVisibility: any) => {

  //Estado para el estado de carga de una tarea
  const [loadingTask, setLoadingTask] = useState(false)
  const [showModalCorrelative, setShowCorrelative] = useState(false)
  const { refreshTask, modalInformation } = useContext(Context)
  const { fetchListOfTasks } = useRequestTasks()
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  //Estado para la actualizacion de una tarea
  const [clonedTask, setTaskToClone] = useState<ICreateTask>(initialTaskCreate)

  //Funciones para actualizar cada input de la tarea 
  const updateTipoTarea = (value: string) => setTaskToClone((prevState) => ({ ...prevState, tipo_tarea: value }))
  const updateTipoBackup = (value: string) => setTaskToClone((prevState) => ({ ...prevState, tipo_backup: value }))
  const updateProteccion = (value: string) => setTaskToClone((prevState) => ({ ...prevState, proteccion: value }))
  const updateFrecuencia = (value: string) => setTaskToClone((prevState) => ({ ...prevState, frecuencia: value }))
  const updateModo = (value: string) => setTaskToClone((prevState) => ({ ...prevState, modo: value }))
  const updateContenido = (value: string) => setTaskToClone((prevState) => ({ ...prevState, contenido: value }))
  const updateLunes = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_lun: value ? 1 : 0 }))
  const updateMartes = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_mar: value ? 1 : 0 }))
  const updateMiercoles = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_mie: value ? 1 : 0 }))
  const updateJueves = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_jue: value ? 1 : 0 }))
  const updateViernes = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_vie: value ? 1 : 0 }))
  const updateSabado = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_sab: value ? 1 : 0 }))
  const updateDomingo = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_dom: value ? 1 : 0 }))
  const updateHoraInicio = (value: string) => setTaskToClone((prevState) => ({ ...prevState, hora_vinicio: value }))
  const updateHoraFin = (value: string) => setTaskToClone((prevState) => ({ ...prevState, hora_vfin: value }))
  const updateEliminarData = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_eliminar_cont: value ? 1 : 0 }))
  const updateDependeDeOtraTarea = (value: boolean) => setTaskToClone((prevState) => ({ ...prevState, bks_depend: value ? "1" : "0" }))
  const updateEspecificarDetalle = (value: string) => setTaskToClone((prevState) => ({ ...prevState, detalle_dependencia: value }))
  const updateTamañoARespaldar = (value: string) => setTaskToClone((prevState) => ({ ...prevState, bks_tamdat: value }))
  const updateHerramienta = (value: string) => setTaskToClone((prevState) => ({ ...prevState, herramienta: value }))
  const updateCellmanager = (value: string) => setTaskToClone((prevState) => ({ ...prevState, cell_manager: value }))
  const updateHoraEstimado = (value: string) => setTaskToClone((prevState) => ({ ...prevState, hora_estimado: value }))
  const updateMinutoEstimado = (value: string) => setTaskToClone((prevState) => ({ ...prevState, minuto_estimado: value }))
  const updateAclaracion = (value: string) => setTaskToClone((prevState) => ({ ...prevState, aclaracion: value }))

  //Metodos para modificar la lista de Horas
  const updateModificarHora = (id_row_hora: string, value: string) => {
    const newListHora = clonedTask?.lista_hora?.map((horaItem: ICreateHours) => {
      if (horaItem.idRow === id_row_hora) {
        return { ...horaItem, descripcion: value }
      }
      return horaItem
    })
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_hora: newListHora }
    })
  }
  const updateEliminarHora = (selectedRows: IDataTableRowsHours[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const newListHora = clonedTask?.lista_hora?.filter((horaItem: ICreateHours) => {
      if (onlyIdRows.includes(horaItem.idRow)) {
        return false
      }
      return true
    })
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_hora: newListHora }
    })
  }
  const updateAgregarHora = (newHora: ICreateHours) => {
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_hora: [...prevState.lista_hora, newHora] }
    })
  }

  //Metodos para modificar la lista de Servidores
  const updateAgregarServidor = (newServer: ICreateServers) => {
    let idxServer = clonedTask?.lista_server?.findIndex((server: ICreateServers) => server.nombreci === newServer.nombreci)
    if (idxServer === -1) {
      setTaskToClone((prevState: any) => {
        return { ...prevState, lista_server: [...prevState.lista_server, newServer] }
      })
    } else {
      toast.warn("No se puede añadir el mismo CI.", {
        position: toast.POSITION.TOP_RIGHT
      })
    }
  }

  const updateEliminarServidor = (selectedRows: IDataTableRowsServers[]) => {

    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const onlyIdCis: number[] = selectedRows.map(({ id_equipo, ...row }) => id_equipo)

    const newServers = clonedTask?.lista_server?.filter((server: ICreateServers) => {
      if (onlyIdRows.includes(server.idRow)) {
        return false
      }
      return true
    });
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_server: newServers }
    })

    //Adicionalmente Eliminar sus rutas asociadas
    const newRoutes = clonedTask?.lista_ruta?.filter((ruta: ICreateRoutes) => {
      if (onlyIdCis.includes(ruta.id_equipo)) {
        return false
      }
      return true
    });
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_ruta: newRoutes }
    })
  }

  //Metodos para modificar la lista de Rutas
  const updateAgregarRuta = (newRoute: ICreateRoutes) => {
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_ruta: [...prevState.lista_ruta, newRoute] }
    })
  }

  const updateEliminarRuta = (selectedRows: IDataTableRowsRoutes[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const newRoutes = clonedTask?.lista_ruta?.filter((route: ICreateRoutes) => {
      if (onlyIdRows.includes(route.idRow)) {
        return false
      }
      return true
    });
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_ruta: newRoutes }
    })
  }

  const updateModificarRuta = (idRoute: string, propertyToModify: any) => {
    const newListRoutes = clonedTask?.lista_ruta?.map((route: ICreateRoutes) => {
      if (route.idRow === idRoute) {
        return { ...route, ...propertyToModify }
      }
      return route
    })
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_ruta: newListRoutes }
    })
  }

  //Metodos para eliminar y agregar a Lista Frecuencia Proteccion
  const updateEliminarFrecuenciaProteccion = (selectedRows: IDataTableRowsFrecuencyProtection[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const newListFrecuencyProtection = clonedTask?.lista_proteccion_frecuencia?.filter((freqProt: ICreateFrecuencyProtection) => {
      if (onlyIdRows.includes(freqProt.idRow)) {
        return false
      }
      return true
    })
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_proteccion_frecuencia: newListFrecuencyProtection }
    })
  }
  const updateAgregarFrecuenciaProteccion = (frecuency_protection: ICreateFrecuencyProtection) => {
    setTaskToClone((prevState: any) => {
      return { ...prevState, lista_proteccion_frecuencia: [...prevState.lista_proteccion_frecuencia, frecuency_protection] }
    })
  }

  const CloneTask = useCallback(async (canCreateCorrelative: string, Task: ICreateTask) => {
    setLoadingTask(true)
    //Se quita la propiedad idRow que fue usada nivelFront para su envio en la peticion
    const serversWithOutIdRow: ICreateServers[] = Task.lista_server.map(({ idRow, ...rest }) => rest)
    const routesWithOutIdRow: ICreateRoutes[] = Task.lista_ruta.map(({ idRow, ...rest }) => rest)
    const hoursWithOutIdRow: ICreateHours[] = Task.lista_hora.map(({ idRow, ...rest }) => rest)
    const frecuencyProtectionWithOutIdRow: ICreateFrecuencyProtection[] = Task.lista_proteccion_frecuencia.map(({ idRow, ...rest }) => rest)
    const clonedTask: ICreateTask = {
      ...Task,
      usuario: user.usuario,
      nombre_tarea: "",
      id_soli_tarea: 0,
      bks_server: "",
      id_solicitud: modalInformation.id_solicitud,
      lista_server: serversWithOutIdRow,
      lista_ruta: routesWithOutIdRow,
      lista_hora: hoursWithOutIdRow,
      lista_proteccion_frecuencia: frecuencyProtectionWithOutIdRow
    }
    try {
      console.log(clonedTask)
      const response = /* { data: { status: "Correcto", mensaje: "lala" } } */await BackupService.createTask(canCreateCorrelative, clonedTask)
      if (response.data.status === "Correcto") {
        toast.success("La tarea ha sido Clonada Correctamente.", {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingTask(false)
        //Se esconde el modal de correlativo
        setShowCorrelative(false)
        //Se cambia la vista de detalle de una tarea a detalle de la solicitud
        setIsVisibility(false)
        //Se llama al endpoint de lista de tareas de esa solicitud y se actualiza la tabla
        fetchListOfTasks(clonedTask.id_solicitud).then((data: ITask[]) => {
          refreshTask(data)
        })
      } else if (response.data.status === "Repetido") {
        toast.warn(`Ya existe una tarea con ese Nombre! ${response.data.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingTask(false)
        //Si el nombre de la solicitud ya existe se pide confirmacion de correlativo
        setShowCorrelative(true)
      } else {
        toast.error(`Ocurrio un Problema en la Creación! ${response.data.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingTask(false)
      }
    } catch (error: any) {
      toast.error(`Ocurrio un Problema en la Creación! ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setLoadingTask(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    loadingTask, updateTipoTarea, updateTipoBackup, updateProteccion
    , updateFrecuencia, updateModo, updateContenido, updateLunes, updateMartes, updateMiercoles, updateJueves, updateViernes,
    updateSabado, updateDomingo, updateHoraInicio, updateHoraFin, updateEliminarData, updateDependeDeOtraTarea, updateTamañoARespaldar
    , updateHerramienta, updateCellmanager, updateHoraEstimado, updateMinutoEstimado, updateAclaracion, updateEspecificarDetalle, clonedTask, setTaskToClone,
    updateModificarHora, updateEliminarHora, updateAgregarHora, updateAgregarServidor, updateEliminarServidor, updateAgregarRuta,
    updateEliminarRuta, updateModificarRuta, showModalCorrelative, setShowCorrelative, CloneTask, updateAgregarFrecuenciaProteccion, updateEliminarFrecuenciaProteccion
  }
}
export { useTaskClone }