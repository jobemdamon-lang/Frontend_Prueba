import { FC } from 'react'
import { ActionsButtons } from './ActionsButtons';
import { DataListInputs } from './DataListInputs';

const FilterInputs: FC = (): JSX.Element => {

  return (
    <div className='accordion-body'>
      <div className='d-flex flex-column gap-5'>
        <ActionsButtons/>
        <DataListInputs />
      </div>
    </div>
  )
}
export { FilterInputs }