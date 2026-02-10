import { FC } from "react"
import { IDynamicAttribute } from "../../../Types"
import { SelectInput } from "../../../../../components/Inputs/SelectInput"

type ComponentProps = {
    attributes: IDynamicAttribute[],
    disabled: boolean
}


const List: FC<ComponentProps> = ({ attributes, disabled }) => {

    const handleNothing = (value: string) => null

    return (
        <div>
            {attributes.map(att => (
                <SelectInput
                    data-type-attribute={att.ATRIBUTO}
                    data-id-value={att.ID_VALOR}
                    data-id-attribute={att.ID_METADATA}
                    className="w-360px"
                    disabled={disabled}
                    key={att.ID_METADATA}
                    label={att.NombreAtributo}
                    defaultValue={att.VALOR_LISTA ?? ""}
                    onChange={handleNothing}
                    data={att?.LISTA_OPCIONES ? att?.LISTA_OPCIONES.map(option => ({ codigo: option.IDOPCION, nombre: option.VALOR })) : []}
                />
            ))}
        </div>
    )
}
export { List }