import { useAdministrateCMDBContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import Tree, { RawNodeDatum } from 'react-d3-tree'
import { IFamilyClase } from "../../Types"

const HierarchyFamilyClase = () => {

    const { modalHook, familyclaseHook } = useAdministrateCMDBContext()

    return (
        <>
            <div className='modal-header px-5 py-3  bg-dark'>
                <h2 className="text-white">RELACION ENTRE FAMILIA Y CLASES</h2>
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
                        data={convertirAFormatoDeseado(addBase(familyclaseHook.familyClaseData))}
                        translate={{ x: 100, y: 400 }}
                    />
                </div>
            </div>
        </>
    )
}
export { HierarchyFamilyClase }

function addBase(familyClase: IFamilyClase[]): IFamilyClase {

    const baseFamilyClase: IFamilyClase = {
        FAMILIA: 'BASE',
        CLASE: 'BASE',
        HIJOS: familyClase,
        ID: 0
    }

    return baseFamilyClase
}

function convertirAFormatoDeseado(familyClase: IFamilyClase): RawNodeDatum {
    const attributes: Record<string, string | number | boolean> = {
        FAMILIA: familyClase.FAMILIA ?? "",
        CLASE: familyClase.CLASE ?? ""
    }

    const children = familyClase.HIJOS?.map(convertirAFormatoDeseado)

    return {
        name: familyClase.FAMILIA + " " + familyClase.CLASE || '',
        attributes,
        children
    }
}