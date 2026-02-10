import { useCallback, useEffect, useState } from "react"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { ModalViewForServerProvisioning, RequestVM, UpdatedGeneral, Vlan } from "../../Types"
import { useServerProvisioningContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { ModalSize } from "../../../../hooks/Types"
import { getTotalDiskSpace } from "../utils"
import { successNotification } from "../../../../helpers/notifications"

export const UpdateNetwork = () => {

    // Hooks del Contexto
    const {
        modalHook,
        updateRequestHook: { updateGeneralVM, loadingUpdateGeneral },
        requestVMHook: { getRequestVM, validateIPRequestVM, loadingValidateIP, generateIPRequestVM, loadingGenerateIP },
        paramsHook: { vlans, loadingVlans }
    } = useServerProvisioningContext()
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const requestInformation: RequestVM = modalHook.modalInformation

    // Estados para el formulario
    const [errors, setErrors] = useState<Record<string, string> | null>(null)
    const [updatedGeneral, setUpdatedGeneral] = useState<UpdatedGeneral>(() => ({
        usuario_modificacion: userName,
        hostname: requestInformation.HOSTNAME,
        id_admin_torre: requestInformation.ID_ADMIN_TORRE,
        id_ambito: requestInformation.ID_AMBITO,
        id_criticidad: requestInformation.ID_CRITICIDAD,
        id_tipo_servicio: requestInformation.ID_TIPO_SERVICIO,
        id_ubicacion: requestInformation.ID_UBICACION,
        ip: requestInformation.IP,
        vlan_id: requestInformation.VLAN_ID,
        gateway: requestInformation.GATEWAY,
        netmask: requestInformation.NETMASK,
        id_tipo_alcance: requestInformation.ID_TIPO_ALCANCE,
        id_ambiente: requestInformation.ID_AMBIENTE
    }))

    const [searchValue, setSearchValue] = useState('')
    const [filteredVlans, setFilteredVlans] = useState<Vlan[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(8)
    const [intendedIP, setIntentedIP] = useState(requestInformation.IP)

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentVlans = filteredVlans.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredVlans.length / itemsPerPage)

    const formatVlanNetwork = (vlan: Vlan): string => {
        return `${vlan.vlan_network}/${vlan.mask}`
    }

    const handleUpdateFormData = useCallback(<K extends keyof UpdatedGeneral>(
        key: K,
        value: UpdatedGeneral[K]
    ) => {
        setUpdatedGeneral(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: '' }))
    }, [])

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

    const handleGenerateIP = () => {
        generateIPRequestVM({ vlan_id: updatedGeneral.vlan_id }).then(data => {
            if (data) {
                setIntentedIP(data.ip)
                handleUpdateFormData('ip', data.ip)
                handleUpdateFormData('gateway', data.gateway)
                handleUpdateFormData('netmask', data.netmask)
            }
        })
    }

    const handleValidateIP = () => {
        validateIPRequestVM({
            ip_number: intendedIP,
            vlan_id: updatedGeneral.vlan_id
        }).then(response => {
            if (response) {
                const filteredVlan = vlans.find(vlan => vlan.vlan_id === updatedGeneral.vlan_id)
                if (!filteredVlan) return;
                handleUpdateFormData('ip', intendedIP)
                handleUpdateFormData('gateway', filteredVlan.gateway)
                handleUpdateFormData('netmask', filteredVlan.netmask)
                successNotification("La IP ingresada esta disponible ")
            } else {
                setIntentedIP('')
            }
        })
    }

    const handleSubmit = () => {
        if (!updatedGeneral) return;
        // Validar si completo la IP
        const newErrors: Record<string, string> = {};
        if (updatedGeneral.ip === '') newErrors.ip = "La dirección IP es requerida. Valídela o genere una nueva.";
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return;

        updateGeneralVM(requestInformation.ID_SOLICITUD, updatedGeneral).then(result => {
            if (!result && !Array.isArray(result)) return;
            const [success, recommended] = result
            if (success) {
                getRequestVM(requestInformation.ID_SOLICITUD)
                modalHook.closeModal()
            } else if (recommended) {
                modalHook.openModal(ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION, ModalSize.XL, undefined, {
                    recommended: recommended,
                    message: "No se pudo actualizar la solicitud por falta de recursos",
                    requestedStorageGB: getTotalDiskSpace(requestInformation?.DISCOS || []),
                    requestedRAMMB: requestInformation.RAM_GB,
                    requestedCPUCores: requestInformation.VCPU_CORES
                })
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
        <>
            <div className='modal-header py-4'>
                <h2 className="text-dark">ACTUALIZAR SOLICITUD</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-10 d-flex flex-column gap-3'>
                {/* Sección IP y botones */}
                <div className="mb-4 d-flex flex-column flex-md-row gap-3 align-items-end justify-content-between">
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
                                disabled={!updatedGeneral.vlan_id || loadingValidateIP}
                            />
                        </div>
                        {errors?.ip && (
                            <div className="fv-plugins-message-container invalid-feedback">{errors.ip}</div>
                        )}
                    </div>

                    <div className="d-flex gap-3 flex-nowrap">
                        <button
                            type="button"
                            className="btn btn-light text-primary"
                            disabled={!updatedGeneral.vlan_id || loadingVlans || loadingValidateIP}
                            onClick={handleValidateIP}
                        >
                            {loadingValidateIP ? 'Validando' : 'Validar IP'}
                            {loadingValidateIP && <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
                        </button>
                        <button
                            type="button"
                            className="btn btn-light text-success"
                            disabled={!updatedGeneral.vlan_id || loadingVlans || loadingGenerateIP}
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
                    {currentVlans.map(vlan => (
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
                                        checked={updatedGeneral.vlan_id === vlan.vlan_id}
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
                    ))}
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
            <div className="modal-footer d-flex justify-content-between">
                <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => modalHook.closeModal()}
                    disabled={loadingUpdateGeneral}
                >
                    <i className="bi bi-x-circle fs-3 me-2"></i>
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-sm btn-success"
                    disabled={loadingUpdateGeneral}
                    onClick={handleSubmit}
                >
                    {loadingUpdateGeneral ?
                        <>
                            Actualizando &nbsp;
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        </> :
                        <>
                            <i className="bi bi-check-square fs-3"></i>
                            Actualizar solicitud
                        </>
                    }
                </button>
            </div>
        </>
    )
}