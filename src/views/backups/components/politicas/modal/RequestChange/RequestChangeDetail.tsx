import { useContext, useState } from "react"
import { KTSVG, toAbsoluteUrl } from "../../../../../../helpers"
import { Context } from "../../Context"
import SVG from "react-inlinesvg"
import { IDataRequestChangesOR } from "../../Types"
import { RequestChangeContent } from "./RequestChangeContent"
import { RequestChangeHeader } from "./RequestChangeHeader"
import { Modal } from "react-bootstrap"
import { LogsModalContent } from "./LogsModalContent"
import { useRequestChanges } from "../../../../hooks/useRequestChanges"

const RequestChangeDetail = () => {

  const { closeModal, modalInformation, showDetail }: { closeModal: any, modalInformation: IDataRequestChangesOR, showDetail: boolean } = useContext(Context)
  const [isDetailVisibility, setIsVisibility] = useState(showDetail)
  const [isLogModalOpen, setOpenLogModal] = useState(false)
  const { fetchLogsRequest, loadingLogs, logsData } = useRequestChanges()

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Solicitud de Actualización de Politica de Backup N° {modalInformation?.nro_ticket}</h2>
        <RequestChangeHeader
          isDetailVisibility={isDetailVisibility}
          setOpenLogModal={setOpenLogModal}
          fetchLogsRequest={fetchLogsRequest}
          modalInformation={modalInformation}
        />
        <div>
          <button
            className="btn-access-modal"
            style={{
              opacity: isDetailVisibility ? "1" : "0",
              backgroundColor: "transparent"
            }}
            onClick={() => setIsVisibility(false)}
          >
            <SVG src={toAbsoluteUrl("/media/icons/duotune/arrows/arr074.svg")} className="category-item" />
            <strong>Regresar</strong>
          </button>
          <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
            <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
          </div>
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10'>
        <RequestChangeContent
          modalInformation={modalInformation}
          isDetailVisibility={isDetailVisibility}
          setIsVisibility={setIsVisibility}
        />
      </div>
      <Modal
        fullscreen={true}
        id='kt_modal_create_app'
        tabIndex={-1}
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered'
        show={isLogModalOpen}
      >
        <LogsModalContent
          setOpenLogModal={setOpenLogModal}
          loadingLogs={loadingLogs}
          logsData={logsData}
        />
      </Modal>
    </>
  )
}
export { RequestChangeDetail }
