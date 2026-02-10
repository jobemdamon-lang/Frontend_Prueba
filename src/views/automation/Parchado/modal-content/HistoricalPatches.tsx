import { useEffect, useState } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useWindowsPatchContext } from "../Context"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { secondCustomStyles } from "../../../../helpers/tableStyles"
import { IListHistoricPatches, IListServerAssigned, ISocketDataEvent } from "../../Types"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { useTypedSelector } from "../../../../store/ConfigStore"
import { filtrarPorFecha } from "../../../../helpers/general"
import { AccessController } from "../../../../components/AccessControler"

const HistoricalPatches = () => {

  const userName = useTypedSelector(({ auth }) => auth.usuario)
  const { modalHook, socketInstance, rol, executionHook, serverHook } = useWindowsPatchContext()
  const modalInformation: IListServerAssigned = modalHook.modalInformation

  const [searchedValue, setSearchedValue] = useState("")
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState(new Date("1998-01-01"))
  const [fechaFinFiltro, setFechaFinFiltro] = useState(new Date())
  const [filteredHistoricPatches, setFilteredHistoricPatches] = useState<IListHistoricPatches[]>([])

  const handleSearchPatches = () => {
    executionHook.initSearchHistoricPatches({
      usuario: userName,
      id_equipo: modalInformation.ID_EQUIPO
    })
  }

  useEffect(() => {
    serverHook.getHistoricPatches(modalInformation.ID_EQUIPO)

    socketInstance?.on('notificacion', (data: ISocketDataEvent) => {
      if (data.status === "Correcto" && data.usuario === userName && data.tipo === 1) {
        console.log("Notificacion HistoricalPatches: ", data)
        executionHook.setInitSearchHistoricPatchLoading(false)
        serverHook.getHistoricPatches(modalInformation.ID_EQUIPO)
      }
      if (data.status !== "Correcto" && data.usuario === userName && data.tipo === 1) {
        console.log("Notificacion HistoricalPatches: ", data)
        executionHook.setInitSearchHistoricPatchLoading(false)
        serverHook.getHistoricPatches(modalInformation.ID_EQUIPO)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFilteredHistoricPatches(serverHook.historicPatches.filter(((patche: IListHistoricPatches) => {
      let hasCoincidences = patche.KB_ID.toLowerCase().includes(searchedValue.toLowerCase()) || patche.TITULO.toLowerCase().includes(searchedValue.toLowerCase())
      let isInDate = new Date(patche.INSTALLED_ON) >= fechaInicioFiltro && new Date(patche.INSTALLED_ON) <= fechaFinFiltro
      return hasCoincidences && isInDate
    })).sort((a, b) => {
      const dateA = Date.parse(a.INSTALLED_ON);
      const dateB = Date.parse(b.INSTALLED_ON);

      // Orden descendente (de la fecha más reciente a la más antigua)
      return dateB - dateA;
    }))
  }, [serverHook.historicPatches, searchedValue, fechaInicioFiltro, fechaFinFiltro])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>HISTORIAL DE PARCHADOS</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <div className="d-flex justify-content-center align-items-end gap-5 mb-5 flex-wrap flex-lg-nowrap">
          <SearchInput placeholder="Ingrese su busqueda..." setValue={setSearchedValue} value={searchedValue} />
          <div className="form-group">
            <label className="form-label">Rango de Fechas</label>
            <div className="d-flex">
              <div className="input-daterange input-group">
                <input
                  type="date"
                  value={fechaInicioFiltro.toISOString().split('T')[0]}
                  className="form-control"
                  name="start"
                  onChange={({ target }) => setFechaInicioFiltro(target.value === "" ? new Date("1998-01-01") : new Date(target.value))}
                />
                <div className="input-group-append">
                  <span className="input-group-text h-100"><i className="bi bi-border-width"></i></span>
                </div>
                <input
                  value={fechaFinFiltro.toISOString().split('T')[0]}
                  onChange={({ target }) => setFechaFinFiltro(target.value === "" ? new Date() : new Date(target.value))}
                  type="date"
                  className="form-control"
                  name="end" />
              </div>
            </div>
          </div>
          <div className="btn-group" role="group" aria-label="button-group">
            <button
              type="button"
              className="btn btn-secondary py-1"
              onClick={() => {
                setFechaInicioFiltro(filtrarPorFecha('ultimoMes'))
                setFechaFinFiltro(new Date())
              }}
            >
              Ultimo Mes
            </button>
            <button
              type="button"
              className="btn btn-secondary py-1"
              onClick={() => {
                setFechaInicioFiltro(filtrarPorFecha('ultimos3Meses'))
                setFechaFinFiltro(new Date())
              }}
            >
              Ultimos 3 Meses
            </button>
            <button
              type="button"
              className="btn btn-secondary py-1"
              onClick={() => {
                setFechaInicioFiltro(filtrarPorFecha(''))
                setFechaFinFiltro(new Date())
              }}
            >
              Todos
            </button>
          </div>
          <AccessController allowedRoles={['ejecutor', 'admin']} rol={rol}>
            <button
              disabled={executionHook.initSearchHistoricPatchLoading}
              onClick={handleSearchPatches}
              className="btn btn-primary btn-sm">
              {executionHook.initSearchHistoricPatchLoading ? "Actualizando" : "Actualizar"}
            </button>
          </AccessController>
        </div>
        <div style={{ position: 'relative' }}>
          <DataTable
            columns={HistoricalPatchesColumns}
            pagination
            highlightOnHover
            persistTableHead
            customStyles={secondCustomStyles}
            disabled={serverHook.getHistoricPatchesLoading || executionHook.initSearchHistoricPatchLoading}
            noDataComponent={<EmptyData loading={serverHook.getHistoricPatchesLoading} />}
            data={filteredHistoricPatches}
          />
          {serverHook.getHistoricPatchesLoading && <LoadingTable description='Cargando' />}
          {executionHook.initSearchHistoricPatchLoading && <LoadingTable description='Realizando busqueda de parches' />}
        </div>
      </div>
    </>
  )
}
export { HistoricalPatches }

export const HistoricalPatchesColumns: TableColumn<IListHistoricPatches>[] = [
  {
    name: 'Nro. KB ID',
    selector: (row: IListHistoricPatches) => row.KB_ID ?? "Sin registro"
  },
  {
    name: 'Categoria',
    selector: (row: IListHistoricPatches) => row.CATEGORIES ?? "Sin registro"
  },
  {
    name: 'Nombre del Parche',
    selector: (row: IListHistoricPatches) => row.TITULO ?? "Sin registro"
  },
  {
    name: 'Fecha Instalación',
    sortable: true,
    selector: (row: IListHistoricPatches) => row.INSTALLED_ON ?? "Sin registro"
  }

]