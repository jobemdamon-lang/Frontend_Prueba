import { useCallback, useState } from "react"
import { MonitoringService } from "../../../../services/Monitoring.service"

export interface ICIOfPolicyDetail {
    BAJA_EQUIPO: string,
    CLASE: string;
    DESCRIPCION: string;
    EQUIPO_ESTADO: string;
    FAMILIA: string;
    ID_EQUIPO: number;
    IP: string;
    NOMBRE: string;
    NOMBRE_CI: string;
    NOMBRE_VIRTUAL: string;
    HEERAMIENTA_MONITOREO: string | null;
    TIPO_EQUIPO: string
}

const useOldPolicy = () => {

    //Estado para el resumen del detalle de la politica
    const [listCIsOfPolicyVersion, setListCisOfPolicyVersion] = useState<ICIOfPolicyDetail[]>([])
    const [listCiLoading, setListCILoading] = useState(false)
    //Estado para la lista de metricas de una politica version
    const [metricsOfPolicyLoading, setMetricsOfPolicyLoading] = useState(false)

    const getListOfMetricsOfPolicy = useCallback(async function (idPolicy: string, nro_Version: string) {
        setMetricsOfPolicyLoading(true)
        try {
            const response = await MonitoringService.getMetricsOfPolicyVersion(idPolicy, nro_Version)
            if (response.status === "Correcto") {
                return response.lista
            } else {
                return []
            }
        } catch (error) {
            return []
        } finally {
            setMetricsOfPolicyLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getCisOfPolicyVersion = useCallback(async function (idPolicy: string, nro_Version: string) {
        setListCILoading(true)
        try {
            const response = await MonitoringService.getCIsOfPolicyVersion(idPolicy, nro_Version)
            if (response.status === "Correcto") {
                setListCisOfPolicyVersion(response.lista)
                setListCILoading(false)
            } else {
                setListCisOfPolicyVersion([])
                setListCILoading(false)
            }
        } catch (error) {
            setListCisOfPolicyVersion([])
            setListCILoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        getListOfMetricsOfPolicy, metricsOfPolicyLoading,
        getCisOfPolicyVersion, listCIsOfPolicyVersion, listCiLoading
    }
}

export { useOldPolicy }