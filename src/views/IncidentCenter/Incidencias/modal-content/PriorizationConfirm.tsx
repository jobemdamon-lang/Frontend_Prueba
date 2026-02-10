import { useState } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useIncidentContext } from "../Context"
import { IncidentItem } from "../../Types"
import { TextInput } from "../../../../components/Inputs/TextInput"
import { AccessController } from "../../../../components/AccessControler"
import { useTypedSelector } from "../../../../store/ConfigStore"

const PriorizationConfirm = () => {

    const { modalHook, useTicketHook, useIncidentHook, rol } = useIncidentContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const modalInformation: IncidentItem = modalHook.modalInformation
    const [motivo, setMotivo] = useState("")

    return (
        <>
            <div className='modal-header py-4'>
                <h2>CONFIRMACIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10'>
                <p className="text-center fs-3">¿Esta seguro que desea PRIORIZAR esta incidencia | {modalInformation.TicketIdentifier}?</p>
                <TextInput value={motivo} label="Motivo de Cambio" type="text" setNewValue={setMotivo} required={true} />
                <div className="d-flex justify-content-center align-items-center gap-8 m-10">
                    <div className="symbol symbol-50px">
                        <div className="symbol-label fs-1 fw-bold bg-dark text-inverse-dark">P2</div>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                        </svg>
                    </div>
                    <div className="symbol symbol-50px">
                        <div className="symbol-label fs-2 fw-bold bg-primary text-inverse-primary">P1</div>
                    </div>
                </div>
                <div className="d-flex justify-content-around my-5 gap-5">
                    <AccessController
                        rol={rol}
                    >
                        <button
                            type="button"
                            className="btn btn-success"
                            disabled={useIncidentHook.changePriorityLoading}
                            onClick={() => {
                                useIncidentHook.ChangePriorityIncident({
                                    nroTicket: modalInformation.TicketIdentifier,
                                    usuario: userName,
                                    prioridad: 1,
                                    motivo: motivo
                                    //Si la priorización es exitosa se actualiza el listado y cierra el modal
                                }).then(success => {
                                    if (success) {
                                        useTicketHook.getActiveTickets()
                                        modalHook.closeModal()
                                    }
                                })
                            }}
                        >
                            {useIncidentHook.changePriorityLoading ? "Procesando.." : "Priorizar"}
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

            </div>
        </>
    )
}

export { PriorizationConfirm }