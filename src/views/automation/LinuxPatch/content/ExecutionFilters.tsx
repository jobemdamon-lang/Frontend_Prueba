import { FC, useEffect, useState } from "react"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { IListExecutionsLinux } from "../../Types"
import "../../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
import { filtrarPorFecha } from "../../../../helpers/general"

type Props = {
    setFilteredExecutions: React.Dispatch<React.SetStateAction<IListExecutionsLinux[]>>,
    executionsData: IListExecutionsLinux[],
}

const ExecutionFilter: FC<Props> = ({ setFilteredExecutions, executionsData }) => {

    const [searchedValue, setSearchedValue] = useState("")
    const [fechaInicioFiltro, setFechaInicioFiltro] = useState(new Date("2023-01-01"))
    const [fechaFinFiltro, setFechaFinFiltro] = useState(new Date())

    useEffect(() => {
        setFilteredExecutions(executionsData.filter((execution: IListExecutionsLinux) => {
            let hasCoincidences = execution?.NOMBRE.toLowerCase().includes(searchedValue.toLowerCase()) ||
                execution?.USUARIO_EJECUTOR?.toLowerCase().includes(searchedValue.toLowerCase()) ||
                execution?.ESTADO_EJECUCION?.toLowerCase().includes(searchedValue.toLowerCase()) ||
                execution?.CRQ?.toLowerCase().includes(searchedValue.toLowerCase())
            let isInDate = execution?.FECHA_INICIO ?
                (new Date(execution.FECHA_INICIO) >= fechaInicioFiltro) : true
                    &&
                    execution?.FECHA_FIN ?
                    (new Date(execution.FECHA_FIN) <= fechaFinFiltro) : true
            return hasCoincidences && isInDate
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executionsData, searchedValue, fechaInicioFiltro, fechaFinFiltro])

    return (
        <div className="d-flex justify-content-between align-items-end gap-5">
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
                    className="btn btn-primary"
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
            <SearchInput
                placeholder="Ingrese su busqueda..."
                setValue={setSearchedValue}
                value={searchedValue}
            />
        </div>
    )
}

export { ExecutionFilter }