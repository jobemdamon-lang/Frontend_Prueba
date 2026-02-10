import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { ICreateCI } from "../../Types"
import { Input } from "../../../../components/Inputs/TextInput"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { useEffect, useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { useProject } from "../../../../hooks/useProjects"
import { useClient } from "../../../../hooks/useClient"
import { useCI } from "../../hooks/useCI"

const CreateCI = () => {

    const { modalHook, monitorOptionsHook, handleListCIs } = useConfigurationItemsContext()
    const [selectedClient, setSelectedClient] = useState("")
    const [selectedProject, setSelectedProject] = useState("")
    const [familyClase, setFamilyClase] = useState({ family: "", clase: "", id_family_clase: 0 })
    const clientHook = useClient()
    const projectHook = useProject()
    const CIHooks = useCI()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [informationCI, setInformationCI] = useState<ICreateCI>(generateInitialCI(userName))

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        CIHooks.createCI(informationCI).then((success) => {
            if (success) {
                modalHook.closeModal()
                handleListCIs()
            }
        })
    }

    useEffect(() => {
        clientHook.getClients()
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
        monitorOptionsHook.getAdminsCloudMonitoring()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">CREACIÓN | ELEMENTO DE CONFIGURACIÓN</h2>
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
                            value={(familyClase.family ?? "").toUpperCase()}
                            onChange={(value: string) => setFamilyClase(prev => ({ ...prev, family: value }))}
                            data={monitorOptionsHook.familyData}
                            dependencyfunction={monitorOptionsHook.getClase}
                            loading={monitorOptionsHook.familyLoading}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CLASE"
                            value={(familyClase.clase ?? "").toUpperCase()}
                            onChange={(value: string) => {
                                setFamilyClase(prev => ({ ...prev, clase: value }))
                                setInformationCI(prev => ({
                                    ...prev,
                                    id_opcion: monitorOptionsHook.claseData.find(clase => clase.nombre === value)?.codigo ?? 0
                                }))
                            }}
                            data={monitorOptionsHook.claseData}
                            loading={monitorOptionsHook.claseLoading}
                            required={true}
                        />
                        <Input
                            className="w-300px"
                            label="HOSTNANE"
                            value={(informationCI.nombre ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, nombre: value }))}
                            required={true}
                        />
                        <Input
                            className="w-300px"
                            label="NOMBRE CI"
                            value={(informationCI.nombre_ci ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, nombre_ci: value }))}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CLIENTE"
                            value={(selectedClient ?? "").toUpperCase()}
                            onChange={setSelectedClient}
                            data={clientHook.clients.map((client, index) => ({ codigo: index, nombre: client.value }))}
                            dependencyfunction={projectHook.getProjects}
                            loading={clientHook.loadingGetClients}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="PROYECTO"
                            value={(selectedProject ?? "").toUpperCase()}
                            onChange={(value: string) => {
                                setSelectedProject(value)
                                setInformationCI(prev => ({
                                    ...prev,
                                    id_proyecto: (projectHook.projects.find(project => project.value === value)?.id ?? 0).toString(),
                                    alp: (projectHook.projects.find(project => project.value === value)?.value ?? "").split("-")[0]
                                }))
                            }}
                            data={projectHook.projects.map(project => ({ codigo: project.id, nombre: project.value }))}
                            loading={projectHook.loadingGetProjects}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="UBICACIÓN"
                            value={(informationCI.ubicacion ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, ubicacion: value }))}
                            data={monitorOptionsHook.ubications}
                            required={true}
                        />
                        <Input
                            className="w-300px"
                            label="SEDE DE CLIENTE"
                            value={(informationCI.sede_cliente ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, sede_cliente: value }))}
                            required={true}
                        />
                        <Input
                            className="w-300px"
                            label="NOMBRE VIRTUAL"
                            value={(informationCI.nombre_virtual ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, nombre_virtual: value }))}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CONSOLA DE ADMINISTRACIÓN"
                            value={(informationCI.vcenter ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, vcenter: value }))}
                            required={true}
                            data={monitorOptionsHook.vcenters}
                        />
                        <SelectInput
                            className="w-300px"
                            label="ESTADO EQUIPO"
                            value={(informationCI.equipo_estado ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, equipo_estado: value }))}
                            data={monitorOptionsHook.statesCI}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="AMBIENTE"
                            value={(informationCI.ambiente ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, ambiente: value }))}
                            data={monitorOptionsHook.environments}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="ROL DE USO"
                            value={(informationCI.rol_uso ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, rol_uso: value }))}
                            data={monitorOptionsHook.roleUses}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="CRITICIDAD"
                            value={(informationCI.prioridad ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, prioridad: value }))}
                            data={monitorOptionsHook.priorities}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="TIPO DE SERVICIO"
                            value={(informationCI.tipo_servicio ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, tipo_servicio: value }))}
                            data={monitorOptionsHook.typeServices}
                            required={true}
                        />
                        <Input
                            className="w-300px"
                            label="SERVICIO DE NEGOCIO"
                            value={(informationCI.servicio_negocio ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, servicio_negocio: value }))}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="TIPO DE EQUIPO"
                            value={(informationCI.tipo_equipo ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, tipo_equipo: value }))}
                            data={monitorOptionsHook.typesCI}
                            required={true}
                        />
                        <Input
                            className="w-300px"
                            label="TICKET DE ALTA"
                            value={(informationCI.crq_alta ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, crq_alta: value }))}
                            required={true}
                        />
                        <Input
                            className="w-300px"
                            label="TICKET DE BAJA"
                            value={(informationCI.ticket_baja ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, ticket_baja: value }))}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="ADMINISTRADOR TORRE"
                            value={(informationCI.administrador ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, administrador: value }))}
                            data={monitorOptionsHook.towersAdministrators}
                            dependencyfunction={monitorOptionsHook.getScopesTypes}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="TIPO DE ALCANCE"
                            value={(informationCI.tipo_alcance ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, tipo_alcance: value }))}
                            data={monitorOptionsHook.scopesType}
                            loading={monitorOptionsHook.loadingScopeTypes}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="BACKUPS"
                            value={(informationCI.backups ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, backups: value }))}
                            data={monitorOptionsHook.administrators}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="MONITOREO"
                            value={(informationCI.monitoreo ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, monitoreo: value }))}
                            data={monitorOptionsHook.administrators}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="BACKUPS NUBE"
                            value={(informationCI.backups_cloud ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, backups_cloud: value }))}
                            data={monitorOptionsHook.administrators}
                            required={true}
                        />
                        <SelectInput
                            className="w-300px"
                            label="MONITOREO NUBE"
                            value={(informationCI.monitoreo_cloud ?? "").toUpperCase()}
                            onChange={(value: string) => setInformationCI(prev => ({ ...prev, monitoreo_cloud: value }))}
                            data={monitorOptionsHook.adminsCloudMonitoring}
                            required={true}
                        />
                    </section>
                    <div className="gap-5 d-flex justify-content-end mt-10">
                        <button
                            className="btn btn-primary me-md-2"
                            type="submit"
                            disabled={CIHooks.loadingCreateCI}
                        >
                            {CIHooks.loadingCreateCI ? "Creando" : "Crear"}
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
export { CreateCI }

const generateInitialCI = (userCreation: string): ICreateCI => ({
    id_equipo: 0,
    nombre_ci: '',
    tipo_alcance: '',
    nombre: '',
    id_opcion: 0,
    sistema_operativo: '',
    version_sw: '',
    modelo: '',
    rol_uso: '',
    vcenter: '',
    propiedad: '',
    administrador: '',
    equipo_estado: '',
    prioridad: '',
    tipo_servicio: '',
    ubicacion: '',
    ambiente: '',
    id_proyecto: '',
    descripcion: '',
    confidencialidad: '',
    integridad: '',
    disponibilidad: '',
    crq_alta: '',
    nro_serie: '',
    detalle_propiedad: '',
    fecha_alta: '',
    fecha_baja: '',
    bahia_desde: '',
    bahia_hasta: '',
    cantidad_ru: '',
    nro_cid: '',
    nro_ranuras: '',
    rango_ru_desde: '',
    rango_ru_hasta: '',
    nombre_virtual: '',
    tipo_equipo: '',
    nro_core: '',
    nro_cpu: '',
    cpu_descripcion: '',
    disk_aprovisionado: '',
    disk_asignado: '',
    ram_asignado: '',
    energia_kw: '',
    energia_uso: '',
    id_genesys: 0,
    part_number: '',
    fabricante: '',
    proveedor: '',
    referencia_externa: '',
    linea_base: '',
    backups: '',
    monitoreo: '',
    backups_cloud: '',
    monitoreo_cloud: '',
    usuario: userCreation,
    alp: '',
    servicio_negocio: '',
    ticket_baja: '',
    sede_cliente: ''
});
