import DataTable, { TableColumn } from "react-data-table-component"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { FC } from "react"

const customStyles = {
  headCells: {
    style: {
      fontSize: '14px',
      justifyContent: 'center'
    },
  },
  cells: {
    style: {
      justifyContent: 'center'
    },
  },
}

type Props = {
  loadingStatus: boolean,
  data: any[],
  columnsTable: Array<TableColumn<any>>
}

const Table: FC<Props> = ({ loadingStatus, data, columnsTable }) => {
  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={columnsTable}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        customStyles={customStyles}
        noDataComponent={<EmptyData loading={loadingStatus} />}
        disabled={false}
        data={data}
      />
      {loadingStatus && <LoadingTable description='Cargando' />}
    </div>
  )
}
export { Table }