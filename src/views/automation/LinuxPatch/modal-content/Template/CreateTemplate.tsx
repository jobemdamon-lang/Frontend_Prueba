
import { TextInput } from "../../../../../components/Inputs/TextInput";
import { useLinuxPatchContext } from "../../Context";
import { FC, useEffect, useState } from "react";
import { AccessController } from "../../../../../components/AccessControler";
import { Draggable } from "./Draggable";
import { useTypedSelector } from "../../../../../store/ConfigStore";
import { DNDType, OPERATE_SYSTEMS } from "../../../Types";
import { dataDraggable, isValidTemplate } from "../../../utils";

type Props = { OPERATE_SYSTEM_ENV: OPERATE_SYSTEMS }
const CreateTemplate: FC<Props> = ({ OPERATE_SYSTEM_ENV }) => {

    const [templateName, setTemplateName] = useState("")
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [routineContainers, setRoutineContainer] = useState<DNDType[]>([])
    const { rol, templateHook } = useLinuxPatchContext()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!isValidTemplate(routineContainers[1].items)) return;

        templateHook.createTemplate({
            nombre_plantilla: templateName,
            usuario: userName,
            lista_pasos: routineContainers[1].items.map(item => parseInt(item.id_item.toString().split('-')[1])),
            sistema_operativo: OPERATE_SYSTEM_ENV
        }).then(success => {
            if (success) templateHook.getListTemplate("LINUX")
        })
    }

    useEffect(() => {
        setRoutineContainer(dataDraggable({
            actualTitle: 'Nueva Plantilla',
            titleOriginal: 'Rutinarias Linux',
            originalData: templateHook.awxRoutinesData,
            actualData: []
        }))
    }, [templateHook.awxRoutinesData, templateHook.getListAWXoutinesLoading])

    return (
        <div className="d-flex flex-column">
            <form onSubmit={handleSubmit} className="d-flex gap-5 align-items-end justify-content-center">
                <TextInput
                    required
                    label="Nombre de la Plantilla de Ejecución"
                    value={templateName}
                    setNewValue={setTemplateName}
                />
                <AccessController rol={rol}>
                    <button
                        disabled={templateHook.createTemplatesLoading}
                        className="btn btn-success"
                    >
                        {templateHook.createTemplatesLoading ? "Creando..." : "Crear Plantilla"}
                    </button>
                </AccessController>
            </form>
            <Draggable
                routineContainers={routineContainers}
                setRoutineContainer={setRoutineContainer}
                loading={templateHook.getListAWXoutinesLoading}
            />
        </div>
    )
}

export { CreateTemplate }
