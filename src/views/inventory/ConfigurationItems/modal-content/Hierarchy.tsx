import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import Tree, { RawNodeDatum } from 'react-d3-tree'
import { IConfigurationItem } from "../../Types"

const Hierarchy = () => {

    const { modalHook, owners } = useConfigurationItemsContext()
    const modalInformation: IConfigurationItem = modalHook.modalInformation

    return (
        <>
            <div className='modal-header px-5 py-3  bg-dark'>
                <h2 className="text-white">CREAR RELACIÓN DE CI's | CLIENTE - {owners.client}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body'>
                <div id="treeWrapper" style={{ width: '100%', height: '88vh' }}>
                    <Tree
                        pathFunc='diagonal'
                        enableLegacyTransitions
                        nodeSize={{ x: 300, y: 150 }}
                        data={convertirAFormatoDeseado(modalInformation)}
                        translate={{ x: 100, y: 400 }}
                    />
                </div>
            </div>
        </>
    )
}
export { Hierarchy }

function convertirAFormatoDeseado(configItem: IConfigurationItem): RawNodeDatum {
    const attributes: Record<string, string | number | boolean> = {
        UBICACION: configItem.UBICACION ?? "",
        NOMBRE_CI: configItem.NOMBRE_CI ?? "",
        CLIENTE: configItem.CLIENTE ?? ""
    }

    const children = configItem.HIJOS?.map(convertirAFormatoDeseado)

    return {
        name: configItem.NOMBRE_CI || '',
        attributes,
        children
    }
}