import { Form } from "react-bootstrap"
/* import "../../../../../../../assets/sass/components/InventoryFilter/comboBox.scss" */
import uniqid from 'uniqid';

type IComboData = {
  codigo: number,
  nombre: string
}
const ComboBoxInput = (props: any) => {
  let value: string = props?.value
  const label: string = props.label
  const disabled: boolean = props.disabled || false
  const isrequired = props.required ? true : false
  let optionValues: Array<IComboData> = props.data || [{ codigo: 1, nombre: "Cargando..." }]
  const setNewValue: React.Dispatch<React.SetStateAction<string | number | null>> = props.setNewValue
  const dependencyFunction = props?.dependencyFunction

  const optionTagStyle = {
    fontSize: "13px",
  }

  return (
    <div>
      <Form.Label htmlFor={`addEquipment-form-${label.replace(/\s+/g, '')}`} >{label}</Form.Label>
      <Form.Control
        disabled={disabled}
        as="select"
        required={isrequired}
        className="comboBox"
        aria-label="Default select example"
        value={value}
        onChange={(value) => {
          if (value.target.value === "") {
            setNewValue("")
            return
          } else {
            if (dependencyFunction !== undefined) {
              dependencyFunction(value.target.value)
            }
            setNewValue(value.target.value)
          }
        }}>
        <option className="combo-option" style={optionTagStyle} value="">Seleccione una opción</option>
        {optionValues.map((option: IComboData) => {
          return (
            <option className="combo-option" style={optionTagStyle} key={uniqid()} value={option.nombre}>{option.nombre}</option>
          )
        })}
      </Form.Control>
    </div>
  )
}
export { ComboBoxInput }