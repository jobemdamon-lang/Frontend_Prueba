import { FC, useEffect, useState } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { ServerProvisioningProvider } from './Context'
import { useModal } from '../../../hooks/useModal'
import { ProvisioningServerModal } from './ServerProvisioningModal'
import { VMCreateForm } from './Content/create-vm/VMCreateForm'
import { useParams } from '../hooks/useParams'
import { useRequestVM } from '../hooks/useRequestVM'
import { Views } from '../Types'
import { Requests } from './Content/requests/Requests'
import { Request } from './Content/requests/Request'
import { useLocation } from 'react-router-dom'
import { useUpdateRequestVM } from '../hooks/useUpdateRequest'
import { useProject } from '../../../hooks/useProjects'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Provider: FC<ModuleProps> = ({ rol }) => {

    const modalHook = useModal()
    const paramsHook = useParams()
    const query = useQuery()
    const requestVMHook = useRequestVM()
    const projectHook = useProject()
    const updateRequestHook = useUpdateRequestVM()
    const [currentView, setCurrentView] = useState<Views>('requests')
    const id = query.get("id")

    useEffect(() => {
        requestVMHook.getRequestsVM()
        paramsHook.getRequestFormParams()
        paramsHook.getVlans()
        projectHook.getProjects()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const id_request = Number(id)
        if (id && id_request) {
            setCurrentView('request_detail')
        } else {
            setCurrentView('requests')
        }
    }, [id])

    return (
        <ServerProvisioningProvider value={{
            rol,
            modalHook,
            paramsHook,
            requestVMHook,
            updateRequestHook,
            setCurrentView,
            projectHook
        }}>
            {currentView === 'requests' && <Requests />}
            {currentView === 'create_request' && <VMCreateForm />}
            {currentView === 'request_detail' && <Request />}
            <ProvisioningServerModal />
        </ServerProvisioningProvider>
    )
}

export { Provider }