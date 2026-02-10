import { useEffect, useState } from "react"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { useAdministrateCMDBContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useDataFromMonitorOptions } from "../../hooks/useDataFromMonitorOptions"

const DeleteRelationFamilyClase = () => {

    const [selectedFamilyParent, setSelectedFamilyParent] = useState("")
    const [selectedClaseParent, setSelectedClaseParent] = useState("")
    const [selectedFamilySon, setSelectedFamilySon] = useState("")
    const [selectedClaseSon, setSelectedClaseSon] = useState("")
    const monitorOptionsHookParent = useDataFromMonitorOptions()
    const monitorOptionsHookSSon = useDataFromMonitorOptions()
    const { modalHook, familyclaseHook } = useAdministrateCMDBContext()

    const handleCreateRelation = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const fc_parent = monitorOptionsHookParent.claseData.find(clase => clase.nombre === selectedClaseParent)
        const fc_son = monitorOptionsHookSSon.claseData.find(clase => clase.nombre === selectedClaseSon)
        if (fc_parent && fc_son) {
            familyclaseHook.deleteRelationFamilyClase({
                familia_clase_padre: fc_parent?.codigo,
                familia_clase_hijo: fc_son?.codigo
            }).then(success => {
                if (success) {
                    modalHook.closeModal()
                    familyclaseHook.getFamiliesWithClases()
                }
            })
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { monitorOptionsHookParent.getFamilia() }, [])

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">Eliminar Relacion Familia Clase</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                <form className="d-flex flex-column gap-5" onSubmit={handleCreateRelation}>
                    <div className="d-flex gap-10 justify-content-around align-items-center" >
                        <div className="d-flex flex-column gap-5 justify-content-center">
                            <h6 className="fw-normal">Familia y Clase Padre</h6>
                            <SelectInput
                                label="Familia"
                                value={selectedFamilyParent}
                                onChange={setSelectedFamilyParent}
                                data={monitorOptionsHookParent.familyData}
                                loading={monitorOptionsHookParent.familyLoading}
                                dependencyfunction={monitorOptionsHookParent.getClase}
                                required
                            />
                            <SelectInput
                                label="Clase"
                                value={selectedClaseParent}
                                onChange={setSelectedClaseParent}
                                data={monitorOptionsHookParent.claseData}
                                loading={monitorOptionsHookParent.claseLoading}
                                required
                            />
                        </div>
                        <div className="d-flex flex-column gap-5 justify-content-around">
                        <h6 className="fw-normal">Familia y Clase Hijo</h6>
                            <SelectInput
                                label="Familia"
                                value={selectedFamilySon}
                                onChange={setSelectedFamilySon}
                                data={monitorOptionsHookParent.familyData}
                                loading={monitorOptionsHookParent.familyLoading}
                                dependencyfunction={monitorOptionsHookSSon.getClase}
                                required
                            />
                            <SelectInput
                                label="Clase"
                                value={selectedClaseSon}
                                onChange={setSelectedClaseSon}
                                data={monitorOptionsHookSSon.claseData}
                                loading={monitorOptionsHookSSon.claseLoading}
                                required
                            />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center gap-10 mt-5">
                        <button
                            type="submit"
                            className="btn btn-success align-self-end"
                            disabled={familyclaseHook.loadingDeleteRelationFamilyClase}
                        >
                            {familyclaseHook.loadingDeleteRelationFamilyClase ? "Eliminar" : "Eliminando"}
                        </button>
                        <button className="btn btn-danger" onClick={() => modalHook.closeModal()}>
                            Cerrar
                        </button>
                    </div>

                </form>
            </div>
        </>

    )
}
export { DeleteRelationFamilyClase }