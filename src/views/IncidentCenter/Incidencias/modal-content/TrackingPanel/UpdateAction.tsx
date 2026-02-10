import { FC, useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { useIncidentContext } from "../../Context"
import { IAction } from "../../../Types"
import { MentionInput } from "./MentionInput"
import { IListCollaborators } from "../../../../administration/Types"
import { AccessController, accessControllerFunction } from "../../../../../components/AccessControler"
import "../../../../../assets/sass/components/incidentCenter-styles/messages.scss"

type ComponentProps = {
    collabsData: IListCollaborators[],
}

const UpdateAction: FC<ComponentProps> = ({ collabsData }) => {

    const { secondModalHook, rol, useIncidentHook } = useIncidentContext()
    const modalSecondInformation: { actionInfo: IAction } = secondModalHook.modalInformation
    const [actionValue, setActionValue] = useState(modalSecondInformation.actionInfo.CONTENIDO)

    const handleSubmit = () => {
        if (accessControllerFunction(rol)) {
            useIncidentHook.updateAction({
                id_accion: modalSecondInformation.actionInfo.ID_ACCION,
                contenido: actionValue
            }).then(res => {
                if (res) {
                    secondModalHook.closeModal()
                    useIncidentHook.getListActions(modalSecondInformation.actionInfo.ID_INCIDENTE.toString())
                }
            })
        }
    }

    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-white">ACTUALIZAR ACCIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => secondModalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10 border rounded-bottom border-top-0 border-dark'>
                <div className="d-flex justify-content-center">
                    <MentionInput inputValue={actionValue} setInputValue={setActionValue} data={collabsData.map(collab => ({ id: collab.usuario, display: collab.nombre }))} />
                </div>
                <div className="d-flex justify-content-end gap-5 my-5">
                    <AccessController
                        rol={rol}
                    >
                        <button
                            disabled={useIncidentHook.updateActionLoading}
                            type="button"
                            //Se emplea un onClick en vez de un form para no entrar en conflicto con el form superior (form dentro de un form)
                            onClick={handleSubmit}
                            className="btn btn-success"
                        >
                            {useIncidentHook.updateActionLoading ? "Actualizando..." : "Actualizar"}
                        </button>
                    </AccessController>

                    <button
                        type="button"
                        onClick={() => secondModalHook.closeModal()}
                        className="btn btn-danger"
                    >
                        Cancelar
                    </button>
                </div>
            </div>

        </>
    )
}

export { UpdateAction }