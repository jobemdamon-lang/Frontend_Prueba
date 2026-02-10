import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IAttributeOfFamilyClase } from "../../Types"
import { useAdministrateCMDBContext } from "../Context"
import { UpdateName } from "./UpdateName"
import { UpdateOptionList } from "./UpdateOptionList"

const UpdateAttribute = () => {

    const { modalHook, attributeHook } = useAdministrateCMDBContext()
    const modalInformation: IAttributeOfFamilyClase = modalHook.modalInformation

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">ACTUALIZAR ATRIBUTO - {modalInformation.NombreAtributo}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                <UpdateName
                    modalInformation={modalInformation}
                    attributeHook={attributeHook}
                />
                {
                    modalInformation.TIPO_ATRIBUTO?.toUpperCase() === "LISTA" &&
                    <UpdateOptionList
                        modalInformation={modalInformation}
                        attributeHook={attributeHook}
                    />
                }

            </div>
        </>
    )
}
export { UpdateAttribute }