import { useCallback, useState } from "react"
import { MonitoringService } from "../../../../services/Monitoring.service"
import { toast } from "react-toastify"

const useExport = () => {

    const [loading, setLoading] = useState(false)

    const exportVersion = useCallback(async function (idPolicy: number, idVersion: number) {
        try {
            setLoading(true)
            const response = await MonitoringService.exportPolicyV2(idPolicy, idVersion)
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a');
            link.href = url;
            let today = new Date();
            let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);;
            let time = today.getHours() + "" + today.getMinutes();
            let filename = date + '_' + time + "-politica.xls";
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("¡Exportación realizada con éxito!", { position: toast.POSITION.TOP_RIGHT }) // <-- Mensaje visual
            setLoading(false)
            return true
        } catch (error) {
            setLoading(false)
            toast.error("Ops.. Al parecer ocurrió un problema al extraer el archivo", { position: toast.POSITION.TOP_RIGHT })
            return false
        }
    }, [])

    const exportPolicyMassive = useCallback(async (idPolicy: number, metricas: { id_detalle_politica: number }[]) => {
        setLoading(true)
        try {
            const response = await MonitoringService.exportPolicyMassive(idPolicy, { equipos: metricas })
            const contentType = response.headers?.['content-type'];
            if (contentType && contentType.includes('application/json')) {
                // Si es JSON, probablemente es un error
                const arrayBuffer = response.data
                const uint8Array = new Uint8Array(arrayBuffer)
                const textDecoder = new TextDecoder('utf-8')
                const jsonString = textDecoder.decode(uint8Array)
                const json_response = JSON.parse(jsonString)
                toast.error(json_response.mensaje || "Ocurrió un error al exportar la política.", { position: toast.POSITION.TOP_RIGHT })
                return false
            } else {
                // Si es Excel, descarga el archivo
                const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
                const link = document.createElement('a');
                let today = new Date();
                let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
                let time = today.getHours() + "" + today.getMinutes();
                let filename = date + '_' + time + "-politica-masiva.xls";
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("¡Exportación realizada con éxito!", { position: toast.POSITION.TOP_RIGHT }) // <-- Mensaje visual
                return true
            }
        } catch (error) {
            toast.error("Ops.. Al parecer ocurrió un problema al extraer el archivo", { position: toast.POSITION.TOP_RIGHT })
            return false
        } finally {
            setLoading(false)
        }
    }, [])

    return { exportPolicyMassive, exportVersion, loading }
}

export { useExport }