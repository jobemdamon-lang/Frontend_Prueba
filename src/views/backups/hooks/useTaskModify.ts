import { useCallback, useContext, useState } from "react"
import { BackupService } from "../../../services/Backup.service"
import { ICreateFrecuencyProtection, ICreateHours, ICreateRoutes, ICreateServers, IDataTableRowsFrecuencyProtection, IDataTableRowsHours, IDataTableRowsRoutes, IDataTableRowsServers, IModifyTask, ITask } from "../components/politicas/Types"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../store/ConfigStore"
import { useRequestTasks } from "./useRequestTasks"
import { Context } from "../components/politicas/Context"
import { initialTaskCreate } from "./initialTask"
import { toast } from "react-toastify"
import { IAuthState } from "../../../store/auth/Types"

const useTaskModify = (setIsVisibility: any) => {

  //Estado para el estado de carga de una tarea
  const [loadingTask, setLoadingTask] = useState(false)
  const [showModalCorrelative, setShowCorrelative] = useState(false)
  const { refreshTask, modalInformation } = useContext(Context)
  const { fetchListOfTasks } = useRequestTasks()
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState

  //Estado para la actualizacion de una tarea
  const [modifiedTask, setTaskToModified] = useState<IModifyTask>(initialTaskCreate)

  //Funciones para actualizar cada input de la tarea 
  const updateNombreTarea = (value: string) => setTaskToModified((prevState) => ({ ...prevState, nombre_tarea: value }))
  const updateTipoTarea = (value: string) => setTaskToModified((prevState) => ({ ...prevState, tipo_tarea: value }))
  const updateTipoBackup = (value: string) => setTaskToModified((prevState) => ({ ...prevState, tipo_backup: value }))
  const updateProteccion = (value: string) => setTaskToModified((prevState) => ({ ...prevState, proteccion: value }))
  const updateFrecuencia = (value: string) => setTaskToModified((prevState) => ({ ...prevState, frecuencia: value }))
  const updateModo = (value: string) => setTaskToModified((prevState) => ({ ...prevState, modo: value }))
  const updateContenido = (value: string) => setTaskToModified((prevState) => ({ ...prevState, contenido: value }))
  const updateLunes = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_lun: value ? 1 : 0 }))
  const updateMartes = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_mar: value ? 1 : 0 }))
  const updateMiercoles = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_mie: value ? 1 : 0 }))
  const updateJueves = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_jue: value ? 1 : 0 }))
  const updateViernes = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_vie: value ? 1 : 0 }))
  const updateSabado = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_sab: value ? 1 : 0 }))
  const updateDomingo = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_dom: value ? 1 : 0 }))
  const updateHoraInicio = (value: string) => setTaskToModified((prevState) => ({ ...prevState, hora_vinicio: value }))
  const updateHoraFin = (value: string) => setTaskToModified((prevState) => ({ ...prevState, hora_vfin: value }))
  const updateEliminarData = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_eliminar_cont: value ? 1 : 0 }))
  const updateDependeDeOtraTarea = (value: boolean) => setTaskToModified((prevState) => ({ ...prevState, bks_depend: value ? "1" : "0" }))
  const updateEspecificarDetalle = (value: string) => setTaskToModified((prevState) => ({ ...prevState, detalle_dependencia: value }))
  const updateTamañoARespaldar = (value: string) => setTaskToModified((prevState) => ({ ...prevState, bks_tamdat: value }))
  const updateHerramienta = (value: string) => setTaskToModified((prevState) => ({ ...prevState, herramienta: value }))
  const updateCellmanager = (value: string) => setTaskToModified((prevState) => ({ ...prevState, cell_manager: value }))
  const updateHoraEstimado = (value: string) => setTaskToModified((prevState) => ({ ...prevState, hora_estimado: value }))
  const updateMinutoEstimado = (value: string) => setTaskToModified((prevState) => ({ ...prevState, minuto_estimado: value }))
  const updateAclaracion = (value: string) => setTaskToModified((prevState) => ({ ...prevState, aclaracion: value }))
  const updateMedio = (value: string) => setTaskToModified((prevState) => ({ ...prevState, medio: value }))
  const updateComentario = (value: string) => setTaskToModified((prevState) => ({ ...prevState, comentario: value }))

  //Metodos para modificar la lista de Horas
  const updateModificarHora = (id_row_hora: string, value: string) => {
    const newListHora = modifiedTask?.lista_hora?.map((horaItem: ICreateHours) => {
      if (horaItem.idRow === id_row_hora) {
        return { ...horaItem, descripcion: value }
      }
      return horaItem
    })
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_hora: newListHora }
    })
  }
  const updateEliminarHora = (selectedRows: IDataTableRowsHours[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    //A todos los elementos que quieres eliminar se les asigna el estado = 0 ya sea que existan en la bd o no
    const listHoraWithStateCero: ICreateHours[] = modifiedTask?.lista_hora?.map((horaItem: ICreateHours) => {
      if (onlyIdRows.includes(horaItem.idRow)) {
        return {
          ...horaItem,
          estado: 0
        }
      }
      return horaItem
    })
    /*A todos los elementos que quieres eliminar y no existen la base de datos se les elimina del state-react para no enviarlos,
     los que si existen ya en la db (tienen ya un id asignado), se permanece en el estado pero con el estado 0 cambiado previamente,
     esto debido a que nivel back se requiere saber que horas han sido eliminadas.
      NOTA: A nivel de Front se mostraran los elementos con estado !== 0 */
    const NewlistHora = listHoraWithStateCero.filter((horaItem: ICreateHours) => {
      if (onlyIdRows.includes(horaItem.idRow) && horaItem.id_soli_hora === 0) {
        return false
      } else {
        return true
      }
    })
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_hora: NewlistHora }
    })
  }
  const updateAgregarHora = (newHora: ICreateHours) => {
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_hora: [...prevState.lista_hora, newHora] }
    })
  }

  //Metodos para modificar la lista de Servidores
  const updateAgregarServidor = (newServer: ICreateServers) => {
    let idxServer = modifiedTask?.lista_server?.findIndex((server: ICreateServers) => server.nombreci === newServer.nombreci)
    //Si el elemento no existe en la lista se añade
    if (idxServer === -1) {
      setTaskToModified((prevState: any) => {
        return {
          ...prevState, lista_server: [...prevState.lista_server, {
            ...newServer,
            isCreatedInFront: true
          }]
        }
      })
      //Si el elemento existe en la lista pero esta en estado = 0 (para ser eliminado) se vuelve a reasignar a 1
    } else {
      if (newServer.estado === 0) {
        setTaskToModified((prevState: any) => {
          return {
            ...prevState, lista_server: [...prevState.lista_server, {
              ...newServer,
              estado: 1
            }]
          }
        })
      } else {
        toast.warn("No se puede añadir el mismo CI.", {
          position: toast.POSITION.TOP_RIGHT
        })
      }

    }
  }

  //Cuando eliminas un servidor tambien se elimina su ruta-servidor asociada en lista rutas
  const updateEliminarServidor = (selectedRows: IDataTableRowsServers[]) => {

    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    const onlyIdCis: number[] = selectedRows.map(({ id_equipo, ...row }) => id_equipo)

    //A todos los elementos que quieres eliminar se les asigna el estado = 0 ya sea que existan en la bd o no
    const serversWithStateCero: ICreateServers[] = modifiedTask?.lista_server?.map((server: ICreateServers) => {
      if (onlyIdRows.includes(server.idRow)) {
        return {
          ...server,
          estado: 0
        }
      }
      return server
    });
    /*Lista servidores no utiliza el id_soli_... para identificar si el elemento existe en la db (no posee ese atributo)
      se ha asignado un atributo exta isCreatedInFront para su identificación
      Los elementos que se quiere eliminar y no estan en la db de eliminan y los que no permanecen en state con estado 0 
      cambiado previamente. NOTA A nivel de Front se mostraran los elementos con estado !== 0*/
    const newListServers: ICreateServers[] = serversWithStateCero.filter((server: ICreateServers) => {
      if (onlyIdRows.includes(server.idRow) && server?.isCreatedInFront === true) {
        return false
      } else {
        return true
      }
    })
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_server: newListServers }
    })

    //Adicionalmente Eliminar sus rutas asociadas
    const routesWithStateCero: ICreateRoutes[] = modifiedTask?.lista_ruta?.map((ruta: ICreateRoutes) => {
      if (onlyIdCis.includes(ruta.id_equipo)) {
        return {
          ...ruta,
          estado: 0
        }
      }
      return ruta
    });
    const newListRoutes = routesWithStateCero.filter((ruta: ICreateRoutes) => {
      if (onlyIdCis.includes(ruta.id_equipo) && ruta.id_soli_ruta === 0) {
        return false
      } else {
        return true
      }
    })

    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_ruta: newListRoutes }
    })
  }

  //Metodos para modificar la lista de Rutas
  const updateAgregarRuta = (newRoute: ICreateRoutes) => {
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_ruta: [...prevState.lista_ruta, newRoute] }
    })
  }

  const updateEliminarRuta = (selectedRows: IDataTableRowsRoutes[]) => {

    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    //A todos los elementos que quieres eliminar se les asigna el estado = 0 ya sea que existan en la bd o no
    const routesWithStatusCero: ICreateRoutes[] = modifiedTask?.lista_ruta?.map((route: ICreateRoutes) => {
      if (onlyIdRows.includes(route.idRow)) {
        return {
          ...route,
          estado: 0
        }
      } else {
        return route
      }
    });
    /*A todos los elementos que quieres eliminar y no existen en la base de datos se les elimina del state-react para no enviarlos,
     los que si existen ya en la db (tienen ya un id asignado), se permanece en el estado pero con el estado 0 cambiado previamente
      esto debido a que nivel back se requiere saber que rutas han sido eliminadas. 
      NOTA: A nivel de Front se mostraran los elementos con estado !== 0 )*/
    const newListRoutes: ICreateRoutes[] = routesWithStatusCero.filter((route: ICreateRoutes) => {
      if (onlyIdRows.includes(route.idRow) && route.id_soli_ruta === 0) {
        return false
      } else {
        return true
      }
    })
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_ruta: newListRoutes }
    })
  }

  const updateModificarRuta = (idRoute: string, propertyToModify: any) => {
    const newListRoutes = modifiedTask?.lista_ruta?.map((route: ICreateRoutes) => {
      if (route.idRow === idRoute) {
        return { ...route, ...propertyToModify }
      }
      return route
    })
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_ruta: newListRoutes }
    })
  }

  // Eliminar y Agregar Lista Frecuencia Proteccion
  const updateEliminarFrecuenciaProteccion = (selectedRows: IDataTableRowsFrecuencyProtection[]) => {
    const onlyIdRows: (string | undefined)[] = selectedRows.map(({ idRow, ...row }) => idRow)
    //A todos los elementos que quieres eliminar se les asigna el estado = 0 ya sea que existan en la bd o no
    const listFrecuencyProtectionWithStateCero: ICreateFrecuencyProtection[] = modifiedTask?.lista_proteccion_frecuencia?.map((freqProt: ICreateFrecuencyProtection) => {
      if (onlyIdRows.includes(freqProt.idRow)) {
        return {
          ...freqProt,
          estado: 0
        }
      }
      return freqProt
    })
    /*A todos los elementos que quieres eliminar y no existen la base de datos se les elimina del state-react para no enviarlos,
     los que si existen ya en la db (tienen ya un id asignado), se permanece en el estado pero con el estado 0 cambiado previamente,
     esto debido a que nivel back se requiere saber que horas han sido eliminadas.
      NOTA: A nivel de Front se mostraran los elementos con estado !== 0 */
    const NewlistFrecuencyProtection = listFrecuencyProtectionWithStateCero.filter((freqProt: ICreateFrecuencyProtection) => {
      if (onlyIdRows.includes(freqProt.idRow) && freqProt.id_soli_tarea_pf === 0) {
        return false
      } else {
        return true
      }
    })
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_proteccion_frecuencia: NewlistFrecuencyProtection }
    })
  }
  const updateAgregarFrecuenciaProteccion = (frecuency_protection: ICreateFrecuencyProtection) => {
    setTaskToModified((prevState: any) => {
      return { ...prevState, lista_proteccion_frecuencia: [...prevState.lista_proteccion_frecuencia, frecuency_protection] }
    })
  }


  const modifyTask = useCallback(async (canCreateCorrelative: string, Task: IModifyTask) => {
    setLoadingTask(true)
    //Se quita la propiedad idRow que fue usada nivelFront para su envio en la peticion
    const serversWithOutIdRow: ICreateServers[] = Task?.lista_server?.map(({ idRow, isCreatedInFront, ...rest }) => rest)
    const routesWithOutIdRow: ICreateRoutes[] = Task?.lista_ruta?.map(({ idRow, ...rest }) => rest)
    const hoursWithOutIdRow: ICreateHours[] = Task?.lista_hora?.map(({ idRow, ...rest }) => rest)
    const frecuencyProtectionWithOutIdRow: ICreateFrecuencyProtection[] = Task?.lista_proteccion_frecuencia?.map(({ idRow, ...rest }) => rest)
    const modifiedTaskToSend: IModifyTask = {
      ...Task,
      usuario: user.usuario,
      id_solicitud: modalInformation.id_solicitud,
      bks_depend: Task?.bks_depend.toString(),
      bk_lib_id: Task?.bk_lib_id?.toString(),
      lista_server: serversWithOutIdRow,
      lista_ruta: routesWithOutIdRow,
      lista_hora: hoursWithOutIdRow,
      lista_proteccion_frecuencia: frecuencyProtectionWithOutIdRow
    }
    try {
      console.log(modifiedTaskToSend)
      const response = /* { data: { status: "Correcto", mensaje: "lala" } } */await BackupService.createTask(canCreateCorrelative, modifiedTaskToSend)
      if (response.data.status === "Correcto") {
        toast.success("La tarea ha sido Modificada Correctamente.", {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingTask(false)
        //Se esconde el modal de correlativo
        setShowCorrelative(false)
        //Se cambia la vista de detalle de una tarea a detalle de la solicitud
        setIsVisibility(false)
        //Se llama al endpoint de lista de tareas de esa solicitud y se actualiza la tabla
        fetchListOfTasks(modifiedTaskToSend.id_solicitud).then((data: ITask[]) => {
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
        toast.error(`Ocurrio un Problema en la Modifiacion! ${response.data.mensaje}`, {
          position: toast.POSITION.TOP_RIGHT
        })
        setLoadingTask(false)
      }
    } catch (error: any) {
      toast.error(`Ocurrio un Problema en la Modificación! ${error}`, {
        position: toast.POSITION.TOP_RIGHT
      })
      setLoadingTask(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    loadingTask, modifyTask, updateTipoTarea, updateTipoBackup, updateProteccion
    , updateFrecuencia, updateModo, updateContenido, updateLunes, updateMartes, updateMiercoles, updateJueves, updateViernes,
    updateSabado, updateDomingo, updateHoraInicio, updateHoraFin, updateEliminarData, updateDependeDeOtraTarea, updateTamañoARespaldar
    , updateHerramienta, updateCellmanager, updateHoraEstimado, updateMinutoEstimado, updateAclaracion, updateEspecificarDetalle, modifiedTask, setTaskToModified,
    updateModificarHora, updateEliminarHora, updateAgregarHora, updateAgregarServidor, updateEliminarServidor, updateAgregarRuta,
    updateEliminarRuta, updateModificarRuta, showModalCorrelative, setShowCorrelative, updateMedio, updateComentario, updateAgregarFrecuenciaProteccion,
    updateEliminarFrecuenciaProteccion, updateNombreTarea
  }
}
export { useTaskModify }