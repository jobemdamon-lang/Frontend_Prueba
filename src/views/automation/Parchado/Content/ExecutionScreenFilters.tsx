import { FC, useEffect, useState } from "react"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { IListExecutions } from "../../Types"
import "../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
import { filtrarPorFecha } from "../../../../helpers/general"

type Props = {
  setFilteredExecutions: React.Dispatch<React.SetStateAction<IListExecutions[]>>,
  executionsData: IListExecutions[]
}

const ExecutionScreenFilters: FC<Props> = ({ setFilteredExecutions, executionsData }) => {

  const [searchedValue, setSearchedValue] = useState("")
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState(new Date("2023-01-01"))
  const [fechaFinFiltro, setFechaFinFiltro] = useState(new Date())
  const [whatStateWant, setWhatStateWant] = useState("")


  useEffect(() => {
    setFilteredExecutions(executionsData.filter((execution: IListExecutions) => {
      let hasCoincidences = execution?.NOMBRE.toLowerCase().includes(searchedValue.toLowerCase()) ||
        execution?.USUARIO_EJECUTOR?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        execution?.CRQ?.toLowerCase().includes(searchedValue.toLowerCase())
      let isInDate = new Date(execution?.FECHA_INICIO ?? "") >= fechaInicioFiltro && new Date(execution?.FECHA_FIN ?? "") <= fechaFinFiltro
      let hasSameState = execution?.ESTADO_EJECUCION?.toLowerCase().includes(whatStateWant.toLowerCase())
      if (!execution.FECHA_FIN || execution.FECHA_FIN) isInDate = true
      return hasCoincidences && isInDate && hasSameState
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executionsData, searchedValue, fechaInicioFiltro, fechaFinFiltro, whatStateWant])

  return (
    <div className="d-flex justify-content-center align-items-end gap-5 flex-wrap">
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
          className="btn btn-primary"
          onClick={() => {
            setFechaInicioFiltro(filtrarPorFecha('ultimoMes'))
            setFechaFinFiltro(new Date())
          }}
        >
          Ultimo Mes
        </button>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => {
            setFechaInicioFiltro(filtrarPorFecha('ultimos3Meses'))
            setFechaFinFiltro(new Date())
          }}
        >
          Ultimos 3 Meses
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setFechaInicioFiltro(filtrarPorFecha(''))
            setFechaFinFiltro(new Date())
          }}
        >
          Todos
        </button>
      </div>

      <div className="form-check">
        <input
          className="form-check-input border border-secondary"
          type="radio"
          id="finished"
          name="stateNeeded"
          onChange={() => setWhatStateWant("TERMINADO")}
        />
        <label className="form-check-label" htmlFor="finished">
          <span className="fs-5 fw-bold" style={{ color: "gray" }}>TERMINADOS</span>
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input border border-secondary"
          type="radio"
          id="planificated"
          name="stateNeeded"
          onChange={() => setWhatStateWant("PLANIFICADO")}
        />
        <label className="form-check-label" htmlFor="planificated">
          <span className="fs-5 fw-bold" style={{ color: "gray" }}>PLANIFICADOS</span>
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input border border-secondary"
          type="radio"
          id="initiated"
          name="stateNeeded"
          onChange={() => setWhatStateWant("INICIADO")}
        />
        <label className="form-check-label" htmlFor="initiated">
          <span className="fs-5 fw-bold" style={{ color: "gray" }}>INICIADOS</span>
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input border border-secondary"
          type="radio"
          id="all"
          name="stateNeeded"
          defaultChecked
          onChange={() => setWhatStateWant("")}
        />
        <label className="form-check-label" htmlFor="all">
          <span className="fs-5 fw-bold" style={{ color: "gray" }}>TODOS</span>
        </label>
      </div>
    </div>
  )
}
export { ExecutionScreenFilters }