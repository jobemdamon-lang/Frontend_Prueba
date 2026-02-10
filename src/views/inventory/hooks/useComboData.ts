import { useCallback, useState } from "react"
import { InventoryService } from "../../../services/Inventory.service"
import { IComboData } from "../../../helpers/Types"

const toUpperCase = (array: IComboData[]) => {
  const newData: IComboData[] = array.map((value: IComboData) => ({ ...value, nombre: value.nombre.toUpperCase() }))
  return newData
}

const useComboData = () => {
  const [ownerData, setOwner] = useState<Array<IComboData>>([])
  const [locationData, setLocation] = useState<Array<IComboData>>([])
  const [serviceTypeData, setServiceType] = useState<Array<IComboData>>([])
  const [roleData, setUseRole] = useState<Array<IComboData>>([])
  const [ambientData, setAmbient] = useState<Array<IComboData>>([])
  const [versionSWData, setVersionSW] = useState<Array<IComboData>>([])
  const [soData, setSO] = useState<Array<IComboData>>([])
  const [familyData, setFamily] = useState<Array<IComboData>>([])
  const [claseData, setClase] = useState<Array<IComboData>>([])
  const [brandData, setBrand] = useState<Array<IComboData>>([])
  const [modelData, setModel] = useState<Array<IComboData>>([])
  const [vcenterData, setVcenter] = useState<Array<IComboData>>([])
  const [cdiData, setCdi] = useState<Array<IComboData>>([])
  const [priorityData, setPriority] = useState<Array<IComboData>>([])
  const [adminTowerData, setAdminTower] = useState<Array<IComboData>>([])
  const [adminByData, setAdminBy] = useState<Array<IComboData>>([])
  const [tipoEquipoData, setTipoEquipo] = useState<Array<IComboData>>([])
  const [estadoEquipoData, setEstadoEquipo] = useState<Array<IComboData>>([])
  const [tipoAlcanceData, setTipoAlcance] = useState<Array<IComboData>>([])

  const fetchPropiedad = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "propiedad",
        filtro: ""
      })
      setOwner(toUpperCase(response.lista))
    } catch (error) {
      setOwner([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchUbicacion = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "ubicacion",
        filtro: ""
      })
      setLocation(toUpperCase(response.lista))
    } catch (error) {
      setLocation([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchUTipoServicio = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "tipo_servicio",
        filtro: ""
      })
      setServiceType(toUpperCase(response.lista))
    } catch (error) {
      setServiceType([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchRolUso = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "rol_uso",
        filtro: ""
      })
      setUseRole(toUpperCase(response.lista))
    } catch (error) {
      setUseRole([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchAmbiente = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "ambiente",
        filtro: ""
      })
      setAmbient(toUpperCase(response.lista))
    } catch (error) {
      setAmbient([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchSistemaOperativo = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "sistema_operativo",
        filtro: ""
      })
      setSO(toUpperCase(response.lista))
    } catch (error) {
      setSO([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchVersionSW = useCallback(async function (specificSO: string = "") {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "sistema_operativo",
        filtro: specificSO
      })
      setVersionSW(toUpperCase(response.lista))
    } catch (error) {
      setVersionSW([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchFamilia = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "familia",
        filtro: ""
      })
      setFamily(toUpperCase(response.lista))
    } catch (error) {
      setFamily([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchClase = useCallback(async function (family: string = "") {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "clase",
        filtro: family
      })
      setClase(toUpperCase(response.lista))
    } catch (error) {
      setClase([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchMarca = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "marca",
        filtro: ""
      })
      setBrand(toUpperCase(response.lista))
    } catch (error) {
      setBrand([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchModelo = useCallback(async function (brand: string = "") {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "modelo",
        filtro: brand
      })
      setModel(toUpperCase(response.lista))
    } catch (error) {
      setModel([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchVCenter = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "vcenter",
        filtro: ""
      })
      setVcenter(toUpperCase(response.lista))
    } catch (error) {
      setVcenter([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchCDI = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "cdi_inventario",
        filtro: ""
      })
      setCdi(toUpperCase(response.lista))
    } catch (error) {
      setCdi([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchPrioridad = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "prioridad",
        filtro: ""
      })
      setPriority(toUpperCase(response.lista))
    } catch (error) {
      setPriority([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchAdministrador = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "admin_torre",
        filtro: ""
      })
      setAdminTower(toUpperCase(response.lista))
    } catch (error) {
      setAdminTower([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchAdministradoPor = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "administrado_por",
        filtro: ""
      })
      setAdminBy(toUpperCase(response.lista))
    } catch (error) {
      setAdminBy([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchTipoEquipo = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "tipo_equipo",
        filtro: ""
      })
      setTipoEquipo(toUpperCase(response.lista))
    } catch (error) {
      setTipoEquipo([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchEstadoEquipo = useCallback(async function () {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "estado_equipo",
        filtro: ""
      })
      setEstadoEquipo(toUpperCase(response.lista))
    } catch (error) {
      setEstadoEquipo([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  const fetchTipoAlcance = useCallback(async function (tower_administrator: string) {
    try {
      const response = await InventoryService.getDataFilter({
        tabla: "tipo_alcance",
        filtro: tower_administrator
      })
      setTipoAlcance(toUpperCase(response.lista))
    } catch (error) {
      setTipoAlcance([{ codigo: 0, nombre: "Error loading data :(" }])
    }
  }, [])

  return {
    ownerData, fetchPropiedad, locationData, fetchUbicacion, serviceTypeData, fetchUTipoServicio, roleData,
    fetchRolUso, ambientData, fetchAmbiente, soData, fetchSistemaOperativo, versionSWData, fetchFamilia, familyData,
    fetchClase, claseData, fetchMarca, brandData, fetchModelo, modelData, fetchVCenter, vcenterData, fetchCDI, cdiData,
    fetchPrioridad, priorityData, fetchVersionSW, fetchAdministrador, adminTowerData, fetchAdministradoPor, adminByData,
    fetchTipoEquipo, tipoEquipoData, fetchEstadoEquipo, estadoEquipoData, fetchTipoAlcance, tipoAlcanceData
  }
}
export { useComboData }