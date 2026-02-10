import { useCallback, useState } from "react"
import { BackupService } from "../../../services/Backup.service"
import { IComboData } from "../components/politicas/Types"

const useComboData = () => {
  const [tipoTareaData, setTipoTarea] = useState<Array<IComboData>>([])
  const [tipoBackupData, setTipoBackup] = useState<Array<IComboData>>([])
  const [ProteccionData, setTipoProteccion] = useState<Array<IComboData>>([])
  const [FrecuenciaData, setTipoFrecuencia] = useState<Array<IComboData>>([])
  const [ModoData, setTipoData] = useState<Array<IComboData>>([])
  const [DatoARespaldarData, setTipoDatoARespaldar] = useState<Array<IComboData>>([])
  const [HerramientaData, setTipoHerramienta] = useState<Array<IComboData>>([])
  const [cellManagerData, setTipoCellmanager] = useState<Array<IComboData>>([])
  const [medioData, setmedioData] = useState<Array<IComboData>>([])
  const [areasData, setAreasData] = useState<Array<IComboData>>([])
  const [userByAreaData, setUsersByArea] = useState<Array<IComboData>>([])

  const fetchBackupTipoTarea = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_tipo_tarea",
        filtro: ""
      })
      setTipoTarea(response.lista)
    } catch (error) {
      setTipoTarea([])
    }
  }, [])

  const fetchBackupTipo = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_tipo",
        filtro:""
      })
      setTipoBackup(response.lista)
    } catch (error) {
      setTipoBackup([])
    }
  }, [])

  const fetchBackupProteccion = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_proteccion",
        filtro:""
      })
      setTipoProteccion(response.lista)
    } catch (error) {
      setTipoProteccion([])
    }
  }, [])

  const fetchBackupFrecuencia = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_frecuencia",
        filtro:""
      })
      setTipoFrecuencia(response.lista)
    } catch (error) {
      setTipoFrecuencia([])
    }
  }, [])

  const fetchBackupModo = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_modo",
        filtro:""
      })
      setTipoData(response.lista)
    } catch (error) {
      setTipoData([])
    }
  }, [])

  const fetchBackupTipoDatoARespaldar = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_contenido",
        filtro:""
      })
      setTipoDatoARespaldar(response.lista)
    } catch (error) {
      setTipoDatoARespaldar([])
    }
  }, [])

  const fetchBackupHerramienta = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_herramienta",
        filtro:""
      })
      setTipoHerramienta(response.lista)
    } catch (error) {
      setTipoHerramienta([])
    }
  }, [])

  const fetchBackupCellManager = useCallback(async function (herramienta: string = "") {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_cellmanager",
        filtro: herramienta
      })
      setTipoCellmanager(response.lista)
    } catch (error) {
      setTipoCellmanager([])
    }
  }, [])

  const fetchMedioData = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "backup_medio",
        filtro:""
      })
      setmedioData(response.lista)
    } catch (error) {
      setmedioData([])
    }
  }, [])

  const fetchAreas = useCallback(async function () {
    try {
      const response = await BackupService.getDataFilter({
        tabla: "area",
        filtro:"backup"
      })
      setAreasData(response.lista)
    } catch (error) {
      setAreasData([])
    }
  }, [])

  const fetchUserByAreas = useCallback(async function (areaToSearch:string) {
    const idx = areasData?.findIndex((area)=> area.nombre === areaToSearch)
    try {
      const response = await BackupService.getDataFilter({
        tabla: "usuario",
        filtro: areasData[idx]?.codigo.toString()
      })
      setUsersByArea(response.lista)
    } catch (error) {
      setUsersByArea([])
    }
  }, [areasData])

  return { tipoTareaData, fetchBackupTipoTarea,tipoBackupData,fetchBackupTipo,ProteccionData,fetchBackupProteccion,FrecuenciaData,
            fetchBackupFrecuencia, ModoData, fetchBackupModo, DatoARespaldarData, fetchBackupTipoDatoARespaldar, HerramientaData,
            fetchBackupHerramienta,cellManagerData,fetchBackupCellManager, medioData, fetchMedioData, areasData, fetchAreas,
            userByAreaData, fetchUserByAreas
          }
}
export { useComboData }