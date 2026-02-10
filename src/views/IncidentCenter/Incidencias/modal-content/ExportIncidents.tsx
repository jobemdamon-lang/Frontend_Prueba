import React, { useState, useEffect } from "react"
import { useIncidentContext } from "../Context"
import { KTSVG } from "../../../../helpers"


export const ExportIncidents = () => {
    const { modalHook } = useIncidentContext()

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    const [error, setError] = useState("")
    const [isValid, setIsValid] = useState(false)

    const validateDates = () => {
        const today = new Date().toISOString().split("T")[0] // Fecha actual en formato YYYY-MM-DD

        // Validar que ambas fechas estén seleccionadas
        if (!startDate || !endDate) {
            setError("Debe seleccionar ambas fechas.")
            return false
        }

        // Validar que la fecha de inicio sea menor o igual a la fecha actual
        if (startDate > today) {
            setError("La fecha de inicio no puede ser mayor a la fecha actual.")
            return false
        }
        // Validar que la fecha de fin sea menor o igual a la fecha actual
        if (endDate > today) {
            setError("La fecha de fin no puede ser mayor a la fecha actual.")
            return false
        }

        // Validar que la fecha de fin sea mayor o igual a la fecha de inicio
        if (endDate < startDate) {
            setError("La fecha de fin no puede ser menor a la fecha de inicio.")
            return false
        }

        // Si todo está bien, limpiar el error
        setError("")
        return true
    }

    useEffect(() => {
        setIsValid(validateDates())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate])

    const handleExport = () => {
        if (validateDates()) {
            console.log("Exporting incidents from", startDate, "to", endDate)
        }
    }

    return (
        <>
            <div className="modal-header">
                <h2 className="fw-bold">Exportar Incidencias</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className="modal-body mx-5 mx-xl-15 my-7">
                {error && (
                    <div className="alert alert-danger d-flex align-items-center mb-5">
                        <i className="fas fa-exclamation-triangle fs-2 text-danger me-4"></i>
                        <div className="d-flex flex-column">
                            <span className="text-danger">{error}</span>
                        </div>
                    </div>
                )}
                <div className="row g-4">
                    <div className="col-md-6">
                        <label htmlFor="startDate" className="form-label required">Fecha de inicio</label>
                        <input
                            type="date"
                            id="startDate"
                            className="form-control form-control-solid"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="dd/mm/aaaa"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="endDate" className="form-label required">Fecha de fin</label>
                        <input
                            type="date"
                            id="endDate"
                            className="form-control form-control-solid"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="dd/mm/aaaa"
                        />
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button 
                    type="button" 
                    className="btn btn-light me-3" 
                    onClick={() => modalHook.closeModal()}
                >
                    Cancelar
                </button>
                <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleExport} 
                    disabled={!isValid}
                >
                    Exportar
                </button>
            </div>
        </>
    )
}