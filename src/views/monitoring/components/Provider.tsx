/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useEffect, useState } from 'react'
import { MenuComponent } from '../../../assets/ts/components'
import { MonitoringService } from '../../../services/Monitoring.service'
import { IAlertDetail } from './Types'
import { Context } from './Context'
import { Content } from './content/Content'
import { ModalContent } from './modal-content/ModalContent'

/**
 * Provee de datos y acciones que seran usados por los componentes hijos.
 * Recibe un parametro desde el componente padre que será enviado como parametro para cargar los datos de la tabla principal
 */
const Provider: FC<{ itipo: number }> = ({ itipo }) => {
   const [data, setData] = useState([])
   const [loading, setLoading] = useState(false)
   const [searchText, setSearchText] = useState('')
   const [resetPagination, setResetPagination] = useState(false)
   const [showModal, setShowModal] = useState(false)
   const [paramsModalContent, setParamsModalContent] = useState<Array<IAlertDetail>>([{} as IAlertDetail])

   /* carga los datos desde la base de datos para llenar la tabla principal */
   const fetchData = async () => {
      setLoading(true)
      try {
         const response = await MonitoringService.listMonitor({
            itipo,
         })
         setData(response)
         setLoading(false)
      } catch (error) {
         setData([])
         setLoading(false)
      }
   }

   /* se ejecuta solo una vez al montar el componente y establece un intervalo de tiempo para traer los datos con el metodo fetchData */
   useEffect(() => {
      MenuComponent.reinitialization()
      fetchData()
      const interval = setInterval(() => {
         fetchData()
      }, 20000)

      return () => {
         /* elimina el intervlo de tiempo al desmontar el componente */
         clearInterval(interval)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const columnsToSearch = ['fecha', 'client', 'alertseverity', 'ticketid', 'priority', 'hostip', 'description']

   /* busca en todas las filas y colunmas datos que coincidan con el valor de "searchText" y retorna los registros */
   const filteredData = searchText.trim()
      ? data.filter((item) => {
           console.log('render search data')
           for (let column of columnsToSearch) {
              if (!(item[column] as string).toLowerCase().includes(searchText.toLowerCase())) {
                 continue
              } else {
                 return true
              }
           }
           return false
        })
      : data

   /* abre una ventana modal mediante el paso de parametros desde el componente ActionsCell */
   const openModal = (row: any) => {
      const params: Array<IAlertDetail> = [
         {
            itipo: 2,
            client: row.client,
            alertid: row.alertid,
            hostip: row.hostip,
            alertseverity: row.alertseverity,
         },
      ]
      setParamsModalContent(params)
      setShowModal(true)
   }

   return (
      <Context.Provider
         value={{
            filteredData,
            searchText,
            setSearchText,
            resetPagination,
            setResetPagination,
            fetchData,
            showModal,
            setShowModal,
            openModal,
            paramsModalContent,
            loading,
         }}
      >
         <Content />
         <ModalContent />
      </Context.Provider>
   )
}

export { Provider }
