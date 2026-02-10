import { ITrackedTicket, IUpdateIncident } from "../../../Types";

export const transformStructureOfData = (incident: ITrackedTicket): IUpdateIncident => {
    return {
        acciones_tomadas: incident.ACCIONES_TOMADAS ?? "",
        alerta: incident.ALERTA ?? "",
        cliente: incident.CLIENTE ?? "",
        avance_ticket_sad: incident.AVANCE_TICKET_SAD ?? "",
        bajo_prioridad: incident.BAJO_PRIORIDAD ?? "",
        crq_wo: incident.CRQ_WO ?? "",
        descripcion: incident.DESCRIPCION,
        desviaciones: incident.DESVIACIONES ?? "",
        duracion: incident.DURACION ?? "",
        estado_incidente: incident.ESTADO_INCIDENTE ?? "",
        escalo_incidente: incident.ESCALO_INCIDENTE ?? "",
        estado: incident.ESTADO ?? 1,
        estado_incidente_id: incident.ESTADO_INCIDENTE_ID ?? 1,
        fecha_creacion: incident.FECHA_CREACION ?? "",
        fecha_modificacion: incident.FECHA_MODIFICACION ?? "",
        fin_indisponibilidad: incident.FIN_INDISPONIBILIDAD ?? "",
        id_incidente: incident.ID_INCIDENTE,
        impacto_negocio_posibles_consecuencias: incident.IMPACTO_NEGOCIO_POSIBLES_CONSECUENCIAS ?? "",
        incident: incident.INCIDENT ?? "",
        inicio_indisponibilidad: incident.INICIO_INDISPONIBILIDAD?.toString() ?? "",
        jp_gp: incident.JP_GP ?? "",
        nro_ticket: incident.NRO_TICKET,
        numero_ticket_sad: incident.NUMERO_TICKET_SAD ?? "",
        observacion_capa_gestion: incident.OBSERVACION_CAPA_GESTION ?? "",
        observacion_coordinador: incident.OBSERVACION_COORDINADOR ?? "",
        observacion_crisis_manager: incident.OBSERVACION_CRISIS_MANAGER ?? "",
        observacion_especialista: incident.OBSERVACION_ESPECIALISTA ?? "",
        otros_clientes_afectados: incident.OTROS_CLIENTES_AFECTADOS ?? "",
        parcial_total: incident.PARCIAL_TOTAL ?? "",
        participo: incident.PARTICIPO ?? "",
        perdida_sla_penalidades: incident.PERDIDA_SLA_PENALIDADES ?? "",
        pm_p1: incident.PM_P1 ?? "",
        porque_no_salio_alerta: incident.PORQUE_NO_SALIO_ALERTA ?? "",
        resumen: incident.RESUMEN ?? "",
        servicio_aplicativo_impactado: incident.SERVICIO_APLICATIVO_IMPACTADO ?? "",
        supervisor: incident.SUPERVISOR ?? "",
        usuario_creacion: incident.USUARIO_CREACION ?? "",
        usuario_modificacion: incident.USUARIO_MODIFICACION ?? "",
        conclusion: incident.CONCLUSION ?? "",
        sintoma: incident.SINTOMA ?? "",
    }

}

export const convertDateFormat = (inputDate: string) => {
    const [datePart, timePart] = inputDate.split(' ');

    const [hours, minutes,] = timePart.split(':');
    const [year, month, day] = datePart.split('-');

    const convertedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
    return convertedDate;
}