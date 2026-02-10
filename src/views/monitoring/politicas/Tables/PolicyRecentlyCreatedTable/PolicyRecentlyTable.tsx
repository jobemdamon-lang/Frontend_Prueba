import DataTable from "react-data-table-component"
import { FC } from "react"
import { recentCreatedPolicyColumns } from "./recentCreatedPolicyColumns"
import { IListEquipmentsOfPolicy } from "../../Types"
import { customStyles } from "../../../../../helpers/tableStyles"

type Props = {
  equipmentsOfPolicy: IListEquipmentsOfPolicy,
  openModalParams: any
}

const PolicyRecentlyCreatedTable: FC<Props> = ({ equipmentsOfPolicy, openModalParams }) => {

  return (
    <div>
      <DataTable
        columns={recentCreatedPolicyColumns(openModalParams, equipmentsOfPolicy?.politica?.ID_POLITICA?.toString())}
        persistTableHead
        customStyles={customStyles}
        highlightOnHover
        pagination
        fixedHeader
        data={equipmentsOfPolicy.equipos_politica}
      />
    </div>
  )
}
export { PolicyRecentlyCreatedTable }
