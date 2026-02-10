import { useState } from "react"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { useAdministrateCMDBContext } from "../Context"
import DataTable, { TableColumn } from "react-data-table-component"
import { minimalistStyles } from "../../../../helpers/tableStyles"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { EditButton } from "../../../../components/buttons/EditButton"
import { IAttributeOfFamilyClase, ModalViewForAdministrateCMDB } from "../../Types"
import { ModalSize } from "../../../../hooks/Types"
import { useDataFromMonitorOptions } from "../../hooks/useDataFromMonitorOptions"
import { Switch } from "../../../../components/Inputs/Switch"

const ListAtributtesSection = () => {

    const { modalHook, familyData, familyLoading, attributeHook } = useAdministrateCMDBContext()
    const monitorOptionsHook = useDataFromMonitorOptions()
    const [selectedFamily, setSelectedFamily] = useState("")
    const [selectedClase, setSelectedClase] = useState("")

    const handleEditAttribute = (row: IAttributeOfFamilyClase) => {
        modalHook.openModal(ModalViewForAdministrateCMDB.UPDATE_ATTRIBUTE, ModalSize.LG, undefined, row)
    }

    const handleListAttByFamilyClase = (nameClase: string) => {
        const clase = monitorOptionsHook.claseData.find(clase => clase.nombre === nameClase)
        if (clase) attributeHook.getAttributesByFamilyClase(clase.codigo)
    }

    const handleChangeVisibility = (isChecked: boolean, row: IAttributeOfFamilyClase) => {
        attributeHook.changeStatusOfAttribute(row.ID_METADATA, isChecked ? 1 : 0).then(success => {
            if (success) attributeHook.getAttributesByFamilyClase(row.IDOPCION)
        })
    }

    return (
        <section className="card overflow-scroll flex-grow-1" style={{ minHeight: "500px" }}>
            <header className="p-8">
                <h4 className="text-start text-uppercase m-0">Actualizar Atributo</h4>
                <p className="fw-light m-0">Actualice las propiedades del atributo seleccionado.</p>
            </header>
            <hr className="text-dark w-100 m-0" style={{ opacity: "0.1" }} />
            <div className="d-flex gap-5 justify-content-around p-5">
                <SelectInput
                    label="Familia"
                    value={selectedFamily}
                    onChange={setSelectedFamily}
                    data={familyData}
                    loading={familyLoading}
                    dependencyfunction={monitorOptionsHook.getClase}
                />
                <SelectInput
                    label="Clase"
                    value={selectedClase}
                    onChange={setSelectedClase}
                    data={monitorOptionsHook.claseData}
                    loading={monitorOptionsHook.claseLoading}
                    dependencyfunction={handleListAttByFamilyClase}
                />
            </div>
            <div className="position-relative px-7 py-2">
                <h5 className="opacity-50 fw-normal">Atributos de la Clase: {selectedClase}</h5>
                <DataTable
                    columns={
                        listAttributesColumns(
                            handleEditAttribute,
                            handleChangeVisibility
                        )}
                    persistTableHead
                    highlightOnHover
                    pagination
                    fixedHeader
                    customStyles={minimalistStyles}
                    paginationPerPage={3}
                    paginationRowsPerPageOptions={[3, 5]}
                    noDataComponent={<EmptyData loading={attributeHook.loadingGetAttribute} />}
                    disabled={attributeHook.loadingGetAttribute || attributeHook.loadingChangeStatusAtt}
                    data={attributeHook.attributesOfFamilyClase}
                />
                {attributeHook.loadingGetAttribute && <LoadingTable description='Cargando' />}
            </div>
        </section>
    )
}

export { ListAtributtesSection }

export const listAttributesColumns = (
    handleEditAttribute: (row: IAttributeOfFamilyClase) => void,
    handleChangeVisibility: (isChecked: boolean, row: IAttributeOfFamilyClase) => void
): TableColumn<IAttributeOfFamilyClase>[] => [
        {
            name: 'Nombre Atributo',
            selector: (row: IAttributeOfFamilyClase) => row.NombreAtributo ?? "Sin registro"
        },
        {
            name: 'Tipo de Atributo',
            selector: (row: IAttributeOfFamilyClase) => row.TIPO_ATRIBUTO ?? "Sin registro"
        },
        {
            name: 'Tipo de Dato',
            selector: (row: IAttributeOfFamilyClase) => row.TIPO_DATO ?? "No Aplica."
        },
        {
            name: 'Acciones',
            cell: (row: IAttributeOfFamilyClase) =>
                <div className="d-flex gap-3 align-items-center">
                    <Switch label="Ocultar" id={row.NombreAtributo} isChecked={row.ESTADO === 1} onChange={(checked) => handleChangeVisibility(checked, row)} />
                    <EditButton onClick={() => handleEditAttribute(row)} />
                </div>
        }
    ]