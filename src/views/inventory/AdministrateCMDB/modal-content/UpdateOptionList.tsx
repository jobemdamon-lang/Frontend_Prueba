import { FC, useEffect, useState } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { IAttributeOfFamilyClase, IOptionByAttribute, IuseAttribute } from "../../Types"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { EditButton } from "../../../../components/buttons/EditButton"
import { minimalistStyles } from "../../../../helpers/tableStyles"
import { Input } from "../../../../components/Inputs/TextInput"
import { Switch } from "../../../../components/Inputs/Switch"
import { ToolTip } from "../../../../components/tooltip/ToolTip"

type Props = {
    modalInformation: IAttributeOfFamilyClase,
    attributeHook: IuseAttribute
}

const UpdateOptionList: FC<Props> = ({ modalInformation, attributeHook }) => {

    const [optionName, setOptionName] = useState("")
    const [selectedOption, setSelectedOption] = useState<IOptionByAttribute>({} as IOptionByAttribute)
    const [action, setAction] = useState<"create" | "update">("create")

    const handleUpdateTableData = () => attributeHook.getListOptionsOfAtt(modalInformation.IDOPCION.toString(), modalInformation.ID_METADATA.toString())

    //Función para modificar el nombre del Atributo
    const handleChangeNameOption = (row: IOptionByAttribute) => {
        setAction("update")
        setSelectedOption(row)
    }

    //Función para actualizar el nombre de la opción de a lista 
    const handleUpdateOption = () => {
        attributeHook.updateOptionListOfAtt(selectedOption.IDOPCION.toString(), {
            valor: selectedOption.VALOR
        }).then(success => {
            if (success) {
                setAction("create")
                setSelectedOption({} as IOptionByAttribute)
                handleUpdateTableData()
            }
        })
    }

    //Función para cambiar la visibilidad de la opción en la lista
    const handleChangeVisibility = (isChecked: boolean, row: IOptionByAttribute) => {
        attributeHook.changeStatusOfOptionListOfAtt(row.IDOPCION.toString(), isChecked ? 1 : 0).then(success => {
            if (success) attributeHook.getListOptionsOfAtt(modalInformation.IDOPCION.toString(), modalInformation.ID_METADATA.toString())
        })
    }

    //Función para crear una nueva opción de la lista
    const handleCreateOption = () => {
        attributeHook.addOptionListInAtt(modalInformation.IDOPCION.toString(), modalInformation.ID_METADATA.toString(), {
            valor: optionName
        }).then(success => {
            if (success) {
                handleUpdateTableData()
                setOptionName("")
            }
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { handleUpdateTableData() }, [])

    return (
        <div>
            {action === "create" ?
                <div className="d-flex justify-content-center align-items-end gap-5">
                    <Input
                        label="Nombre de Nueva Opción"
                        value={optionName}
                        onChange={setOptionName}
                        disabled={attributeHook.loadingCreateOptionListOfAtt}
                    />
                    <button
                        onClick={handleCreateOption}
                        className="btn btn-success"
                        disabled={attributeHook.loadingCreateOptionListOfAtt}
                    >
                        {attributeHook.loadingCreateOptionListOfAtt ? "Creando" : "Crear Opción"}
                    </button>
                </div>
                :
                <div className="d-flex justify-content-center align-items-end gap-5">
                    <button
                        onClick={() => setAction("create")}
                        className="btn btn-info">
                        Volver
                    </button>
                    <Input
                        label="Nuevo nombre de Opción"
                        value={selectedOption.VALOR}
                        onChange={(NameOption: string) => {
                            setSelectedOption(prev => ({ ...prev, VALOR: NameOption }))
                        }}
                        disabled={attributeHook.loadingUpdateOptionNameListOfAtt}
                    />
                    <button
                        onClick={handleUpdateOption}
                        className="btn btn-success"
                        disabled={attributeHook.loadingUpdateOptionNameListOfAtt}
                    >
                        {attributeHook.loadingUpdateOptionNameListOfAtt ? "Actualizando" : "Actualizar"}
                    </button>
                </div>
            }
            <div className="position-relative px-7 mt-10">
                <h5 className="opacity-50 fw-normal">
                    Lista de posibles opciones del Atributo: {modalInformation.NombreAtributo}
                </h5>
                <DataTable
                    columns={optionListOfAtt(handleChangeNameOption, handleChangeVisibility)}
                    persistTableHead
                    highlightOnHover
                    pagination
                    fixedHeader
                    customStyles={minimalistStyles}
                    noDataComponent={<EmptyData loading={attributeHook.loadingGetOptionsListOfAtt} />}
                    disabled={attributeHook.loadingGetOptionsListOfAtt || attributeHook.loadingChangeStatusOptionListOfAtt}
                    data={attributeHook.optionsListOfAttribute}
                />
                {attributeHook.loadingGetOptionsListOfAtt && <LoadingTable description='Cargando' />}
            </div>
        </div>

    )
}
export { UpdateOptionList }


export const optionListOfAtt = (
    handleChangeNameOption: (row: IOptionByAttribute) => void,
    handleChangeVisibility: (isChecked: boolean, row: IOptionByAttribute) => void
): TableColumn<IOptionByAttribute>[] => [
        {
            name: 'ID',
            width: '125px',
            selector: (row: IOptionByAttribute) => row.IDOPCION ?? "Sin registro"
        },
        {
            name: 'Nombre Opción',
            cell: (row: IOptionByAttribute) => (
                <ToolTip message={row.VALOR} placement='top'>
                    <span className="text-center">{row.VALOR}</span>
                </ToolTip>
            )
        },
        {
            name: 'Acciones',
            cell: (row: IOptionByAttribute) =>
                <div className="d-flex gap-3 align-items-center">
                    <Switch
                        label="Ocultar"
                        id={row.VALOR}
                        isChecked={row.ESTADO === 1}
                        onChange={(checked) => handleChangeVisibility(checked, row)}
                    />
                    <EditButton onClick={() => handleChangeNameOption(row)} />
                </div>
        }
    ]