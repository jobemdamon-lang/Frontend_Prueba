import DataTable from "react-data-table-component"
import { CIsColumns } from "./CIsColumns"
import { FC } from "react"
import { IEquipmentsRestantes } from "../../Types"
import { customStyles } from "../../../../../helpers/tableStyles"

type Props = {
  listaCis: IEquipmentsRestantes[]
  toggleCleared: boolean,
  handleRowSelected: any
}

const CIsTable: FC<Props> = ({ listaCis, toggleCleared, handleRowSelected }) => {

  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={CIsColumns()}
        persistTableHead
        highlightOnHover
        pagination
        selectableRows
        fixedHeader
        customStyles={customStyles}
        paginationPerPage={6}
        paginationRowsPerPageOptions={[2, 4, 8]}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        disabled={false}
        data={listaCis}
      />
    </div>
  )
}
export { CIsTable }
