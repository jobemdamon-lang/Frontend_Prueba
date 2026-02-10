import { useEffect, useState } from "react"
import { Input } from "../../../../components/Inputs/TextInput"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { useAdministrateCMDBContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { Tab, Tabs } from "../../../../components/Tabs"
import { useDataFromMonitorOptions } from "../../hooks/useDataFromMonitorOptions"

const UpdateFamilyClase = () => {

    const [selectedFamilyToUpdate, setSelectedFamilyToUpdate] = useState("")
    const [updatedFamily, setUpdatedFamily] = useState("")
    const [selectedFamily, setSelectedFamily] = useState("")
    const [selectedClase, setSelectedClase] = useState("")
    const [updatedClase, setUpdatedClase] = useState("")
    const monitorOptionsHook = useDataFromMonitorOptions()
    const { modalHook, familyclaseHook } = useAdministrateCMDBContext()

    const handleChangeFamilyToUpdate = (family: string) => {
        setSelectedFamilyToUpdate(family)
        setUpdatedFamily(family)
    }

    const handleChangeClaseToUpdate = (clase: string) => {
        setSelectedClase(clase)
        setUpdatedClase(clase)
    }

    const handleUpdateFamilyName = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        familyclaseHook.updateFamilyName(selectedFamilyToUpdate, {
            familia: updatedFamily.toUpperCase()
        }).then(success => {
            if (success) modalHook.closeModal()
        })
    }

    const handleUpdateClaseName = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const claseToUpdate = monitorOptionsHook.claseData.find(clase => clase.nombre.toUpperCase() === selectedClase.toUpperCase())
        if (claseToUpdate) {
            familyclaseHook.updateClaseName(claseToUpdate.codigo, {
                clase: updatedClase.toUpperCase()
            }).then(success => {
                if (success) modalHook.closeModal()
            })
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { monitorOptionsHook.getFamilia() }, [])

    return (

        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">Actualizar Familia y Clase</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                <Tabs>
                    <Tab title="FAMILIA">
                        <form className="d-flex flex-column gap-5" onSubmit={handleUpdateFamilyName}>
                            <SelectInput
                                label="Familia a actualizar"
                                value={selectedFamilyToUpdate}
                                onChange={handleChangeFamilyToUpdate}
                                data={monitorOptionsHook.familyData}
                                loading={monitorOptionsHook.familyLoading}
                                required
                            />
                            <Input
                                label="Nuevo nombre de Familia"
                                value={updatedFamily}
                                onChange={setUpdatedFamily}
                                required
                            />
                            <button
                                type="submit"
                                disabled={familyclaseHook.loadingUpdateFamilyName}
                                className="btn btn-success align-self-end"
                            >
                                {familyclaseHook.loadingUpdateFamilyName ? "Actualizando" : "Actualizar"}
                            </button>
                        </form>

                    </Tab>
                    <Tab title="CLASE">
                        <form className="d-flex flex-column gap-5" onSubmit={handleUpdateClaseName}>
                            <SelectInput
                                label="Familia"
                                value={selectedFamily}
                                onChange={setSelectedFamily}
                                data={monitorOptionsHook.familyData}
                                loading={monitorOptionsHook.familyLoading}
                                dependencyfunction={monitorOptionsHook.getClase}
                                required
                            />
                            <SelectInput
                                label="Clase a actualizar"
                                value={selectedClase}
                                onChange={handleChangeClaseToUpdate}
                                data={monitorOptionsHook.claseData}
                                loading={monitorOptionsHook.claseLoading}
                                required
                            />
                            <Input
                                label="Nuevo nombre de Clase"
                                value={updatedClase}
                                onChange={setUpdatedClase}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-success align-self-end"
                                disabled={familyclaseHook.loadingUpdateClaseName}
                            >
                                {familyclaseHook.loadingUpdateClaseName ? "Actualizando" : "Actualizar"}
                            </button>
                        </form>
                    </Tab>
                </Tabs>
            </div>
        </>

    )
}
export { UpdateFamilyClase }