import { FC } from "react"
import { ListaEquipmentsToMetrics, ModalView } from "../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { useModalParams } from "../../hooks/useModalParams"
import { Modal } from "react-bootstrap"
import { CatalogInformation } from "./CatalogInformation"
import { customStyles } from "../../../../../helpers/tableStyles"

type Props = {
  metricsToCreate: (ListaEquipmentsToMetrics & { ci_name: string })[]
}

export const verificationColumns = (openModalParams: Function): TableColumn<(ListaEquipmentsToMetrics & { ci_name: string })>[] => [
  {
    name: 'NOMBRE DE CI',
    cell: (row: (ListaEquipmentsToMetrics & { ci_name: string })) => row.ci_name ?? "Sin registro",
    sortable: true
  },
  {
    name: 'FAMILIA',
    cell: (row: (ListaEquipmentsToMetrics & { ci_name: string })) => row.familia ?? "Sin registro",
    sortable: true
  },
  {
    name: 'CLASE',
    cell: (row: (ListaEquipmentsToMetrics & { ci_name: string })) => row.clase ?? "Sin registro",
    sortable: true
  },
  {
    name: 'HERRAMIENTA',
    cell: (row: (ListaEquipmentsToMetrics & { ci_name: string })) => row.herramienta ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TIPO DE EQUIPO',
    cell: (row: (ListaEquipmentsToMetrics & { ci_name: string })) => row.tipo_equipo ?? "Sin registro",
    sortable: true
  },
  {
    name: 'DETALLE DE CREACIÓN',
    cell: (row: (ListaEquipmentsToMetrics & { ci_name: string })) => (
      <button
        className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
        onClick={() => { openModalParams(ModalView.DETAIL_OF_CATALOG, { family: row.familia, clase: row.clase , tipo_equipo: row.tipo_equipo}) }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-square-fill" viewBox="0 0 16 16">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </button>
    ),
    sortable: true
  }
]

const SecondStep: FC<Props> = ({ metricsToCreate }) => {

  const { openModalParams, closeModalParams, showModalParams, modalViewParams, modalInformationParams } = useModalParams()

  return (
    <div className="w-100">
      <DataTable
        columns={verificationColumns(openModalParams)}
        persistTableHead
        highlightOnHover
        pagination
        customStyles={customStyles}
        fixedHeader
        disabled={false}
        data={metricsToCreate}
      />
      <Modal
        id='kt_modal_create_app'
        size={"lg"}
        tabIndex={-1}
        fullscreen={true}
        aria-hidden='true'
        dialogClassName='modal-dialog modal-dialog-centered'
        show={showModalParams}
      >
        {modalViewParams === ModalView.DETAIL_OF_CATALOG && <CatalogInformation closeModalParams={closeModalParams} modalInformationParams={modalInformationParams} />}
      </Modal>
    </div>
  )
}
export { SecondStep }
