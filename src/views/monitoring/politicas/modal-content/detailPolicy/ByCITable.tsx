import { FC, useContext, useEffect, useState } from "react"
import { ICIOfPolicyDetail, ModalView } from "../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { ContextPolitica } from "../../ContextPolitica"

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
  listCIsOfPolicyVersion: ICIOfPolicyDetail[],
  listCiLoading: boolean
}

const ByCITable: FC<Props> = ({ listCIsOfPolicyVersion, listCiLoading }) => {

  const { openModalParams } = useContext(ContextPolitica)
  const [listCIs, setListCIs] = useState(listCIsOfPolicyVersion)
  const [nombreCI, setNombreCI] = useState("")

  useEffect(() => {
    setListCIs(listCIsOfPolicyVersion.filter(
      (ci: ICIOfPolicyDetail) =>
        ci.NOMBRE_CI.toLocaleLowerCase().includes(nombreCI.toLocaleLowerCase())
    ))
  }, [nombreCI, listCIsOfPolicyVersion])

  return (
    <>
      <SearchInput value={nombreCI} setValue={setNombreCI} />
      <div style={{ position: 'relative' }}>
        <DataTable
          columns={CIsColumns(openModalParams)}
          persistTableHead
          highlightOnHover
          pagination
          fixedHeader
          customStyles={customStyles}
          paginationPerPage={8}
          paginationRowsPerPageOptions={[2, 4, 8, 10]}
          noDataComponent={<EmptyData loading={listCiLoading} />}
          disabled={listCiLoading}
          data={listCIs}
        />
        {listCiLoading && <LoadingTable description='Cargando' />}
      </div>
    </>

  )
}
export { ByCITable }

const CIsColumns = (openModalParams: Function): TableColumn<ICIOfPolicyDetail>[] => [
  {
    name: 'NOMBRE DE CI',
    cell: (row: ICIOfPolicyDetail) => row.NOMBRE_CI ?? "Sin registro",
    sortable: true
  },
  {
    name: 'HOSTNAME',
    cell: (row: ICIOfPolicyDetail) => row.NOMBRE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NORMBRE VIRTUAL',
    cell: (row: ICIOfPolicyDetail) => row.NOMBRE_VIRTUAL ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NRO. IP',
    cell: (row: ICIOfPolicyDetail) => row.IP ?? "Sin registro",
    sortable: true
  },
  {
    name: 'FAMILIA',
    cell: (row: ICIOfPolicyDetail) => row.FAMILIA ?? "Sin registro",
    sortable: true
  },
  {
    name: 'CLASE',
    cell: (row: ICIOfPolicyDetail) => row.CLASE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'DESCRIPCIÓN',
    cell: (row: ICIOfPolicyDetail) => row.DESCRIPCION ?? "Sin registro",
    sortable: true
  },
  {
    name: 'IP',
    cell: (row: ICIOfPolicyDetail) => row.IP ?? "Sin registro",
    sortable: true
  },
  {
    name: 'ESTADO CMDB',
    cell: (row: ICIOfPolicyDetail) => row.EQUIPO_ESTADO ?? "Sin registro",
    sortable: true
  },
  /*{
    name: 'ESTADO BAJA',
    cell: (row: ICIOfPolicyDetail) => <span className={`badge ${row.BAJA_EQUIPO === "NO" ? "badge-success" : "badge-danger"}`}>{row.BAJA_EQUIPO}</span> ?? "Sin registro",
    sortable: true
  },*/
  {
    name: 'METRICAS',
    cell: (row: ICIOfPolicyDetail) => (
      <ToolTip
        message='Ver Metricas'
        placement='top'
      >
        <button
          className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
          onClick={() => {
            openModalParams(ModalView.DETAIL_POLICY_OF_CI, row)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-square-fill" viewBox="0 0 16 16">
            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        </button>
      </ToolTip>
    ) ?? "Sin registro",
    sortable: true
  }
]