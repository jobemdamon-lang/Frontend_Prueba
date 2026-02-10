import { useEffect, useState } from "react"
import { IModalFunctions, ModalSize } from "./Types"

const useModal = ():IModalFunctions => {

  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState("")
  const [wantFullSize, setWantFullSize] = useState<true | undefined | string>(undefined)
  const [modalInformation, setModalInformation] = useState<any>()
  const [sizeModal, setSize] = useState<ModalSize>(ModalSize.XL)

  //Cada vez que el componente Modal se desmonta de resetea la información del Modal
  useEffect(() => {
    return () => { setModalInformation("") }
  }, [])

  /*Funcion para abrir la modal la cual recibe como parametros la vista a mostrar, el tamaño del modal, 
  opcionalmente si se quiere que sea FullZise y la información que sea pertinente para el modal*/
  const openModal = (view: string, size: ModalSize, wantFullSize?: true | string | undefined, information?: any) => {
    setWantFullSize(wantFullSize ? true : undefined)
    setSize(size)
    setModalView(view)
    setShowModal(true)
    setModalInformation(information)
  }
  const closeModal = () => setShowModal(false)
  const updateInformatioModal = (information: any) => setModalInformation(information)

  return { openModal, closeModal, showModal, modalView, modalInformation, sizeModal, wantFullSize, updateInformatioModal }
}

export { useModal }