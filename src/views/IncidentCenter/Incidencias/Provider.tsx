import { FC, useEffect } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { useModal } from '../../../hooks/useModal'
import { IncidentProvider } from './Context'
import { useTicket } from '../hooks/useTicket'
import { useIncident } from '../hooks/useIncident'
import { Tab, Tabs } from '../../../components/Tabs'
import { ActiveIncidents } from './Content/ActiveIncidents'
import { ResolvedIncidents } from './Content/ResolvedIncidents'
import { HistoricIncidents } from './Content/HistoricIncidents'
import { IncidentModal } from './IncidentModal'
import { AccordionHeader } from './Content/AccordionHeader'

const Provider: FC<ModuleProps> = ({ rol }): JSX.Element => {

    const modalHook = useModal()
    const secondModalHook = useModal()
    const useTicketHook = useTicket()
    const useIncidentHook = useIncident()

    useEffect(() => {
        const today = new Date()
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(today.getMonth() - 6)
        
        // Formatear como DD/MM/YYYY 
        const fecha_fin = today.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        const fecha_inicio = sixMonthsAgo.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        
        console.log('Carga inicial con fechas:', { fecha_inicio, fecha_fin })
        
        useTicketHook.getActiveTickets()
        useTicketHook.getClosedTickets(fecha_inicio, fecha_fin)
        useIncidentHook.getListHistoricIncidents(fecha_inicio, fecha_fin)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <IncidentProvider value={{
            modalHook,
            rol,
            useTicketHook,
            useIncidentHook,
            secondModalHook
        }} >
            <AccordionHeader />
            <div className="card">
                <div className='card-header'>
                    <h3 className='card-title align-items-start flex-column'>
                        <span className='card-label fw-bolder fs-3'>CENTRALIZADOR DE INCIDENCIAS</span>
                    </h3>
                </div>
                <div className='card-body '>
                    <Tabs>
                        <Tab title="Tickets Activos">
                            <ActiveIncidents />
                        </Tab>
                        <Tab title="Tickets Resueltos">
                            <ResolvedIncidents />
                        </Tab>
                        <Tab title="Tickets Historicos">
                            <HistoricIncidents />
                        </Tab>
                        {/*<Tab title={`Tickets por regularizar (${ticketsWithObs.length})`}>
                            <TicketsWithObs />
                        </Tab>*/}
                    </Tabs>
                </div>
                <IncidentModal/>
            </div>
        </IncidentProvider>
    )
}

export { Provider }
