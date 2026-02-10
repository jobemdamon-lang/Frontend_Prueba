import { useCallback, useState } from "react"
import { ProvisioningService } from "../../../services/Provisioning.service"
import { handleAxiosError, isSuccessActionInBackend, isSuccessRequest } from "../../../helpers/handleAxiosError";
import { errorNotification, successNotification, warningNotification } from "../../../helpers/notifications";
import { CreateRequestVM, Ejecucion, GeneratedIP, GenerateIP, IuseRequestVM, ProvisioningExport, RequestVM, RequestVMResume, RevalidateApproval, ValidateIP, validateRecommendation, ValidateRequestVM } from "../Types";

const useRequestVM = (): IuseRequestVM => {

    const [loadingCreateRequestVM, setLoadingCreateRequestVM] = useState(false)
    const [loadingRequestsVM, setLoadingRequestsVM] = useState(false)
    const [requestsVM, setRequestsVM] = useState<RequestVMResume[]>([])
    const [loadingRequestVM, setLoadingRequestVM] = useState(false)
    const [requestVM, setRequestVM] = useState<RequestVM | null>(null)
    const [loadingSendApproveRequestVM, setLoadingSendApproveRequestVM] = useState(false)
    const [loadingApproveRequestVM, setLoadingApproveRequestVM] = useState(false)
    const [loadingCancelRequestVM, setLoadingCancelRequestVM] = useState(false)
    const [loadingValidateIP, setLoadingValidateIP] = useState(false)
    const [loadingGenerateIP, setLoadingGenerateIP] = useState(false)
    const [loadingProvisioning, setLoadingProvisioning] = useState(false)
    const [loadingValidateRequestVM, setLoadingValidateRequestVM] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(false)
    const [progressExecution, setProgressExecution] = useState<Ejecucion[]>([])
    const [loadingRevalidation, setLoadingRevalidation] = useState(false)
    const [loadingRecommendation, setLoadingRecommendation] = useState(false)
    const [loadingExport, setLoadingExport] = useState(false)

    const createRequestVM = useCallback(async function (data: CreateRequestVM) {
        setLoadingCreateRequestVM(true)
        try {
            const response = await ProvisioningService.createRequestVM(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingCreateRequestVM(false)
        }
    }, [])

    const getRequestsVM = useCallback(async function () {
        setLoadingRequestsVM(true)
        try {
            const response = await ProvisioningService.getRequestsVM()
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setRequestsVM(response.data.lista)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingRequestsVM(false)
        }
    }, [])

    const getRequestVM = useCallback(async function (id_vm_request: number) {
        setLoadingRequestVM(true)
        try {
            const response = await ProvisioningService.getRequestVM(id_vm_request)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setRequestVM(response.data.data)
            } else {
                errorNotification(response.data.mensaje)
                setRequestVM(null)
            }
        } catch (e) {
            setRequestVM(null)
            handleAxiosError(e)
        } finally {
            setLoadingRequestVM(false)
        }
    }, [])

    const sendToApproveRequestVM = useCallback(async function (id_vm_request: number, usuario: string) {
        setLoadingSendApproveRequestVM(true)
        try {
            const response = await ProvisioningService.sendToApproveRequestVM(id_vm_request, usuario)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingSendApproveRequestVM(false)
        }
    }, [])

    const approveRequestVM = useCallback(async function (id_vm_request: number, usuario: string) {
        setLoadingApproveRequestVM(true)
        try {
            const response = await ProvisioningService.approveRequestVM(id_vm_request, usuario)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingApproveRequestVM(false)
        }
    }, [])

    const cancelRequestVM = useCallback(async function (id_vm_request: number, usuario: string) {
        setLoadingCancelRequestVM(true)
        try {
            const response = await ProvisioningService.cancelRequestVM(id_vm_request, usuario)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje); return true
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingCancelRequestVM(false)
        }
    }, [])

    const validateIPRequestVM = useCallback(async function (data: ValidateIP) {
        setLoadingValidateIP(true)
        try {
            const response = await ProvisioningService.validateIPRequestVM(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                const isValidIP = response.data.es_valido
                if (isValidIP) return true;
                warningNotification(response.data.mensaje);
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingValidateIP(false)
        }
    }, [])

    const generateIPRequestVM = useCallback(async function (data: GenerateIP): Promise<GeneratedIP | undefined> {
        setLoadingGenerateIP(true)
        try {
            const response = await ProvisioningService.generateIPRequestVM(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return response.data.data;
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingGenerateIP(false)
        }
    }, [])

    const executeProvisioning = useCallback(async function (id_request: number, usuario: string) {
        setLoadingProvisioning(true)
        try {
            const response = await ProvisioningService.executeProvisioning(id_request, usuario)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true;
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingProvisioning(false)
        }
    }, [])

    const validateRequestVM = useCallback(async function (data: ValidateRequestVM): Promise<undefined | [boolean, string]> {
        setLoadingValidateRequestVM(true)
        try {
            const response = await ProvisioningService.validateRequestVM(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return [true, response.data.mensaje]
            } else {
                return [false, response.data.mensaje]
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingValidateRequestVM(false)
        }
    }, [])

    const getProgressExecution = useCallback(async function (id_execution: number) {
        setLoadingProgress(true)
        try {
            const response = await ProvisioningService.getProgressExecution(id_execution)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                setProgressExecution(response.data.data)
            } else {
                errorNotification(response.data.mensaje)
                setProgressExecution([])
            }
        } catch (e) {
            setProgressExecution([])
            handleAxiosError(e)
        } finally {
            setLoadingProgress(false)
        }
    }, [])

    const revalidateApproval = useCallback(async function (data: RevalidateApproval) {
        setLoadingRevalidation(true)
        try {
            const response = await ProvisioningService.revalidateApproval(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                successNotification(response.data.mensaje)
                return true;
            } else {
                errorNotification(response.data.mensaje)
            }
        } catch (e) {
            handleAxiosError(e)
        } finally {
            setLoadingRevalidation(false)
        }
    }, [])

    const validateRecommendations = useCallback(async function (data: validateRecommendation) {
        setLoadingRecommendation(true)
        try {
            const response = await ProvisioningService.validateRecommendations(data)
            if (isSuccessRequest(response.status) && isSuccessActionInBackend(response.data.status)) {
                return {
                    "success": true,
                    "recommended": response.data?.recommended || null,
                    "message": response.data.mensaje
                }
            } else {
                return {
                    "success": false,
                    "recommended": response.data?.recommended || null,
                    "message": response.data.mensaje
                }
            }
        } catch (e) {
            return {
                "success": false,
                "recommended": null,
                "message": "Error al validar recomendaciones"
            }
        } finally {
            setLoadingRecommendation(false)
        }
    }, [])

    const exportarAprovisionamiento = useCallback(async function (data: ProvisioningExport) {
    setLoadingExport(true)
    try {
        const response = await ProvisioningService.exportarAprovisionamiento(data)
        const contentType = response.headers?.['content-type'];
        
        if (contentType && contentType.includes('application/json')) {
            const arrayBuffer = response.data
            const uint8Array = new Uint8Array(arrayBuffer)
            const textDecoder = new TextDecoder('utf-8')
            const jsonString = textDecoder.decode(uint8Array)
            const json_response = JSON.parse(jsonString)
            errorNotification(json_response.mensaje || "Ocurrió un error al exportar el aprovisionamiento.")
        } else {
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }))
            const link = document.createElement('a')
            link.href = url
            const today = new Date()
            const date = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2)
            const time = today.getHours() + "" + today.getMinutes()
            const filename = date + '_' + time + '-aprovisionamiento.xls'
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            successNotification("¡Exportación realizada con éxito!")
        }
    } catch (e) {
        handleAxiosError(e)
    } finally {
        setLoadingExport(false)
    }
}, [])

    return {
        createRequestVM, loadingCreateRequestVM,
        getRequestsVM, loadingRequestsVM, requestsVM,
        getRequestVM, loadingRequestVM, requestVM,
        sendToApproveRequestVM, loadingSendApproveRequestVM,
        approveRequestVM, loadingApproveRequestVM,
        cancelRequestVM, loadingCancelRequestVM,
        validateIPRequestVM, loadingValidateIP,
        generateIPRequestVM, loadingGenerateIP,
        executeProvisioning, loadingProvisioning,
        validateRequestVM, loadingValidateRequestVM,
        getProgressExecution, loadingProgress, progressExecution,
        revalidateApproval, loadingRevalidation,
        validateRecommendations, loadingRecommendation,
        exportarAprovisionamiento, loadingExport
    }
}

export { useRequestVM }