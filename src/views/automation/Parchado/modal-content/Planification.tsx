import { useEffect, useRef, useState } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { useWindowsPatchContext } from "../Context"
import { ModalSize } from "../../../../hooks/Types"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { Card } from "../../../../components/Card";
import uniqid from 'uniqid';
import { EventClickArg, EventSourceInput } from "@fullcalendar/core";
import { ICreatePlanification, IPlanification, ModalView } from "../../Types";
import { reestructureInformation } from "./Planification/planificationUtils";
import { Modal } from "react-bootstrap";
import { useModal } from "../../../../hooks/useModal";
import { DeletePlanificationConfirm } from "./Planification/DeletePlanificationConfirm";
import { LoadingTable } from "../../../../components/loading/LoadingTable";
import { useTypedSelector } from "../../../../store/ConfigStore";

const Planification = () => {

  const calendarRef = useRef<InstanceType<typeof FullCalendar>>(null)
  const userName = useTypedSelector(({ auth }) => auth.usuario)
  const { modalHook, selectedOwners, planificationHook, groupHook, } = useWindowsPatchContext()
  const [calendarEvents, setCalendarEvents] = useState<EventSourceInput | undefined>([])
  const planificationModalFunctions = useModal()

  const handleList = () => {
    planificationHook.getListPlanification({ cliente: selectedOwners.cliente, id_proyecto: 0 }).then((planifications: IPlanification[]) => {
      setCalendarEvents(reestructureInformation(planifications))
    })
  }
  useEffect(() => {
    handleList()
    groupHook.getListGroups('WINDOWS')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // load external events
  useEffect(() => {
    let draggableEl: any = document.getElementById("external-events");
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        return {
          id: uniqid(),
          idgroup: eventEl.getAttribute("data-idgroup"),
          title: eventEl.getAttribute("title"),
          color: eventEl.getAttribute("data-color"),
          create: true
        };
      }
    });
    return () => draggable.destroy();
  }, []);

  // handle event receive a info https://fullcalendar.io/docs/eventReceive
  const handleEventReceive = (eventInfo: any) => {
    const newEvent: any = {
      id: eventInfo.event.id,
      allDay: eventInfo.event.allDay,
      title: eventInfo.event.title,
      color: eventInfo.draggedEl.getAttribute("data-color"),
      idgroup: eventInfo.event.extendedProps.idgroup,
      start: eventInfo.event.startStr,
      end: eventInfo.event.endStr,
    };
    setCalendarEvents((prev: any) => ([...prev, newEvent]));
  };

  const handleEventClick = (eventExternal: EventClickArg) => {
    planificationModalFunctions.openModal(ModalView.CONFIRM_DELETE_PLANIFICATION, ModalSize.SM, undefined,
      {
        idPlanification: eventExternal.event.id,
        setCalendarEvents: setCalendarEvents,
        handleList: handleList
      })
  }

  const saveEvents = () => {
    if (calendarRef.current !== null) {
      const calendarApi = calendarRef.current.getApi()
      const events = calendarApi.getEvents()
      let finalEvents: ICreatePlanification[] = events.map(event => ({
        all_day: event.allDay ? 1 : 0,
        ejecutado: 0,
        estado: 1,
        fecha_inicio: event.startStr,
        fecha_fin: event.endStr,
        id_planificacion: isNaN(Number(event.id)) ? 0 : parseInt(event.id),
        id_grupo: parseInt(event.extendedProps.idgroup),
        usuario: userName
      }))
      planificationHook.savePlanification(finalEvents).then(succes => {
        if (succes) modalHook.closeModal()
      })
    }
  }

  return (
    <>
      <div className='modal-header py-4 bg-dark'>
        <h2 className="text-white">PLANIFICACION DE PARCHADOS</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body px-lg-10'>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4">
              <Card
                cardTitle="GRUPOS"
                className="mb-5"
                cardDetail="Lista de Grupos Disponibles"
                bodyId="external-events"
                bodyclassName="d-flex flex-column flex-grow justify-content-center w-100"
              >
                {groupHook.getListGroupsLoading ?
                  <div className="d-flex justify-content-center">
                    <i className="fs-5">Cargando..</i>
                  </div> :
                  groupHook.groupsData.length === 0 ?
                    <div className="d-flex justify-content-center">
                      <i className="fs-5">No existen registros.</i>
                    </div>
                    :
                    groupHook.groupsData.map((event) => (
                      <div
                        className="fc-event fc-h-event mb-1 fc-daygrid-event fc-daygrid-block-event p-2"
                        title={event.NOMBRE}
                        data-idgroup={event.ID_GRUPO}
                        data-color="#8ADAB2"
                        key={event.ID_GRUPO}
                        style={{
                          backgroundColor: "#8ADAB2",
                          borderColor: "#8ADAB2",
                          cursor: "pointer"
                        }}
                      >
                        <div className="fc-event-main">
                          <strong>{event.NOMBRE}</strong>
                        </div>
                      </div>
                    ))
                }
              </Card>
              <button
                className="btn btn-success"
                onClick={() => saveEvents()}
                disabled={planificationHook.savePlanificationLoading}
              >
                {planificationHook.savePlanificationLoading ? "Guardando" : "Guardar Planificacion"}
              </button>
            </div>
            <div className="col-12 col-md-8 ">
              <div className="card card-dashed card-custom card-stretch shadow p-5" style={{ position: 'relative' }}>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                  }}
                  initialView="dayGridMonth"
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  ref={calendarRef}
                  eventClick={(e) => { handleEventClick(e) }}
                  weekends={true}
                  events={calendarEvents}
                  droppable={true}
                  eventReceive={handleEventReceive}
                />
                {planificationHook.listPlanificationLoading && <LoadingTable description='Cargando Fechas...' />}
              </div>
            </div>
          </div>
        </div>
        <Modal
          id='kt_modal_create_app'
          size={planificationModalFunctions.sizeModal || "xl"}
          tabIndex={-1}
          fullscreen={planificationModalFunctions.wantFullSize ? "true" : "false"}
          aria-hidden='true'
          dialogClassName='modal-dialog modal-dialog-centered'
          show={planificationModalFunctions.showModal}
        >
          {planificationModalFunctions.modalView === ModalView.CONFIRM_DELETE_PLANIFICATION && <DeletePlanificationConfirm planificationModalFunctions={planificationModalFunctions} />}
        </Modal>
      </div>
    </>
  )
}
export { Planification }

