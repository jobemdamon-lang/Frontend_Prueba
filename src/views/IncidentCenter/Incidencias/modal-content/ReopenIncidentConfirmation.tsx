import { useState } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useIncidentContext } from "../Context"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { AccessController } from "../../../../components/AccessControler"
import { IncidentItem } from "../../Types"
import { Input } from "../../../../components/Inputs/TextInput"

const ReopenIncidentConfirmation = () => {

    const { modalHook, useTicketHook, rol } = useIncidentContext()
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
                <p className="text-center fs-3">¿Esta seguro que desea REABRIR esta incidencia | {modalInformation.TicketIdentifier}?</p>
                <Input value={motivo} label="Motivo de Cambio" type="text" onChange={setMotivo} required={true} />
                <div className="d-flex justify-content-around my-5 gap-5">
                    <AccessController
                        rol={rol}
                    >
                        <button
                            type="button"
                            className="btn btn-success"
                            disabled={useTicketHook.reopenTicketLoading}
                            onClick={() => {
                                useTicketHook.reopenTicket({
                                    nroTicket: modalInformation.TicketIdentifier,
                                    usuario: userName,
                                    motivo: motivo
                                }).then(result => {
                                    if (result) {
                                        useTicketHook.getActiveTickets()
                                        useTicketHook.getClosedTickets()
                                        modalHook.closeModal()
                                    }
                                })
                            }}
                        >
                            {useTicketHook.reopenTicketLoading ? "Reabriendo..." : "Reabrir"}
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

export { ReopenIncidentConfirmation }