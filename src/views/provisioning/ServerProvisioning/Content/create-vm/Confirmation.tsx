import { FC } from "react";
import { CreateFormProps } from "./VMCreateForm";
import { useServerProvisioningContext } from "../../Context";
import { CreateRequestVM } from "../../../Types";

export const ConfirmationView: FC<CreateFormProps> = ({
    formData,
    selectedSO,
    errors,
    handleUpdateFormData
}) => {
    const { paramsHook: { requestParams, projectScopes, vlans }, projectHook } = useServerProvisioningContext()
    const isLinux = selectedSO?.toLowerCase() === "linux"

    const findByAttr = (id: number) => {
        const findedElement = requestParams.find(p => p.IDOPCION === id)
        return findedElement ? findedElement.ATRIBUTO : ''
    }

    const findByValue = (id: number) => {
        const findedElement = requestParams.find(p => p.IDOPCION === id)
        return findedElement ? findedElement.VALOR : ''
    }

    const findScope = (id: number) => {
        const findedElement = projectScopes.find(p => p.IDOPCION === id)
        return findedElement ? findedElement.VALOR : ''
    }

    const findProject = (id: number) => {
        const findedElement = projectHook.projects.find(p => p.id === id)
        return findedElement ? findedElement.value : ''
    }

    const findVlan = (id: number) => {
        const filteredVlan = vlans.find(vlan => vlan.vlan_id === id)
        return filteredVlan
    }
    
    const getEDRLabel = () => {
        const selectedEDR = requestParams.find(r => r.TIPOATRIBUTO === 'TIPO_EDR_APROVISIONAMIENTO' && r.IDOPCION === formData.implementar_edr)
        if (!selectedEDR) return <span className="badge badge-light-danger">No seleccionado</span>
        return <span className="badge badge-light-warning">{selectedEDR.ATRIBUTO}</span>
    }

    const vmConfigItems = [
        { label: "Hostname", value: formData.hostname, icon: "bi-display" },
        { label: "Número de IP", value: formData.ip, icon: "bi-hdd-network" },
        { label: "Vcpu Cores", value: formData.vcpu_cores, icon: "bi-cpu" },
        { label: "RAM (GB)", value: `${formData.ram_gb} GB`, icon: "bi-memory" },
        { label: "SWAP (GB)", value: `${formData.swap_gb} GB`, icon: "bi-arrow-left-right" },
        { label: "Rol de uso de la VM", value: formData.rol_uso, icon: "bi-gear" },
    ];

    const categoryItems = [
        { label: "Criticidad de la VM", value: findByValue(formData.id_criticidad), icon: "bi-exclamation-diamond" },
        { label: "Ubicación", value: findByValue(formData.id_ubicacion), icon: "bi-geo-alt" },
        { label: "Tipo de Servicio", value: findByValue(formData.id_tipo_servicio), icon: "bi-server" },
        { label: "Sistema Operativo - Versión", value: findByAttr(formData.id_so_version), icon: "bi-windows" },
        { label: "Administrador por", value: findByValue(formData.id_admin_torre), icon: "bi-person-badge" },
        { label: "Ambito", value: findScope(formData.id_ambito), icon: "bi-diagram-3" },
        { label: "Proyecto", value: findProject(formData.id_proyecto), icon: "bi-folder" },
    ];

    const networkItems = [
        { label: "Vlan ID", value: findVlan(formData.vlan_id)?.vlan_id ?? '', icon: "bi-hdd-stack" },
        { label: "Vlan Network", value: findVlan(formData.vlan_id)?.vlan_network ?? '', icon: "bi-diagram-3" },
    ];

    const securityItems = [
        {
            label: "Implementar Monitoreo",
            value: formData.implementar_monitoreo
                ? <span className="badge badge-light-success">Activado</span>
                : <span className="badge badge-light-danger">Desactivado</span>,
            icon: "bi-graph-up"
        },
        {
            label: "Implementar Backup",
            value: formData.implementar_backup
                ? <span className="badge badge-light-success">Activado</span>
                : <span className="badge badge-light-danger">Desactivado</span>,
            icon: "bi-archive"
        },
        {
            label: "Implementar EDR de CANVIA",
            value: getEDRLabel(),
            icon: "bi-shield-check"
        },
    ];

    return (
        <div className="w-100">
            {/* Header */}
            <div className="pb-5">
                <h1 className="fw-bolder text-gray-900 mb-2">
                    <i className="bi bi-clipboard-check text-primary me-3"></i>
                    Confirmación de Solicitud
                </h1>
                <div className="text-gray-600 fw-semibold fs-5">
                    Revise y confirme los detalles de su solicitud de aprovisionamiento
                    <i
                        className="fas fa-exclamation-circle ms-2 fs-7 text-primary align-middle"
                        data-bs-toggle="tooltip"
                        title="Todos los campos del formulario son necesarios para el proceso de aprovisionamiento automático"
                    ></i>
                </div>
            </div>

            {/* Fecha de Ejecución */}
            <div className="card card-flush">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-md-4 d-flex align-items-center">
                            <div className="input-group input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-clock"></i>
                                </span>
                                <input
                                    type="datetime-local"
                                    className="form-control form-control"
                                    id="fecha_ejecucion"
                                    name="fecha_ejecucion"
                                    min={getMinDateTime()}
                                    max={getMaxDateTime()}
                                    value={formData.fecha_ejecucion}
                                    onChange={(e) => handleUpdateFormData('fecha_ejecucion', e.target.value)}
                                />
                            </div>
                            {errors.fecha_ejecucion && (
                                <div className="text-danger mt-2">
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    {errors.fecha_ejecucion}
                                </div>
                            )}
                        </div>
                        <div className="col-md-8 mt-5">
                            <label className="form-label required fs-6 fw-bold">
                                Fecha y Hora de Ejecución
                            </label>
                            <div className="text-gray-600 mb-4">
                                <i className="bi bi-info-circle me-1"></i>
                                La fecha y hora que elija indicarán cuándo se creará su máquina virtual.
                                Tenga en cuenta que este proceso puede tardar hasta 30 minutos, ya que estas
                                se procesan cada media hora. Por ejemplo, si elige las 1:31, su solicitud se procesará a las 2:00.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección de Configuración de VM */}
            <div className="card card-flush">
                <div className="card-header p-0">
                    <h3 className="card-title fw-bolder">
                        <i className="bi bi-pc text-primary me-2"></i>
                        Configuración de la Máquina Virtual
                    </h3>
                </div>
                <div className="card-body p-0">
                    <div className="row g-6">
                        {vmConfigItems.map((item, index) => (
                            <div key={index} className="col-md-6 col-xl-4">
                                <div className="d-flex align-items-center gap-4 p-4 bg-light bg-opacity-50 rounded">
                                    <div className="symbol symbol-40px">
                                        <span className="symbol-label bg-light-primary">
                                            <i className={`bi ${item.icon} text-primary fs-3`}></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <div className="fw-semibold text-gray-600">{item.label}</div>
                                        <div className="fw-bold text-gray-800 fs-5">{item.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sección de Categorización */}
            <div className="card card-flush">
                <div className="card-header p-0">
                    <h3 className="card-title fw-bolder">
                        <i className="bi bi-tags text-primary me-2"></i>
                        Categorización
                    </h3>
                </div>
                <div className="card-body p-0">
                    <div className="row g-6">
                        {categoryItems.map((item, index) => (
                            <div key={index} className="col-md-6 col-xl-4">
                                <div className="d-flex align-items-center gap-4 p-4 bg-light bg-opacity-50 rounded">
                                    <div className="symbol symbol-40px">
                                        <span className="symbol-label bg-light-info">
                                            {item.label === 'Sistema Operativo - Versión' ?
                                                <i className={`bi ${isLinux ? "bi-ubuntu" : "bi-windows"} text-info fs-3`}></i> :
                                                <i className={`bi ${item.icon} text-info fs-3`}></i>
                                            }
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <div className="fw-semibold text-gray-600">{item.label}</div>
                                        <div className="fw-bold text-gray-800 fs-5">{item.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sección de Red */}
            <div className="card card-flush">
                <div className="card-header p-0">
                    <h3 className="card-title fw-bolder">
                        <i className="bi bi-hdd-network text-primary me-2"></i>
                        Configuración de Red
                    </h3>
                </div>
                <div className="card-body p-0">
                    <div className="row g-6">
                        {networkItems.map((item, index) => (
                            <div key={index} className="col-md-6">
                                <div className="d-flex align-items-center gap-4 p-4 bg-light bg-opacity-50 rounded">
                                    <div className="symbol symbol-40px">
                                        <span className="symbol-label bg-light-success">
                                            <i className={`bi ${item.icon} text-success fs-3`}></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <div className="fw-semibold text-gray-600">{item.label}</div>
                                        <div className="fw-bold text-gray-800 fs-5">{item.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sección de Seguridad */}
            <div className="card card-flush">
                <div className="card-header p-0">
                    <h3 className="card-title fw-bolder">
                        <i className="bi bi-shield-check text-primary me-2"></i>
                        Servicios Adicionales
                    </h3>
                </div>
                <div className="card-body p-0">
                    <div className="row g-6">
                        {securityItems.map((item, index) => (
                            <div key={index} className="col-md-4">
                                <div className="d-flex align-items-center gap-4 p-4 bg-light bg-opacity-50 rounded">
                                    <div className="symbol symbol-40px">
                                        <span className="symbol-label bg-light-warning">
                                            <i className={`bi ${item.icon} text-warning fs-3`}></i>
                                        </span>
                                    </div>
                                    <div className="d-flex flex-column">
                                        <div className="fw-semibold text-gray-600">{item.label}</div>
                                        <div className="fw-bold text-gray-800 fs-6">{item.value}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Almacenamiento */}
            <StorageSummary
                formData={formData}
                selectedSO={selectedSO}
            />
        </div>
    );
}

type StorageResumeProps = {
    formData: CreateRequestVM,
    selectedSO: string
}

const StorageSummary: FC<StorageResumeProps> = ({ formData, selectedSO }) => (
    <div className="card card-flush">
        <div className="card-header p-0">
            <h3 className="card-title fw-bolder">
                <i className="bi bi-hdd-stack text-primary me-2"></i>
                Configuración de Almacenamiento
            </h3>
        </div>
        <div className="card-body p-0">
            {formData.discos.length === 0 ? (
                <div className="alert alert-dismissible bg-light-danger d-flex flex-center flex-column py-10 px-10 px-lg-20 mb-10">
                    <i className="bi bi-hdd text-danger fs-2hx mb-5"></i>
                    <div className="text-center">
                        <h5 className="fw-bold text-danger mb-5">No se han configurado discos</h5>
                        <div className="text-gray-600 fw-semibold fs-6">
                            Debe agregar al menos un disco para continuar con la solicitud.
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row g-6">
                    {formData.discos.map((disco, index) => (
                        <div key={index} className="col-12 col-md-6 col-xl-4">
                            <div className="card card-bordered">
                                <div className="card-header ribbon ribbon-top ribbon-vertical">
                                    {index === 0 && (
                                        <div className="ribbon-label bg-primary">
                                            <i className="bi bi-star-fill fs-6 text-warning pe-2"></i> Principal
                                        </div>
                                    )}
                                    <div className="card-title">
                                        <h4 className="fw-bold text-gray-800">
                                            <i className="bi bi-hdd text-primary me-2"></i>
                                            Disco {index + 1}
                                        </h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div className="d-flex align-items-center">
                                            <div className="symbol symbol-50px me-4">
                                                <span className="symbol-label bg-light-primary">
                                                    <i className="bi bi-hdd text-primary fs-2x"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-gray-600">Unidad</div>
                                                <div className="fw-bolder text-gray-800 fs-3">{disco.nombre_unidad}</div>
                                            </div>
                                        </div>
                                        {selectedSO !== 'LINUX' &&
                                            <span className="badge badge-lg badge-light-primary">
                                                <span className="fw-bold fs-4">{disco.gb_disco}</span>
                                                <span className="fw-semibold fs-7">GB</span>
                                            </span>
                                        }
                                    </div>

                                    {selectedSO === 'LINUX' && disco.particiones.length > 0 && (
                                        <div className="mt-5">
                                            <h6 className="text-gray-600 fw-bold mb-3">
                                                <i className="bi bi-diagram-3 text-info me-2"></i>
                                                Particiones
                                            </h6>
                                            <div className="d-flex flex-column gap-2">
                                                {disco.particiones.map((part, pIndex) => (
                                                    <div key={pIndex} className="d-flex align-items-center justify-content-between p-3 bg-light rounded">
                                                        <div className="d-flex align-items-center">
                                                            <i className="bi bi-folder2-open text-info me-2"></i>
                                                            <span className="fw-semibold text-gray-700">
                                                                {part.punto_montaje}
                                                            </span>
                                                        </div>
                                                        <span className="badge badge-light-success">
                                                            {part.gb_particion} GB
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-info-circle text-gray-500 me-2"></i>
                                        <span className="text-gray-600 fs-7">
                                            {selectedSO === 'LINUX' ? 'Sistema Linux' : 'Sistema Windows'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getMaxDateTime = () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Agregar 1 semana

    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, "0");
    const day = String(futureDate.getDate()).padStart(2, "0");
    const hours = String(futureDate.getHours()).padStart(2, "0");
    const minutes = String(futureDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
