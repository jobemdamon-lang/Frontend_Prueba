import { useEffect } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { useLinuxPatchContext } from "../../Context"
import { Tab, Tabs } from "../../../../../components/Tabs"
import { ManagementCredential } from "./ManagementCredential"
import { AssignCredentialMain } from "./AssignCredentialMain"


const CredentialConfiguration = () => {

    const { modalHook, credentialHook } = useLinuxPatchContext()

    useEffect(() => {
        credentialHook.getListCredentials()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header py-4'>
                <h2>GESTIÓN DE CREDENCIALES</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10'>
                <Tabs>
                    <Tab title="Credenciales">
                        <ManagementCredential />
                    </Tab>
                    <Tab title="Asignar Credenciales">
                        <AssignCredentialMain />
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}
export { CredentialConfiguration }