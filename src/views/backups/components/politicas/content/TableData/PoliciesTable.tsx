import { FC, useContext } from "react";
import DataTable from "react-data-table-component";
import { EmptyData } from "../../../../../../components/datatable/EmptyData";
import { LoadingTable } from "../../../../../../components/loading/LoadingTable";
import { Context } from "../../Context";
import { columnsBackupsPolicies } from "./PoliciesColumns";
import { customStyles } from "../../../../../../helpers/tableStyles";

const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
}

const PoliciesTable: FC = () => {

  const { policiesData, policiesLoading } = useContext(Context)

  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={columnsBackupsPolicies}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        customStyles={customStyles}
        noDataComponent={<EmptyData loading={policiesLoading} />}
        paginationComponentOptions={paginationComponentOptions}
        disabled={policiesLoading}
        data={policiesData}
      />
      {policiesLoading && <LoadingTable description='Cargando' />}
    </div>

  )
}
export { PoliciesTable }