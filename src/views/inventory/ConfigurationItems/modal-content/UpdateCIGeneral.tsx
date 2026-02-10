import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IConfigurationItem } from "../../Types"
import { notNull, separateProjectNameAndALP } from "../../../../helpers/general"
import { Input } from "../../../../components/Inputs/TextInput"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { useEffect, useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { useProject } from "../../../../hooks/useProjects"
import { useClient } from "../../../../hooks/useClient"
import { useCI } from "../../hooks/useCI"
import { changeFormatToSendUpdate } from "../../hooks/utils"

const UpdateCIGeneral = () => {

    const { modalHook, monitorOptionsHook, handleListCIs } = useConfigurationItemsContext()
    const clientHook = useClient()
    const projectHook = useProject()
    const CIHooks = useCI()
    const modalInformation: IConfigurationItem = modalHook.modalInformation
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [updatedCIInformation, updateCIInformation] = useState<IConfigurationItem>(modalInformation)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        CIHooks.updateGeneralInformationCI({
            ...changeFormatToSendUpdate(updatedCIInformation, userName),
            id_proyecto: projectHook.projects.find(project => project.value === updatedCIInformation.ALP + "-" + updatedCIInformation.PROYECTO)?.id.toString() ?? "0"
        }).then((success) => {
            if (success) {
                modalHook.closeModal()
                handleListCIs()
            }
        })
    }

    useEffect(() => {
        console.log(updatedCIInformation.ALP + "-" + updatedCIInformation.PROYECTO)
        clientHook.getClients()
        projectHook.getProjects(modalInformation.CLIENTE ?? "")
        monitorOptionsHook.getScopesTypes(updatedCIInformation.ADMINISTRADOR ?? "")
        monitorOptionsHook.getClase(updatedCIInformation.FAMILIA_REAL ?? "")
        monitorOptionsHook.getUbications()
        monitorOptionsHook.getVcenters()
        monitorOptionsHook.getStatesCI()
        monitorOptionsHook.getEnviroments()
        monitorOptionsHook.getRoleUses()
        monitorOptionsHook.getPriorities()
        monitorOptionsHook.getTypesServices()
        monitorOptionsHook.getTypesCI()
        monitorOptionsHook.getTowersAdministrators()
        monitorOptionsHook.getAdministrators()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">ACTUALIZAR INFORMACIÓN GENERAL | {modalInformation.NOMBRE_CI}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                <form onSubmit={handleSubmit} >
                    <section className="d-flex justify-content-around flex-wrap gap-5">
                        <SelectInput
                            className="w-300px"
                            label="FAMILIA"
                            value={notNull(updatedCIInformation.FAMILIA_REAL).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, FAMILIA_REAL: value }))}
                            data={monitorOptionsHook.familyData}
                            dependencyfunction={monitorOptionsHook.getClase}
                            loading={monitorOptionsHook.familyLoading}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CLASE"
                            value={notNull(updatedCIInformation.CLASE_REAL).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, CLASE_REAL: value }))}
                            data={monitorOptionsHook.claseData}
                            loading={monitorOptionsHook.claseLoading}
                        />
                        <Input
                            className="w-300px"
                            label="HOSTNANE"
                            value={notNull(updatedCIInformation.NOMBRE).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, NOMBRE: value }))}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CLIENTE"
                            value={notNull(updatedCIInformation.CLIENTE).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, CLIENTE: value }))}
                            data={clientHook.clients.map((client, index) => ({ codigo: index, nombre: client.value }))}
                            dependencyfunction={projectHook.getProjects}
                            loading={clientHook.loadingGetClients}
                        />
                        <SelectInput
                            className="w-300px"
                            label="PROYECTO"
                            value={notNull(updatedCIInformation.ALP + "-" + updatedCIInformation.PROYECTO).toUpperCase()}
                            onChange={(value: string) => {
                                const { alp, nameProject } = separateProjectNameAndALP(value)
                                updateCIInformation(prev => ({ ...prev, ALP: alp, PROYECTO: nameProject }))
                            }}
                            data={projectHook.projects.map(project => ({ codigo: project.id, nombre: project.value }))}
                            loading={projectHook.loadingGetProjects}
                        />
                        <SelectInput
                            className="w-300px"
                            label="UBICACIÓN"
                            value={notNull(updatedCIInformation.UBICACION).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, UBICACION: value }))}
                            data={monitorOptionsHook.ubications}
                        />
                        <Input
                            className="w-300px"
                            label="SEDE DE CLIENTE"
                            value={notNull(updatedCIInformation?.SEDE_CLIENTE).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, SEDE_CLIENTE: value }))}
                        />
                        <Input
                            className="w-300px"
                            label="NOMBRE VIRTUAL"
                            value={notNull(updatedCIInformation.NOMBRE_VIRTUAL).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, NOMBRE_VIRTUAL: value }))}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CONSOLA DE ADMINISTRACIÓN"
                            value={notNull(updatedCIInformation.VCENTER).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, VCENTER: value }))}
                            data={monitorOptionsHook.vcenters}
                        />
                        <SelectInput
                            className="w-300px"
                            label="ESTADO EQUIPO"
                            value={notNull(updatedCIInformation.EQUIPO_ESTADO).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, EQUIPO_ESTADO: value }))}
                            data={monitorOptionsHook.statesCI}
                        />
                        <SelectInput
                            className="w-300px"
                            label="AMBIENTE"
                            value={notNull(updatedCIInformation.AMBIENTE).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, AMBIENTE: value }))}
                            data={monitorOptionsHook.environments}
                        />
                        <SelectInput
                            className="w-300px"
                            label="ROL DE USO"
                            value={notNull(updatedCIInformation.ROL_USO).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, ROL_USO: value }))}
                            data={monitorOptionsHook.roleUses}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CRITICIDAD"
                            value={notNull(updatedCIInformation.PRIORIDAD).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, PRIORIDAD: value }))}
                            data={monitorOptionsHook.priorities}
                        />
                        <SelectInput
                            className="w-300px"
                            label="TIPO DE SERVICIO"
                            value={notNull(updatedCIInformation.TIPO_SERVICIO).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, TIPO_SERVICIO: value }))}
                            data={monitorOptionsHook.typeServices}
                        />
                        <Input
                            className="w-300px"
                            label="SERVICIO DE NEGOCIO"
                            value={notNull(updatedCIInformation?.SERVICIO_NEGOCIO).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, SERVICIO_NEGOCIO: value }))}
                        />
                        <SelectInput
                            className="w-300px"
                            label="TIPO DE EQUIPO"
                            value={notNull(updatedCIInformation.TIPO_EQUIPO).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, TIPO_EQUIPO: value }))}
                            data={monitorOptionsHook.typesCI}
                        />
                        <Input
                            className="w-300px"
                            label="TICKET DE ALTA"
                            value={notNull(updatedCIInformation.CRQ_ALTA).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, CRQ_ALTA: value }))}
                        />
                        <Input
                            className="w-300px"
                            label="TICKET DE BAJA"
                            value={notNull(updatedCIInformation?.TICKET_BAJA).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, TICKET_BAJA: value }))}
                        />
                        <SelectInput
                            className="w-300px"
                            label="ADMINISTRADOR TORRE"
                            value={notNull(updatedCIInformation.ADMINISTRADOR).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, ADMINISTRADOR: value }))}
                            data={monitorOptionsHook.towersAdministrators}
                            dependencyfunction={monitorOptionsHook.getScopesTypes}
                        />
                        <SelectInput
                            className="w-300px"
                            label="TIPO DE ALCANCE"
                            value={notNull(updatedCIInformation.TIPO_ALCANCE).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, TIPO_ALCANCE: value }))}
                            data={monitorOptionsHook.scopesType}
                            loading={monitorOptionsHook.loadingScopeTypes}
                        />
                        <SelectInput
                            className="w-300px"
                            label="BACKUPS"
                            value={notNull(updatedCIInformation.BACKUPS).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, BACKUPS: value }))}
                            data={monitorOptionsHook.administrators}
                        />
                        <SelectInput
                            className="w-300px"
                            label="MONITOREO"
                            value={notNull(updatedCIInformation.MONITOREO).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, MONITOREO: value }))}
                            data={monitorOptionsHook.administrators}
                        />
                        <SelectInput
                            className="w-300px"
                            label="BACKUPS NUBE"
                            value={notNull(updatedCIInformation.BACKUPS_CLOUD).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, BACKUPS_CLOUD: value }))}
                            data={monitorOptionsHook.administrators}
                        />
                        <SelectInput
                            className="w-300px"
                            label="MONITOREO NUBE"
                            value={notNull(updatedCIInformation.MONITOREO_CLOUD).toUpperCase()}
                            onChange={(value: string) => updateCIInformation(prev => ({ ...prev, MONITOREO_CLOUD: value }))}
                            data={monitorOptionsHook.administrators}
                        />
                    </section>
                    <div className="gap-5 d-flex justify-content-end mt-10">
                        <button
                            className="btn btn-primary me-md-2"
                            type="submit"
                            disabled={CIHooks.loadingUpdateGeneralInformationCI}
                        >
                            {CIHooks.loadingUpdateGeneralInformationCI ? "Actualizando" : "Actualizar"}
                        </button>
                        <button
                            onClick={() => modalHook.closeModal()}
                            className="btn btn-danger"
                            type="button"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>

    )
}
export { UpdateCIGeneral }

