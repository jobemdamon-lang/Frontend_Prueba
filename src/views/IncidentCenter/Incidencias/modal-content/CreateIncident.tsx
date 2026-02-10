import { useEffect, useState } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useIncidentContext } from "../Context"
import { Input } from "../../../../components/Inputs/TextInput"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { AccessController, accessControllerFunction } from "../../../../components/AccessControler"
import { IDataListProject } from "../../../../helpers/Types"
import { useProject } from "../../../../hooks/useProjects"
import { DataList } from "../../../../components/Inputs/DataListInput"
import "../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"

const CreateIncident = () => {

    const { modalHook, useTicketHook, useIncidentHook, rol } = useIncidentContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { getProjects, projects } = useProject()
    const [selectedProject, setSelectedProject] = useState("")
    const [description, setDescription] = useState("")
    const [asunto, setAsunto] = useState("")

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        //Devuelve true si tiene permisos para esta acción
        if (accessControllerFunction(rol)) {
            useIncidentHook.createIncident({
                asunto: asunto,
                descripcion: description,
                id_proyecto: projects.find((project: IDataListProject) => project.value === selectedProject)?.id ?? 0,
                nombre_usuairo: userName
            }).then(success => {
                if (success) {
                    useTicketHook.getActiveTickets()
                    modalHook.closeModal()
                }
            })
        }
    }

    useEffect(() => {
        getProjects()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header py-4'>
                <h2>NUEVO INCIDENTE</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10'>
                <form onSubmit={handleSubmit}>
                    <div className="d-flex justify-content-center align-items-center gap-5 m-5 flex-column">
                        <DataList
                            value={selectedProject}
                            onChange={setSelectedProject}
                            items={projects}
                            required
                            label="Proyectos"
                        />
                        <Input label="Descripción" value={asunto} onChange={setAsunto} className="w-400px" required={true} />
                        <Input label="Detalle" value={description} onChange={setDescription} className="w-400px" required={true} />
                    </div>
                    <div className="d-flex justify-content-end gap-5">
                        <AccessController
                            rol={rol}
                        >
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={useIncidentHook.createIncidentLoading}
                            >
                                {useIncidentHook.createIncidentLoading ? "Creando..." : "Crear"}
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
        </>
    )
}

export { CreateIncident }
