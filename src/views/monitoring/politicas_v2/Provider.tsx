import { FC, useState } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { MonitoringPoliciesProvider } from './Context'
import { useModal } from '../../../hooks/useModal'
import { MonitoringPoliciesModal } from './MonitoringPoliciesModal'
import { Views } from './Types'
import { PoliciesMain } from './Content/PoliciesMain'
import { UpdateMain } from './Content/updatePolicy/UpdateMain'
import { usePolicy } from './hooks/usePolicy'
import { useVersion } from './hooks/useVersion'
import { useCatalog } from './hooks/useCatalog'
import { useChange } from './hooks/useChange'

const Provider: FC<ModuleProps> = ({ rol }) => {

    const [currentView, setCurrentView] = useState<Views>('policies')
    const [globalParams, setGlobalParams] = useState<{
        projectID: number,
        clientID: number,
        policyID: number,
        versionID: number
    }>({
        projectID: 0,
        clientID: 0,
        versionID: 0,
        policyID: 0,
    })
    const modalHook = useModal()
    const policyHook = usePolicy()
    const versionHook = useVersion()
    const catalogHook = useCatalog()
    const changesHook = useChange()

    return (
        <MonitoringPoliciesProvider value={{
            rol,
            modalHook,
            currentView,
            globalParams,
            setGlobalParams,
            setCurrentView,
            policyHook,
            versionHook,
            catalogHook,
            changesHook
        }}>
            <div style={{ display: currentView === 'policies' ? 'block' : 'none' }}>
                <PoliciesMain />
            </div>
            {currentView === 'update_policy' && <UpdateMain />}
            <MonitoringPoliciesModal />
        </MonitoringPoliciesProvider>
    )
}

export { Provider }