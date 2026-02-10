import { FC } from "react"
import { IComboData, InputSelectProps } from "../../helpers/Types"
import uniqid from "uniqid"

const SelectInput: FC<InputSelectProps> = ({ data, dependencyfunction, label, loading, containerClassName, ...props }) => {

    return (
        <div className={containerClassName ?? ""}>
            <label className="form-label" htmlFor={`select-${label.replace(/\s+/g, '')}`} >{label}</label>
            <select
                {...props}
                className={`form-select ${props.className}`}
                name={`select-${label.replace(/\s+/g, '')}`}
                id={`select-${label.replace(/\s+/g, '')}`}
                aria-label="Seleccione un valor"
                onChange={(event) => {
                    if (dependencyfunction !== undefined) {
                        dependencyfunction(event.target.value)
                    }
                    props.onChange(event.target.value)
                }}>
                <option value="">{loading ? "Cargando..." : "Seleccione una opción"}</option>
                {data.map((option: IComboData) => {
                    return (
                        <option key={uniqid()} value={option.nombre}>{option.nombre}</option>
                    )
                })}
            </select>
        </div>
    )
}

export { SelectInput }