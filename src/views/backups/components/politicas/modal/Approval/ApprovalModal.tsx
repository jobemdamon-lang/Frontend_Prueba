import { FC, useCallback, useContext, useEffect, useState } from "react"
import { Modal } from "react-bootstrap"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { KTSVG, toAbsoluteUrl } from "../../../../../../helpers"
import { ComboBoxInput } from "../RequestChange/CreateTaskSection/ComboBoxInput"
import { IDataRequestChangesOR, ITaskToApprove } from "../../Types"
import SVG from "react-inlinesvg"
import { toast } from "react-toastify"
import { Context } from "../../Context"
import { useRequestChanges } from "../../../../hooks/useRequestChanges"

type Props = {
  showApprovalModal: boolean,
  setShowApproval: React.Dispatch<React.SetStateAction<boolean>>,
  modalInformation: IDataRequestChangesOR,
  listTaskToApprove: ITaskToApprove[],
  loadingTaskToApprove: boolean,
  fetchlistTaskToApprove: any
}

export const columnsApproval: TableColumn<ITaskToApprove>[] =
  [
    {
      name: 'ACCION',
      selector: (row: ITaskToApprove) => row.ACCION ?? "Sin registro",
      sortable: true
    },
    {
      name: 'NOMBRE DE TAREA',
      selector: (row: ITaskToApprove) => row.NOMBRE_TAREA ?? "Sin registro",
      sortable: true
    },
    {
      name: 'ESTADO SOLICITUD',
      selector: (row: ITaskToApprove) => row.ESTADO_SOLICITUD ?? "Sin registro",
      sortable: true
    },
    {
      name: 'APROBADOR',
      selector: (row: ITaskToApprove) => row.APROBADOR ?? "Sin registro",
      sortable: true
    },
    {
      name: 'ESTADO APROBADOR',
      selector: (row: ITaskToApprove) => row.ESTADO_APROB ?? "Sin registro",
      sortable: true
    }
  ]

const customStyles = {
  header: {
    style: {
      backgroundColor: '#7fcdff',
      justifyContent: 'center',
    }
  },
  headCells: {
    style: {
      fontSize: '15px',
      fontWeight: 'bold',
      paddingLeft: '0 8px',
      justifyContent: 'center',
      backgroundColor: "#CCCCFF"
    }
  },
  cells: {
    style: {
      justifyContent: 'center',
    },
  }
};

const ApprovalModal: FC<Props> = ({ showApprovalModal, setShowApproval, modalInformation, listTaskToApprove, loadingTaskToApprove, fetchlistTaskToApprove }) => {

  const [selectedArea, setArea] = useState("")
  const [selectedUser, setUser] = useState("")
  const [selectedRows, setSelectedRows] = useState<Array<ITaskToApprove>>([])
  const { ComboData } = useContext(Context)
  const { assignTaskToApprover, loadingTaskToApprover } = useRequestChanges()

  useEffect(() => {
    ComboData.fetchAreas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows)
  }, [])

  return (
    <Modal
      id='kt_modal_create_app'
      fullscreen={true}
      tabIndex={-1}
      aria-hidden='true'
      dialogClassName='modal-dialog modal-dialog-centered'
      show={showApprovalModal}
    >
      <div className='modal-header py-4 bg-dark'>
        <h1 className="text-light">
          {/* <KTSVG className='svg-icon-1' path='/media/svg/avatars/004-boy-1.svg' /> */}
          <SVG width={30} height={30} src={toAbsoluteUrl('/media/svg/avatars/004-boy-1.svg')} />
          &nbsp; Asignar Responsables de Tareas
        </h1>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => setShowApproval(false)}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10 gap-5 d-flex flex-column'>
        <div className="py-4">
          <h2>
            Siguiente estado
            <SVG width={30} height={30} src={toAbsoluteUrl('/media/icons/duotune/arrows/arr027.svg')} />
            {modalInformation.estado_siguiente}
          </h2>
        </div>
        <div className="d-flex justify-content-around align-items-center my-8">
          <div>
            <ComboBoxInput
              value={selectedArea}
              label="Seleccionar Equipo"
              data={ComboData.areasData}
              setNewValue={setArea}
              dependencyFunction={ComboData.fetchUserByAreas}
            />
          </div>
          <ComboBoxInput
            value={selectedUser}
            label="Seleccionar Colaborador"
            data={ComboData.userByAreaData}
            setNewValue={setUser}
          />
          <button
            type="button"
            className="btn btn-success"
            disabled={loadingTaskToApprover}
            onClick={() => {
              if (selectedArea !== "" && selectedRows.length !== 0) {
                let idxArea = ComboData.areasData.findIndex((area: any) => area.nombre === selectedArea)
                let idxUser = ComboData.userByAreaData.findIndex((user: any) => user.nombre === selectedUser)

                let userToSend = selectedUser === "" ? "" : ComboData.userByAreaData[idxUser].codigo
                let id_soli_tareas_approve = selectedRows.map((eachRow: ITaskToApprove) => eachRow.ID_SOLI_TAREA_APROB).join(",")

                assignTaskToApprover(userToSend, ComboData.areasData[idxArea].codigo, id_soli_tareas_approve, fetchlistTaskToApprove, modalInformation.id_solicitud, setShowApproval)
              } else {
                toast.warn("Debe seleccionar un Area Revisora y Tarea", {
                  position: toast.POSITION.TOP_RIGHT
                })
              }
            }}
          >{loadingTaskToApprover ? "Asignando..." :  "Asignar"}</button>
        </div>
        <div>
          <p className="text-center my-8"><em><strong>No es obligatorio elegir un colaborador, ya que por defecto las tareas seran asignadas al responsable del Area.</strong></em></p>
        </div>
        <div>
          <DataTable
            columns={columnsApproval}
            persistTableHead
            highlightOnHover
            selectableRows
            pagination
            customStyles={customStyles}
            fixedHeader
            onSelectedRowsChange={handleRowSelected}
            noDataComponent={<EmptyData loading={loadingTaskToApprove} />}
            disabled={loadingTaskToApprove}
            data={listTaskToApprove}
          />
        </div>
        {/* <div className="d-flex flex-center align-items-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {

            }}
          >Enviar Solicitud</button>
        </div> */}
      </div>
    </Modal>
  )
}
export { ApprovalModal }