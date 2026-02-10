import { KTSVG } from "../../../../../helpers/components/KTSVG"
import "../../../../../assets/sass/components/incidentCenter-styles/messages.scss"
import { useIncidentContext } from "../../Context"
import { IAction, ICoincidentes } from "../../../Types"
import "../../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"

// Expresión regular para encontrar menciones de usuarios
const regex = /@\[([^)]+)\]\([^)]+\)/g;

const HistoricActions = () => {

    const { secondModalHook } = useIncidentContext()
    const modalInformation: ICoincidentes = secondModalHook.modalInformation

    // Reemplazar menciones de usuarios con solo el nombre en azul
    const structure = (action: string) => {
        return action.split(regex).map((parte, index) => parte);
    }

    return (
        <>
            <div className='modal-header py-4 bg-dark'>
                <h2 className="text-white">ACCIONES REALIZADAS</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => secondModalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10 border rounded-bottom border-top-0 border-dark'>
                <div className="p-10 " style={{ overflowY: "auto", maxHeight: '500px' }}>
                    {modalInformation.ACCIONES.length === 0 ?
                        <div className="h-100 d-flex justify-content-center align-items-center">
                            <div>
                                <p className="fs-7 fw-bold">No se encontraron acciones realizadas...</p>
                            </div>
                        </div>
                        :
                        <ul className="list-unstyled mb-0">
                            {modalInformation.ACCIONES.map((action: IAction) => (
                                <li className="p-2 border-bottom border-secondary d-flex justify-content-between gap-5 align-items-center">
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
                                                <p className="fs-7 text-dark">{structure(action.CONTENIDO)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
        </>
    )
}

export { HistoricActions }

