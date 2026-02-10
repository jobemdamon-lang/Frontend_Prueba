import { FC, useContext } from "react"
import { PolicyRecentlyCreatedTable } from "../../Tables/PolicyRecentlyCreatedTable/PolicyRecentlyTable"
import { IListEquipmentsOfPolicy, ModalView } from "../../Types"
import { Modal } from 'react-bootstrap'
import { ContextPolitica } from "../../ContextPolitica"
import { AddPortMetric } from "./OptionalMetrics/AddPorts"
import { AddDisponibility } from "./OptionalMetrics/AddDisponibility"
import { AddFilesystem } from "./OptionalMetrics/AddFileSystem"

type Props = {
  equipmentsOfPolicy: IListEquipmentsOfPolicy
}

const ThirdStep: FC<Props> = ({ equipmentsOfPolicy }) => {

  const { openModalParams, showModalParams, modalViewParams } = useContext(ContextPolitica)

  return (
    <div className="w-100 p-3">
      <h4 className=" ">AÑADIR METRICAS OPCIONALES</h4>
      <PolicyRecentlyCreatedTable
        equipmentsOfPolicy={equipmentsOfPolicy}
        openModalParams={openModalParams}
      />
      <Modal
        id='kt_modal_create_app'
        size={"lg"}
        tabIndex={-1}
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered'
        show={showModalParams}
      >
        {modalViewParams === ModalView.ADD_PORT_METRIC && <AddPortMetric nro_version_={equipmentsOfPolicy.politica.VERSION_ACTUAL} />}
        {modalViewParams === ModalView.ADD_DISPONIBILITY_METRIC && <AddDisponibility nro_version_={equipmentsOfPolicy.politica.VERSION_ACTUAL} />}
        {modalViewParams === ModalView.ADD_FILESYSTEM_METRIC && <AddFilesystem nro_version_={equipmentsOfPolicy.politica.VERSION_ACTUAL} />}
      </Modal>
    </div>
  )
}
export { ThirdStep }