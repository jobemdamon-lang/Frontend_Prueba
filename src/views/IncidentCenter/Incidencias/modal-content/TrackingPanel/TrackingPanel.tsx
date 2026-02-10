import { useEffect, useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { useIncidentContext } from "../../Context"
import { Input } from "../../../../..//components/Inputs/TextInput"
import { transformStructureOfData } from "./transformStructure"
import { Modal } from "react-bootstrap"
import { NotificationAction } from "./NotificationAction"
import { UpdateAction } from "./UpdateAction"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { Suggestions } from "./Suggestions"
import { useCollaborator } from "../../../../administration/Colaborador/hooks/useCollaborator"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { AccessController, accessControllerFunction } from "../../../../../components/AccessControler"
import { ModalSize } from "../../../../../hooks/Types"
import lodash from 'lodash'
import { IListCollaborators } from "../../../../administration/Types"
import { ActionSection } from "./ActionSection"
import { SendWhatsapp } from "./SendWhatsapp"
import { HistoricActions } from "./HistoricActions"
import { IUpdateIncident, ModalViewForIncident, ITrackedTicket } from "../../../Types"
import { DataList } from "../../../../../components/Inputs/DataListInput"
import "../../../../../assets/sass/components/incidentCenter-styles/messages.scss"

const TrackingPanel = () => {

    const { useTicketHook, useIncidentHook, secondModalHook, modalHook, rol } = useIncidentContext()
    const modalInformation: ITrackedTicket = modalHook.modalInformation
    const { fetchCollabs, collabsData } = useCollaborator({})
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [canEditContent, setCanEditContent] = useState(false)
    const [originalStateIncident, setOriginalState] = useState(modalInformation.ESTADO_INCIDENTE)
    const [actualIncident, setActualIncident] = useState<IUpdateIncident>(transformStructureOfData(modalInformation))

    const [flagAlerta, setFlagAlerta] = useState(modalInformation.FLAG_ALERTA)
    const [isTogglingAlert, setIsTogglingAlert] = useState(false)

    const updateNothing = (value: string) => { }
    useEffect(() => {
        setOriginalState(modalInformation.ESTADO_INCIDENTE)
        setFlagAlerta(modalInformation.FLAG_ALERTA)
        fetchCollabs()
        //Listar Estado de incident center para el Combo p1 o p2 (1 o 2)
        useIncidentHook.getListStatesIncidentCenter("1")
        useIncidentHook.getListActions(modalInformation.ID_INCIDENTE.toString())
        return () => setOriginalState('')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (accessControllerFunction(rol)) {
            let incidentWithUser = lodash.cloneDeep(actualIncident)
            let { fin_indisponibilidad, ...incidentWhitoutFinIndisponibilidad } = incidentWithUser
            incidentWhitoutFinIndisponibilidad.usuario_modificacion = userName
            useIncidentHook.updatedInfoIncident(incidentWhitoutFinIndisponibilidad).then(success => {
                //Si se actualiza el registro correctamente se cierra el modal y actualiza los registros y añade la accion si corsuccessponde
                if (success) {
                    modalHook.closeModal()
                    useTicketHook.getActiveTickets()
                    useTicketHook.getClosedTickets()
                    //Si estado Incident Center ha cambiado se crea una accion indicando ello
                    if (originalStateIncident !== actualIncident.estado_incidente) {
                        useIncidentHook.createNewAction({
                            usuario: userName,
                            id_incidente: modalInformation.ID_INCIDENTE,
                            contenido: 'Se cambió el estado a: ' + actualIncident.estado_incidente
                        })
                    }
                }
            })
        }
    }

    const updateEstadoIncidentCenter = (newValue: string) => {       
        const currentState = actualIncident.estado_incidente;

        const allowedTransitions: Record<string, string[]> = {
            "INICIADO": ["EN WAR ROOM"],
            "EN WAR ROOM": ["FINALIZADO", "SALA EN ESPERA"],
            "SALA EN ESPERA": ["EN WAR ROOM", "FINALIZADO"],
        };

        if (currentState in allowedTransitions && !allowedTransitions[currentState].includes(newValue)) {
            console.warn(`Transición no permitida: ${currentState} -> ${newValue}`);
            return;
        }

        setActualIncident(prev => ({
            ...prev,
            estado_incidente: newValue,
            estado_incidente_id: useIncidentHook.incidentCenterStates.find(incident => incident.VALOR === newValue)?.ID_ESTADO_INCIDENTE ?? 0,
        }));
    };
    
    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-white">INFORMACIÓN DE INCIDENCIA - {modalInformation.NRO_TICKET}</h2>
                <AccessController
                    rol={rol}
                >
                    <div className="d-flex justify-content-end gap-2">
                        <button
                            className={`btn btn-${!canEditContent ? "primary" : "danger"}`}
                            onClick={() => setCanEditContent(prev => !prev)}
                        >
                            <i className={`fas ${!canEditContent ? "fa-edit" : "fa-lock"}`}></i>
                            <span className="d-none d-lg-inline ms-1">
                                {canEditContent ? "Bloquear Edición" : "Editar Contenido"}
                            </span>
                        </button>
                        <button
                            className="btn btn-info"
                            onClick={() => {
                                secondModalHook.openModal(ModalViewForIncident.NOTIFICATION_CONFIRMATION, ModalSize.LG, undefined, modalInformation)
                            }}>
                            <i className="fas fa-bell"></i>
                            <span className="d-none d-lg-inline ms-1">Notificar</span>
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => {
                                secondModalHook.openModal(
                                    ModalViewForIncident.SEND_WHATSAPP,
                                    ModalSize.XL, undefined,
                                    { ...modalInformation, lista_acciones: useIncidentHook.actionList }
                                )
                            }}>
                            <i className="fab fa-whatsapp fs-3"></i>
                            <span className="d-none d-lg-inline ms-1">WhatsApp</span>
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <div className="form-check d-flex align-items-center justify-content-center gap-2">
                            <input 
                                className="form-check-input m-0" 
                                type="checkbox" 
                                id="automaticMessages"
                                checked={flagAlerta === 1}
                                onChange={async (e) => {
                                    const newCheckedValue = e.target.checked;
                                    setIsTogglingAlert(true);
                                    setFlagAlerta(newCheckedValue ? 1 : 0);
                                    
                                    const success = await useIncidentHook.toggleAutomaticAlerts(newCheckedValue, modalInformation.ID_INCIDENTE.toString());
                                    
                                    if (!success) {
                                        setFlagAlerta(newCheckedValue ? 0 : 1);
                                    }
                                    
                                    setIsTogglingAlert(false);
                                }}
                                disabled={useIncidentHook.automaticAlertsLoading || isTogglingAlert}
                            />
                            <label className="form-check-label text-white fs-7 mb-0" htmlFor="automaticMessages">
                                <span className="d-none d-md-inline">Alertas automáticas (cada 30 minutos)</span>
                                <span className="d-inline d-md-none">Alertas automáticas</span>
                            </label>
                        </div>
                    </div>
                </AccessController>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15' style={{ backgroundColor: "RGB(245, 247, 249)", backdropFilter: "blur(5px)" }}>
                <form onSubmit={handleSubmit}>
                    <section className="row">
                        <section className="col-12 col-lg-8 px-10">
                            <h3 className="font-weight-bold my-5 text-center text-dark">DETALLES</h3>
                            <div className="row row-cols-4 justify-content-md-center align-items-end p-10 rounded mb-5" style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                                <Input
                                    containerClassName="mb-8"
                                    label="Numero de Ticket"
                                    value={actualIncident.nro_ticket}
                                    onChange={updateNothing}
                                    disabled={true}
                                />
                                <Input
                                    containerClassName="mb-8"
                                    label="Cliente"
                                    value={actualIncident.cliente}
                                    onChange={updateNothing}
                                    disabled={true}
                                />
                                {/*<Input containerClassName="mb-8" label="Otros Clientes Afectados" value={actualIncident.otros_clientes_afectados} onChange={updateOtrosClientesAfectados} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="¿ Otros Clientes Afectados?"
                                    value={actualIncident.otros_clientes_afectados}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, otros_clientes_afectados: newValue }))}
                                    disabled={!canEditContent}
                                    data={[{ codigo: 1, nombre: "SI" }, { codigo: 2, nombre: "NO" }]}
                                />
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="Estado Incident Center"
                                    value={actualIncident.estado_incidente}
                                    onChange={updateEstadoIncidentCenter}
                                    disabled={!canEditContent} // No deshabilitamos el SelectInput
                                    data={useIncidentHook.incidentCenterStates
                                        .filter(incident => {
                                            const currentState = actualIncident.estado_incidente;
                                            const allowedTransitions: Record<string, string[]> = {
                                                "INICIADO": ["EN WAR ROOM"],
                                                "EN WAR ROOM": ["FINALIZADO", "SALA EN ESPERA"],
                                                "SALA EN ESPERA": ["EN WAR ROOM", "FINALIZADO"],
                                                "FINALIZADO": ["EN WAR ROOM", "SALA EN ESPERA"], // Permitir solo regresar a estos estados
                                            };
                                            return currentState in allowedTransitions
                                                ? allowedTransitions[currentState].includes(incident.VALOR) || incident.VALOR === currentState
                                                : true;
                                        })
                                        .map(incident => ({ codigo: incident.ID_ESTADO_INCIDENTE, nombre: incident.VALOR }))}
                                />
                                <Input containerClassName="mb-8"
                                    label="JP | GP"
                                    value={actualIncident.jp_gp}
                                    onChange={updateNothing}
                                    disabled={true}
                                />
                                <Input
                                    containerClassName="mb-8"
                                    label="Servicio o Aplicativo Impactado"
                                    value={modalInformation.SERVICIO_APLICATIVO_IMPACTADO ?? ""}
                                    onChange={updateNothing}
                                    disabled={true}
                                />
                                {/*<Input containerClassName="mb-8" label="Parcial | Total" value={actualIncident.parcial_total} onChange={updateParcialTotal} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="Parcial | Total"
                                    value={actualIncident.parcial_total}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, parcial_total: newValue }))}
                                    disabled={!canEditContent}
                                    data={[
                                        { codigo: 1, nombre: "PARCIAL" },
                                        { codigo: 2, nombre: "PROYECTO NO LO INDICA" },
                                        { codigo: 3, nombre: "TOTAL" },
                                        { codigo: 4, nombre: "NO HUBO IMPACTO" }
                                    ]}
                                />
                                <Input
                                    containerClassName="mb-8"
                                    label="Descripción"
                                    value={actualIncident.descripcion}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, descripcion: newValue }))}
                                    disabled={true}
                                />
                                <Input
                                    containerClassName="mb-8"
                                    label="Impacto en el Negocio | Posibles Consecuencias"
                                    value={actualIncident.impacto_negocio_posibles_consecuencias}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, impacto_negocio_posibles_consecuencias: newValue }))}
                                    disabled={!canEditContent}
                                />
                                <Input
                                    containerClassName="mb-8"
                                    label="Inicio de Indisponibilidad"
                                    value={actualIncident.inicio_indisponibilidad}
                                    onChange={updateNothing}
                                    disabled={true} />
                                {/*<Input containerClassName="mb-8" label="Perdidad de SLA y/o Penalidades" value={actualIncident.perdida_sla_penalidades} onChange={updatePerdidaSLA} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="¿ Perdidad de SLA y/o Penalidades ?"
                                    value={actualIncident.perdida_sla_penalidades}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, perdida_sla_penalidades: newValue }))}
                                    disabled={!canEditContent}
                                    data={[{ codigo: 1, nombre: "SI" }, { codigo: 2, nombre: "NO" }]}
                                />
                                <Input
                                    containerClassName="mb-8"
                                    label="Fin de Indisponibilidad"
                                    value={actualIncident.fin_indisponibilidad ?? ""}
                                    onChange={updateNothing}
                                    disabled={true}
                                />
                                {/*<Input containerClassName="mb-8" label="¿ Se escaló el incidente ?" value={actualIncident.escalo_incidente} onChange={updateEscaloIncidente} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="¿ Se escaló al Crisis Manager ?"
                                    value={actualIncident.escalo_incidente}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, escalo_incidente: newValue }))}
                                    disabled={!canEditContent}
                                    data={[{ codigo: 1, nombre: "SI" }, { codigo: 2, nombre: "NO" }]}
                                />
                                {/*<Input containerClassName="mb-8" label="Crisis Manager" value={actualIncident.incident} onChange={updateIncident} disabled={!canEditContent} />*/}
                                <DataList
                                    label="Crisis Manager"
                                    containerClassName="mb-8"
                                    className="w-250px"
                                    disabled={!canEditContent}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, incident: newValue }))}
                                    value={actualIncident.incident}
                                    items={collabsData.map((collab: IListCollaborators) => ({ id: collab?.idusuario, value: collab?.nombre }))}
                                />
                                {/*<Input containerClassName="mb-8" label="¿ Participó ?" value={actualIncident.participo} onChange={updateParticipoIncident} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="¿ Participó ?"
                                    value={actualIncident.participo}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, participo: newValue }))}
                                    disabled={!canEditContent} data={[{ codigo: 1, nombre: "SI" }, { codigo: 2, nombre: "NO" }]}
                                />
                                {/*<Input containerClassName="mb-8" label="Alerta" value={actualIncident.alerta} onChange={updateAlerta} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="Alerta" value={actualIncident.alerta}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, alerta: newValue }))}
                                    disabled={!canEditContent}
                                    data={[{ codigo: 1, nombre: "SI" }, { codigo: 2, nombre: "NO" }, { codigo: 2, nombre: "NO APLICA" }]}
                                />
                                <Input
                                    containerClassName="mb-8"
                                    label="¿ Porqué no salio ?"
                                    value={actualIncident.porque_no_salio_alerta}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, porque_no_salio_alerta: newValue }))}
                                    disabled={!canEditContent}
                                />
                                {/*<Input containerClassName="mb-8" label="JP solicitó P1" value={actualIncident.pm_p1} onChange={updateJPSolicitoP1} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="JP solicitó P1"
                                    value={actualIncident.pm_p1}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, pm_p1: newValue }))}
                                    disabled={!canEditContent}
                                    data={[{ codigo: 1, nombre: "SI" }, { codigo: 2, nombre: "NO" }]}
                                />
                                {/*<Input containerClassName="mb-8" label="¿ Bajo la prioridad ? " value={actualIncident.bajo_prioridad} onChange={updateBajoLaPrioridad} disabled={!canEditContent} />*/}
                                <SelectInput
                                    containerClassName="mb-8"
                                    label="¿ Bajo la prioridad ?"
                                    value={actualIncident.bajo_prioridad}
                                    onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, bajo_prioridad: newValue }))}
                                    disabled={!canEditContent}
                                    data={[{ codigo: 1, nombre: "SI" }, { codigo: 2, nombre: "NO" }]}
                                />
                            </div>
                        </section>
                        <section className="col-12 col-lg-4 mb-5">
                            <ActionSection
                                collabsData={collabsData}
                                modalInformation={modalInformation}
                            />
                        </section>
                        <section>
                            <div className="accordion" id="kt_accordion_1" style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="kt_accordion_1_header_1">
                                        <button className="accordion-button fs-4 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#kt_accordion_1_body_1" aria-expanded="true" aria-controls="kt_accordion_1_body_1">
                                            DATOS ADICIONALES
                                        </button>
                                    </h2>
                                    <div id="kt_accordion_1_body_1" className="accordion-collapse collapse show" aria-labelledby="kt_accordion_1_header_1" data-bs-parent="#kt_accordion_1">
                                        <div className="accordion-body row row-cols-4 justify-content-md-center align-items-end">
                                            <Input
                                                containerClassName="mb-5"
                                                label="Numero de Ticket 100 | 200"
                                                value={actualIncident.crq_wo}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, crq_wo: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Observaciones Crisis Manager"
                                                value={actualIncident.observacion_crisis_manager}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, observacion_crisis_manager: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Observaciones Especialista"
                                                value={actualIncident.observacion_especialista}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, observacion_especialista: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Observaciones Coordinador"
                                                value={actualIncident.observacion_coordinador}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, observacion_coordinador: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Observaciones Capa de Gestión"
                                                value={actualIncident.observacion_capa_gestion}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, observacion_capa_gestion: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Duración"
                                                value={actualIncident.duracion}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, duracion: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Desviaciones"
                                                value={actualIncident.desviaciones}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, desviaciones: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Resumen"
                                                value={actualIncident.resumen}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, resumen: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Numero de Ticket SA&D"
                                                value={actualIncident.numero_ticket_sad}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, numero_ticket_sad: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Porcentaje Avance de Ticket SA&D"
                                                value={actualIncident.avance_ticket_sad}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, avance_ticket_sad: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Sintoma"
                                                value={actualIncident.sintoma}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, sintoma: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                            <Input
                                                containerClassName="mb-5"
                                                label="Conclusiones"
                                                value={actualIncident.conclusion}
                                                onChange={(newValue: string) => setActualIncident(prev => ({ ...prev, conclusion: newValue }))}
                                                disabled={!canEditContent}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <section className="row mt-5">
                        <Suggestions nroIncident={modalInformation.NRO_TICKET} secondModalHook={secondModalHook} />
                    </section>
                    <div className="d-flex justify-content-end my-5 gap-5">
                        <AccessController
                            rol={rol}
                        >
                            <button
                                disabled={useIncidentHook.updateIncidentLoading || !canEditContent}
                                type="submit"
                                className="btn btn-success"
                            >
                                {useIncidentHook.updateIncidentLoading ? "Actualizando..." : "Actualizar"}
                            </button>
                        </AccessController>
                        <button
                            type="button"
                            onClick={() => modalHook.closeModal()}
                            className="btn btn-danger"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
            <Modal
                id='kt_modal_create_app'
                size={secondModalHook.sizeModal || "xl"}
                tabIndex={-1}
                aria-hidden='true'
                dialogClassName='modal-dialog modal-dialog-centered'
                show={secondModalHook.showModal}
                onHide={() => secondModalHook.closeModal()}
            >
                {secondModalHook.modalView === ModalViewForIncident.NOTIFICATION_CONFIRMATION && <NotificationAction collabsData={collabsData} />}
                {secondModalHook.modalView === ModalViewForIncident.EDIT_ACTION && <UpdateAction collabsData={collabsData} />}
                {secondModalHook.modalView === ModalViewForIncident.SEND_WHATSAPP && <SendWhatsapp />}
                {secondModalHook.modalView === ModalViewForIncident.HISTORIC_ACTIONS && <HistoricActions />}
            </Modal>
        </>
    )
}
export { TrackingPanel }