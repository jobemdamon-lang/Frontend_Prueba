import { useEffect } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { useWindowsPatchContext } from "../../Context"
import "../../../../../assets/sass/components/automationawx/general-styles.scss"
import { ServerSpecifications } from "./ServerSpecifications"
import { AvailablePatches } from "./AvailablePatches"
import { ServerStatus } from "./ServerStatus"
import { CRQsAssociated } from "./CRQsAssociated"
import { IListServerAssigned } from "../../../Types"

const ServerInformation = () => {

  const { modalHook, serverHook } = useWindowsPatchContext()
  const modalInformation: IListServerAssigned = modalHook.modalInformation

  useEffect(() => {
    serverHook.getServerInformation(modalInformation.ID_EQUIPO)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>INFORMACION DEL SERVIDOR: {modalInformation.NOMBRE_CI}</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 server-information-parent'>
        <ServerSpecifications
          getServersInfoLoading={serverHook.getServersInfoLoading}
          serverInformationData={serverHook.serverInformationData}
          modalInformation={modalInformation}
        />
        <ServerStatus
          getServersInfoLoading={serverHook.getServersInfoLoading}
          serverInformationData={serverHook.serverInformationData}
          modalInformation={modalInformation}
        />
        <AvailablePatches
          getServersInfoLoading={serverHook.getServersInfoLoading}
          serverInformationData={serverHook.serverInformationData}
          modalInformation={modalInformation}
        />
        <CRQsAssociated
          getServersInfoLoading={serverHook.getServersInfoLoading}
          serverInformationData={serverHook.serverInformationData}
          modalInformation={modalInformation}
        />
      </div>
    </>
  )
}
export { ServerInformation }