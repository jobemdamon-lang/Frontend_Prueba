import { FC, useEffect, useState } from "react"
import { useIncidentContext } from "../Context"
import { IAction, IHistoricIncidents, ModalViewForIncident } from "../../Types"
import { KTSVG } from "../../../../helpers"
import { Input } from "../../../../components/Inputs/TextInput"
import { Modal, Spinner } from "react-bootstrap"
import { AccessController } from "../../../../components/AccessControler"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { ExportExcel } from "../../../../components/excel/ExportExcel"
import { Suggestions } from "./TrackingPanel/Suggestions"
import { HistoricActions } from "./TrackingPanel/HistoricActions"

const HistoricIncidentInformation = () => {

    const { modalHook, useIncidentHook, secondModalHook, rol } = useIncidentContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const modalInformation: IHistoricIncidents = modalHook.modalInformation
    const [sintoma, setSintoma] = useState(modalInformation.SINTOMA)
    const [conclusion, setConclusion] = useState(modalInformation.CONCLUSION)
    const donothing = () => { }

    useEffect(() => {
        useIncidentHook.getListActions(modalInformation.ID_INCIDENTE.toString())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUpdate = () => {
        useIncidentHook.updatedSintomaConlusionIncident({
            id_incidente: modalInformation.ID_INCIDENTE,
            conclusion: conclusion ?? "",
            sintoma: sintoma ?? "",
            estado_incidente_id: modalInformation.ESTADO_INCIDENTE_ID,
            usuario_modificacion: userName,
            nro_ticket: modalInformation.NRO_TICKET,
            is_historico: modalInformation.IS_HISTORICO
        }).then(success => {
            if (success) {
                modalHook.closeModal()
                useIncidentHook.getListHistoricIncidents()
            }
        })
    }

    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-white">INFORMACIÓN DE INCIDENCIA - {modalInformation.NRO_TICKET}</h2>
                <ExportExcel
                    data={useIncidentHook.actionList}
                    head={excelActionsHeads}
                    wrapComponent={<ExportActionsButton />}
                    sheetName={`Acciones_${modalInformation.NRO_TICKET}`}
                />
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15' style={{ backgroundColor: "RGB(245, 247, 249)", backdropFilter: "blur(5px)" }}>
                <section className="row">
                    <section className="col-12 col-lg-8 px-10">
                        <h3 className="font-weight-bold my-5 text-center text-dark">DETALLES</h3>
                        <div
                            className="row row-cols-4 justify-content-md-center align-items-end p-10 rounded mb-5"
                            style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
                        >
                            <Input
                                containerClassName="mb-8"
                                label="Numero de Ticket"
                                value={modalInformation.NRO_TICKET ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Cliente"
                                value={modalInformation.CLIENTE ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="¿ Otros Clientes Afectados?"
                                value={modalInformation.OTROS_CLIENTES_AFECTADOS ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Estado Incident Center"
                                value={modalInformation.ESTADO_INCIDENTE ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="JP | GP"
                                value={modalInformation.JP_GP ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Servicio o Aplicativo Impactado"
                                value={modalInformation.SERVICIO_APLICATIVO_IMPACTADO ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Parcial | Total"
                                value={modalInformation.PARCIAL_TOTAL ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Descripción"
                                value={modalInformation.DESCRIPCION ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Impacto en el Negocio | Posibles Consecuencias"
                                value={modalInformation.IMPACTO_NEGOCIO_POSIBLES_CONSECUENCIAS ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Inicio de Indisponibilidad"
                                value={modalInformation.INICIO_INDISPONIBILIDAD?.toString() ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="¿ Perdidad de SLA y/o Penalidades ?"
                                value={modalInformation.PERDIDA_SLA_PENALIDADES ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Fin de Indisponibilidad"
                                value={modalInformation.FIN_INDISPONIBILIDAD ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="¿ Se escaló al Crisis Manager ?"
                                value={modalInformation.ESCALO_INCIDENTE ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Crisis Manager"
                                value={modalInformation.INCIDENT ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="¿ Participó ?"
                                value={modalInformation.PARTICIPO ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="Alerta"
                                value={modalInformation.ALERTA ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="¿ Porqué no salio ?"
                                value={modalInformation.PORQUE_NO_SALIO_ALERTA ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="JP solicitó P1"
                                value={modalInformation.PM_P1 ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                            <Input
                                containerClassName="mb-8"
                                label="¿ Bajo la prioridad ? "
                                value={modalInformation.BAJO_PRIORIDAD ?? ""}
                                disabled={true}
                                onChange={donothing}
                            />
                        </div>
                    </section>
                    <section className="col-12 col-lg-4 mb-5">
                        <h3 className="font-weight-bold my-5 text-center text-dark">ACCIONES REALIZADAS</h3>
                        <div className="chat-container rounded" style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                            <div className="p-10 " style={{ overflowY: "auto" }}>
                                {useIncidentHook.actionListLoading ?
                                    <div className="h-100 d-flex justify-content-center align-items-center">
                                        <Spinner animation="border" role="status">
                                        </Spinner>
                                    </div>
                                    :
                                    <>
                                        {useIncidentHook.actionList.length === 0 ?
                                            <div className="h-100 d-flex justify-content-center align-items-center">
                                                <div>
                                                    <p className="fs-7 fw-bold">No se encontraron acciones realizadas...</p>
                                                </div>
                                            </div>
                                            :
                                            <ul className="list-unstyled mb-0">
                                                {
                                                    useIncidentHook.actionList.map((action: IAction) => (
                                                        <li className="p-2 border-bottom border-secondary d-flex justify-content-between gap-5 align-items-center" key={action.ID_ACCION}>
                                                            <div className="flex-grow w-100">
                                                                <div className="d-flex justify-content-between flex-column">
                                                                    <div className="d-flex flex-row justify-content-between">
                                                                        <div className="pt-1">
                                                                            <p className="fw-bold text-primary mb-0 fs-6">{action.USUARIO.toUpperCase()}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="fs-8 text-dark mb-1">{action.FECHA_REGISTRO}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="pt-1">
                                                                        <p className="fs-7 text-dark">{formatAction(action.CONTENIDO)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        }
                                    </>}
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="accordion" id="kt_accordion_1" style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}>
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="kt_accordion_1_header_1">
                                    <button className="accordion-button fs-4 fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#kt_accordion_1_body_1" aria-expanded="true" aria-controls="kt_accordion_1_body_1">
                                        DATOS ADICIONALES
                                    </button>
                                </h2>
                                <div id="kt_accordion_1_body_1" className="accordion-collapse show" aria-labelledby="kt_accordion_1_header_1" data-bs-parent="#kt_accordion_1">
                                    <div className="accordion-body row row-cols-4 justify-content-md-center align-items-end">
                                        <Input
                                            className="mb-5"
                                            label="Numero de Ticket 100 | 200"
                                            value={modalInformation.CRQ_WO ?? ""}
                                            disabled={true}
                                            onChange={donothing} />
                                        <Input
                                            className="mb-5"
                                            label="Observaciones Crisis Manager"
                                            value={modalInformation.OBSERVACION_CRISIS_MANAGER ?? ""}
                                            disabled={true}
                                            onChange={donothing} />
                                        <Input
                                            className="mb-5"
                                            label="Observaciones Especialista"
                                            value={modalInformation.OBSERVACION_ESPECIALISTA ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Observaciones Coordinador"
                                            value={modalInformation.OBSERVACION_COORDINADOR ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Observaciones Capa de Gestión"
                                            value={modalInformation.OBSERVACION_CAPA_GESTION ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Duración"
                                            value={modalInformation.DURACION ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Desviaciones"
                                            value={modalInformation.DESVIACIONES ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Resumen"
                                            value={modalInformation.RESUMEN ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Numero de Ticket SA&D"
                                            value={modalInformation.NUMERO_TICKET_SAD ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Porcentaje Avance de Ticket SA&D"
                                            value={modalInformation.AVANCE_TICKET_SAD ?? ""}
                                            disabled={true}
                                            onChange={donothing}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Sintoma"
                                            value={sintoma ?? ""}
                                            disabled={false}
                                            onChange={setSintoma}
                                        />
                                        <Input
                                            className="mb-5"
                                            label="Conclusion"
                                            value={conclusion ?? ""}
                                            disabled={false}
                                            onChange={setConclusion}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="row mt-5">
                        <Suggestions nroIncident={modalInformation.NRO_TICKET} secondModalHook={secondModalHook} />
                    </section>
                    <section className="d-flex justify-content-end p-5 gap-5">
                        <AccessController
                            rol={rol}
                        >
                            <button
                                disabled={useIncidentHook.updateSintomaConlusionLoading}
                                onClick={() => handleUpdate()}
                                type="button"
                                className="btn btn-success"
                            >
                                {useIncidentHook.updateSintomaConlusionLoading ? "Actualizando..." : "Actualizar"}
                            </button>
                        </AccessController>
                        <button
                            type="button"
                            onClick={() => modalHook.closeModal()}
                            className="btn btn-danger"
                        >
                            Cancelar
                        </button>
                    </section>
                </section>
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
                {secondModalHook.modalView === ModalViewForIncident.HISTORIC_ACTIONS && <HistoricActions />}
            </Modal>
        </>
    )
}
export { HistoricIncidentInformation }

const formatAction = (action: string): string[] => {
    const regex = /@\[([^)]+)\]\([^)]+\)/g;
    return action.split(regex).map((parte, index) => {
        return parte; // Las partes que coinciden con el usuario (ignoradas)
    })
}
const ExportActionsButton: FC = () => {
    return (
        <button type='button' className='btn btn-sm btn-primary'>
            Exportar acciones
        </button>
    )
}

const excelActionsHeads = [
    { label: 'Nro. Accion', name: 'ID_ACCION' },
    { label: 'Fecha Registro', name: 'FECHA_REGISTRO' },
    { label: 'Usuario', name: 'USUARIO' },
    { label: 'Contenido Acción', name: 'CONTENIDO' },
]