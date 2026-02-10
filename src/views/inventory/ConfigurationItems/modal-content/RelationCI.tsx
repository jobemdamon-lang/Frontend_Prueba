import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IConfigurationItemPlane } from "../../Types"
import { useEffect, useState } from "react"
import { DataList } from "../../../../components/Inputs/DataListInput"
import DataTable, { TableColumn } from "react-data-table-component"
import { secondCustomStyles } from "../../../../helpers/tableStyles"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { useCI } from "../../hooks/useCI"
import { SearchInput } from "../../../../components/SearchInput/SearchInput"
import { warningNotification } from "../../../../helpers/notifications"

const RelationCI = () => {

    const { modalHook, owners, configurationItemsPlane, loadingListCIPlane, handleListCIs } = useConfigurationItemsContext()
    const [selectedParentCI, setSelectedParentCI] = useState("")
    const [selectedRows, setSelectedRows] = useState<IConfigurationItemPlane[]>([])
    const [filteredCIs, setFilteredCIs] = useState<IConfigurationItemPlane[]>([])
    const [toggledClearRows, setToggleClearRows] = useState(false)
    const [searchedValue, setSearchedValue] = useState("")
    const CIHook = useCI()

    const handleChange = ({ selectedRows }: { selectedRows: IConfigurationItemPlane[] }) => {
        setSelectedRows(selectedRows)
    }

    const handleAssignChildrens = () => {

        const parentCI = configurationItemsPlane.find(ci => ci.NOMBRE_CI?.toUpperCase() === selectedParentCI.toUpperCase())
        const childrensCI = selectedRows.map(ci => ci.ID_EQUIPO)

        if (selectedParentCI === "" || selectedRows.length === 0 || !parentCI || childrensCI.includes(parentCI.ID_EQUIPO)) {
            warningNotification('Debe seleccionar un Parent CI y CIs hijos válidos')
            return
        }
        CIHook.assignChildrensCI({
            parent_id: parentCI.ID_EQUIPO,
            hijos: childrensCI
        }).then(success => {
            if (success) {
                setToggleClearRows(!toggledClearRows)
                handleListCIs()
            }
        })
    }

    useEffect(() => {
        setFilteredCIs(configurationItemsPlane.filter(ci => {
            return ci.NOMBRE?.toUpperCase().includes(searchedValue.toUpperCase()) ||
                ci.NOMBRE_CI?.toUpperCase().includes(searchedValue.toUpperCase()) ||
                ci.IPLAN?.toUpperCase().includes(searchedValue.toUpperCase())
        }))
    }, [searchedValue, configurationItemsPlane])

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">CREAR RELACIÓN DE CI's | CLIENTE - {owners.client}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15 d-flex flex-column gap-5'>
                <div className="d-flex align-items-end gap-10 justify-content-center">
                    <DataList
                        label="Elemento de Configuración Contenedor"
                        loading={loadingListCIPlane}
                        items={configurationItemsPlane.map(ci => ({ id: ci.ID_EQUIPO, value: ci.NOMBRE_CI || '' }))}
                        value={selectedParentCI}
                        onChange={setSelectedParentCI}
                    />
                    <button
                        onClick={handleAssignChildrens}
                        className="btn btn-success"
                        disabled={CIHook.loadingAssignChildrensCI}
                    >
                        {CIHook.loadingAssignChildrensCI ? "Asignando" : "Asignar relación"}
                    </button>
                </div>
                <h4>Componentes hijos que pertenecen a: {selectedParentCI} </h4>
                <div style={{ position: 'relative' }} className="d-flex flex-column gap-5">
                    <SearchInput
                        setValue={setSearchedValue}
                        value={searchedValue}
                        placeholder="Ingrese su busqueda"
                    />
                    <DataTable
                        columns={columnsIP}
                        customStyles={secondCustomStyles}
                        persistTableHead
                        highlightOnHover
                        pagination
                        fixedHeader
                        noDataComponent={<EmptyData loading={loadingListCIPlane} />}
                        data={filteredCIs}
                        disabled={loadingListCIPlane}
                        selectableRows
                        onSelectedRowsChange={handleChange}
                        clearSelectedRows={toggledClearRows}
                    />
                    {loadingListCIPlane && <LoadingTable description='Cargando' />}
                </div>
            </div>
        </>
    )
}
export { RelationCI }

export const columnsIP: TableColumn<IConfigurationItemPlane>[] = [
    {
        name: 'NOMBRE CI',
        selector: (row: IConfigurationItemPlane) => row.NOMBRE_CI ?? "Sin registro"
    },
    {
        name: 'HOSTNAME',
        selector: (row: IConfigurationItemPlane) => row.NOMBRE ?? "Sin registro"
    },
    {
        name: 'NUMERO IP',
        selector: (row: IConfigurationItemPlane) => row.IPLAN ?? "Sin registro"
    },
    {
        name: 'UBICACION',
        selector: (row: IConfigurationItemPlane) => row.UBICACION ?? "Sin registro"
    },
    {
        name: 'NOMBRE CI PADRE',
        selector: (row: IConfigurationItemPlane) => row.PARENT_NOMBRE_CI ?? "Sin registro"
    },
    {
        name: 'HOSTNAME PADRE',
        selector: (row: IConfigurationItemPlane) => row.PARENT_NOMBRE ?? "Sin registro"
    }
]
