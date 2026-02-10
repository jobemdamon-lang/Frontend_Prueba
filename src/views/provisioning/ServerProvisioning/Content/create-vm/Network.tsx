import { FC, useCallback, useEffect, useState } from "react"
import { Vlan } from "../../../Types"
import { CreateFormProps } from "./VMCreateForm"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import { useServerProvisioningContext } from "../../Context"
import { successNotification } from "../../../../../helpers/notifications"

export const Network: FC<CreateFormProps> = ({
    formData,
    handleUpdateFormData,
    errors
}) => {

    const {
        paramsHook: { loadingVlans, vlans },
        requestVMHook: { validateIPRequestVM, loadingValidateIP, generateIPRequestVM, loadingGenerateIP }
    } = useServerProvisioningContext()
    const [searchValue, setSearchValue] = useState('')
    const [filteredVlans, setFilteredVlans] = useState<Vlan[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(8)
    const [intendedIP, setIntentedIP] = useState('')

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentVlans = filteredVlans.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredVlans.length / itemsPerPage)

    const formatVlanNetwork = (vlan: Vlan): string => {
        return `${vlan.vlan_network}/${vlan.mask}`
    }

    const handleVlanSelected = useCallback((vlanId: number) => {
        handleUpdateFormData('vlan_id', vlanId)
        handleUpdateFormData('ip', '')
        handleUpdateFormData('gateway', '')
        handleUpdateFormData('netmask', '')
        setIntentedIP('')
    }, [handleUpdateFormData])

    const handleSearch = (value: string) => {
        setCurrentPage(1)
        setSearchValue(value)
    }

    const handleValidateIP = () => {
        validateIPRequestVM({
            ip_number: intendedIP,
            vlan_id: formData.vlan_id
        }).then(response => {
            if (response) {
                const filteredVlan = vlans.find(vlan => vlan.vlan_id === formData.vlan_id)
                if (!filteredVlan) return;
                handleUpdateFormData('ip', intendedIP)
                handleUpdateFormData('gateway', filteredVlan.gateway)
                handleUpdateFormData('netmask', filteredVlan.netmask)
                successNotification("La IP ingresada esta disponible")
            } else {
                setIntentedIP('')
            }
        })
    }

    const handleGenerateIP = () => {
        generateIPRequestVM({ vlan_id: formData.vlan_id }).then(data => {
            if (data) {
                setIntentedIP(data.ip)
                handleUpdateFormData('ip', data.ip)
                handleUpdateFormData('gateway', data.gateway)
                handleUpdateFormData('netmask', data.netmask)
            }
        })
    }

    useEffect(() => {
        setFilteredVlans(vlans?.filter(vlan => (
            vlan.client?.toLowerCase().includes(searchValue.toLowerCase()) ||
            vlan.vlan_network?.toLowerCase().includes(searchValue.toLowerCase())
        )) || [])
    }, [searchValue, vlans])

    return (
        <div className="d-flex flex-column w-100">
            {/* Titulo de la sección */}
            <div className="pb-10">
                <h2 className="fw-bolder d-flex align-items-center text-gray-900">
                    Configuración de Red
                    <i
                        className="fas fa-exclamation-circle ms-2 fs-7"
                        data-bs-toggle="tooltip"
                        title="Todos los campos del formulario son necesarios para el proceso de aprovisionamiento automático"
                    ></i>
                </h2>
                <div className="text-gray-500 fw-bold fs-6">
                    Escoja o genere una IP en base a la Vlan seleccionada
                </div>
            </div>

            {/* Sección IP y botones */}
            <div className="mb-10 d-flex flex-column flex-md-row gap-3 align-items-end justify-content-between">
                <div className="flex-fill w-100">
                    <div className="d-flex justify-content-between align-content-center">
                        <label htmlFor="ip" className="form-label flex-grow-1">Dirección IP</label>
                    </div>
                    <div className="input-group">
                        <span className="input-group-text"><i className="bi bi-hdd-network fs-2"></i></span>
                        <input
                            type="text"
                            className="form-control"
                            id="ip"
                            name="ip"
                            placeholder="Ingrese una dirección IP"
                            value={intendedIP}
                            onChange={(e) => setIntentedIP(e.target.value)}
                            disabled={!formData.vlan_id || loadingValidateIP}
                        />
                    </div>
                    {errors.ip && (
                        <div className="fv-plugins-message-container invalid-feedback">{errors.ip}</div>
                    )}
                </div>

                <div className="d-flex gap-3 flex-nowrap">
                    <button
                        type="button"
                        className="btn btn-light text-primary"
                        disabled={!formData.vlan_id || loadingVlans || loadingValidateIP}
                        onClick={handleValidateIP}
                    >
                        {loadingValidateIP ? 'Validando' : 'Validar IP'}
                        {loadingValidateIP && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                    </button>
                    <button
                        type="button"
                        className="btn btn-light text-success"
                        disabled={!formData.vlan_id || loadingVlans || loadingGenerateIP}
                        onClick={handleGenerateIP}
                    >
                        {loadingGenerateIP ? 'Generando' : 'Generar IP'}
                        {loadingGenerateIP && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                    </button>
                </div>
            </div>

            {/* Buscador de Vlans */}
            <SearchInput setValue={handleSearch} value={searchValue} placeholder="Ingrese su parametros de busqueda" />

            {/* Listado de VLANs con tamaño fijo y paginación */}
            <div className="row g-3 mb-4">
                {currentVlans.length > 0 ? (
                    currentVlans.map(vlan => (
                        <div
                            className="col-6 col-md-4 col-lg-3 d-flex"
                            key={vlan.vlan_id}
                            onClick={() => handleVlanSelected(vlan.vlan_id)}
                        >
                            <div className="card flex-fill cursor-pointer hover-elevate-up transition-all">
                                <div className="card-body text-center">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="vlanSelector"
                                        id={`vlan-${vlan.vlan_id}`}
                                        checked={formData.vlan_id === vlan.vlan_id}
                                        onChange={() => { }}
                                    />
                                    <label
                                        className="btn btn-outline btn-outline-dashed btn-outline-default w-100 h-100"
                                        htmlFor={`vlan-${vlan.vlan_id}`}
                                    >
                                        <div className="d-flex flex-column justify-content-center h-100">
                                            <span className="text-gray-800 fw-bolder fs-5 mb-2">
                                                {formatVlanNetwork(vlan)}
                                            </span>
                                            <span className="text-gray-600 fs-6">
                                                {vlan.client?.toUpperCase()}
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-10">
                        <div className="mb-4">
                            <i className="bi bi-inbox-fill text-gray-400 fs-5x"></i>
                        </div>
                        <h3 className="text-gray-600 fw-semibold">No se encontraron VLANs</h3>
                        <p className="text-gray-500">No hay VLANs que coincidan con el filtro ingresado</p>
                    </div>
                )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <nav className="d-flex justify-content-center">
                    <ul className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li
                                key={i + 1}
                                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
};