import { FC, useEffect } from "react"
import { KTSVG } from "../../../../../helpers/components/KTSVG"
import DataTable, { TableColumn } from "react-data-table-component"
import { ICatalogModel } from "../../Types"
import { useCatalog } from "../../hooks/useCatalog"
import { LoadingTable } from "../../../../../components/loading/LoadingTable"
import { customStyles } from "../../../../../helpers/tableStyles"

type Props = {
  closeModalParams: Function,
  modalInformationParams: {
    family: string,
    clase: string,
    tipo_equipo: string
  }
}

const CatalogInformation: FC<Props> = ({ closeModalParams, modalInformationParams }) => {

  const { getListDetailCatalog, catalogDetailInformation, catalogLoading } = useCatalog()

  useEffect(() => {
    getListDetailCatalog(modalInformationParams.family, modalInformationParams.clase, modalInformationParams.tipo_equipo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">Metricas a Crear - Detalle Catalogo</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => closeModalParams()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <h1 className="text-center py-5">CATALOGO DE ALERTA PARA CLIENTES</h1>
        <div style={{ position: 'relative' }}>
          <DataTable
            columns={CatalogColumns}
            persistTableHead
            highlightOnHover
            pagination
            customStyles={customStyles}
            fixedHeader
            disabled={catalogLoading}
            data={catalogDetailInformation}
          />
          {catalogLoading && <LoadingTable description='Cargando' />}
        </div>
      </div>
    </>
  )
}
export { CatalogInformation }

export const CatalogColumns: TableColumn<ICatalogModel>[] = [
  {
    name: 'CLIENTES',
    cell: (row: ICatalogModel) => row.CLIENTES ?? "Sin registro",
    sortable: true
  },
  {
    name: 'DETALLE',
    cell: (row: ICatalogModel) => row.DETALLE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'FRECUENCIA',
    cell: (row: ICatalogModel) => row.FRECUENCIA ?? "Sin registro",
    sortable: true
  },
  {
    name: 'HERRAMIENTA MONITOREO',
    cell: (row: ICatalogModel) => row.HERRAMIENTA_MONITOREO ?? "Sin registro",
    sortable: true
  },
  {
    name: 'METRICAS',
    cell: (row: ICatalogModel) => row.METRICAS ?? "Sin registro",
    sortable: true
  },
  {
    name: 'NRO POOLEOS',
    cell: (row: ICatalogModel) => row.NRO_POOLEOS ?? "Sin registro",
    sortable: true
  },
  {
    name: 'TORRE',
    cell: (row: ICatalogModel) => row.TORRE ?? "Sin registro",
    sortable: true
  },
  {
    name: 'UMBRAL',
    cell: (row: ICatalogModel) => row.UMBRAL ?? "Sin registro",
    sortable: true
  },
  {
    name: 'UNIDADES',
    cell: (row: ICatalogModel) => row.UNIDADES ?? "Sin registro",
    sortable: true
  },
  {
    name: 'URGENCIA',
    cell: (row: ICatalogModel) => row.URGENCIA ?? "Sin registro",
    sortable: true
  }
]