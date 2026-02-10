import { FC } from 'react'
import { KTSVG } from '../../../../../../helpers'
import { FilterInputs } from './FilterInputs'


const FilterSection: FC = ():JSX.Element => {
  return (
    <div className='accordion' id='kt_accordion_backups'>
      <div className='accordion-item'>
        <h2 className='accordion-header' id='kt_accordion_backups_header_1'>
          <button
            className='accordion-button fs-4 fw-bold collapsed bg-dark bg-gradient'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#kt_accordion_backups_body_1'
            aria-expanded='false'
            aria-controls='kt_accordion_backups_body_1'
          >
            <div className='d-flex flex-row justify-content-around'>
                <span className='card-title fw-bolder mb-1 mx-5 text-white'>Filtros</span>
                <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-2' />
            </div>
          </button>
        </h2>
        <div
          id='kt_accordion_backups_body_1'
          className='accordion-collapse collapse'
          aria-labelledby='kt_accordion_backups_header_1'
          data-bs-parent='#kt_accordion_backups'
        >
          <FilterInputs />
        </div>
      </div>
    </div>

  )
}

export { FilterSection }