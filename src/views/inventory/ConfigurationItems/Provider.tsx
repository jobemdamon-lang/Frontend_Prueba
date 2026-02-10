import { FC, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { ConfigurationItemsProvider } from './Context'
import { CMDBTable } from './Content/CMDBTable'
import { useCI } from '../hooks/useCI'
import { useModal } from '../../../hooks/useModal'
import { CIFilters } from './Content/CIFilters'
import { useClient } from '../../../hooks/useClient'
import { useProject } from '../../../hooks/useProjects'
import { IOwners, initialOwnerCMDB } from '../Types'
import { ConfigurationItemsModal } from './ConfigurationItemsModal'
import { useDataFromMonitorOptions } from '../hooks/useDataFromMonitorOptions'
import { CardsContainer } from './Content/CardsContainer'
import { ApiContext } from '@ezgrid/grid-core'
//import { CMDBCustomTable } from './Content/CMDBCustomTable'

const Provider: FC<ModuleProps> = ({ rol }) => {

    const { getListConfigurationItems, loadingListCI, configurationItems, getListConfigurationItemsPlane, loadingListCIPlane, configurationItemsPlane } = useCI()
    const [owners, setOwners] = useState<IOwners>(initialOwnerCMDB)
    const clientHook = useClient()
    const projectHook = useProject()
    const modalHook = useModal()
    const monitorOptionsHook = useDataFromMonitorOptions()
    const apiRef = useRef<ApiContext | null>(null)
    const [filterGlobalValue, setFilterGlobalValue] = useState("")

    const handleListCIs = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault()
        getListConfigurationItems({
            alp: owners.alp,
            cliente: owners.client,
            proyecto: owners.project,
            buscar_palabra: owners.generic_filter
        })
        getListConfigurationItemsPlane({
            alp: owners.alp,
            cliente: owners.client,
            proyecto: owners.project,
            buscar_palabra: owners.generic_filter
        })
    }

    const handleCleanFilters = () => {
        setFilterGlobalValue("")
        apiRef.current?.api?.clearGlobalFilter()
    }

    useLayoutEffect(() => {
        const demoLink = document.querySelector('a[href="https://reactdatagrid.com"]');
        if (demoLink instanceof HTMLElement) {
            demoLink.style.display = 'none';
        }
    }, [])

    useEffect(() => {
        clientHook.getClientsWithCMDBD()
        monitorOptionsHook.getFamilia()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConfigurationItemsProvider value={{
            rol,
            modalHook,
            clientHook,
            projectHook,
            setOwners,
            owners,
            handleListCIs,
            monitorOptionsHook,
            configurationItemsPlane,
            loadingListCIPlane,
            apiRef,
            handleCleanFilters,
            filterGlobalValue,
            setFilterGlobalValue
        }} >
            <div className='d-flex flex-column gap-10'>
                <CIFilters setFilterGlobalValue={setFilterGlobalValue} />
                <CardsContainer configurationItems={configurationItems} loadingListCI={loadingListCI} />
            </div>
            <CMDBTable dataCI={configurationItems} loading={loadingListCI} />
            <ConfigurationItemsModal />
        </ConfigurationItemsProvider>
    )
}

export { Provider }