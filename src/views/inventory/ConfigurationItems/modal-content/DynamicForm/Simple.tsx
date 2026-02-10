import { FC } from "react"
import { IDynamicAttribute, TYPE_DATA } from "../../../Types"
import { Input } from "../../../../../components/Inputs/TextInput"

type ComponentProps = {
    attributes: IDynamicAttribute[],
    disabled: boolean
}

const Simple: FC<ComponentProps> = ({ attributes, disabled }) => {

    const handleNothing = (value: string) => null

    return (
        <div>
            {attributes.map(att => (
                <Input
                    data-type-attribute={att.ATRIBUTO}
                    data-id-value={att.ID_VALOR}
                    data-id-attribute={att.ID_METADATA}
                    className="w-300px"
                    disabled={disabled}
                    type={typeDataInput[att?.TIPO_DATO ?? "TEXTO"]}
                    key={att.ID_METADATA}
                    label={att.NombreAtributo}
                    defaultValue={att.VALOR_SIMPLE ?? ""}
                    onChange={handleNothing}
                />
            ))}
        </div>
    )
}
export { Simple }

const typeDataInput: Record<TYPE_DATA, string> = {
    TEXTO: "text",
    NUMERO: "number",
    FECHA: "date",
    HORA: "time",
};