import React, { useState } from "react";
import { CreateRequestVM, initialRequest, ModalViewForServerProvisioning, StepForm } from "../../../Types";
import { General } from "./General";
import { Storage } from "./Storage";
import { Network } from "./Network";
import { AditionalServices } from "./AditionalServices";
import { ConfirmationView } from "./Confirmation";
import { useServerProvisioningContext } from "../../Context";
import { addLinuxSwap, addWindowsPageFile, buildBasePayload, calculateDiskSize, labelNextButton, stepsForm, validateGeneral, validateStorage } from "../../utils";
import { useTypedSelector } from "../../../../../store/ConfigStore";
import { ModalSize } from "../../../../administration/Types";

// Interface para los steps Components
export type CreateFormProps = {
    formData: CreateRequestVM,
    handleUpdateFormData: <K extends keyof CreateRequestVM>(key: K, value: CreateRequestVM[K]) => void;
    errors: Record<string, string>;
    setErrors: React.Dispatch<React.SetStateAction<{} | Record<string, string>>>;
    selectedSO: string;
    setSelectedSO: React.Dispatch<React.SetStateAction<string>>;
}

export const VMCreateForm = () => {

    const { requestVMHook, setCurrentView, modalHook, projectHook, paramsHook } = useServerProvisioningContext()
    const [currentStep, setCurrentStep] = useState(1)
    const [validationMessage, setValidationMessage] = useState("")
    const userName = useTypedSelector(({ auth }) => auth.usuario)
    const [errors, setErrors] = useState<Record<string, string> | {}>({})
    const [formData, setFormData] = useState<CreateRequestVM>(initialRequest(userName, paramsHook))
    const [selectedSO, setSelectedSO] = useState("")

    const validateRequest = async (validateAll: boolean) => {

        const basePayload = buildBasePayload(formData, projectHook, paramsHook, selectedSO)
        return await requestVMHook.validateRequestVM({
            ...basePayload,
            validar_todo: validateAll
        }).then(result => {
            if (!result) return false;
            const [valid, message] = result
            if (!valid) {
                setValidationMessage(message)
                return false
            }
            return true
        })
    }

    const handleNext = async () => {
        if (currentStep === 1) {
            // Validacion para datos generales
            const newErrors = validateGeneral(formData)
            setErrors(newErrors)
            if (Object.keys(newErrors).length > 0) return;

            // Añadir el disco o partición swap
            const normalizedSO = selectedSO.toLowerCase();
            const updatedDisks = normalizedSO === 'linux'
                ? addLinuxSwap([...formData.discos], formData.swap_gb)
                : addWindowsPageFile([...formData.discos], formData.swap_gb)
            handleUpdateFormData('discos', updatedDisks)

            const validationResult = await validateRequest(false);
            if (!validationResult) return;

        } else if (currentStep === 2) {
            // Validacion para discos/particiones
            const newErrors = validateStorage(formData.discos, selectedSO);
            setErrors(newErrors)
            if (Object.keys(newErrors).length > 0) return;

        } else if (currentStep === 3) {
            // Validacion para IP
            const newErrors: Record<string, string> = {};
            if (formData.ip === '') newErrors.ip = "La dirección IP es requerida. Valídela o genere una nueva.";
            setErrors(newErrors)
            if (Object.keys(newErrors).length > 0) return;

            const validationResult = await validateRequest(true);
            if (!validationResult) return;
        }

        if (currentStep < stepsForm.length) {
            setValidationMessage("")
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        if (currentStep === 5) {
            const newErrors: Record<string, string> = {};
            if (!formData.fecha_ejecucion) {
                newErrors.fecha_ejecucion = "Seleccione una fecha de ejecución válida";
            } else {
                const selectedDate = new Date(formData.fecha_ejecucion).getTime();
                const minDate = new Date().getTime(); // Fecha/hora actual
                const maxDate = minDate + 7 * 24 * 60 * 60 * 1000; // +1 semana
                if (selectedDate < minDate) {
                    newErrors.fecha_ejecucion = "La fecha no puede ser anterior a la fecha/hora actual";
                } else if (selectedDate > maxDate) {
                    newErrors.fecha_ejecucion = "La fecha no puede ser mayor a 1 semana desde ahora";
                }
            }
            setErrors(newErrors)

            if (Object.values(newErrors).some(error => error)) {
                document.getElementById(Object.keys(newErrors)[0])?.focus()
                return;
            }
        }

        const basePayload = buildBasePayload(formData, projectHook, paramsHook, selectedSO)
        const capacity = {
            total_gb: calculateDiskSize(
                selectedSO.toLowerCase() === "linux" ? "linux" : "windows",
                formData.discos
            ),
            total_cpu: formData.vcpu_cores,
            total_ram: formData.ram_gb,
        }
        requestVMHook.validateRecommendations({
            ...basePayload,
            ...capacity
        }).then(response => {
            if (response.success) {
                requestVMHook.createRequestVM(formData).then(result => {
                    if (result) {
                        requestVMHook.getRequestsVM()
                        setFormData(initialRequest(userName, paramsHook))
                        setCurrentView('requests')
                    }
                })
            } else {
                modalHook.openModal(ModalViewForServerProvisioning.VALIDATE_RECOMMENDATION, ModalSize.XL, undefined, {
                    recommended: response.recommended,
                    message: response.message,
                    requestedStorageGB: capacity.total_gb,
                    requestedRAMMB: capacity.total_ram,
                    requestedCPUCores: capacity.total_cpu
                });
            }
        })


    }

    const handleExit = () => {
        setFormData(initialRequest(userName, paramsHook))
        setCurrentView('requests')
        modalHook.closeModal()
    }

    const handleUpdateFormData = <K extends keyof CreateRequestVM>(
        key: K,
        value: CreateRequestVM[K]
    ) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: '' }))
    }

    return (
        <div id="kt_app_content_container" className="app-container container-fluid">
            <div className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid">
                {/* Navigation */}
                <div className="d-none d-xl-flex card justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9">
                    <div className="card-body px-6 px-lg-10 px-xxl-15 py-20">
                        <div className="stepper-nav">
                            {stepsForm.map((step, index) => (
                                <StepNavigationItem
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    currentStep={currentStep}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="d-flex flex-row-fluid flex-center bg-body rounded position-relative" >
                    <button
                        className="btn btn-light-danger position-absolute top-0 end-0"
                        style={{ borderRadius: '0 0 0 0.5rem' }}
                        onClick={() => modalHook.openModal(ModalViewForServerProvisioning.CANCEL_CREATION, ModalSize.LG, undefined, { cancel: handleExit })}
                    >
                        <i className="bi bi-box-arrow-left fs-1"></i>
                        Cancelar
                    </button>
                    <form className="py-20 w-100 w-xl-900px px-9">
                        <div
                            className={`${currentStep === 1 ? "current" : "d-none"}`}
                            data-kt-stepper-element="content"
                        >
                            <General
                                formData={formData}
                                handleUpdateFormData={handleUpdateFormData}
                                errors={errors}
                                selectedSO={selectedSO}
                                setSelectedSO={setSelectedSO}
                                setErrors={setErrors}
                            />
                        </div>
                        <div
                            className={`${currentStep === 2 ? "current" : "d-none"}`}
                            data-kt-stepper-element="content"
                        >
                            <Storage
                                disks={formData.discos}
                                selectedSO={selectedSO}
                            />
                        </div>
                        <div
                            className={`${currentStep === 3 ? "current" : "d-none"}`}
                            data-kt-stepper-element="content"
                        >
                            <Network
                                formData={formData}
                                handleUpdateFormData={handleUpdateFormData}
                                errors={errors}
                                selectedSO={selectedSO}
                                setSelectedSO={setSelectedSO}
                                setErrors={setErrors}
                            />
                        </div>
                        <div
                            className={`${currentStep === 4 ? "current" : "d-none"}`}
                            data-kt-stepper-element="content"
                        >
                            <AditionalServices
                                formData={formData}
                                handleUpdateFormData={handleUpdateFormData}
                                errors={errors}
                                selectedSO={selectedSO}
                                setSelectedSO={setSelectedSO}
                                setErrors={setErrors}
                            />
                        </div>
                        <div
                            className={`${currentStep === 5 ? "current" : "d-none"}`}
                            data-kt-stepper-element="content"
                        >
                            <ConfirmationView
                                formData={formData}
                                handleUpdateFormData={handleUpdateFormData}
                                errors={errors}
                                selectedSO={selectedSO}
                                setSelectedSO={setSelectedSO}
                                setErrors={setErrors}
                            />
                        </div>
                        {/* Validation Message Error */}
                        <div className="text-end w-100 my-10">
                            <span className={`${validationMessage ? 'd-block' : 'd-none'} badge badge-light-danger text-danger fs-6 p-3 fw-normal text-wrap`}>
                                <i className="bi bi-info-circle-fill fs-5 text-danger"></i>
                                &nbsp; {validationMessage}
                            </span>
                        </div>
                        {/* Navigation Buttons */}
                        <div className="d-flex flex-stack">
                            <div className="mr-2">
                                {currentStep > 1 && currentStep < stepsForm.length + 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-light-primary me-3"
                                        onClick={handlePrevious}
                                        disabled={currentStep === 1}
                                    >
                                        <i className="bi bi-caret-left-fill fs-3"></i>
                                        Regresar
                                    </button>
                                )}
                            </div>
                            <div>
                                {currentStep === stepsForm.length ?
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="btn btn-lg btn-primary me-3"
                                        disabled={requestVMHook.loadingCreateRequestVM || requestVMHook.loadingRecommendation}
                                    >
                                        <span className="indicator-label">
                                            {(requestVMHook.loadingCreateRequestVM || requestVMHook.loadingRecommendation) ? (
                                                <>
                                                    Enviando &nbsp;
                                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                                </>
                                            ) : (
                                                <>
                                                    Enviar Solicitud &nbsp;
                                                    <i className="bi bi-save fs-3"></i>
                                                </>
                                            )}
                                        </span>
                                    </button> :
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-primary me-3"
                                        onClick={handleNext}
                                        disabled={requestVMHook.loadingValidateRequestVM}
                                    >
                                        <span className="indicator-label">
                                            {requestVMHook.loadingValidateRequestVM ? 'Validando..' : labelNextButton(currentStep)} &nbsp;
                                            <i className="bi bi-caret-right-fill fs-3"></i>
                                        </span>
                                    </button>
                                }

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

// Componente para cada ítem de navegación
const StepNavigationItem: React.FC<{
    step: StepForm,
    index: number,
    currentStep: number
}> = ({ step, index, currentStep }) => {
    const isCompleted = currentStep > index + 1
    const isCurrent = currentStep === step.id
    const isLastCompleted = isCurrent && index === 4

    return (
        <div
            className={`stepper-item ${isCurrent ? "current" : ""} ${isCompleted || isLastCompleted ? "completed" : ""
                }`}
            data-kt-stepper-element="nav"
            key={step.id}
        >
            <div className="stepper-wrapper">
                <div className="stepper-icon w-40px h-40px">
                    <i className="fas fa-check stepper-check"></i>
                    <span className="stepper-number">{index + 1}</span>
                </div>
                <div className="stepper-label">
                    <h3 className="stepper-title">{step.title}</h3>
                    <div className="stepper-desc fw-semibold">{step.description}</div>
                </div>
            </div>
            {index < 4 && <div className="stepper-line h-75px"></div>}
        </div>
    )
}
