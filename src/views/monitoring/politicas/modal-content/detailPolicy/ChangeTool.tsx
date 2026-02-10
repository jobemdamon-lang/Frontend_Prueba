import { useContext, useEffect, useState } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import { ContextPolitica } from "../../ContextPolitica"
import { ICIOfPolicyDetail, IChangeTool, IMonitoringPolicyVersions, ITools } from "../../Types"
import DataTable, { TableColumn } from "react-data-table-component"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../../components/datatable/EmptyData"
import { usePolicy } from "../../hooks/usePolicy"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import { shallowEqual, useSelector } from "react-redux"
import { IAuthState } from "../../../../../store/auth/Types"
import { RootState } from "../../../../../store/ConfigStore"
import { cloneDeep } from 'lodash';
import { Form } from "react-bootstrap"
import uniqid from "uniqid"
import { useCatalog } from "../../hooks/useCatalog"

type Props = {
  closeModalParams: Function,
  modalInformation: IMonitoringPolicyVersions,
  updateTools: Function,
  updateToolsLoading: boolean,
  closeModal: Function
}

const ChangeTool = () => {

  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
  const { closeModalParams, modalInformation, updateTools, updateToolsLoading, closeModal }: Props = useContext(ContextPolitica)
  const { getCisOfPolicyVersion, listCIsOfPolicyVersion, listCiLoading, } = usePolicy()
  const [cis, setCis] = useState<ICIOfPolicyDetail[]>(cloneDeep(listCIsOfPolicyVersion))
  const [nombreCI, setNombreCI] = useState("")

  const handleUpdate = (idCI: number, herramienta: string) => {
    const newValues = [...cis]
    const idx = newValues.findIndex(ci => ci.ID_EQUIPO === idCI)
    newValues[idx].HEERAMIENTA_MONITOREO = herramienta
    setCis(newValues)
  }

  useEffect(() => {
    getCisOfPolicyVersion(modalInformation.ID_POLITICA.toString(), modalInformation.NRO_VERSION.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setCis(cloneDeep(listCIsOfPolicyVersion).filter(
      (metric: ICIOfPolicyDetail) =>
        metric.NOMBRE_CI.toLocaleLowerCase().includes(nombreCI.toLocaleLowerCase())
    ))
  }, [nombreCI, listCIsOfPolicyVersion])

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">CONFIRMAR HERRAMIENTAS USADAS</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModalParams()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10 border border-dark'>
        <p className="text-center"><i className="m-2 fs-5">Seleccione la herramienta con la que finalmente se implementó la solución.</i></p>
        <h5 className=" my-5">Lista de CI's Monitoreados</h5>
        <div style={{ position: 'relative' }}>
          <SearchInput value={nombreCI} setValue={setNombreCI} />
          <DataTable
            columns={equipmentsOfPolicy(handleUpdate)}
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
        <div className="d-flex justify-content-end m-3">
          <button
            disabled={updateToolsLoading}
            className="btn btn-success"
            onClick={() => {
              let changesToUpdate = cis.map(ci => ({
                id_equipo: ci.ID_EQUIPO,
                herramienta_monitoreo: ci.HEERAMIENTA_MONITOREO ?? ''
              }))
              //Se preparan los cambios y se envía
              let changeToSend: IChangeTool = {
                id_politica: modalInformation.ID_POLITICA,
                nro_version: modalInformation.NRO_VERSION,
                usuario: user.usuario,
                lista_equipo: changesToUpdate
              }
              updateTools(changeToSend, closeModalParams, closeModal)
            }}>{updateToolsLoading ? "Actualizando..." : "Confirmar Cambios"}</button>
        </div>
      </div>
    </>
  )
}
export { ChangeTool }

export const equipmentsOfPolicy = (
  handleUpdate: Function
): TableColumn<ICIOfPolicyDetail>[] => [
    {
      name: 'NOMBRE CI',
      cell: (row: (ICIOfPolicyDetail)) => row.NOMBRE_CI ?? "Sin registro",
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
      name: 'HERRAMIENTA PREDEFINIDA',
      width: "220px",
      cell: (row: (ICIOfPolicyDetail)) => <CustomCombo rowInfo={row} value={row.HEERAMIENTA_MONITOREO} setNewValue={handleUpdate} data={[]} /> ?? "Sin registro",
      sortable: true
    },

  ]

export function CustomCombo(props: any) {
  let rowInfo: ICIOfPolicyDetail = props.rowInfo
  let value: string = props?.value
  const setNewValue: Function = props.setNewValue
  const { getListToolsByFamilyClase, tools } = useCatalog()

  useEffect(() => {
    getListToolsByFamilyClase(rowInfo.FAMILIA, rowInfo.CLASE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Form.Control
        as="select"
        className="comboBox"
        aria-label="Default select example"
        value={value ?? ""}
        onChange={(value) => { setNewValue(rowInfo.ID_EQUIPO, value.target.value) }}>
        <option className="combo-option" value="">Seleccione una opción</option>
        {tools.map((option: ITools) => {
          return (
            <option className="combo-option" key={uniqid()} value={option.HERRAMIENTA_MONITOREO}>{option.HERRAMIENTA_MONITOREO}</option>
          )
        })}
      </Form.Control>
    </div>
  )
}