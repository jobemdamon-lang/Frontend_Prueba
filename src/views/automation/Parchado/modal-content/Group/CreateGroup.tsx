import { FC, useState } from "react"
import { TextInput } from "../../../../../components/Inputs/TextInput"
import { useTypedSelector } from "../../../../../store/ConfigStore"
import { useWindowsPatchContext } from "../../Context"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { OPERATE_SYSTEMS } from "../../../Types"
import { AccessController } from "../../../../../components/AccessControler"
import { AnalyticsService } from "../../../../../helpers/analytics"

type Props = { OPERATE_SYSTEM_ENV: OPERATE_SYSTEMS }
const CreateGroup: FC<Props> = ({ OPERATE_SYSTEM_ENV }) => {

    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const { groupHook, rol, templateHook } = useWindowsPatchContext()
    //Estados para la creacion de un grupo con una plantilla de ejecución asociada
    const [groupName, setGroupName] = useState("")
    const [associateTemplate, setAssociateTemplate] = useState('')

    const handleCreateGroup = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        AnalyticsService.event("create_group", { module: "parchado" });
        const template = templateHook.templatesData.find(template => template.NOMBRE === associateTemplate)
        if (!template) return;
        groupHook.createGroup({
            id_plantilla: template.ID_PLANTILLA,
            id_grupo: 0,
            usuario: userName,
            nombre: groupName,
            sistema_operativo: OPERATE_SYSTEM_ENV
        }).then(success => {
            if (success) {
                groupHook.getListGroups(OPERATE_SYSTEM_ENV)
                setAssociateTemplate('')
                setGroupName('')
            }
        })
    }

    return (
        <form onSubmit={handleCreateGroup} className="d-flex justify-content-around align-items-end">
            <TextInput
                label="Nombre del Grupo"
                value={groupName}
                setNewValue={setGroupName}
                required
            />
            <SelectInput
                label="Plantilla Asociada"
                value={associateTemplate}
                data={templateHook.templatesData.map(template => ({ codigo: template.ID_PLANTILLA, nombre: template.NOMBRE }))}
                onChange={setAssociateTemplate}
                loading={templateHook.getListTemplateLoading}
                required
            />
            <AccessController rol={rol}>
                <button
                    className="btn btn-success"
                    type="submit"
                    disabled={groupHook.isCreateLoading}
                >
                    {groupHook.isCreateLoading ? "Creando..." : "Crear Grupo"}
                </button>
            </AccessController>
        </form>
    )
}

export { CreateGroup }