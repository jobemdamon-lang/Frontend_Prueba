import DataTable from "react-data-table-component"
import { useModules } from "../../hooks/useModules"
import { ModuleColumn, SubmoduleColumn } from "./ColumnsModules"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { useContext, useEffect } from "react"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../../helpers/AssetHelpers"
import { Context } from "../../Context"
import { customStyles } from "../../../../../helpers/tableStyles"

const GestionModulos = () => {

  const { fetchListModules, modules, moduleLoading, fetchListSubmodules, submodules, submoduleLoading } = useModules()
  const { openModal } = useContext(Context)

  useEffect(() => {
    fetchListModules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="d-flex flex-column justify-content-center">
      <div style={{ position: 'relative' }}>
        <h4>Lista de Modulos</h4>
        <DataTable
          columns={ModuleColumn(fetchListSubmodules, openModal)}
          persistTableHead
          highlightOnHover
          pagination
          fixedHeader
          customStyles={customStyles}
          noDataComponent={<EmptyData loading={moduleLoading} />}
          disabled={moduleLoading}
          data={modules}
        />
        {moduleLoading && <LoadingTable description='Cargando' />}
      </div>
      <div className="d-flex justify-content-center">
        <SVG width={30} height={30} src={toAbsoluteUrl('/media/icons/duotune/arrows/arr082.svg')} />
      </div>
      <div style={{ position: 'relative' }}>
        <h4>Lista de SubModulos</h4>
        <DataTable
          columns={SubmoduleColumn}
          persistTableHead
          highlightOnHover
          pagination
          fixedHeader
          customStyles={customStyles}
          noDataComponent={<EmptyData loading={submoduleLoading} />}
          disabled={submoduleLoading}
          data={submodules}
        />
        {submoduleLoading && <LoadingTable description='Cargando' />}
      </div>
    </div>
  )
}
export { GestionModulos }