import DataTable from "react-data-table-component"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { CollaboratorColumns } from "./CollaboratorColumns"
import { useContext, useEffect, useState } from "react"
import { Context } from "../Context"
import { IListCollaborators } from "../../Types"
import { customStyles } from "../../../../helpers/tableStyles"

const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
}
const Content = () => {

  const { openModal, collabsData, preferences, setNroCollabs, loadingCollab } = useContext(Context)
  const [filteredData, setFilteredData] = useState<Array<IListCollaborators>>(collabsData)

  useEffect(() => {
    const filtered = collabsData.filter((client: IListCollaborators) =>
      (client?.area === preferences.area || preferences.area === '') &&
      (client.nombre?.toLowerCase().includes(preferences.nombre?.toLowerCase()) || preferences.nombre === '')
    );
    setFilteredData(filtered);
  }, [preferences, collabsData])

  useEffect(() => {
    setNroCollabs(filteredData.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData])

  return (
    <div style={{ position: 'relative' }}>
      <DataTable
        columns={CollaboratorColumns({ openModal })}
        persistTableHead
        highlightOnHover
        pagination
        fixedHeader
        customStyles={customStyles}
        noDataComponent={<EmptyData loading={loadingCollab} />}
        paginationComponentOptions={paginationComponentOptions}
        disabled={loadingCollab}
        data={filteredData}
      />
      {loadingCollab && <LoadingTable description='Cargando' />}
    </div>
  )
}
export { Content }