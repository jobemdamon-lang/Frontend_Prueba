/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { LoadingTable } from '../../../../components/loading/LoadingTable'
import { EmptyData } from '../../../../components/datatable/EmptyData'
import { Context } from '../Context'
import { SearchText } from './filters/SearchText'
import { Export } from './export/Export'
import { columns } from './Columns'
import { CustomStyles } from '../../../../components/datatable/CustomStyles'

const Content: FC = () => {
   const { filteredData, resetPagination, loading } = useContext(Context)

   const paginationComponentOptions = {
      rowsPerPageText: 'Filas por página',
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
   }

   return (
      <>
         <div className='d-flex align-content-center justify-content-between w-100 pb-3'>
            <div>
               <SearchText />
            </div>
            <div className='d-none d-md-block'>
               <Export />
            </div>
         </div>
         <div style={{ position: 'relative' }}>
            <DataTable
               columns={columns}
               data={filteredData}
               pagination
               paginationResetDefaultPage={resetPagination}
               highlightOnHover
               disabled={loading}
               persistTableHead
               noDataComponent={<EmptyData loading={loading} />}
               paginationComponentOptions={paginationComponentOptions}
               customStyles={CustomStyles}
            />
            {loading && <LoadingTable description='Cargando' />}
         </div>
      </>
   )
}

export { Content }
