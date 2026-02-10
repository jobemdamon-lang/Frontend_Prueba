import React, { useState } from "react"
import { Input } from "../../../../components/Inputs/TextInput"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { warningNotification } from "../../../../helpers/notifications"
import { useAttribute } from "../../hooks/useAttribute"
import { useDataFromMonitorOptions } from "../../hooks/useDataFromMonitorOptions"
import { useAdministrateCMDBContext } from "../Context"

const AddAtributteSection = () => {

    const [selectedFamily, setSelectedFamily] = useState("")
    const [selectedClase, setSelectedClase] = useState("")
    const [atributte, setAtributte] = useState("")
    const [typeAttribute, setTypeAttribute] = useState("SIMPLE")
    const [typeValue, setTypeValue] = useState("")
    const { familyData, familyLoading, typeAttributes, typeAttLoading, typeData, typeDataLoading } = useAdministrateCMDBContext()
    const monitorOptionsHook = useDataFromMonitorOptions()
    const attributeHook = useAttribute()

    const handleCreateAttribute = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (atributte.trim().includes(" ")) {
            warningNotification("El atributo no puede contener espacios, remplace los espacios por un guión bajo _"); return
        }
        const elementClase = monitorOptionsHook.claseData.find(clase => clase.nombre === selectedClase)
        const typeAttItem = typeAttributes.find(att => att.nombre === typeAttribute)
        const typeValueItem = typeData.find(type => type.nombre === typeValue)
        if (elementClase && typeAttItem) {
            attributeHook.createAttribute(elementClase.codigo, {
                nombre: atributte.toUpperCase(),
                id_tipo_atributo: typeAttItem.codigo,
                id_tipo_dato: typeValueItem?.codigo ?? 0
            }).then(success => {
                if (success) setAtributte("")
            })
        } else {
            warningNotification("Seleccione una clase, tipo de atributo válidos para la creación.")
        }
    }

    return (
        <section className="card" style={{ minWidth: "600px" }}>
            <header className="p-8">
                <h4 className="text-start text-uppercase m-0">Crear Atributo</h4>
                <p className="fw-light m-0">Añada nuevos atributos personalizados a la clase seleccionada.</p>
            </header>
            <hr className="text-dark w-100 m-0" style={{ opacity: "0.1" }} />
            <form onSubmit={handleCreateAttribute} className="d-flex flex-column">
                <div className="d-flex gap-5 justify-content-around p-5 mb-3">
                    <SelectInput
                        label="Familia"
                        value={selectedFamily}
                        onChange={setSelectedFamily}
                        data={familyData}
                        loading={familyLoading}
                        dependencyfunction={monitorOptionsHook.getClase}
                        required
                    />
                    <SelectInput
                        label="Clase"
                        value={selectedClase}
                        onChange={setSelectedClase}
                        data={monitorOptionsHook.claseData}
                        loading={monitorOptionsHook.claseLoading}
                        required
                    />
                </div>
                <div className="d-flex gap-5 justify-content-around p-5 mb-3">
                    <SelectInput
                        label="Tipo de Atributo"
                        value={typeAttribute}
                        onChange={setTypeAttribute}
                        data={typeAttributes}
                        loading={typeAttLoading}
                        required
                    />
                    <div>
                        <SelectInput
                            label="Tipo de Dato"
                            value={typeValue}
                            onChange={setTypeValue}
                            data={typeData}
                            loading={typeDataLoading}
                            disabled={typeAttribute !== "SIMPLE"}
                            required={typeAttribute === "SIMPLE"}
                        />
                        <i className="text-info">
                            {typeAttribute === "SIMPLE" ? "Escoja el Tipo de dato que se usará" : "No Aplica."}
                        </i>
                    </div>
                </div>
                <div className="px-8 mb-3">
                    <Input
                        label="Nuevo Atributo"
                        value={atributte.toUpperCase()}
                        onChange={setAtributte}
                        disabled={attributeHook.loadingAddAttribute}
                        required
                    />
                </div>
                <button
                    disabled={attributeHook.loadingAddAttribute}
                    className="btn btn-success mx-8 my-5"
                >
                    {attributeHook.loadingAddAttribute ? "Creando" : "Crear Atributo"}
                </button>
            </form>
        </section>
    )
}

export { AddAtributteSection }