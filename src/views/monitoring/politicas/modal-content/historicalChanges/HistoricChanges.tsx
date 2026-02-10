import { useContext, useEffect, useState } from "react"
import { KTSVG } from "../../../../../helpers"
import { ContextPolitica } from "../../ContextPolitica"
import DataTable from "react-data-table-component"
import { customStyles } from "../../../../../helpers/tableStyles"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { usePolicy } from "../../hooks/usePolicy"
import { IPolicyHistoryDetail } from "../../Types"
import { ComboBoxInput } from "../../../../../components/Inputs/ComboBoxInputs"
import { HistoricalChangesColumns } from "./historicalChangesColumns"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import "../../../../../assets/sass/components/InventoryFilter/table-styles.scss"
import { IComboData } from "../../../../../helpers/Types"

type ContextProps = {
  modalInformation: { id_politica: string },
  closeModal: Function
}

const HistoricChanges = () => {

  const { closeModal, modalInformation } = useContext<ContextProps>(ContextPolitica)
  const { getHistoricalChanges, historicalChanges, historicalChangesLoading } = usePolicy()
  const [filteredData, setFilteredData] = useState<IPolicyHistoryDetail[]>([])
  const [comboDataVersion, setComboDataVersion] = useState<IComboData[]>([])
  const [selectedVersion, setSelectedVersion] = useState("")
  const [searchedValue, setSearchedValue] = useState("")
  const [wantCanceled, setWantCanceled] = useState(false)

  useEffect(() => {
    let filteredChanges = historicalChanges.filter((change: IPolicyHistoryDetail) => {
      const HasSameVersion = selectedVersion === "" ? true : change.VERSION_POLITICA.toString() === selectedVersion
      const isCanceled = wantCanceled ? true : change.ESTADO_POLITICA_REAL !== "CANCELADO"
      const hasSimilitudes = change.USUARIO?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        (change.NRO_TICKET ?? "").toString().toLowerCase().includes(searchedValue.toLowerCase()) ||
        (change.TICKET_MONITOREO ?? "").toString().toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.NOMBRE_CI?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.IP?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.FAMILIA?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.CLASE?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.METRICAS?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.USUARIO?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.HERRAMIENTA_MONITOREO?.toLowerCase().includes(searchedValue.toLowerCase()) ||
        change.MOTIVO?.toLowerCase().includes(searchedValue.toLowerCase())
      return HasSameVersion && hasSimilitudes && isCanceled
    })
    setFilteredData(filteredChanges)
  }, [selectedVersion, searchedValue, historicalChanges, wantCanceled])

  useEffect(() => {
    console.log('este es el id', modalInformation)
    getHistoricalChanges(modalInformation.id_politica, "0")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const nroVersionSet = new Set(historicalChanges.map(change => change.VERSION_POLITICA));
    const nroVersionesUnicas = Array.from(nroVersionSet)
      .sort((a, b) => a - b); // Ordenar de menor a mayor

    setComboDataVersion(
      nroVersionesUnicas.map((nroversion, index) => ({
        codigo: index,
        nombre: nroversion.toString(),
      }))
    );
  }, [historicalChanges]);


  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">Historial de Politica</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <section className="d-flex justify-content-end gap-10 align-items-end mb-5">
          <div className="form-check">
            <input
              className="form-check-input border border-secondary"
              type="checkbox"
              checked={wantCanceled}
              id="cancelado"
              onChange={() => setWantCanceled(prev => !prev)}
            />
            <label className="form-check-label" htmlFor="cancelado">
              <span className="fs-5 fw-bold" style={{ color: "gray" }}>INCLUIR CANCELADOS</span>
            </label>
          </div>
          <ComboBoxInput label="Numero de Version" value={selectedVersion} setNewValue={setSelectedVersion} data={comboDataVersion} disabled={false} />
          <SearchInput placeholder="Ingrese su busqueda.." value={searchedValue} setValue={setSearchedValue} />
        </section>
        <section style={{ position: 'relative' }}>
          <DataTable
            columns={HistoricalChangesColumns}
            pagination
            highlightOnHover
            persistTableHead
            disabled={historicalChangesLoading}
            customStyles={customStyles}
            noDataComponent={<EmptyData loading={historicalChangesLoading} />}
            data={filteredData}
          />
          {historicalChangesLoading && <LoadingTable description='Cargando' />}
        </section>
      </div>
    </>
  )
}
export { HistoricChanges }
