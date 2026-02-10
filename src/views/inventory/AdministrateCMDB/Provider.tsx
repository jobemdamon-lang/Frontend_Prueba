import { FC, useEffect } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { AdministrateCMDBProvider } from './Context'
import { AddAtributteSection } from './Content/AddAtributteSection'
import { ListAtributtesSection } from './Content/ListAtributtesSection'
import { useDataFromMonitorOptions } from '../hooks/useDataFromMonitorOptions'
import { useModal } from '../../../hooks/useModal'
import { AdministrateCMDBModal } from './AdministrateCMDBModal'
import { useAttribute } from '../hooks/useAttribute'
import { FamilyClaseTable } from './Content/FamilyClaseTable'
import { useFamilyClase } from '../hooks/useFamilyClase'

const Provider: FC<ModuleProps> = ({ rol }): JSX.Element => {

    const modalHook = useModal()
    const { getFamilia, getTypesAttributes, getTypesData, familyData, familyLoading, typeAttributes, typeAttLoading, typeData, typeDataLoading, } = useDataFromMonitorOptions()
    const attributeHook = useAttribute()
    const familyclaseHook = useFamilyClase()

    useEffect(() => {
        getFamilia()
        getTypesAttributes()
        getTypesData()
        familyclaseHook.getFamiliesWithClases()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AdministrateCMDBProvider value={{
            rol,
            modalHook,
            familyData,
            familyLoading,
            typeAttributes,
            typeAttLoading,
            typeData,
            typeDataLoading,
            attributeHook,
            familyclaseHook
        }} >
            <div className='mx-10'>
                <div className='d-flex justify-content-around align-items-center gap-10 flex-wrap mb-5'>
                    <AddAtributteSection />
                    <ListAtributtesSection />
                </div>
                <FamilyClaseTable />
            </div>
            <AdministrateCMDBModal />
        </AdministrateCMDBProvider>
    )
}

export { Provider }
