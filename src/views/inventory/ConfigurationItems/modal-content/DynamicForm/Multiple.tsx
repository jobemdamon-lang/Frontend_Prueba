import { FC } from "react"
import { IDynamicAttribute } from "../../../Types"
import { TagInput } from "./TagInput"

type ComponentProps = {
    attributes: IDynamicAttribute[],
    disabled: boolean
}

const Multiple: FC<ComponentProps> = ({ attributes, disabled }) => {
    return (
        <div>
            <TagInput
                className="w-300px"
                disabled={disabled}
                key={attributes[0].ID_METADATA}
                label={attributes[0].NombreAtributo}
                data={attributes}
            />
        </div>
    )
}
export { Multiple }