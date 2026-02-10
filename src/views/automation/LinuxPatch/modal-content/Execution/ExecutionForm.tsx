import { FC } from "react"
import { TagInput } from "../../../../../components/Inputs/TagInput"
import { Input } from "../../../../../components/Inputs/TextInput"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { useLinuxPatchContext } from "../../Context"
import { IExecutionConfiguration } from "../../../Types"
import { handleAdd, handleRemove } from "./utils"

const ExecutionForm: FC<Props> = ({
    handleSubmit,
    executionConfiguration,
    setExecutionConfiguration,
    handleInitSearch
}) => {

    const { modalHook, executionHook, groupHook } = useLinuxPatchContext()

    return (
        <form
            className="d-flex justify-content-between flex-column w-100 p-5"
            onSubmit={handleSubmit}
        >
            <div className="d-flex flex-column gap-5">
                <TagInput
                    label="Exclusiones"
                    value={executionConfiguration.actual_exclusion}
                    loading={groupHook.getListGroupsServersLinux}
                    items={groupHook.linuxFormConfigurationData.exclusions}
                    enableCustom
                    onChange={(value) => {
                        setExecutionConfiguration((prev) => ({ ...prev, actual_exclusion: value }))
                    }}
                    onAddCustom={() => {
                        handleAdd({
                            property: 'exclusion',
                            setState: setExecutionConfiguration,
                            sourceData: groupHook.linuxFormConfigurationData.exclusions,
                            stateData: executionConfiguration.exclusions,
                            value: executionConfiguration.actual_exclusion
                        })
                    }}
                    onTagAdd={(value) => {
                        handleAdd({
                            property: 'exclusion',
                            setState: setExecutionConfiguration,
                            sourceData: groupHook.linuxFormConfigurationData.exclusions,
                            stateData: executionConfiguration.exclusions,
                            value: value
                        })
                    }}
                    onTagRemove={(id) => {
                        handleRemove({
                            id: id,
                            property: 'exclusion',
                            setState: setExecutionConfiguration
                        })
                    }}
                    tags={executionConfiguration.exclusions}
                />
                <Input
                    placeholder="user@domain.com"
                    label="Red Hat - Ingrese usuario"
                    value={executionConfiguration.redhat_user}
                    onChange={(value) => setExecutionConfiguration((prev) => ({ ...prev, redhat_user: value }))}
                />
                <Input
                    placeholder="********"
                    type="password"
                    label="Red Hat - Ingrese la credencial"
                    value={executionConfiguration.redhat_credential}
                    onChange={(value) => setExecutionConfiguration((prev) => ({ ...prev, redhat_credential: value }))}
                />
                <TagInput
                    label="SUSE OS - Categorias"
                    value={executionConfiguration.actual_suse_category}
                    loading={groupHook.getListGroupsServersLinux}
                    items={groupHook.linuxFormConfigurationData.suse_categoria}
                    onTagAdd={(value) => {
                        handleAdd({
                            property: 'category',
                            setState: setExecutionConfiguration,
                            sourceData: groupHook.linuxFormConfigurationData.suse_categoria,
                            stateData: executionConfiguration.suse_categories,
                            value: value
                        })
                    }}
                    onTagRemove={(id) => {
                        handleRemove({
                            id: id,
                            property: 'category',
                            setState: setExecutionConfiguration
                        })
                    }}
                    tags={executionConfiguration.suse_categories}
                />
                <TagInput
                    label="SUSE OS Severidad"
                    value={executionConfiguration.actual_suse_severity}
                    loading={groupHook.getListGroupsServersLinux}
                    items={groupHook.linuxFormConfigurationData.suse_severity}
                    onTagAdd={(value) => {
                        handleAdd({
                            property: 'severity',
                            setState: setExecutionConfiguration,
                            sourceData: groupHook.linuxFormConfigurationData.suse_severity,
                            stateData: executionConfiguration.suse_severities,
                            value: value
                        })
                    }}
                    onTagRemove={(id) => {
                        handleRemove({
                            id: id,
                            property: 'severity',
                            setState: setExecutionConfiguration
                        })
                    }}
                    tags={executionConfiguration.suse_severities}
                />
                <SelectInput
                    label="SUSE Opcional"
                    value={executionConfiguration.actual_suse_optional}
                    onChange={(value) => setExecutionConfiguration((prev) => ({ ...prev, actual_suse_optional: value }))}
                    data={[{ codigo: 112233, nombre: 'SI' }, { codigo: 445566, nombre: 'NO' }]}
                    className="w-100"
                />
            </div>
            <div className="d-flex justify-content-end align-items-end gap-5 pt-5">
                <ToolTip
                    placement="top-start"
                    message="Guarde la configuración para ser ejecutada posteriormente."
                >
                    <button
                        type="submit"
                        disabled={executionHook.createConfigurationLinuxLoading}
                        className="btn btn-sm btn-success"
                    >
                        {executionHook.createConfigurationLinuxLoading &&
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        }
                        {executionHook.createConfigurationLinuxLoading ? ' Guardando' : 'Guardar'}
                    </button>
                </ToolTip>
                <ToolTip
                    placement="top-start"
                    message="Ejecute una busqueda de parches en los grupos seleccionados."
                >
                    <button
                        type="button"
                        disabled={executionHook.executeSearchLinuxLoading}
                        onClick={handleInitSearch}
                        className="btn btn-sm btn-success"
                    >
                        {executionHook.executeSearchLinuxLoading &&
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        }
                        {executionHook.executeSearchLinuxLoading ? ' Ejecutando' : 'Ejecutar Busqueda'}
                    </button>
                </ToolTip>
                <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => modalHook.closeModal()}
                >
                    Cerrar
                </button>
            </div>
        </form>
    )
}

export { ExecutionForm }

type Props = {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
    handleInitSearch: () => void,
    setExecutionConfiguration: React.Dispatch<React.SetStateAction<IExecutionConfiguration>>,
    executionConfiguration: IExecutionConfiguration
}
