import { useCallback, useState } from "react"
import { IncidentCenterService } from "../../../services/IncidentCenter.service"
import { IReopenIncident, IUseTicket, IncidentItem } from "../Types"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError"
import { errorNotification, successNotification } from "../../../helpers/notifications"

const useTicket = (): IUseTicket => {

    //Estado para el listado de los tickets de Remedy
    const [activeTicketsLoading, setLoadingActiveTickets] = useState(false)
    const [activeTickets, setActiveTickets] = useState<IncidentItem[]>([])

    //Estado para el metodo reabrir un ticket de incidencia
    const [reopenTicketLoading, setReopenTicketLoading] = useState(false)

    //Estado para el listado de los tickets de Remedy en estado Terminado
    const [finalizedTicketsLoading, setFinalizedTicketsLoading] = useState(false)
    const [finalizedTickets, setFinalizedTickets] = useState<IncidentItem[]>([])

    //Estado para listar las incidencias que requira atencion (P3,P4,P5 con seguimiento)
    const [observatedTicketLoading, setObservatedTicketLoading] = useState<boolean>(false)
    const [observatedTickets, setObservatedTickets] = useState<IncidentItem[]>([])

    //Estado para la carga de la exportación de los valores pertenecientes a la tabla de resueltos
    const [exportFilteredLoading, setExportFilteredLoading] = useState<boolean>(false)

    const getActiveTickets = useCallback(async function () {
        setLoadingActiveTickets(true)
        try {
            const response = await IncidentCenterService.getActiveTickets()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setActiveTickets(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingActiveTickets(false)
        }
    }, [])


    const getClosedTickets = useCallback(async function (fecha_inicio?: string, fecha_fin?: string) {
        setFinalizedTicketsLoading(true)
        try {
            const response = await IncidentCenterService.getFinalizedTickets(fecha_inicio, fecha_fin)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setFinalizedTickets(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setFinalizedTicketsLoading(false)
        }
    }, [])

    const reopenTicket = useCallback(async function (incidentInfo: IReopenIncident) {
        setReopenTicketLoading(true)
        try {
            const response = await IncidentCenterService.reopenTicket(incidentInfo)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(`Se reabrió el Ticket ${incidentInfo.nroTicket} exitosamente.`); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setReopenTicketLoading(false)
        }
    }, [])

    const getObservatedTickets = useCallback(async function () {
        setObservatedTicketLoading(true)
        try {
            const response = await IncidentCenterService.getObservatedTickets()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setObservatedTickets(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setObservatedTicketLoading(false)
        }
    }, [])

    const exportTableFiltered = useCallback(async function (filteredData: IncidentItem[]) {
        setExportFilteredLoading(true)
        try {
            const response = await IncidentCenterService.exportTableIncidentFiltered(filteredData)
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a');
            link.href = url;
            let today = new Date();
            let date = today.getFullYear() + "" + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);
            let time = today.getHours() + "" + today.getMinutes();
            let filename = date + '_' + time + "-incidentes-filtrados.xls";
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            successNotification("Exportación completada exitosamente");
        } catch (error) {
            errorNotification("Error al exportar los datos filtrados");
        } finally {
            setExportFilteredLoading(false)
        }
    }, [])

    return {
        getActiveTickets, activeTicketsLoading, activeTickets,
        getClosedTickets, finalizedTicketsLoading, finalizedTickets,
        reopenTicket, reopenTicketLoading,
        getObservatedTickets, observatedTicketLoading, observatedTickets,
        exportTableFiltered, exportFilteredLoading
    }
}
export { useTicket }