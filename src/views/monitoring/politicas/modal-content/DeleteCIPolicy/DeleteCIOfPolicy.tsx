import { useContext, useEffect, useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { ContextPolitica } from "../../ContextPolitica"
import { ICIOfPolicyDetail, IMonitoringPolicyVersions, IOwner } from "../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { usePolicy } from "../../hooks/usePolicy"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import { shallowEqual, useSelector } from "react-redux"
import { IAuthState } from "../../../../../store/auth/Types"
import { RootState } from "../../../../../store/ConfigStore"
import { warningNotification } from "../../../../../helpers/notifications"

type Props = {
  closeModal: Function,
  modalInformation: IMonitoringPolicyVersions,
  deleteCIsOfPolicy: Function,
  deletingCIsOfPolicyLoading: boolean,
  selectedOwner: IOwner,
  policiesByProject: IMonitoringPolicyVersions[]
}

const DeleteCIOfPolicy = () => {

  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
  const { closeModal, modalInformation, deleteCIsOfPolicy, deletingCIsOfPolicyLoading, selectedOwner, policiesByProject }: Props = useContext(ContextPolitica)
  const { getCisOfPolicyVersion, listCIsOfPolicyVersion, listCiLoading } = usePolicy()
  const [cis, setCis] = useState(listCIsOfPolicyVersion)
  const [nombreCI, setNombreCI] = useState("")
  const [view, setView] = useState(1)
  const [ciToDelete, setCisToDelete] = useState<ICIOfPolicyDetail[]>([])

  useEffect(() => {
    //Solo se tiene que mostrar los equipos que esten dentro de las versiones implementadas
    const lastImplementedVersion = policiesByProject?.filter(policy => policy.ESTADO_POLITICA === "IMPLEMENTADO")[policiesByProject?.filter(policy => policy.ESTADO_POLITICA === "IMPLEMENTADO").length - 1]
    if (lastImplementedVersion) {
      getCisOfPolicyVersion(modalInformation.ID_POLITICA.toString(), lastImplementedVersion?.NRO_VERSION.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCis(listCIsOfPolicyVersion.filter(
      (metric: (ICIOfPolicyDetail)) =>
        metric.NOMBRE_CI.toLocaleLowerCase().includes(nombreCI.toLocaleLowerCase())
    ))
  }, [nombreCI, listCIsOfPolicyVersion])

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">DAR DE BAJA UN CI EN LA POLITICA</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <p className="text-center"><i className="m-2 fs-5">La baja de un CI implica la eliminación de todas sus metricas en la politica.</i></p>
        {view === 1 ?
          <div style={{ position: 'relative' }}>
            <div className="d-flex justify-content-around">
              <SearchInput value={nombreCI} setValue={setNombreCI} />
              <button className="btn btn-info" onClick={() => setView(2)}>Ver CI's a retirar ( {ciToDelete.length} )</button>
            </div>
            <h5 className=" my-5">Lista de CI's Monitoreados</h5>
            <DataTable
              columns={equiposRestantesColumns(setCisToDelete)}
              persistTableHead
              highlightOnHover
              pagination
              fixedHeader
              paginationPerPage={6}
              paginationRowsPerPageOptions={[2, 4, 8, 10]}
              noDataComponent={<EmptyData loading={listCiLoading} />}
              disabled={listCiLoading}
              data={cis.filter((ci: ICIOfPolicyDetail) => ci.BAJA_EQUIPO === "NO")}
            />
            {listCiLoading && <LoadingTable description='Cargando' />}
          </div>
          :
          <div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-primary align-center" onClick={() => setView(1)}>Regresar</button>
            </div>
            <h5>Lista de CI's a eliminar en la politica</h5>
            <DataTable
              columns={equiposRestantesColumnsFinally(setCisToDelete)}
              persistTableHead
              highlightOnHover
              pagination
              fixedHeader
              paginationPerPage={6}
              paginationRowsPerPageOptions={[2, 4, 8, 10]}
              data={ciToDelete}
            />
          </div>
        }
        <div className="d-flex justify-content-end m-3">
          <button
            disabled={deletingCIsOfPolicyLoading}
            className="btn btn-success"
            onClick={() => {
              if (ciToDelete.length === 0) {
                warningNotification('No existen CIs para eliminar')
                return;
              }
              deleteCIsOfPolicy({
                usuario: user.usuario,
                motivo: "",
                nro_ticket: "",
                //Se envia la eliminacion siempre priorizando el por implementar, si no el en cola o al ultimo el implementado (FilterSection +detalle)
                id_politica: modalInformation.ID_POLITICA,
                nro_version: modalInformation.NRO_VERSION,
                lista_politica_new: ciToDelete.map(ci => ({
                  id_equipo: ci.ID_EQUIPO,
                  familia: "",
                  clase: "",
                  tipo_equipo: "",
                  herramienta: ""
                }))
              }, selectedOwner.id_proyecto, closeModal)
            }}>{deletingCIsOfPolicyLoading ? "Eliminando..." : "Eliminar CIs del Monitoreo"}</button>
        </div>
      </div>
    </>
  )
}
export { DeleteCIOfPolicy }

export const equiposRestantesColumns = (
  setCisToDelete: React.Dispatch<React.SetStateAction<ICIOfPolicyDetail[]>>
): TableColumn<ICIOfPolicyDetail>[] => [
    {
      name: 'NOMBRE CI',
      cell: (row: (ICIOfPolicyDetail)) => row.NOMBRE_CI ?? "Sin registro",
      sortable: true
    },
    {
      name: 'HOSTNAME',
      cell: (row: (ICIOfPolicyDetail)) => row.NOMBRE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'NRO IP',
      cell: (row: (ICIOfPolicyDetail)) => row.IP ?? "Sin registro",
      sortable: true
    },
    {
      name: 'FAMILIA',
      cell: (row: (ICIOfPolicyDetail)) => row.FAMILIA ?? "Sin registro",
      sortable: true
    },
    {
      name: 'CLASE',
      cell: (row: (ICIOfPolicyDetail)) => row.CLASE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'DAR DE BAJA',
      width: "150px",
      cell: (row: (ICIOfPolicyDetail)) =>
        <div className="d-flex gap-2">
          <button
            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
            onClick={() => {
              setCisToDelete((prev) => {
                const hasAlready = [...prev].some(ci => ci.ID_EQUIPO === row.ID_EQUIPO)
                return hasAlready ? prev : [...prev, row]
              })
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
            </svg>
          </button>
        </div>
    }
  ]

export const equiposRestantesColumnsFinally = (
  setCisToDelete: React.Dispatch<React.SetStateAction<ICIOfPolicyDetail[]>>
): TableColumn<ICIOfPolicyDetail>[] => [
    {
      name: 'NOMBRE CI',
      cell: (row: (ICIOfPolicyDetail)) => row.NOMBRE_CI ?? "Sin registro",
      sortable: true
    },
    {
      name: 'HOSTNAME',
      cell: (row: (ICIOfPolicyDetail)) => row.NOMBRE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'FAMILIA',
      cell: (row: (ICIOfPolicyDetail)) => row.FAMILIA ?? "Sin registro",
      sortable: true
    },
    {
      name: 'CLASE',
      cell: (row: (ICIOfPolicyDetail)) => row.CLASE ?? "Sin registro",
      sortable: true
    },
    {
      name: 'DESCARTAR ELIMINACIÓN',
      width: "150px",
      cell: (row: (ICIOfPolicyDetail)) =>
        <div className="d-flex gap-2">
          <button
            className='btn btn-icon btn-light btn-active-color-primary btn-sm me-1'
            onClick={() => {
              setCisToDelete((prev) => {
                const newData = [...prev]
                return newData.filter(ci => ci.ID_EQUIPO !== row.ID_EQUIPO)
              })
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
            </svg>
          </button>
        </div>
    }
  ]
