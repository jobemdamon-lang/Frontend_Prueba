/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import DataTable from 'react-data-table-component'

const customStyles = {
   header: {
      style: {
         minHeight: '56px',
         wordBreak: 'break-word',
      },
   },
   headCells: {
      style: {
         '&:not(:last-of-type)': {
            paddingRight: '8px',
            paddingLeft: '8px',
            wordBreak: 'break-word',
         },
      },
   },
   cells: {
      style: {
         '&:not(:last-of-type)': {
            paddingRight: '8px',
            paddingLeft: '8px',
         },
      },
   },
}

type Props = {
   data: object[]
   columns: object[]
   expandable?: boolean
}

const paginationComponentOptions = {
   rowsPerPageText: 'Filas por página',
   rangeSeparatorText: 'de',
   selectAllRowsItem: true,
}

const BasicTable: FC<Props> = ({ columns, data, expandable }) => {
   return (
      <DataTable
         columns={columns}
         data={data}
         pagination
         paginationComponentOptions={paginationComponentOptions}
         expandableRows={expandable}
         customStyles={customStyles}
      />
   )
}

BasicTable.defaultProps = {
   expandable: false,
}

export { BasicTable }
