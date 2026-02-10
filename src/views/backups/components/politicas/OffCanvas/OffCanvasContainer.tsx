import { Offcanvas } from "react-bootstrap"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../../../store/ConfigStore"
import { closeOffCanvas } from "../../../../../store/offcanvasSlice"
import { RequestNotifications } from "./RequestNotifications"


const OffCanvasContainer = () => {

  const isCanvasOpen = useSelector<RootState>(({ offCanvas }) => offCanvas.isOffCanvasOpen, shallowEqual)
  const dispatch = useDispatch()

  return (
    <Offcanvas show={isCanvasOpen} onHide={() => dispatch(closeOffCanvas())} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Mis Solicitudes</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <RequestNotifications/>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
export { OffCanvasContainer }