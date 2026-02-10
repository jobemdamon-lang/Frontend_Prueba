import { FC, InputHTMLAttributes } from "react"
import { InputProps } from "../../helpers/Types"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string,
  value: string | number,
  classNameFather?: string,
  className?: string,
  setNewValue: (value: string) => void,
  type?: string
}
const TextInput: FC<Props> = ({ label, value, setNewValue, className, classNameFather, type, ...inputProps }) => {

  return (
    <div className={classNameFather}>
      <label htmlFor={label.split(" ").join("_")} className="form-label">{label}</label>
      <input
        {...inputProps}
        type={type ?? "text"}
        className={`form-control ${className}`}
        id={label.split(" ").join("_")}
        value={value}
        onChange={(event) => setNewValue(event.target.value)}
      />
    </div>
  )
}
const Input: FC<InputProps> = ({ label, loading, containerClassName, ...props }) => {

  return (
    <div className={containerClassName ?? ""}>
      <label className='form-label' htmlFor={`input-${label.replace(/\s+/g, '')}`}>{label}</label>
      <input
        {...props}
        placeholder={loading ? "Cargando..." : props.placeholder}
        name={`input-${label.replace(/\s+/g, '')}`}
        id={`input-${label.replace(/\s+/g, '')}`}
        className={`form-control ${props.className ?? ""}`}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </div>
  )
}

export { TextInput, Input }