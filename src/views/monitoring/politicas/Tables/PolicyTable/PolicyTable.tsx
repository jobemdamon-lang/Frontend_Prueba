import DataTable from "react-data-table-component"
import { PolicyColumns } from "./PolicyColumns"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { FC } from "react"
import { IMonitoringPolicyVersions } from "../../Types"
import { customStyles } from "../../../../../helpers/tableStyles"

type Props = {
  fetchPoliciesByProjectLoading: boolean,
  policies: IMonitoringPolicyVersions[]
}

const PolicyTable: FC<Props> = ({ fetchPoliciesByProjectLoading, policies }) => {

  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={PolicyColumns}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        customStyles={customStyles}
        noDataComponent={<EmptyData loading={fetchPoliciesByProjectLoading} />}
        disabled={fetchPoliciesByProjectLoading}
        data={policies}
      />
      {fetchPoliciesByProjectLoading && <LoadingTable description='Cargando' />}
    </div>
  )
}
export { PolicyTable }

