import { FC, useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Context } from "../../Context"
import { IComboData, IDataRequestChangesOR, ISearchTasksWithFormat } from "../../Types"
import { useServers } from "../../../../hooks/useServers"
import { EmptyData } from "../../../../../../components/datatable/EmptyData"
import { columnsServersCreate, conditionalRowStyles, customStyles } from "./TableUtilities"
import DatalistInput from "react-datalist-input"
import uniqid from "uniqid"
import { LoadingTable } from "../../../../../../components/loading/LoadingTable"

type Props = {
  tasksOfPoliciesWithFormat: ISearchTasksWithFormat[],
  loadingSearchTaskOfPolicies?: boolean,
  handleRowSelected: any,
  toggleCleared: boolean
}

const ByServer: FC<Props> = ({ tasksOfPoliciesWithFormat, handleRowSelected, toggleCleared, loadingSearchTaskOfPolicies }) => {

  const [selectedServer, setSelectedServer] = useState("")
  const { modalInformation }: { modalInformation: IDataRequestChangesOR } = useContext(Context)
  const [filteredDataByServer, setFilteredData] = useState<Array<ISearchTasksWithFormat>>([])
  const { fetchServers, serversCombo, loading } = useServers()
  /* const rowDisabledCriteria = (row:ISearchTasksWithFormat) => (row.has_a_change.isInRequest || row.has_a_change.isChangeInFront) */

  //Cada vez que cambien los datos de la politica o el valor del servidor seleccionado se reasignan los datos
  useEffect(() => {
    //Se extrae el nombre del servidor del selectedServer debido a la concatenación serverName||hostname
    const dataFiltered: ISearchTasksWithFormat[] = tasksOfPoliciesWithFormat.filter((task: ISearchTasksWithFormat) => task.bks_server.includes(selectedServer.split("||")[0]))
    setFilteredData(dataFiltered)
  }, [tasksOfPoliciesWithFormat, selectedServer])

  useEffect(() => {
    fetchServers({ cliente: modalInformation.cliente, alp: modalInformation.alp, proyecto: "" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="d-flex flex-column">
      <div className=" d-flex p-8 gap-5 justify-content-around align-items-center">
        <div className="d-flex gap-3 align-items-end">
          <DatalistInput
            value={selectedServer}
            placeholder=""
            label="Nombre del Servidor"
            onSelect={(event) => setSelectedServer(event.value)}
            items={serversCombo.map((server: IComboData) => ({ id: uniqid(), value: server.nombre }))}
          />
          <button type="button" className="btn btn-info" onClick={()=> setFilteredData(tasksOfPoliciesWithFormat)}>Reiniciar</button>
        </div>
      </div>
      <div className="position-relative">
        <DataTable
          columns={columnsServersCreate}
          persistTableHead
          selectableRows
          customStyles={customStyles}
          highlightOnHover
          pagination
          fixedHeader
          conditionalRowStyles={conditionalRowStyles}
          /* selectableRowDisabled={rowDisabledCriteria} */
          onSelectedRowsChange={handleRowSelected}
          clearSelectedRows={toggleCleared}
          noDataComponent={<EmptyData loading={loading} />}
          disabled={loadingSearchTaskOfPolicies}
          data={filteredDataByServer}
        />
        {loadingSearchTaskOfPolicies && <LoadingTable description='Cargando' />}
      </div>
    </div>
  )
}
export { ByServer }