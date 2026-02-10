import { FC } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { KTSVG } from "../../../../../../helpers"
import { columnsLogs } from "../../content/TableData/LogsColumns"
import { ILogs } from "../../Types"

type Props = {
  setOpenLogModal: React.Dispatch<React.SetStateAction<boolean>>,
  logsData: ILogs[],
  loadingLogs: boolean
}

const LogsModalContent: FC<Props> = ({ setOpenLogModal, logsData, loadingLogs }) => {

  return (
    <div style={{overflow: "auto"}}>
      <div className='modal-header py-4'>
        <h2>Lista de Aprobaciones</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => setOpenLogModal(false)}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10'>
        <DataTable
          customStyles={{
            headRow: {
              style: {
                color:'#223336',
                backgroundColor: '#BAD7E9',
                borderRadius: "5px"
              },
            }
          }}
          columns={columnsLogs}
          persistTableHead
          highlightOnHover
          pagination
          fixedHeader
          noDataComponent={<EmptyData loading={loadingLogs} />}
          disabled={loadingLogs}
          data={logsData}
        />
      </div>
    </div>
  )
}
export { LogsModalContent }