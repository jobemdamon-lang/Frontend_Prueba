import { FC, useState } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { useModal } from '../../../hooks/useModal'
import { BackupsPoliciesModal } from './BackupsPoliciesModal'
import { BackupsPoliciesProvider } from './Context'
import { PoliciesMain } from './content/PoliciesMain'
import { useOptions } from './hooks/useOption'
import { useGroupPolicies } from './hooks/useGroupPolitics'

const Provider: FC<ModuleProps> = ({ rol }) => {

    const [globalParams, setGlobalParams] = useState({
        clientName: "",
        projectID: 0,
        projectName:"",
        groupPolicyID: 0,
        alp: "",
        usuario:""
    })
    const modalHook = useModal()
    
    // Usar el hook de opciones para las políticas
    const { policies, policiesLoading, getPolicies, requests, requestsLoading, getRequests } = useOptions()
    const {
        groupPolicies,
        groupPoliciesLoading,
        getGroupPolicies,
    } = useGroupPolicies();

    return (
        <BackupsPoliciesProvider value={{
            rol,
            modalHook,
            globalParams,
            setGlobalParams,
            policies,
            policiesLoading,
            getPolicies,
            requests,
            requestsLoading, 
            getRequests,
            groupPolicies,
            groupPoliciesLoading,
            getGroupPolicies,
        }}>
            <PoliciesMain />
            
            <BackupsPoliciesModal />
        </BackupsPoliciesProvider>
    )
}

export { Provider }