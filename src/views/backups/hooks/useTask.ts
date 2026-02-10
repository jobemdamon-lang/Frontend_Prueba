import { useCallback, useContext, useState } from "react"
import { BackupService } from "../../../services/Backup.service"
import { ICreateFrecuencyProtection, ICreateHours, ICreateRoutes, ICreateServers, ICreateTask, IDataTableRowsFrecuencyProtection, IDataTableRowsHours, IDataTableRowsRoutes, IDataTableRowsServers, ITask } from "../components/politicas/Types"
import { Context } from "../components/politicas/Context"
import { useRequestTasks } from "./useRequestTasks"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../store/ConfigStore"
import { initialTaskCreate } from "./initialTask"
import { toast } from "react-toastify"
import { IAuthState } from "../../../store/auth/Types"

const useTask = (setIsVisible?: any) => {

  //Estado para el estado de carga de una tarea
  const [loadingTask, setLoadingTask] = useState(false)
  const [showModalCorrelative, setShowCorrelative] = useState(false)
  const { refreshTask, modalInformation } = useContext(Context)
  const { fetchListOfTasks } = useRequestTasks()
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  //Estado para la actualizacion de una tarea
  const [newTask, setNewTask] = useState<ICreateTask>(initialTaskCreate)

  //Funciones para actualizar cada input de la tarea 
  const updateTipoTarea = (value: string) => setNewTask((prevState) => ({ ...prevState, tipo_tarea: value }))
  const updateTipoBackup = (value: string) => setNewTask((prevState) => ({ ...prevState, tipo_backup: value }))
  const updateProteccion = (value: string) => setNewTask((prevState) => ({ ...prevState, proteccion: value }))
  const updateFrecuencia = (value: string) => setNewTask((prevState) => ({ ...prevState, frecuencia: value }))
  const updateModo = (value: string) => setNewTask((prevState) => ({ ...prevState, modo: value }))
  const updateContenido = (value: string) => setNewTask((prevState) => ({ ...prevState, contenido: value }))
  const updateLunes = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_lun: value ? 1 : 0 }))
  const updateMartes = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_mar: value ? 1 : 0 }))
  const updateMiercoles = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_mie: value ? 1 : 0 }))
  const updateJueves = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_jue: value ? 1 : 0 }))
  const updateViernes = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_vie: value ? 1 : 0 }))
  const updateSabado = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_sab: value ? 1 : 0 }))
  const updateDomingo = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_dom: value ? 1 : 0 }))
  const updateHoraInicio = (value: string) => setNewTask((prevState) => ({ ...prevState, hora_vinicio: value }))
  const updateHoraFin = (value: string) => setNewTask((prevState) => ({ ...prevState, hora_vfin: value }))
  const updateEliminarData = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_eliminar_cont: value ? 1 : 0 }))
  const updateDependeDeOtraTarea = (value: boolean) => setNewTask((prevState) => ({ ...prevState, bks_depend: value ? "1" : "0" }))
  const updateEspecificarDetalle = (value: string) => setNewTask((prevState) => ({ ...prevState, detalle_dependencia: value }))
  const updateTamañoARespaldar = (value: string) => setNewTask((prevState) => ({ ...prevState, bks_tamdat: value }))
  const updateHerramienta = (value: string) => setNewTask((prevState) => ({ ...prevState, herramienta: value }))
  const updateCellmanager = (value: string) => setNewTask((prevState) => ({ ...prevState, cell_manager: value }))
  const updateHoraEstimado = (value: string) => setNewTask((prevState) => ({ ...prevState, hora_estimado: value }))
  const updateMinutoEstimado = (value: string) => setNewTask((prevState) => ({ ...prevState, minuto_estimado: value }))
  const updateAclaracion = (value: string) => setNewTask((prevState) => ({ ...prevState, aclaracion: value }))

  //Metodos para modificar, eliminar y agregar en la lista de Horas
  const updateModificarHora = (id_row_hora: string, value: string) => {
    const newListHora = newTask.lista_hora?.map((horaItem: ICreateHours) => {
      if (horaItem.idRow === id_row_hora) {
        return { ...horaItem, descripcion: value }
      }
      return horaItem
    })
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_hora: newListHora }
    })
  }
  const updateEliminarHora = (selectedRows: IDataTableRowsHours[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const newListHora = newTask.lista_hora?.filter((horaItem: ICreateHours) => {
      if (onlyIdRows.includes(horaItem.idRow)) {
        return false
      }
      return true
    })
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_hora: newListHora }
    })
  }
  const updateAgregarHora = (newHora: ICreateHours) => {
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_hora: [...prevState.lista_hora, newHora] }
    })
  }

  //Metodos para Agregar y Eliminar en la lista de Servidores - CI
  const updateAgregarServidor = (newServer: ICreateServers) => {
    let idxServer = newTask.lista_server?.findIndex((server: ICreateServers) => server.nombreci === newServer.nombreci)
    //Se verifica si el servidor ya existe en la lista - no se puede agregar dos veces el mismo CI
    if (idxServer === -1) {
      setNewTask((prevState: ICreateTask) => {
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

    const newServers = newTask.lista_server.filter((server: ICreateServers) => {
      if (onlyIdRows.includes(server.idRow)) {
        return false
      }
      return true
    });
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_server: newServers }
    })
    //Adicionalmente Eliminar sus rutas asociadas de la tabla lista_rutas
    const newRoutes = newTask.lista_ruta?.filter((ruta: ICreateRoutes) => {
      if (onlyIdCis.includes(ruta.id_equipo)) {
        return false
      }
      return true
    });
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_ruta: newRoutes }
    })
  }

  //Metodos para Agregar, Modificar y Eliminar en la lista de Rutas 
  const updateAgregarRuta = (newRoute: ICreateRoutes) => {
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_ruta: [...prevState.lista_ruta, newRoute] }
    })
  }
  const updateEliminarRuta = (selectedRows: IDataTableRowsRoutes[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const newRoutes = newTask.lista_ruta?.filter((route: ICreateRoutes) => {
      if (onlyIdRows.includes(route.idRow)) {
        return false
      }
      return true
    });
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_ruta: newRoutes }
    })
  }

  const updateModificarRuta = (id_row_ruta: string, propertyToModify: any) => {
    const newListRoutes = newTask.lista_ruta?.map((route: ICreateRoutes) => {
      if (route.idRow === id_row_ruta) {
        return { ...route, ...propertyToModify }
      }
      return route
    })
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_ruta: newListRoutes }
    })
  }

  //Metodos par agregar y eliminar frecuencias
  const updateEliminarFrecuenciaProteccion = (selectedRows: IDataTableRowsFrecuencyProtection[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const newListFrecuencyProtection = newTask.lista_proteccion_frecuencia?.filter((frecProt: ICreateFrecuencyProtection) => {
      if (onlyIdRows.includes(frecProt.idRow)) {
        return false
      }
      return true
    })
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_proteccion_frecuencia: newListFrecuencyProtection }
    })
  }
  const updateAgregarFrecuenciaProteccion = (frecuency_protection: ICreateFrecuencyProtection) => {
    setNewTask((prevState: ICreateTask) => {
      return { ...prevState, lista_proteccion_frecuencia: [...prevState.lista_proteccion_frecuencia, frecuency_protection] }
    })
  }

  const createTask = useCallback(async (canCreateCorrelative: string, Task: ICreateTask) => {
    setLoadingTask(true)
    //Se quita la propiedad idRow que fue usada nivelFront para su envio en la peticion
    const serversWithOutIdRow: ICreateServers[] = Task.lista_server.map(({ idRow, ...rest }) => rest)
    const routesWithOutIdRow: ICreateRoutes[] = Task.lista_ruta.map(({ idRow, ...rest }) => rest)
    const hoursWithOutIdRow: ICreateHours[] = Task.lista_hora.map(({ idRow, ...rest }) => rest)
    const frecuencyProtectionWithOutIdRow: ICreateFrecuencyProtection[] = Task.lista_proteccion_frecuencia.map(({ idRow, ...rest }) => rest)
    const newTask: ICreateTask = {
      ...Task,
      lista_server: serversWithOutIdRow,
      lista_ruta: routesWithOutIdRow,
      lista_hora: hoursWithOutIdRow,
      lista_proteccion_frecuencia: frecuencyProtectionWithOutIdRow,
      id_solicitud: modalInformation.id_solicitud,
      usuario: user.usuario
    }
    try {
      console.log(newTask)
      const response = /* { data: { status: "Correcto", mensaje: "lala" } } */await BackupService.createTask(canCreateCorrelative, newTask)
      if (response.data.status === "Correcto") {
        toast.success("La Tarea ha sido Agredada Correctamente.", {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingTask(false)
        //Se esconde el modal de correlativo
        setShowCorrelative(false)
        //Se reinicia los valores del estado de nueva tarea
        setNewTask(initialTaskCreate)
        //Se cambia la vista de detalle de una tarea a detalle de la solicitud
        setIsVisible(false)
        //Una vez se agrega la tarea se actualiza la informacion de la solicitud y su lista de tareas del modal
        fetchListOfTasks(newTask.id_solicitud).then((data: ITask[]) => {
          refreshTask(data)
        })
      } else if (response.data.status === "Repetido") {
        toast.warn(`${response.data.mensaje}`, {
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
    loadingTask, showModalCorrelative, setShowCorrelative, createTask, updateTipoTarea, updateTipoBackup, updateProteccion
    , updateFrecuencia, updateModo, updateContenido, updateLunes, updateMartes, updateMiercoles, updateJueves, updateViernes,
    updateSabado, updateDomingo, updateHoraInicio, updateHoraFin, updateEliminarData, updateDependeDeOtraTarea, updateTamañoARespaldar
    , updateHerramienta, updateCellmanager, updateHoraEstimado, updateMinutoEstimado, updateAclaracion, updateEspecificarDetalle, newTask,
    updateModificarHora, updateEliminarHora, updateAgregarHora, updateAgregarServidor, updateEliminarServidor, updateAgregarRuta, updateEliminarRuta,
    updateModificarRuta, updateAgregarFrecuenciaProteccion, updateEliminarFrecuenciaProteccion
  }
}
export { useTask }