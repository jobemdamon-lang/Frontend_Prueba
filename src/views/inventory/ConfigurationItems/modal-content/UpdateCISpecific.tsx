import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useCI } from "../../hooks/useCI"
import { useEffect } from "react"
import { IConfigurationItem, IUpdateDynamicAttribute } from "../../Types"
import { Simple } from "./DynamicForm/Simple"
import { List } from "./DynamicForm/List"
import { Multiple } from "./DynamicForm/Multiple"
import { Loading } from "../../../../components/Loading"
import { buildAttOfFormFromEventTarget, makeBodyForDynamicAttUpdate } from "../../hooks/utils"
import { NoFoundData } from "../../../../components/NoFoundData"

const UpdateCISpecific = () => {

    const { modalHook, handleListCIs } = useConfigurationItemsContext()
    const modalInformation: IConfigurationItem = modalHook.modalInformation
    const CIHook = useCI()

    useEffect(() => {
        CIHook.getValuesOfDynamicAttributesByCI(modalInformation.IDOPCION.toString(), modalInformation.ID_EQUIPO.toString())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const body: IUpdateDynamicAttribute[] = []
        const formElements = event.currentTarget.elements;
        const listElementsOfAttributes = buildAttOfFormFromEventTarget(formElements)

        for (let attElement of listElementsOfAttributes) {
            const elementToUpdate = makeBodyForDynamicAttUpdate(modalInformation, CIHook.dynamicValuesOfAttributes, attElement)
            if (elementToUpdate) body.push(elementToUpdate)
        }
        CIHook.updateDynamicInformationCI(modalInformation.ID_EQUIPO, {
            registros: body
        }).then(success => {
            if (success) {
                modalHook.closeModal()
                handleListCIs()
            }
        })
    };

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">ACTUALIZAR INFORMACIÓN ESPECIFICA | {modalInformation.NOMBRE_CI}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                {CIHook.loadingListDynamicAttributes ?
                    <Loading loadingText="Cargando Información..." />
                    :
                    CIHook.dynamicValuesOfAttributes.length !== 0 &&
                    <form
                        onSubmit={handleSubmit}
                        className="d-flex flex-column"
                    >
                        <div className="d-flex justify-content-center flex-wrap gap-5 align-items-top">
                            {CIHook.dynamicValuesOfAttributes.map(item => {
                                return (
                                    <div>
                                        {item.ATRIBUTO === "SIMPLE" && <Simple attributes={item.HIJOS} disabled={false} />}
                                        {item.ATRIBUTO === "LISTA" && <List attributes={item.HIJOS} disabled={false} />}
                                        {item.ATRIBUTO === "MULTIPLE" && <Multiple attributes={item.HIJOS} disabled={false} />}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="gap-5 d-flex justify-content-end mt-10">
                            <button
                                className="btn btn-primary me-md-2"
                                type="submit"
                                disabled={CIHook.loadingUpdateDynamicInformationCI}
                            >
                                {CIHook.loadingUpdateDynamicInformationCI ? "Actualizando" : "Actualizar"}
                            </button>
                            <button
                                onClick={() => modalHook.closeModal()}
                                className="btn btn-danger"
                                type="button"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                }
                {!CIHook.loadingListDynamicAttributes && CIHook.dynamicValuesOfAttributes.length === 0 &&
                    <NoFoundData message="No se han encontrado atributos personalizados para este CI." />
                }
            </div>
        </>
    )
}
export { UpdateCISpecific }