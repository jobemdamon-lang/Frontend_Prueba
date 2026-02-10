
import { TextInput } from "../../../../../components/Inputs/TextInput";
import { useLinuxPatchContext } from "../../Context";
import { useEffect, useState } from "react";
import { AccessController } from "../../../../../components/AccessControler";

import { SelectInput } from "../../../../../components/Inputs/SelectInput";
import { DNDType, IListTemplate } from "../../../Types";
import { warningNotification } from "../../../../../helpers/notifications";
import { useTypedSelector } from "../../../../../store/ConfigStore";
import { Draggable } from "./Draggable";
import { dataDraggable, isValidTemplate } from "../../../utils";

const UpdateTemplate = () => {

    const [templateName, setTemplateName] = useState("")
    const [selectedTemplate, setSelectedTemplate] = useState<IListTemplate>({ ID_PLANTILLA: 0, NOMBRE: "" } as IListTemplate)
    const [routineContainers, setRoutineContainer] = useState<DNDType[]>([])
    const { rol, templateHook, modalHook } = useLinuxPatchContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!isValidTemplate(routineContainers[1].items)) return;

        templateHook.updateTemplate({
            usuario: userName,
            nombre_plantilla: templateName,
            id_plantilla: selectedTemplate.ID_PLANTILLA,
            lista_pasos: routineContainers[1].items.map(item => parseInt(item.id_item.toString().split('-')[1]))
        }).then(success => {
            if (success) modalHook.closeModal()
        })
    }

    const handleDeleteTemplate = () => {
        if (selectedTemplate.ID_PLANTILLA === 0) {
            warningNotification("Seleccione una Plantilla para su eliminación")
            return
        }
        templateHook.deleteTemplate(selectedTemplate.ID_PLANTILLA).then(success => {
            if (success) modalHook.closeModal()
        })
    }

    const handleChangeTemplateSelected = (nameTemplate: string) => {
        const template = templateHook.templatesData.find(template => template.NOMBRE === nameTemplate)
        if (!template) return;
        templateHook.getListAWXRoutinesOfTemplate(template.ID_PLANTILLA)
        setSelectedTemplate(template)
        setTemplateName(template.NOMBRE)
    }

    useEffect(() => {
        if (selectedTemplate.NOMBRE === '') {
            setRoutineContainer([])
        } else {
            setRoutineContainer(
                dataDraggable({
                    actualTitle: selectedTemplate.NOMBRE,
                    titleOriginal: 'Rutinarias Linux',
                    originalData: templateHook.awxRoutinesData.filter(awxRoutine =>
                        !templateHook.awxRoutinesOfTemplateData.map(awx => awx.ID_RUTINARIA).includes(awxRoutine.ID_RUTINARIA)
                    ),
                    actualData: templateHook.awxRoutinesOfTemplateData
                }))
        }
    }, [templateHook.awxRoutinesData, templateHook.awxRoutinesOfTemplateData, selectedTemplate])


    return (
        <div className="d-flex flex-column">
            <form onSubmit={handleSubmit} className="d-flex gap-5 align-items-end justify-content-center">
                <TextInput
                    required
                    label="Nombre de la Plantilla de Ejecución"
                    value={templateName}
                    setNewValue={setTemplateName}
                />
                <SelectInput
                    required
                    onChange={handleChangeTemplateSelected}
                    label="Plantillas"
                    value={selectedTemplate.NOMBRE}
                    data={templateHook.templatesData.map(template => ({ codigo: template.ID_PLANTILLA, nombre: template.NOMBRE }))}
                    loading={templateHook.getListTemplateLoading}
                />
                <AccessController rol={rol}>
                    <button
                        className="btn btn-success"
                        type="submit"
                        disabled={templateHook.updateTemplateLoading || templateHook.getListAWXoutinesOfTemplateLoading}
                    >
                        {templateHook.updateTemplateLoading ? "Actualizando..." : "Actualizar"}
                    </button>
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={handleDeleteTemplate}
                        disabled={templateHook.deleteTemplateLoading || templateHook.getListAWXoutinesOfTemplateLoading}
                    >
                        {templateHook.deleteTemplateLoading ? "Eliminando..." : "Eliminar"}
                    </button>
                </AccessController>
            </form>
            <Draggable
                routineContainers={routineContainers}
                setRoutineContainer={setRoutineContainer}
                loading={templateHook.getListAWXoutinesLoading || templateHook.getListAWXoutinesOfTemplateLoading}
            />
        </div>
    )
}

export { UpdateTemplate }