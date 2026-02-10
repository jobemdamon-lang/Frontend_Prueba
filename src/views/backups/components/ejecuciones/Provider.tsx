/* eslint-disable jsx-a11y/anchor-is-valid */
import { Context } from './Context'

const Provider = (): JSX.Element => {

   return (
      <Context.Provider value={{
      }} >
         <div className='card-header rounded rounded-3 my-3'>
            <h3 className='card-title align-items-start flex-column'>
               <span className='card-label fw-bolder fs-3 mb-1 '>Dashboard de Ejecuciones</span>
            </h3>
         </div>
         <div className='card-body py-3 px-6'>
            <iframe title="Informe centralizador de Backups" width="100%" height="720" src="https://app.powerbi.com/view?r=eyJrIjoiZWM5YWRjNDUtYzkyOS00Y2ZhLWI3ZTAtYmNkNTVkMGJkNzNlIiwidCI6IjBmYWFjZDM2LTc2ODAtNDQ0MS04MTdhLTkzNmE0ZTAyNDRkZSIsImMiOjR9&pageName=ReportSection8f386a2175653c122396" allowFullScreen={true}></iframe>
         </div>
      </Context.Provider>

   )
}

export { Provider }
