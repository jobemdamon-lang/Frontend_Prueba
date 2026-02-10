/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useState, useEffect, useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { KTSVG } from '../../../../helpers'
import DataTable, { ExpanderComponentProps } from 'react-data-table-component'
import { LoadingTable } from '../../../../components/loading/LoadingTable'
import { EmptyData } from '../../../../components/datatable/EmptyData'
import { MonitoringService } from '../../../../services/Monitoring.service'
import { Context } from '../Context'
import { Export } from './export/Export'
import { columns } from './Columns'
import { IAlert, IAlertModal } from '../Types'
import { CustomStyles } from '../../../../components/datatable/CustomStyles'

type Props = {
   params: Array<IAlert>
}

const Content = ({ params }: Props) => {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])

   const fetchData = async () => {
      setLoading(true)
      const response = await MonitoringService.listMonitor({
         itipo: 2,
         client: params[0].client,
         alertid: params[0].alertid,
         hostip: params[0].hostip,
      })
      setData(response)
      setLoading(false)
   }

   useEffect(() => {
      fetchData()
   }, [])

   const ExpandedComponent: FC<ExpanderComponentProps<IAlertModal>> = ({ data }) => {
      return (
         <>
            <p>Espacio de regla: {data.rulespace}</p>
            <p>Valor: {data.value}</p>
            <p>Tipo de regla: {data.ruletype}</p>
            <p>Herramienta: {data.tool}</p>
         </>
      )
   }

   const paginationComponentOptions = {
      rowsPerPageText: 'Filas por página',
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
   }

   return (
      <>
         <div className='d-flex justify-content-end'>
            <div className='d-none d-md-block'>
               <Export data={data} />
            </div>
         </div>
         <div style={{ position: 'relative' }}>
            <DataTable
               columns={columns}
               data={data}
               pagination
               highlightOnHover
               persistTableHead
               paginationPerPage={7}
               noDataComponent={<EmptyData loading={loading} />}
               paginationRowsPerPageOptions={[7, 10, 15, 20, 25, 30]}
               paginationComponentOptions={paginationComponentOptions}
               expandableRows={true}
               expandableRowsComponent={ExpandedComponent}
               customStyles={CustomStyles}
            />
            {loading && <LoadingTable description='Cargando' />}
         </div>
      </>
   )
}

const ModalContent: FC = () => {
   const { paramsModalContent, showModal, setShowModal } = useContext(Context)

   const params: IAlert = paramsModalContent[0]

   return (
      <Modal
         id='kt_modal_create_app'
         size='xl'
         tabIndex={-1}
         aria-hidden='true'
         dialogClassName='modal-dialog modal-dialog-centered'
         show={showModal}
         onHide={() => setShowModal(false)}
      >
         <div className='modal-header py-4'>
            <h2>
               {params.client} | {params.hostip} | {params.alertseverity}
            </h2>
            <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => setShowModal(false)}>
               <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
            </div>
         </div>
         <div className='modal-body pt-2 px-lg-10'>
            <Content params={paramsModalContent} />
         </div>
      </Modal>
   )
}

export { ModalContent }
