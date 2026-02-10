import { FC, useEffect, useState } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { useModal } from '../../../hooks/useModal'
import { useUserAdministration } from './hooks/userUser'
import { UserModal } from './UserModal'
import { UserAdministrationProvider } from './Context'
import { UsersList } from './Content/UsersList'
import { useLocation } from 'react-router-dom'
import { UserInformation, Views } from './Types'
import { UserProfile } from './Content/UserProfile'
import { useParams } from './hooks/useParams'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Provider: FC<ModuleProps> = ({ rol }) => {

    const modalHook = useModal()
    const query = useQuery()
    const userHook = useUserAdministration()
    const paramsHook = useParams()
    const [currentView, setCurrentView] = useState<Views>('users_list')
    const [selectedUser, setSelectedUser] = useState<UserInformation | null>(null)
    const id = query.get("id")

    useEffect(() => {
        userHook.getUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const id_request = Number(id)
        if (id && id_request) {
            setCurrentView('user_profile')
        } else {
            setCurrentView('users_list')
        }
    }, [id])

    return (
        <UserAdministrationProvider value={{
            rol,
            modalHook,
            userHook,
            paramsHook,
            setCurrentView,
            setSelectedUser,
            selectedUser
        }}>
            {currentView === 'users_list' && <UsersList />}
            {currentView === 'user_profile' && <UserProfile />}
            <UserModal />
        </UserAdministrationProvider>
    )
}

export { Provider }