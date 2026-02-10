import { useEffect, useState } from "react"
import { ModalView, ModalSize } from "../components/politicas/Types"

const useModal = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState("")
  const [modalInformation, setModalInformation] = useState<any>()
  const [sizeModal, setSize] = useState<ModalSize>(ModalSize.XL)

  const refreshTask = (newTasks:any)=>{
    setModalInformation((prev:any)=> {
      return {
        ...prev,
        tareas: newTasks
      }
    })
  }
  useEffect(()=>{
    return ()=>{
      setModalInformation("")
    }
  },[])

  /*Funcion para abrir la modal la cual recibe como parametros la vista a mostrar, el tamaño del modal, opcionalmente información  
  que sea pertinente para el modal*/
  //Se agrego un cuarto parametro solo usado para la vista REQUEST_CHANGE_DETAIL al tener elegir si mostrar el segundo contenido
  const openModal = (view:ModalView , size:ModalSize, information?:any) => {
    setSize(size)
    setModalView(view)
    setShowModal(true)
    setModalInformation(information)
  }
  const closeModal = () => setShowModal(false)
  
  return { openModal, closeModal, showModal, modalView, modalInformation, sizeModal , setModalInformation, refreshTask }
}

export { useModal }