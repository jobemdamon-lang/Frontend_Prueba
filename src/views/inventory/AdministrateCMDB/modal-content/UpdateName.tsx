import { FC, useState } from "react"
import { IAttributeOfFamilyClase, IuseAttribute } from "../../Types"
import { Input } from "../../../../components/Inputs/TextInput"

type Props = {
    modalInformation: IAttributeOfFamilyClase,
    attributeHook: IuseAttribute
}

const UpdateName: FC<Props> = (props) => {

    const [nameAttribute, setNameAttribute] = useState(props.modalInformation.NombreAtributo)

    const handleChangeNameAtt = () => {
        props.attributeHook.updateNameAttribute(props.modalInformation.ID_METADATA.toString(), {
            nombre: nameAttribute
        }).then(success => {
            if (success) props.attributeHook.getAttributesByFamilyClase(props.modalInformation.IDOPCION)
        })
    }

    return (
        <div className="d-flex justify-content-center align-items-end gap-10 mb-8">
            <Input
                label="Nombre Atributo"
                value={nameAttribute}
                onChange={setNameAttribute}
                disabled={props.attributeHook.loadingUpdateNameAttribute}
            />
            <button
                onClick={handleChangeNameAtt}
                disabled={props.attributeHook.loadingUpdateNameAttribute}
                className="btn btn-success"
            >
                {props.attributeHook.loadingUpdateNameAttribute ? "Actualizando" : "Actualizar Nombre"}
            </button>
        </div>
    )
}
export { UpdateName }