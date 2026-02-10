import { useEffect } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { useLinuxPatchContext } from "../../Context"
import { IListServerAssignedLinux } from "../../../Types"
import { ServerSpecifications } from "./ServerSpecifications"
import { CRQsAssociated } from "./CRQsAssociated"

const ServerInformation = () => {

    const { modalHook, serverHook } = useLinuxPatchContext()
    const modalInformation: IListServerAssignedLinux = modalHook.modalInformation

    useEffect(() => {
        serverHook.getServerInformationLinux(modalInformation.ID_EQUIPO)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header py-4'>
                <h2>INFORMACION DEL SERVIDOR {modalInformation.NOMBRE_CI.toUpperCase()}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-lg-10 d-flex gap-3 justify-content-around'>
                <ServerSpecifications
                    getServersInfoLoading={serverHook.getServersInfoLinuxLoading}
                    serverInformationData={serverHook.serverInformationLinuxData}
                    modalInformation={modalInformation}
                />
                <CRQsAssociated
                    getServersInfoLoading={serverHook.getServersInfoLinuxLoading}
                    serverInformationData={serverHook.serverInformationLinuxData}
                />
            </div>
        </>
    )
}
export { ServerInformation }