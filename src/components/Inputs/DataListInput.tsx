import { FC, ReactNode } from "react"
import DatalistInput, { Item } from "react-datalist-input"
import "../../assets/sass/components/data-list-input.scss"

type ComponentProps = {
  items: { id: string | number, value: string, node?: ReactNode }[],
  label: string,
  value: string,
  loading?: boolean,
  onChange: (value: string) => void,
  required?: boolean,
  className?: string,
  disabled?: boolean,
  containerClassName?: string
}

export const DataList: FC<ComponentProps> = (props) => {
  return (
    <div className={props.containerClassName ?? ""}>
      <label htmlFor={`select-${props.label.replace(/\s+/g, '')}`} className="form-label">{props.label}</label>
      <DatalistInput
        className={props.className}
        value={props.value}
        id={`select-${props.label.replace(/\s+/g, '')}`}
        inputProps={{
          disabled: props.disabled,
          required: props.required,
          name: `select-${props.label.replace(/\s+/g, '')}`
        }}
        placeholder={props.loading ? "Cargando" : "Ingrese su busqueda"}
        label=""
        onSelect={(selectedItem: Item) => {
          props.onChange(selectedItem.value)
        }}
        items={props.items}
      />
    </div>
  )
}


