import { useContext } from "react"
import DataTable from "react-data-table-component"
import { EmptyData } from "../../../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../../../components/loading/LoadingTable"
import { Context } from "../../../Context"
import { columnsRequestChanges } from "./ChangesColumns"
import { customStyles } from "../../../../../../../helpers/tableStyles"

const ChangesTable = () => {

  const { requestChangesData, requestChangesLoading } = useContext(Context)

  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={columnsRequestChanges}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        selectableRows
        customStyles={customStyles}
        noDataComponent={<EmptyData loading={requestChangesLoading} />}
        disabled={requestChangesLoading}
        data={requestChangesData}
      />
      {requestChangesLoading && <LoadingTable description='Cargando' />}
    </div>
  )
}
export { ChangesTable }