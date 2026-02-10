import { useState } from "react"
import { Input } from "../../../../components/Inputs/TextInput"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { useAdministrateCMDBContext } from "../Context"
import { warningNotification } from "../../../../helpers/notifications"
import { KTSVG } from "../../../../helpers/components/KTSVG"

const CreateFamilyClase = () => {

    const [nameFamily, setNameFamily] = useState("")
    const [nameClase, setNameClase] = useState("")
    const [selectedFamily, setSelectedFamily] = useState("")
    const { modalHook, familyData, familyLoading, familyclaseHook } = useAdministrateCMDBContext()

    const handleCreateFamilyClase = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (selectedFamily !== "" && nameFamily !== "") {
            warningNotification("Elija solo una Familia")
        } else {
            familyclaseHook.createFamilyClase({
                familia: nameFamily !== "" ? nameFamily : selectedFamily,
                clase: nameClase
            }).then(sucess => {
                if (sucess) modalHook.closeModal()
            })
        }
    }

    return (

        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">Crear Familia y Clase</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                <form className="d-flex justify-content-center align-items-center gap-10 pb-5 flex-wrap" onSubmit={handleCreateFamilyClase}>
                    <div className="d-flex flex-column gap-5 justify-content-center align-items-center">
                        <i className="text-center">Seleccione una familia existente o ingrese la nueva Familia.</i>
                        <SelectInput
                            label="Familias Existentes"
                            value={selectedFamily}
                            onChange={setSelectedFamily}
                            data={familyData}
                            loading={familyLoading}
                            required={nameFamily === ""}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-arrow-down-up" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5" />
                        </svg>
                        <Input
                            label="Nueva Familia"
                            value={nameFamily}
                            onChange={setNameFamily}
                            required={selectedFamily === ""}
                        />
                    </div>
                    <div className="d-flex gap-10">
                        <Input
                            label="Nombre Clase"
                            value={nameClase}
                            onChange={setNameClase}
                            required
                        />
                        <button
                            type="submit"
                            disabled={familyclaseHook.loadingCreateFamilyClase}
                            className="btn btn-success align-self-end"
                        >
                            {familyclaseHook.loadingCreateFamilyClase ? "Creando" : "Crear"}
                        </button>
                    </div>
                </form>
            </div>
        </>

    )
}
export { CreateFamilyClase }