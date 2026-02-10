import { useEffect, useState } from "react"
import { Input } from "../../../../components/Inputs/TextInput"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useAplicationContext } from "../Context"
import DataTable, { TableColumn } from "react-data-table-component"
import { secondCustomStyles } from "../../../../helpers/tableStyles"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { IIntegration, IUrls, ModalSize, ModalViewForAplication } from "../../Types"
import { EditButton } from "../../../../components/buttons/EditButton"
import { DeleteButton } from "../../../../components/buttons/DeleteButton"


const InfoUrl = () => {
    const { modalHook, integrationHook } = useAplicationContext()
    const modalInformation: IIntegration = modalHook.modalInformation
    const [selectedUrl, setSelectedUrl] = useState("")

    useEffect(() => {
        integrationHook.getListIntegrationUrl(modalInformation.ID_INTEGRACION.toString())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const openModalEditUrl = (row: IUrls) => {
        modalHook.openModal(ModalViewForAplication.EDIT_URL, ModalSize.LG, undefined, row)
    }

    const openModalDeleteUrl = (row: IUrls) => {
        modalHook.openModal(ModalViewForAplication.CONFIRMATIONURL_DELELTE, ModalSize.LG, undefined, row)
    }

    return (

        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">LISTA DE URLS | {modalInformation.NOMBRE}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>



            <div className="d-flex align-items-center gap-3 flex-column">
                <div className="d-flex gap-5 ">

                    <Input
                        label='URL PARA AGREGAR'
                        onChange={setSelectedUrl}
                        value={selectedUrl}
                        className="w-200px" />

                </div>

                <div className="d-flex justify-content-center align-items-end gap-3 mb-5" style={{ borderRadius: '10px' }}>

                    <button
                        disabled={integrationHook.loadingCreateIntegrationUrl}
                        className="btn btn-success"
                        onClick={() => {
                            integrationHook.createIntegrationUrl({
                                url: selectedUrl,
                                id_integracion: modalInformation.ID_INTEGRACION

                            }).then((success) => {
                                if (success) {
                                    integrationHook.getListIntegrationUrl(modalInformation.ID_INTEGRACION.toString())
                                }
                            })

                        }} >
                        GUARDAR
                    </button>

                    <button className="btn btn-danger"
                        onClick={() => modalHook.closeModal()}>
                        CANCELAR
                    </button>
                </div>


            </div>

            <div style={{ position: 'relative' }} className="mx-5 ml-5 my-5">
                <DataTable
                    columns={getListIntegrationUrl(openModalEditUrl, openModalDeleteUrl)}
                    customStyles={secondCustomStyles}
                    persistTableHead
                    highlightOnHover
                    pagination
                    fixedHeader
                    noDataComponent={<EmptyData loading={integrationHook.loadingListIntegrationUrl} />}
                    data={integrationHook.integrationUrl}
                    disabled={integrationHook.loadingListIntegrationUrl}
                />
                {integrationHook.loadingListIntegrationUrl && <LoadingTable description='Cargando' />}
            </div>

        </>


    )


}
export { InfoUrl }
export const getListIntegrationUrl = (
    openModalEditUrl: (row: IUrls) => void,
    openModalDeleteUrl: (row: IUrls) => void
): TableColumn<IUrls>[] => [

        {
            name: 'URL',
            selector: (row: IUrls) => row.URL
        },
        {
            name: 'ACCIONES',
            width: '',
            cell: (row: IUrls) => <>
                <div className='d-flex'>
                    <EditButton className='d-flex'
                        onClick={() => {
                            openModalEditUrl(row)
                        }}
                    >

                    </EditButton>

                </div>

                <div className='d-flex'>
                    <DeleteButton className='d-flex'
                        onClick={() => {
                            openModalDeleteUrl(row)
                        }}
                    >

                    </DeleteButton>

                </div>
            </>

        }]

