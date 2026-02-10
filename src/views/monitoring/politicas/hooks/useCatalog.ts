import { useCallback, useState } from "react"
import { ICatalogModel, IListCatalog, IListClase, IListMetricsByCi } from "../Types"
import { MonitoringService } from "../../../../services/Monitoring.service"
import uniqid from "uniqid"

const useCatalog = () => {

  //Estado para el listado del Detalle del Catalogo - Informacion
  const [catalogDetailInformation, setCatalogDetail] = useState<Array<ICatalogModel>>([])
  const [catalogLoading, setCatalogLoading] = useState(false)
  //Estado para el get id detalle de politica
  const [listOfMetricsOfFamily, setListOfMetricsOfFamily] = useState([])
  const [loadingGetOptionalMetrics, setLoadingGetOptionalMetrics] = useState(false)
  //Estado para el get id detalle de politica
  const [listOfMetricsByFamily, setListOfMetricsByFamily] = useState<{ codigo: string, nombre: string }[]>([])
  //Estado para el get id detalle de politica
  const [tools, setTools] = useState([])

  const fetchListCatalog = useCallback(async function (id_project: string) {
    try {
      const response = await MonitoringService.getListCatalog(id_project)
      if (response.status === "Correcto") {
        const familiasConClasesConElementosEnListaCi = response.catalogo.filter((catalog: IListCatalog) => {
          // Filtramos las clases que tienen al menos un elemento en lista_ci:
          const clasesConElementosEnListaCi = catalog.lista_clase.filter((clase: IListClase) => clase.lista_ci.length > 0);
          // Devolvemos true si la longitud de clasesConElementosEnListaCi es mayor que 0, es decir, si hay al menos una clase con elementos en lista_ci.
          return clasesConElementosEnListaCi.length > 0;
        }).map((catalog: IListCatalog) => {
          // Mapeamos las familias a una nueva estructura que solo contenga las clases con elementos en lista_ci:
          const clasesConElementosEnListaCi = catalog.lista_clase.filter((clase: IListClase) => clase.lista_ci.length > 0);
          return { FAMILIA: catalog.FAMILIA, lista_clase: clasesConElementosEnListaCi };
        });
        return familiasConClasesConElementosEnListaCi
      } else {
        return []
      }
    } catch (error) {
      return []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListDetailCatalog = useCallback(async function (family: string, clase: string, typeServer: string) {
    setCatalogLoading(true)
    try {
      const response = await MonitoringService.getCatalogInformation(family, clase, typeServer)
      if (response.status === "Correcto") {
        setCatalogLoading(false)
        setCatalogDetail(response.lista)
      } else {
        setCatalogLoading(false)
        setCatalogDetail([])
      }
    } catch (error) {
      setCatalogLoading(false)
      setCatalogDetail([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListMetricsOfFamily = useCallback(async function (family: string, clase: string, typeServer: string) {
    setLoadingGetOptionalMetrics(true)
    try {
      const response = await MonitoringService.getListOfMetricsOptionals(family, clase, typeServer)
      if (response.status === "Correcto") {
        setListOfMetricsOfFamily(response.lista.map((metric: IListMetricsByCi) => ({ codigo: uniqid(), nombre: metric.METRICAS })))
        return true
      } else {
        setListOfMetricsOfFamily([])
        return false
      }
    } catch (error) {
      setListOfMetricsOfFamily([])
      return false
    } finally {
      setLoadingGetOptionalMetrics(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListMetricsByFamily = useCallback(async function (family: string) {
    try {
      const response = await MonitoringService.getListMetricsOfFamily(family)
      if (response.status === "Correcto") {
        setListOfMetricsByFamily(response.lista.map((metric: IListMetricsByCi) => ({ codigo: uniqid(), nombre: metric.METRICAS })))
      } else {
        setListOfMetricsByFamily([])
      }
    } catch (error) {
      setListOfMetricsByFamily([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getListToolsByFamilyClase = useCallback(async function (family: string, clase: string) {
    try {
      const response = await MonitoringService.listToolsByFamilyClase(family, clase)
      if (response.status === "Correcto") {
        setTools(response.lista)
      } else {
        setTools([])
      }
    } catch (error) {
      setTools([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    fetchListCatalog, getListDetailCatalog, catalogDetailInformation, catalogLoading, getListToolsByFamilyClase, tools,
    getListMetricsOfFamily, loadingGetOptionalMetrics, listOfMetricsOfFamily, getListMetricsByFamily, listOfMetricsByFamily
  }
}

export { useCatalog }