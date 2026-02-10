import { FC, useEffect } from 'react'
import { ModuleProps } from '../../../helpers/Types'
import { AplicationProvider } from './Context'
import DataTable, { TableColumn } from 'react-data-table-component'
import { EmptyData } from '../../../components/datatable/EmptyData'
import { minimalistStyles } from '../../../helpers/tableStyles'
import { LoadingTable } from '../../../components/loading/LoadingTable'
import { IIntegration, ModalViewForAplication } from '../Types'
import { useModal } from '../../../hooks/useModal'
import { ModalSize } from '../../../hooks/Types'
import { AplicationModal } from './AplicationModal'
import { Switch } from '../../../components/Inputs/Switch'
import { Header } from './Modal-Content/Header'
import { UrlButton } from '../../../components/buttons/UrlButton'
import { useIntegration } from './hooks/useIntegration'


const Provider: FC<ModuleProps> = ({ rol }) => {
    const modalHook = useModal()

    const integrationHook = useIntegration()

    const handleChangeSwitch = (row: IIntegration, checked: boolean) => {
        const newstate = checked === true ? 1 : 0
        modalHook.openModal(ModalViewForAplication.CONFIRMATION_DELELTE, ModalSize.XL, undefined, { ...row, newstate })
    }


    const handleEditUrl = (row: IIntegration) => {

        modalHook.openModal(ModalViewForAplication.INFO_URL, ModalSize.XL, undefined, row)
    }
    useEffect(() => {
        integrationHook.getLisAlltIntegration()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AplicationProvider value={{
            rol,
            modalHook,
            integrationHook
        }} >
            <>
                <Header />
                <div className="position-relative  py-2">
                    <h5 className="opacity-50 fw-normal">LISTA DE INTEGRACIONES</h5>
                    <DataTable
                        columns={
                            listAttributesColumns(handleChangeSwitch, handleEditUrl)}
                        persistTableHead
                        highlightOnHover
                        pagination
                        fixedHeader
                        customStyles={minimalistStyles}
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[10]}
                        noDataComponent={<EmptyData loading={false} />}
                        disabled={integrationHook.loadingListAllIntegrations}
                        data={integrationHook.integrationsList}
                    />
                    {integrationHook.loadingListAllIntegrations && <LoadingTable description='Cargando' />}
                </div>

                <AplicationModal />
            </>

        </AplicationProvider>
    )
}

export { Provider }

export const listAttributesColumns = (
    handleChangeSwitch: (row: IIntegration, checked: boolean) => void,
    handleEditUrl: (row: IIntegration) => void
): TableColumn<IIntegration>[] => [
        {
            name: 'ESTADO',
            selector: (row: IIntegration) => row.ESTADO ?? "Sin registro",
            width: '100px'
        },
        {
            name: 'TOKEN',
            selector: (row: IIntegration) => row.TOKEN ?? "Sin registro",
            width: '900px'
        },
        {
            name: 'INTEGRACIÓN',
            cell: (row: IIntegration) => row.NOMBRE ?? "Sin registro",
            width: '150px'
        },
        {

            name: 'ACCIONES',
            width: '250px',
            cell: (row: IIntegration) =>

                <>
                    <div className='d-flex gap-3'>
                        <UrlButton className='d-flex' onClick={() => {
                            handleEditUrl(row)
                        }}>

                        </UrlButton>

                        <Switch isChecked={row.ESTADO === 1 ? true : false} label='ACT|DESACT' onChange={(checked: boolean) => {
                            handleChangeSwitch(row, checked)
                        }} />
                    </div>
                </>

        },
    ]