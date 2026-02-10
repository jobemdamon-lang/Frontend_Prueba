import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IConfigurationItem, IassignedIP } from "../../Types"
import { Input } from "../../../../components/Inputs/TextInput"
import { SelectInput } from "../../../../components/Inputs/SelectInput"
import { useEffect, useState } from "react"
import { useCI } from "../../hooks/useCI"
import { Loading } from "../../../../components/Loading"
import DataTable, { TableColumn } from "react-data-table-component"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { secondCustomStyles } from "../../../../helpers/tableStyles"
import { AccessController } from "../../../../components/AccessControler"

const AdministrateIP = () => {

    const { modalHook, monitorOptionsHook, rol } = useConfigurationItemsContext()
    const modalInformation: IConfigurationItem = modalHook.modalInformation
    const [selectedTypeIP, setSelectedTypeIP] = useState("")
    const [IP, setIP] = useState("")
    const [subnetMask, setSubnetMask] = useState("")
    const [comments, setComments] = useState("")
    const CIHooks = useCI()

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        CIHooks.addIP({
            comentario: comments,
            mascara: subnetMask,
            id_equipo: modalInformation.ID_EQUIPO,
            nro_ip: IP,
            tipo_ip: selectedTypeIP
        }).then(succcess => {
            if (succcess) CIHooks.getIPsByCI(modalInformation.ID_EQUIPO)
        })
    }

    useEffect(() => {
        monitorOptionsHook.getTypesIP()
        CIHooks.getIPsByCI(modalInformation.ID_EQUIPO)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">LISTA DE IPS | {modalInformation.NOMBRE_CI}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                {CIHooks.loadingIPsByCI ?
                    <Loading loadingText="Cargando Información..." />
                    :
                    <div className="d-flex flex-column gap-5">
                        <AccessController rol={rol}>
                            <form
                                onSubmit={handleSubmit}
                                className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-center gap-5">
                                    <Input
                                        label="Numero de IP"
                                        onChange={setIP}
                                        required={true}
                                        pattern="((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}$"
                                    />
                                    <SelectInput
                                        label="Tipo de Equipo"
                                        data={monitorOptionsHook.IPtypes}
                                        onChange={setSelectedTypeIP}
                                        loading={monitorOptionsHook.loadingTypesIP}
                                        required={true} />
                                    <Input
                                        label="Mascara"
                                        required={true}
                                        onChange={setSubnetMask}
                                        pattern="(255)\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)\.(0|128|192|224|240|248|252|254|255)"
                                    />
                                </div>
                                <div className="d-flex justify-content-center align-items-end gap-5">
                                    <Input label="Comentario" onChange={setComments} maxLength={500} />
                                    <div className="d-flex aling-items-end gap-5">
                                        <button
                                            disabled={CIHooks.loadingAddIP}
                                            className="btn btn-success"
                                        >
                                            {CIHooks.loadingAddIP ? "Creando" : "Crear"}
                                        </button>
                                        <button className="btn btn-danger">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </AccessController>
                        <div style={{ position: 'relative' }}>
                            <DataTable
                                columns={columnsIP}
                                customStyles={secondCustomStyles}
                                persistTableHead
                                highlightOnHover
                                pagination
                                fixedHeader
                                noDataComponent={<EmptyData loading={CIHooks.loadingIPsByCI} />}
                                data={CIHooks.CIIps}
                                disabled={CIHooks.loadingIPsByCI}
                            />
                            {CIHooks.loadingIPsByCI && <LoadingTable description='Cargando' />}
                        </div>
                    </div>
                }
            </div>
        </>

    )
}
export { AdministrateIP }


export const columnsIP: TableColumn<IassignedIP>[] = [
    {
        name: 'NRO IP',
        selector: (row: any) => row.NRO_IP
    },
    {
        name: 'TIPO IP',
        selector: (row: any) => row.TIPO_IP
    },
    {
        name: 'MASCARA',
        selector: (row: any) => row.MASCARA
    },
    {
        name: 'COMENTARIO',
        width: "400px",
        selector: (row: any) => row.COMENTARIO
    }
]
