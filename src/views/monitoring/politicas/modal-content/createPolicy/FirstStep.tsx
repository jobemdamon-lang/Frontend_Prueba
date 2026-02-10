import { FC, useCallback, useEffect, useState } from "react"
import { IEquipmentsRestantes, IListCatalog, IListClase, IListHerramienta, IListTypeEquipment, ListaEquipmentsToMetrics } from "../../Types"
import uniqid from "uniqid"
import { CIsTable } from "../../Tables/CIsTable/CIsTable"
import { ComboBoxInput } from "./ComboBoxInput"
import { toast } from "react-toastify"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"

type Props = {
  listCatalog: IListCatalog[],
  metricsToCreate: (ListaEquipmentsToMetrics & { ci_name: string })[],
  setMetricsToCreate: React.Dispatch<React.SetStateAction<(ListaEquipmentsToMetrics & { ci_name: string })[]>>
}

const FirstStep: FC<Props> = ({ listCatalog, metricsToCreate, setMetricsToCreate }) => {

  const [activeTab, setActiveTab] = useState("")
  const [toggleCleared, setToggleCleared] = useState(false)
  const [selectedClase, setSelectedClase] = useState("")
  const [selectedHerramienta, setSelectedHerramienta] = useState("")
  const [selectedTipoEquipo, setSelectedTipoEquipo] = useState("")
  const [selectedCis, setSelectedCis] = useState<Array<IEquipmentsRestantes>>([])
  const [searchedCI, setSearchedCI] = useState("")
  const [filteredCI, setFilteredCI] = useState<IEquipmentsRestantes[]>([])
  //Estados variantes que se alternan depende la clase Seleccionada
  const [listaCis, setListaCis] = useState<IEquipmentsRestantes[]>([])
  const [listaHerramienta, setListaHerramienta] = useState<IListHerramienta[]>([])
  const [listaTipoEquipo, setListaTipoEquipo] = useState<IListTypeEquipment[]>([])

  const handleRowSelected = useCallback((state: any) => {
    setSelectedCis(state.selectedRows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setActiveTab(listCatalog[0]?.FAMILIA ?? "") }, [listCatalog])

  useEffect(() => {
    setFilteredCI(listaCis.filter(ci => (ci.NOMBRE_CI?.toLocaleLowerCase().includes(searchedCI.toLocaleLowerCase()) ||
      ci.NOMBRE?.toLocaleLowerCase().includes(searchedCI.toLocaleLowerCase())
    )))
  }, [listaCis, searchedCI])

  const handleChangeClase = (newClaseSelected: string) => {
    setSelectedClase(newClaseSelected)
    const selectedFamily = listCatalog.filter((family: IListCatalog) => family.FAMILIA === activeTab)[0]
    const selectedClase = selectedFamily.lista_clase.filter((clase: IListClase) => clase.CLASE === newClaseSelected)[0]
    setListaCis(selectedClase.lista_ci)
    setListaTipoEquipo(selectedClase.lista_tipo_equipo)
    //setListaHerramienta(selectedClase.lista_herramientas)
  }

  const handleChangeTypeServer = (newTypeServerSelected: string) => {
    setSelectedTipoEquipo(newTypeServerSelected)
    const selectedFamily = listCatalog.filter((family: IListCatalog) => family.FAMILIA === activeTab)[0]
    const selectedClases = selectedFamily.lista_clase.filter((clase: IListClase) => clase.CLASE === selectedClase)[0]
    const selectedTypeServer = selectedClases.lista_tipo_equipo.filter(tipo_equipo => tipo_equipo.TIPO_EQUIPO === newTypeServerSelected)[0]
    setListaHerramienta(selectedTypeServer.lista_herramientas)
  }

  return (
    <div className="d-flex flex-column justify-content-center w-100">
      <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x">
        {listCatalog.map((families: IListCatalog) => (
          <li className="nav-item" key={families.FAMILIA}>
            <a
              className={`nav-link ${families.FAMILIA === activeTab ? 'active' : ''}`}
              data-bs-toggle="tab"
              href={`#${families.FAMILIA}`}
              onClick={() => {
                setActiveTab(families.FAMILIA)
                //Cada vez que se cambie de familia se resetea las selecciones
                setSelectedClase("")
                setSelectedHerramienta("")
                setSelectedTipoEquipo("")
                setListaCis([])
              }}
            >
              {families.FAMILIA}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content" id="myTabContent">
        {listCatalog.map((families: IListCatalog) => (
          <div
            className={`tab-pane p-8 ${families.FAMILIA === activeTab ? 'show active' : ''}`}
            id={families.FAMILIA}
            role="tabpanel"
            key={families.FAMILIA}
          >
            <div className="d-flex justify-content-end gap-3 align-items-center">
              <SearchInput
                placeholder="BUSCAR IP | HOSTNAME"
                value={searchedCI}
                setValue={(value: string) => setSearchedCI(value)}
              />
              <button
                className="btn btn-danger"
                onClick={() => {
                  const onlyIds = selectedCis.map((ci: IEquipmentsRestantes) => ci.ID_EQUIPO)
                  setMetricsToCreate((prev: (ListaEquipmentsToMetrics & { ci_name: string })[]) => {
                    const newMetrics = [...prev]
                    return newMetrics.filter((metric: (ListaEquipmentsToMetrics & { ci_name: string })) => {
                      return onlyIds.includes(metric.id_equipo) ? false : true
                    })
                  })
                  setToggleCleared(!toggleCleared)
                }}
              >
                Desasignar</button>
              <button
                className="btn btn-success"
                onClick={() => {
                  if (selectedCis.length !== 0 && selectedClase !== "" && selectedHerramienta !== "" && selectedTipoEquipo !== "") {
                    setMetricsToCreate((prev: (ListaEquipmentsToMetrics & { ci_name: string })[]) => {
                      const newMetrics = [...prev]
                      const onlyIds = newMetrics.map(metric => metric.id_equipo)
                      selectedCis.forEach((ci: IEquipmentsRestantes) => {
                        if (onlyIds.includes(ci.ID_EQUIPO)) {
                          const idx = newMetrics.findIndex(metric => metric.id_equipo === ci.ID_EQUIPO)
                          newMetrics[idx] = {
                            id_equipo: ci.ID_EQUIPO,
                            clase: selectedClase,
                            familia: activeTab,
                            herramienta: selectedHerramienta,
                            tipo_equipo: selectedTipoEquipo,
                            ci_name: ci.NOMBRE_CI
                          }
                        } else {
                          newMetrics.push({
                            id_equipo: ci.ID_EQUIPO,
                            clase: selectedClase,
                            familia: activeTab,
                            herramienta: selectedHerramienta,
                            tipo_equipo: selectedTipoEquipo,
                            ci_name: ci.NOMBRE_CI
                          })
                        }
                      })
                      return newMetrics
                    }
                    )
                  } else {
                    toast.warn("Seleccione todos los campos requeridos: CLASE , HERRAMIENTA, TIPO EQUIPO, CI'S", {
                      position: toast.POSITION.TOP_RIGHT
                    })
                  }
                  setToggleCleared(!toggleCleared)
                }}
              >
                Asignar</button>
            </div>
            <div className="d-flex justify-content-between gap-5">
              <div className="d-flex justify-content-around flex-column gap-3">
                <h5>CLASES</h5>
                <ComboBoxInput
                  data={families.lista_clase.map((clase: IListClase) => ({ codigo: uniqid(), nombre: clase.CLASE }))}
                  value={selectedClase}
                  label="Selecciona una Clase"
                  setNewValue={handleChangeClase}
                />
                <ComboBoxInput
                  data={listaTipoEquipo.map((tipoEquipo: IListTypeEquipment) => ({ codigo: uniqid(), nombre: tipoEquipo.TIPO_EQUIPO }))}
                  value={selectedTipoEquipo}
                  label="Selecciona una Tipo de Equipo"
                  setNewValue={handleChangeTypeServer}
                />
                <ComboBoxInput
                  data={listaHerramienta.map((herramienta: IListHerramienta) => ({ codigo: uniqid(), nombre: herramienta.HERRAMIENTA_MONITOREO }))}
                  value={selectedHerramienta}
                  label="Selecciona una Herramienta"
                  setNewValue={setSelectedHerramienta}
                />
              </div>
              <div style={{ minWidth: "65%" }}>
                <h5>LISTA DE CI'S</h5>
                <CIsTable
                  handleRowSelected={handleRowSelected}
                  listaCis={filteredCI}
                  toggleCleared={toggleCleared}
                />
              </div>
            </div>
            <div className="mt-5">
              <h4>RESUMEN</h4>
              <div>
                {metricsToCreate.map((metrics: (ListaEquipmentsToMetrics & { ci_name: string })) => (
                  <ToolTip key={metrics.id_equipo} message={`HERRAMIENTA: ${metrics.herramienta} | TIPO EQUIPO: ${metrics.tipo_equipo}`} placement="top-start">
                    <button
                      onClick={() => {
                        setMetricsToCreate((prev: (ListaEquipmentsToMetrics & { ci_name: string })[]) => {
                          const actualMetrics = [...prev]
                          return actualMetrics.filter((metric: (ListaEquipmentsToMetrics & { ci_name: string })) => metric.id_equipo !== metrics.id_equipo)
                        })
                      }}
                      key={metrics.id_equipo}
                      className="bg-transparent hover-elevate-up">
                      <span className="badge badge-light-primary fs-6">{metrics.ci_name}</span>
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </ToolTip>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export { FirstStep }