/* import "../../../../assets/sass/components/InventoryFilter/comboBox.scss" */
import uniqid from 'uniqid';
import { FC, InputHTMLAttributes } from "react";
import "../../assets/sass/components/InventoryFilter/comboBox.scss"
import { IComboData, InputSelectProps } from '../../helpers/Types';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string,
  value: string | number,
  classNameFather?: string,
  disabled?: boolean,
  className?: string,
  setNewValue: (value: string) => void,
  type?: "string",
  data: IComboData[],
  required?: boolean
  dependencyFunction?: Function
}

const ComboBoxInput: FC<Props> = ({
  label,
  value,
  classNameFather,
  className,
  disabled,
  setNewValue,
  data = [{ codigo: 1, nombre: "Cargando..." }],
  dependencyFunction,
  required
}) => {

  const optionTagStyle = {
    fontSize: "13px",
  }

  return (
    <div className={classNameFather}>
      <label className="form-label" htmlFor={label.split(" ").join("_")} >{label}</label>
      <select
        required={required}
        disabled={disabled}
        id={label.split(" ").join("_")}
        className={`form-select ${className}`}
        aria-label="Default select example"
        value={value}
        onChange={(event) => {
          if (dependencyFunction !== undefined) {
            dependencyFunction(event.target.value)
          }
          setNewValue(event.target.value)
        }}>
        <option className="combo-option" style={optionTagStyle} value="">Seleccione una opción</option>
        {
          data.map((option: IComboData) => {
            return (
              <option className="combo-option" style={optionTagStyle} key={uniqid()} value={option.nombre}>{option.nombre}</option>
            )
          })}
      </select>
    </div>
  )
}

const SelectInput: FC<InputSelectProps> = ({ data, dependencyfunction, label, loading, ...props }) => {

  return (
    <div>
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
export { ComboBoxInput, SelectInput };