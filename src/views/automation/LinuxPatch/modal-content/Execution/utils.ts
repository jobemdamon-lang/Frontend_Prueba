import { cloneDeep } from "lodash";
import { IDataListFormat } from "../../../../../helpers/Types";
import { warningNotification } from "../../../../../helpers/notifications";
import { ICreateConfigurationLinux, IExecuteTemplateLinux, IExecutionConfiguration, IGroupsWithServersLinux, IGroupsWithServersLinuxFront, ILinuxConfigurationSaved, ListaServidoresLinux } from "../../../Types";
import uniqid from "uniqid";

const handleAdd = ({
    value,
    property,
    sourceData,
    stateData,
    setState
}: {
    value: string,
    property: 'exclusion' | 'category' | 'severity',
    sourceData: IDataListFormat[],
    stateData: IDataListFormat[],
    setState: React.Dispatch<React.SetStateAction<IExecutionConfiguration>>
}) => {
    const selectedOption = sourceData.find(exclusion => exclusion.value === value) ?? {
        id: uniqid(),
        value: value
    }
    if (stateData.some(node => node.value === value)) {
        warningNotification('Ya se incluyo esta selección');
        return;
    }
    setState((prev) => {
        if (property === 'exclusion') {
            return { ...prev, exclusions: [...prev.exclusions, selectedOption] }
        } else if (property === 'category') {
            return { ...prev, suse_categories: [...prev.suse_categories, selectedOption] }
        } else {
            return { ...prev, suse_severities: [...prev.suse_severities, selectedOption] }
        }
    })
}

const handleRemove = ({
    id,
    property,
    setState
}: {
    id: string | number,
    property: 'exclusion' | 'category' | 'severity',
    setState: React.Dispatch<React.SetStateAction<IExecutionConfiguration>>
}) => {

    setState((prev) => {
        if (property === 'exclusion') {
            return { ...prev, exclusions: [...prev.exclusions].filter(exclusion => exclusion.id !== id) }
        } else if (property === 'category') {
            return { ...prev, suse_categories: [...prev.suse_categories].filter(category => category.id !== id) }
        } else {
            return { ...prev, suse_severities: [...prev.suse_severities].filter(severity => severity.id !== id) }
        }
    })

}

const isAnyArrayEmpty = (lists: any[][]) => {
    return lists.some(list => list.length === 0)
}

const addCheckInGroups = (groupsWithServers: IGroupsWithServersLinux[]): IGroupsWithServersLinuxFront[] => {
    const transformedData = groupsWithServers.map(group => {
        return ({
            ...group,
            CHECK: false
        })
    })
    return transformedData
}

const addCheckInGroupsAndValue = (groupsWithServers: IGroupsWithServersLinux[], configuratioSaved: ILinuxConfigurationSaved): IGroupsWithServersLinuxFront[] => {
    const transformedData = groupsWithServers.map(group => {
        return ({
            ...group,
            CHECK: configuratioSaved.LISTA_GRUPOS.map(group => group.ID_GRUPO).includes(group.ID_GRUPO)
        })
    })
    return transformedData
}

const unCheckGroup = (groupsData: IGroupsWithServersLinuxFront[], idGroup: number, checked: boolean): IGroupsWithServersLinuxFront[] => {
    const clone = cloneDeep(groupsData)
    const updatedGroup = clone.findIndex(group => group.ID_GRUPO === idGroup)
    clone[updatedGroup].CHECK = checked
    return clone
}

const initConfigurationSaved = (configurationSaved: ILinuxConfigurationSaved): IExecutionConfiguration => {
    const configuration: IExecutionConfiguration = {
        client: '',
        actual_exclusion: '',
        actual_suse_category: '',
        actual_suse_optional: configurationSaved.SUSE_OPCIONAL ?? '',
        actual_suse_severity: '',
        exclusions: configurationSaved.EXCLUSION ? configurationSaved.EXCLUSION.split(',').map(exclusion => ({
            id: uniqid(),
            value: exclusion
        })) : [],
        redhat_credential: configurationSaved.RED_HAT_CREDENTIALS ?? '',
        redhat_user: configurationSaved.RED_HAT_USER ?? '',
        suse_categories: configurationSaved.SUSE_CATEGORIA ? configurationSaved.SUSE_CATEGORIA.split(',').map(exclusion => ({
            id: uniqid(),
            value: exclusion
        })) : [],
        suse_severities: configurationSaved.SUSE_SEVERIDAD ? configurationSaved.SUSE_SEVERIDAD.split(',').map(exclusion => ({
            id: uniqid(),
            value: exclusion
        })) : [],
        ticket_cambio: configurationSaved.CRQ ?? ''
    }
    return configuration
}


const calculateFirstRoutineFailed = (server: ListaServidoresLinux): number => {
    return server.lista_rutinaria.filter(step => step.es_error === 1)[0]?.id_ejecucion_detalle ?? 0
}
const canReexecute = (server: ListaServidoresLinux): boolean => {
    return server.lista_rutinaria.every(step => step.is_executed === 1) &&
        !server.lista_rutinaria.some(step => step.es_error === 1) &&
        server.lista_rutinaria.some(step => (step.fecha_fin === undefined || step.fecha_fin === null))
}

const routineActuallyExecuting = (server: ListaServidoresLinux): number => {
    return server.lista_rutinaria?.filter(step => step.is_executed === 1 && !step?.fecha_fin)[0]?.id_ejecucion_detalle ?? 0
}

const customStylesToAWXLogs = `
body pre {color: white}
.ansi_fore { color: #000000; }
.ansi_back { background-color: #F5F5F5; }
.ansi_fore.ansi_dark { color: #AAAAAA; }
.ansi_back.ansi_dark { background-color: #000000; }
.ansi1 { font-weight: bold; }
.ansi3 { font-weight: italic; }
.ansi4 { text-decoration: underline; }
.ansi9 { text-decoration: line-through; }
.ansi30 { color: #d1dded; }
.ansi31 { color: #d9534f; }
.ansi32 { color: #5cb85c; }
.ansi33 { color: #f0ad4e; }
.ansi34 { color: #337ab7; }
.ansi35 { color: #e1539e; }
.ansi36 { color: #2dbaba; }
.ansi37 { color: #ffffff; }
.ansi40 { background-color: #161b1f; }
.ansi41 { background-color: #d9534f; }
.ansi42 { background-color: #5cb85c; }
.ansi43 { background-color: #f0ad4e; }
.ansi44 { background-color: #337ab7; }
.ansi45 { background-color: #e1539e; }
.ansi46 { background-color: #2dbaba; }
.ansi47 { background-color: #ffffff; }
body.ansi_back pre {
  font-family: Monaco, Menlo, Consolas, "Courier New", monospace;
  font-size: 12px;
}
div.ansi_back.ansi_dark {
  padding: 0 8px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
}
`;

const buildBodyToSaveConfiguration = (
    executionConfiguration: IExecutionConfiguration,
    userName: string,
    groupsWithServer: IGroupsWithServersLinuxFront[]
): ICreateConfigurationLinux => {
    const configurationLinux: ICreateConfigurationLinux = {
        cliente: executionConfiguration.client,
        red_hat_user: executionConfiguration.redhat_user,
        red_hat_credential: executionConfiguration.redhat_credential,
        crq: executionConfiguration.ticket_cambio,
        lista_excluido: executionConfiguration.exclusions.map(exclusion => exclusion.value),
        lista_suse_categoria: executionConfiguration.suse_categories.map(exclusion => exclusion.value),
        lista_suse_severidad: executionConfiguration.suse_severities.map(exclusion => exclusion.value),
        suse_opcional: executionConfiguration.actual_suse_optional,
        usuario: userName,
        lista_programacion: groupsWithServer
            .filter(group => group.CHECK)
            .map(group => ({
                id_grupo: group.ID_GRUPO,
                lista_servidores: group.SERVIDORES.map(server => ({
                    id_servidor: server.ID_EQUIPO
                }))
            }))
    }
    return configurationLinux
}

const buildBodyToExecuteTemplate = (
    executionConfiguration: IExecutionConfiguration,
    userName: string,
    groupsWithServer: IGroupsWithServersLinuxFront[]
): IExecuteTemplateLinux => {
    const configurationLinux: IExecuteTemplateLinux = {
        cliente: executionConfiguration.client,
        red_hat_user: executionConfiguration.redhat_user,
        red_hat_credential: executionConfiguration.redhat_credential,
        crq: executionConfiguration.ticket_cambio,
        lista_excluido: executionConfiguration.exclusions.map(exclusion => exclusion.value),
        lista_suse_categoria: executionConfiguration.suse_categories.map(exclusion => exclusion.value),
        lista_suse_severidad: executionConfiguration.suse_severities.map(exclusion => exclusion.value),
        suse_opcional: executionConfiguration.actual_suse_optional,
        usuario: userName,
        lista_programacion: groupsWithServer
            .filter(group => group.CHECK)
            .map(group => (group.ID_GRUPO))
    }
    return configurationLinux
}

export {
    handleAdd,
    handleRemove,
    isAnyArrayEmpty,
    addCheckInGroups,
    unCheckGroup,
    addCheckInGroupsAndValue,
    initConfigurationSaved,
    calculateFirstRoutineFailed,
    canReexecute,
    routineActuallyExecuting,
    customStylesToAWXLogs,
    buildBodyToSaveConfiguration,
    buildBodyToExecuteTemplate
}