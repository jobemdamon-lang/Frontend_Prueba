import { useEffect, useState } from "react"
import { Input } from "../../../../components/Inputs/TextInput"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useAplicationContext } from "../Context"
import { Button } from "react-bootstrap"
import { useProject } from "../../../../hooks/useProjects"
import { DataList } from "../../../../components/Inputs/DataListInput"

const InsertIntegration = () => {
    const { modalHook, integrationHook } = useAplicationContext()
    const { projects, getProjects, loadingGetProjects } = useProject()
    const [selectedProyect, setSelectedProject] = useState('')
    const [nameIntegration, setNameIntegration] = useState('')
    useEffect(() => {
        getProjects()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (

        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">AGREGAR NUEVA INTEGRACIÓN</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>

            <div className="d-flex justify-content-center align-items-end mb-5 gap-10 bg-Light" style={{ borderRadius: '10px', border: '1px gray' }}>
                <div className="d-flex align-items-end gap-3">
                    <DataList
                        items={projects}
                        label="PROYECTOS"
                        value={selectedProyect}
                        onChange={setSelectedProject}
                        loading={loadingGetProjects}
                    />
                    <Input
                        label='NOMBRE NUEVA INTEGRACIÓN'
                        onChange={setNameIntegration}
                        value={nameIntegration}
                        className="w-200px" />

                    <Button
                        disabled={integrationHook.loadingCreateIntegration}
                        className="btn btn-success"
                        onClick={() => {
                            integrationHook.createIntegration({
                                id_proyecto: projects.find((project) => project.value === selectedProyect)?.id ?? 0,
                                nombre: nameIntegration
                            })
                            .then((success) => {
                                if (success) {
                                    integrationHook.getLisAlltIntegration()
                                    modalHook.closeModal()
                                }
                            })
                        }} >
                        GUARDAR
                    </Button>
                </div>
            </div>


        </>
    )
}
export { InsertIntegration }


