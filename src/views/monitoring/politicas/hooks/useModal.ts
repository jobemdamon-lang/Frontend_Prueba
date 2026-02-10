import { useEffect, useState } from "react"
import { ModalView, ModalSize } from "../Types"

const useModal = () => {
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState("")
  const [modalInformation, setModalInformation] = useState<any>()
  const [fullsize, setfullsize] = useState(false)
  const [sizeModal, setSize] = useState<ModalSize>(ModalSize.XL)

   useEffect(()=>{
    return ()=>{
      setModalInformation("")
    }
  },[])

  /*Funcion para abrir la modal la cual recibe como parametros la vista a mostrar, el tamaño del modal, opcionalmente información  
  que sea pertinente para el modal*/
  const openModal = (view:ModalView , size:ModalSize, information?:any, fullsize?:boolean) => {
    setSize(size)
    setModalView(view)
    setShowModal(true)
    setModalInformation(information)
    setfullsize(fullsize ?? false)
  }
  const closeModal = () => setShowModal(false)
  
  return { openModal, closeModal, showModal, modalView, modalInformation, sizeModal , setModalInformation, fullsize }
}

export { useModal }