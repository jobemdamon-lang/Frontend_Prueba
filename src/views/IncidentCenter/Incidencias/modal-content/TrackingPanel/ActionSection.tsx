import { Spinner } from "react-bootstrap"
import { AccessController } from "../../../../../components/AccessControler"
import { FC, useState } from "react"
import { ActionsMessages } from "./ActionMessages"
import { IAction, ITrackedTicket } from "../../../Types"
import { convertDateFormat } from "./transformStructure"
import uniqid from "uniqid"
import { MentionInput } from "./MentionInput"
import { IListCollaborators } from "../../../../administration/Types"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { warningNotification } from "../../../../../helpers/notifications"
import { useIncidentContext } from "../../Context"

type Props = { collabsData: IListCollaborators[], modalInformation: ITrackedTicket }

const ActionSection: FC<Props> = ({ collabsData, modalInformation }) => {

    const { useIncidentHook, secondModalHook, rol } = useIncidentContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [newAction, setNewAction] = useState("")

    return (
        <>
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
                                            <ActionsMessages
                                                action={action}
                                                timeAction={convertDateFormat(action.FECHA_REGISTRO)}
                                                key={uniqid()}
                                            />
                                        ))
                                    }
                                </ul>
                            }
                        </>
                    }
                </div>
                <div className="d-flex w-100 align-items-center gap-5 mt-2 p-5">
                    <MentionInput inputValue={newAction} setInputValue={setNewAction} data={collabsData.map((collab: any) => ({ id: collab.usuario, display: collab.nombre }))} />
                    <AccessController
                        rol={rol}
                    >
                        <button
                            type="button"
                            disabled={useIncidentHook.newActionLoading}
                            onClick={() => {
                                if (newAction !== "") {
                                    useIncidentHook.createNewAction({
                                        usuario: userName,
                                        id_incidente: modalInformation.ID_INCIDENTE,
                                        contenido: newAction
                                    }).then((res: any) => {
                                        if (res) {
                                            secondModalHook.closeModal()
                                            useIncidentHook.getListActions(modalInformation.ID_INCIDENTE.toString())
                                            setNewAction("")
                                        }
                                    })
                                } else {
                                    warningNotification("Ingrese una acción para poder añadirla")
                                }
                            }}
                            className="btn btn-primary">
                            {useIncidentHook.newActionLoading ? "Añadiendo..." : "Añadir"}
                        </button>
                    </AccessController>
                </div>
            </div>
        </>
    )
}

export { ActionSection }