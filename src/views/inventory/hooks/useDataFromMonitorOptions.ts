import { useCallback, useState } from "react"
import { InventoryService } from "../../../services/Inventory.service"
import { IComboData } from "../../../helpers/Types";
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { dataToUpperCaseInIComboData } from "../../../helpers/general";
import { IuseDataFromMonitorOptions } from "../Types";

const useDataFromMonitorOptions = (): IuseDataFromMonitorOptions => {

  //Estado para la request solicitar las familias de los CIS
  const [familyData, setFamily] = useState<Array<IComboData>>([])
  const [familyLoading, setFamilyLoading] = useState(false)
  const [claseData, setClase] = useState<Array<IComboData>>([])
  const [claseLoading, setClaseLoading] = useState(false)
  const [typeAttributes, setTypesAttributes] = useState<Array<IComboData>>([])
  const [typeAttLoading, setTypeAttLoading] = useState(false)
  const [typeData, setTypeData] = useState<Array<IComboData>>([])
  const [typeDataLoading, setTypeDataLoading] = useState(false)
  const [ubications, setUbications] = useState<Array<IComboData>>([])
  const [loadingUbications, setLoadingUbications] = useState(false)
  const [vcenters, setVcenters] = useState<Array<IComboData>>([])
  const [loadingVcenters, setLoadingVcenters] = useState(false)
  const [statesCI, setStatesCI] = useState<Array<IComboData>>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [environments, setEnvironments] = useState<Array<IComboData>>([])
  const [loadingEnvironments, setLoadingEnvironments] = useState(false)
  const [roleUses, setRoleUses] = useState<Array<IComboData>>([])
  const [loadingRoleUses, setLoadingRoleUses] = useState(false)
  const [priorities, setPriorities] = useState<Array<IComboData>>([])
  const [loadingPriorities, setLoadingPriorities] = useState(false)
  const [typeServices, setTypesServices] = useState<Array<IComboData>>([])
  const [loadingTypeServices, setTypeServices] = useState(false)
  const [typesCI, setTypesCI] = useState<Array<IComboData>>([])
  const [loadingTypesCI, setLoadingTypesCI] = useState(false)
  const [towersAdministrators, setTowersAdministrators] = useState<Array<IComboData>>([])
  const [loadingTowerAdministrator, setLoadingTowerAdministrator] = useState(false)
  const [scopesType, setScopesTypes] = useState<Array<IComboData>>([])
  const [loadingScopeTypes, setLoadingScopesType] = useState(false)
  const [administrators, setAdministrator] = useState<Array<IComboData>>([])
  const [loadingAdministrators, setLoadingAdministrators] = useState(false)
  const [IPtypes, setIPtypes] = useState<Array<IComboData>>([])
  const [loadingTypesIP, setLoadingTypesIP] = useState(false)
  const [adminsCloudMonitoring, setAdminsCloudMonitoring] = useState<Array<IComboData>>([])
  const [loadingAdminsCloudMonitoring, setLoadingAdminsCloudMonitoring] = useState(false)

  const getFamilia = useCallback(async function () {
    setFamilyLoading(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "familia",
        filtro: "",
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setFamily(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setFamily([])
    } finally {
      setFamilyLoading(false)
    }
  }, [])

  const getClase = useCallback(async function (family: string = "") {
    setClaseLoading(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "clase",
        filtro: family
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setClase(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setClase([])
    } finally {
      setClaseLoading(false)
    }
  }, [])

  const getTypesAttributes = useCallback(async function () {
    setTypeAttLoading(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "tipo_atributo",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setTypesAttributes(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setTypesAttributes([])
    } finally {
      setTypeAttLoading(false)
    }
  }, [])

  const getTypesData = useCallback(async function () {
    setTypeDataLoading(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "tipo_dato_simple",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setTypeData(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setTypeData([])
    } finally {
      setTypeDataLoading(false)
    }
  }, [])


  const getUbications = useCallback(async function () {
    setLoadingUbications(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "ubicacion",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setUbications(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setUbications([])
    } finally {
      setLoadingUbications(false)
    }
  }, [])

  const getVcenters = useCallback(async function () {
    setLoadingVcenters(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "vcenter",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setVcenters(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setVcenters([])
    } finally {
      setLoadingVcenters(false)
    }
  }, [])

  const getStatesCI = useCallback(async function () {
    setLoadingStates(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "estado_equipo",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setStatesCI(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setTypeData([])
    } finally {
      setLoadingStates(false)
    }
  }, [])

  const getEnviroments = useCallback(async function () {
    setLoadingEnvironments(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "ambiente",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setEnvironments(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setEnvironments([])
    } finally {
      setLoadingEnvironments(false)
    }
  }, [])

  const getRoleUses = useCallback(async function () {
    setLoadingRoleUses(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "rol_uso",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setRoleUses(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setRoleUses([])
    } finally {
      setLoadingRoleUses(false)
    }
  }, [])

  const getPriorities = useCallback(async function () {
    setLoadingPriorities(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "prioridad",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setPriorities(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setPriorities([])
    } finally {
      setLoadingPriorities(false)
    }
  }, [])


  const getTypesServices = useCallback(async function () {
    setTypeServices(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "tipo_servicio",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setTypesServices(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setTypesServices([])
    } finally {
      setTypeServices(false)
    }
  }, [])


  const getTypesCI = useCallback(async function () {
    setLoadingTypesCI(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "tipo_equipo",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setTypesCI(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setTypesCI([])
    } finally {
      setLoadingTypesCI(false)
    }
  }, [])


  const getTowersAdministrators = useCallback(async function () {
    setLoadingTowerAdministrator(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "admin_torre",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setTowersAdministrators(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setTowersAdministrators([])
    } finally {
      setLoadingTowerAdministrator(false)
    }
  }, [])


  const getScopesTypes = useCallback(async function (tower_administrator: string) {
    setLoadingScopesType(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "tipo_alcance",
        filtro: tower_administrator
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setScopesTypes(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setScopesTypes([])
    } finally {
      setLoadingScopesType(false)
    }
  }, [])

  const getAdministrators = useCallback(async function () {
    setLoadingAdministrators(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "administrado_por",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setAdministrator(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setAdministrator([])
    } finally {
      setLoadingAdministrators(false)
    }
  }, [])

  const getTypesIP = useCallback(async function () {
    setLoadingTypesIP(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "tipo_ip",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setIPtypes(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setIPtypes([])
    } finally {
      setLoadingTypesIP(false)
    }
  }, [])

    const getAdminsCloudMonitoring = useCallback(async function () {
    setLoadingAdminsCloudMonitoring(true)
    try {
      const response = await InventoryService.getDataFromMonitorOptions({
        tabla: "monitoreo_nube",
        filtro: ""
      })
      if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
        setAdminsCloudMonitoring(dataToUpperCaseInIComboData(response.data.lista))
      }
    } catch (e) {
      handleAxiosError(e)
      setAdminsCloudMonitoring([])
    } finally {
      setLoadingAdminsCloudMonitoring(false)
    }
  }, [])

  return {
    getFamilia, familyData, familyLoading,
    getClase, claseData, claseLoading,
    getTypesAttributes, typeAttributes, typeAttLoading,
    getTypesData, typeData, typeDataLoading,
    getUbications, ubications, loadingUbications,
    getVcenters, vcenters, loadingVcenters,
    getStatesCI, statesCI, loadingStates,
    getEnviroments, environments, loadingEnvironments,
    getRoleUses, roleUses, loadingRoleUses,
    getPriorities, priorities, loadingPriorities,
    getTypesServices, typeServices, loadingTypeServices,
    getTypesCI, typesCI, loadingTypesCI,
    getTowersAdministrators, towersAdministrators, loadingTowerAdministrator,
    getScopesTypes, scopesType, loadingScopeTypes,
    getAdministrators, administrators, loadingAdministrators,
    getTypesIP, IPtypes, loadingTypesIP,
    getAdminsCloudMonitoring, loadingAdminsCloudMonitoring, adminsCloudMonitoring
  }
}
export { useDataFromMonitorOptions }