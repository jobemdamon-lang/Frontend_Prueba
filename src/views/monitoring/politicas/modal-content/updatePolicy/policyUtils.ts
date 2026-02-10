import uniqid from "uniqid";
import { IListMetricsPolicyVersion, IListMetricsPolicyVersionFront, IMonitoringPolicyVersions, IUpdateListaPolitica } from "../../Types";

export const restructureInformation = (info: IListMetricsPolicyVersion[]) => {
  const dataAgrupada: any = {};

  // Recorremos el array original
  for (const item of info) {
    const familia = item.FAMILIA.toUpperCase();

    // Si la familia aún no existe en el objeto dataAgrupada, la creamos como un array vacío
    if (!dataAgrupada[familia]) {
      dataAgrupada[familia] = [];
    }

    // Agregamos el objeto actual al array correspondiente a su familia y se le asigna un ID a nivel Front
    dataAgrupada[familia].push({ ...item, ID: uniqid() });
  }

  // Convertimos el objeto dataAgrupada en un array de objetos y se le asigna un ID a nivel Front
  const resultadoFinal: IListMetricsPolicyVersionFront[] = Object.keys(dataAgrupada).map((familia) => ({
    ID: uniqid(),
    FAMILIA: familia,
    METRICS: dataAgrupada[familia],
  }))

  return resultadoFinal

}

export const generateRowsOfMetric = (
  updatedMetric: (IListMetricsPolicyVersion & { ID: string }),
  originalMetric: (IListMetricsPolicyVersion & { ID: string }),
  modalInformation: IMonitoringPolicyVersions
) => {
  const updatedMetricstoSend: IUpdateListaPolitica[] = []
  //Si la frecuencia(intervalo) cambia se generaran 1, 2 o 3 registros dependiendo
  if (updatedMetric.FRECUENCIA !== originalMetric.FRECUENCIA) {
    if (originalMetric.WARNING?.ID_DETALLE_POLITICA !== undefined) {
      updatedMetricstoSend.push({
        id_politica: modalInformation.ID_POLITICA,
        id_detalle_politica: updatedMetric.WARNING.ID_DETALLE_POLITICA,
        command_process: updatedMetric.COMMAND_PROCESS || "",
        command_path: updatedMetric.COMMAND_PATH || "",
        estado: 1,
        frecuencia: updatedMetric.FRECUENCIA,
        herramienta_monitoreo: updatedMetric.HERRAMIENTA_MONITOREO,
        id_equipo: updatedMetric.ID_EQUIPO,
        metrica_ruta: updatedMetric.METRICA_RUTA || "",
        metricas: updatedMetric.METRICAS,
        monitoreado_desde: updatedMetric.MONITOREADO_DESDE || "",
        nro_pooleos: updatedMetric.WARNING.NRO_POOLEO || "",
        nro_version: modalInformation.NRO_VERSION,
        observacion: updatedMetric.OBSERVACION || "",
        protocolo: updatedMetric.PROTOCOLO || "",
        puerto: updatedMetric.PUERTO || "",
        servicio_asociado: updatedMetric.SERVICIO_ASOCIADO || "",
        tipo_equipo: updatedMetric.TIPO_EQUIPO || "",
        tipo_monitoreo: updatedMetric.TIPO_MONITOREO || "",
        umbral: updatedMetric.WARNING.VALOR,
        tablespace_name: updatedMetric.TABLESPACE_NAME || "",
        nombre_instancia: updatedMetric.NOMBRE_INSTANCIA || "",
        nro_puerto_instancia: updatedMetric.NRO_PUERTO_INSTANCIA || "",
        nombre_db: updatedMetric.NOMBRE_DB || "",
        nombre_job: updatedMetric.NOMBRE_JOB || "",
        disponibilidad_proceso: updatedMetric.DISPONIBILIDAD_PROCESO || "",
        nombre_interfaz: updatedMetric.NOMBRE_INTERFAZ || "",
        estado_interface: updatedMetric.ESTADO_INTERFACE || "",
        all_replicas: updatedMetric.ALL_REPLICAS || "",
        primary_replicas: updatedMetric.PRIMARY_REPLICAS || "",
        some_replicas: updatedMetric.SOME_REPLICAS || "",
        app_pool: updatedMetric.APP_POOL || "",
        name_web: updatedMetric.NAME_WEB || ""
      })
    }
    if (originalMetric.CRITICAL?.ID_DETALLE_POLITICA !== undefined) {
      updatedMetricstoSend.push({
        id_politica: modalInformation.ID_POLITICA,
        id_detalle_politica: updatedMetric.CRITICAL.ID_DETALLE_POLITICA,
        command_process: updatedMetric.COMMAND_PROCESS || "",
        command_path: updatedMetric.COMMAND_PATH || "",
        estado: 1,
        frecuencia: updatedMetric.FRECUENCIA,
        herramienta_monitoreo: updatedMetric.HERRAMIENTA_MONITOREO,
        id_equipo: updatedMetric.ID_EQUIPO,
        metrica_ruta: updatedMetric.METRICA_RUTA || "",
        metricas: updatedMetric.METRICAS,
        monitoreado_desde: updatedMetric.MONITOREADO_DESDE || "",
        nro_pooleos: updatedMetric.CRITICAL.NRO_POOLEO || "",
        nro_version: modalInformation.NRO_VERSION,
        observacion: updatedMetric.OBSERVACION || "",
        protocolo: updatedMetric.PROTOCOLO || "",
        puerto: updatedMetric.PUERTO || "",
        servicio_asociado: updatedMetric.SERVICIO_ASOCIADO || "",
        tipo_equipo: updatedMetric.TIPO_EQUIPO || "",
        tipo_monitoreo: updatedMetric.TIPO_MONITOREO || "",
        umbral: updatedMetric.CRITICAL.VALOR,
        tablespace_name: updatedMetric.TABLESPACE_NAME || "",
        nombre_instancia: updatedMetric.NOMBRE_INSTANCIA || "",
        nro_puerto_instancia: updatedMetric.NRO_PUERTO_INSTANCIA || "",
        nombre_db: updatedMetric.NOMBRE_DB || "",
        nombre_job: updatedMetric.NOMBRE_JOB || "",
        disponibilidad_proceso: updatedMetric.DISPONIBILIDAD_PROCESO || "",
        nombre_interfaz: updatedMetric.NOMBRE_INTERFAZ || "",
        estado_interface: updatedMetric.ESTADO_INTERFACE || "",
        all_replicas: updatedMetric.ALL_REPLICAS || "",
        primary_replicas: updatedMetric.PRIMARY_REPLICAS || "",
        some_replicas: updatedMetric.SOME_REPLICAS || "",
        app_pool: updatedMetric.APP_POOL || "",
        name_web: updatedMetric.NAME_WEB || ""
      })
    }
    if (originalMetric.FATAL?.ID_DETALLE_POLITICA !== undefined) {
      updatedMetricstoSend.push({
        id_politica: modalInformation.ID_POLITICA,
        id_detalle_politica: updatedMetric.FATAL.ID_DETALLE_POLITICA,
        command_process: updatedMetric.COMMAND_PROCESS || "",
        command_path: updatedMetric.COMMAND_PATH || "",
        estado: 1,
        frecuencia: updatedMetric.FRECUENCIA,
        herramienta_monitoreo: updatedMetric.HERRAMIENTA_MONITOREO,
        id_equipo: updatedMetric.ID_EQUIPO,
        metrica_ruta: updatedMetric.METRICA_RUTA || "",
        metricas: updatedMetric.METRICAS,
        monitoreado_desde: updatedMetric.MONITOREADO_DESDE || "",
        nro_pooleos: updatedMetric.FATAL.NRO_POOLEO || "",
        nro_version: modalInformation.NRO_VERSION,
        observacion: updatedMetric.OBSERVACION || "",
        protocolo: updatedMetric.PROTOCOLO || "",
        puerto: updatedMetric.PUERTO || "",
        servicio_asociado: updatedMetric.SERVICIO_ASOCIADO || "",
        tipo_equipo: updatedMetric.TIPO_EQUIPO || "",
        tipo_monitoreo: updatedMetric.TIPO_MONITOREO || "",
        umbral: updatedMetric.FATAL.VALOR,
        tablespace_name: updatedMetric.TABLESPACE_NAME || "",
        nombre_instancia: updatedMetric.NOMBRE_INSTANCIA || "",
        nro_puerto_instancia: updatedMetric.NRO_PUERTO_INSTANCIA || "",
        nombre_db: updatedMetric.NOMBRE_DB || "",
        nombre_job: updatedMetric.NOMBRE_JOB || "",
        disponibilidad_proceso: updatedMetric.DISPONIBILIDAD_PROCESO || "",
        nombre_interfaz: updatedMetric.NOMBRE_INTERFAZ || "",
        estado_interface: updatedMetric.ESTADO_INTERFACE || "",
        all_replicas: updatedMetric.ALL_REPLICAS || "",
        primary_replicas: updatedMetric.PRIMARY_REPLICAS || "",
        some_replicas: updatedMetric.SOME_REPLICAS || "",
        app_pool: updatedMetric.APP_POOL || "",
        name_web: updatedMetric.NAME_WEB || ""
      })
    }
  } else {
    if (originalMetric.WARNING?.ID_DETALLE_POLITICA !== undefined && (
      originalMetric.WARNING?.NRO_POOLEO !== updatedMetric.WARNING?.NRO_POOLEO ||
      originalMetric.WARNING?.VALOR !== updatedMetric.WARNING?.VALOR ||
      originalMetric.METRICA_RUTA !== updatedMetric.METRICA_RUTA ||
      originalMetric.COMMAND_PROCESS !== updatedMetric.COMMAND_PROCESS ||
      originalMetric.COMMAND_PATH !== updatedMetric.COMMAND_PATH ||
      originalMetric.SERVICIO_ASOCIADO !== updatedMetric.SERVICIO_ASOCIADO ||
      originalMetric.PUERTO !== updatedMetric.PUERTO ||
      originalMetric.PROTOCOLO !== updatedMetric.PROTOCOLO ||
      originalMetric.TABLESPACE_NAME !== updatedMetric.TABLESPACE_NAME ||
      originalMetric.NOMBRE_INSTANCIA !== updatedMetric.NOMBRE_INSTANCIA ||
      originalMetric.NRO_PUERTO_INSTANCIA !== updatedMetric.NRO_PUERTO_INSTANCIA ||
      originalMetric.NOMBRE_DB !== updatedMetric.NOMBRE_DB ||
      originalMetric.NOMBRE_JOB !== updatedMetric.NOMBRE_JOB ||
      originalMetric.DISPONIBILIDAD_PROCESO !== updatedMetric.DISPONIBILIDAD_PROCESO ||
      originalMetric.NOMBRE_INTERFAZ !== updatedMetric.NOMBRE_INTERFAZ ||
      originalMetric.ESTADO_INTERFACE !== updatedMetric.ESTADO_INTERFACE ||
      originalMetric.ALL_REPLICAS !== updatedMetric.ALL_REPLICAS ||
      originalMetric.PRIMARY_REPLICAS !== updatedMetric.PRIMARY_REPLICAS ||
      originalMetric.SOME_REPLICAS !== updatedMetric.SOME_REPLICAS ||
      originalMetric.APP_POOL !== updatedMetric.APP_POOL ||
      originalMetric.NAME_WEB !== updatedMetric.NAME_WEB
    )
    ) {
      updatedMetricstoSend.push({
        id_politica: modalInformation.ID_POLITICA,
        id_detalle_politica: updatedMetric.WARNING.ID_DETALLE_POLITICA,
        command_process: updatedMetric.COMMAND_PROCESS || "",
        command_path: updatedMetric.COMMAND_PATH || "",
        estado: 1,
        frecuencia: updatedMetric.FRECUENCIA,
        herramienta_monitoreo: updatedMetric.HERRAMIENTA_MONITOREO,
        id_equipo: updatedMetric.ID_EQUIPO,
        metrica_ruta: updatedMetric.METRICA_RUTA || "",
        metricas: updatedMetric.METRICAS,
        monitoreado_desde: updatedMetric.MONITOREADO_DESDE || "",
        nro_pooleos: updatedMetric.WARNING.NRO_POOLEO || "",
        nro_version: modalInformation.NRO_VERSION,
        observacion: updatedMetric.OBSERVACION || "",
        protocolo: updatedMetric.PROTOCOLO || "",
        puerto: updatedMetric.PUERTO || "",
        servicio_asociado: updatedMetric.SERVICIO_ASOCIADO || "",
        tipo_equipo: updatedMetric.TIPO_EQUIPO || "",
        tipo_monitoreo: updatedMetric.TIPO_MONITOREO || "",
        umbral: updatedMetric.WARNING.VALOR,
        tablespace_name: updatedMetric.TABLESPACE_NAME || "",
        nombre_instancia: updatedMetric.NOMBRE_INSTANCIA || "",
        nro_puerto_instancia: updatedMetric.NRO_PUERTO_INSTANCIA || "",
        nombre_db: updatedMetric.NOMBRE_DB || "",
        nombre_job: updatedMetric.NOMBRE_JOB || "",
        disponibilidad_proceso: updatedMetric.DISPONIBILIDAD_PROCESO || "",
        nombre_interfaz: updatedMetric.NOMBRE_INTERFAZ || "",
        estado_interface: updatedMetric.ESTADO_INTERFACE || "",
        all_replicas: updatedMetric.ALL_REPLICAS || "",
        primary_replicas: updatedMetric.PRIMARY_REPLICAS || "",
        some_replicas: updatedMetric.SOME_REPLICAS || "",
        app_pool: updatedMetric.APP_POOL || "",
        name_web: updatedMetric.NAME_WEB || ""
      })
    }
    if (originalMetric.CRITICAL?.ID_DETALLE_POLITICA !== undefined && (
      originalMetric.CRITICAL?.NRO_POOLEO !== updatedMetric.CRITICAL?.NRO_POOLEO ||
      originalMetric.CRITICAL?.VALOR !== updatedMetric.CRITICAL?.VALOR ||
      originalMetric.METRICA_RUTA !== updatedMetric.METRICA_RUTA ||
      originalMetric.COMMAND_PROCESS !== updatedMetric.COMMAND_PROCESS ||
      originalMetric.COMMAND_PATH !== updatedMetric.COMMAND_PATH ||
      originalMetric.SERVICIO_ASOCIADO !== updatedMetric.SERVICIO_ASOCIADO ||
      originalMetric.PUERTO !== updatedMetric.PUERTO ||
      originalMetric.PROTOCOLO !== updatedMetric.PROTOCOLO ||
      originalMetric.TABLESPACE_NAME !== updatedMetric.TABLESPACE_NAME ||
      originalMetric.NOMBRE_INSTANCIA !== updatedMetric.NOMBRE_INSTANCIA ||
      originalMetric.NRO_PUERTO_INSTANCIA !== updatedMetric.NRO_PUERTO_INSTANCIA ||
      originalMetric.NOMBRE_DB !== updatedMetric.NOMBRE_DB ||
      originalMetric.NOMBRE_JOB !== updatedMetric.NOMBRE_JOB ||
      originalMetric.DISPONIBILIDAD_PROCESO !== updatedMetric.DISPONIBILIDAD_PROCESO ||
      originalMetric.NOMBRE_INTERFAZ !== updatedMetric.NOMBRE_INTERFAZ ||
      originalMetric.ESTADO_INTERFACE !== updatedMetric.ESTADO_INTERFACE ||
      originalMetric.ALL_REPLICAS !== updatedMetric.ALL_REPLICAS ||
      originalMetric.PRIMARY_REPLICAS !== updatedMetric.PRIMARY_REPLICAS ||
      originalMetric.SOME_REPLICAS !== updatedMetric.SOME_REPLICAS ||
      originalMetric.APP_POOL !== updatedMetric.APP_POOL ||
      originalMetric.NAME_WEB !== updatedMetric.NAME_WEB
    )) {
      updatedMetricstoSend.push({
        id_politica: modalInformation.ID_POLITICA,
        id_detalle_politica: updatedMetric.CRITICAL.ID_DETALLE_POLITICA,
        command_process: updatedMetric.COMMAND_PROCESS || "",
        command_path: originalMetric.COMMAND_PATH || "",
        estado: 1,
        frecuencia: updatedMetric.FRECUENCIA,
        herramienta_monitoreo: updatedMetric.HERRAMIENTA_MONITOREO,
        id_equipo: updatedMetric.ID_EQUIPO,
        metrica_ruta: updatedMetric.METRICA_RUTA || "",
        metricas: updatedMetric.METRICAS,
        monitoreado_desde: updatedMetric.MONITOREADO_DESDE || "",
        nro_pooleos: updatedMetric.CRITICAL.NRO_POOLEO || "",
        nro_version: modalInformation.NRO_VERSION,
        observacion: updatedMetric.OBSERVACION || "",
        protocolo: updatedMetric.PROTOCOLO || "",
        puerto: updatedMetric.PUERTO || "",
        servicio_asociado: updatedMetric.SERVICIO_ASOCIADO || "",
        tipo_equipo: updatedMetric.TIPO_EQUIPO || "",
        tipo_monitoreo: updatedMetric.TIPO_MONITOREO || "",
        umbral: updatedMetric.CRITICAL.VALOR,
        tablespace_name: updatedMetric.TABLESPACE_NAME || "",
        nombre_instancia: updatedMetric.NOMBRE_INSTANCIA || "",
        nro_puerto_instancia: updatedMetric.NRO_PUERTO_INSTANCIA || "",
        nombre_db: updatedMetric.NOMBRE_DB || "",
        nombre_job: updatedMetric.NOMBRE_JOB || "",
        disponibilidad_proceso: updatedMetric.DISPONIBILIDAD_PROCESO || "",
        nombre_interfaz: updatedMetric.NOMBRE_INTERFAZ || "",
        estado_interface: updatedMetric.ESTADO_INTERFACE || "",
        all_replicas: updatedMetric.ALL_REPLICAS || "",
        primary_replicas: updatedMetric.PRIMARY_REPLICAS || "",
        some_replicas: updatedMetric.SOME_REPLICAS || "",
        app_pool: updatedMetric.APP_POOL || "",
        name_web: updatedMetric.NAME_WEB || ""
      })
    }
    if (originalMetric.FATAL?.ID_DETALLE_POLITICA !== undefined && (
      originalMetric.FATAL?.NRO_POOLEO !== updatedMetric.FATAL?.NRO_POOLEO ||
      originalMetric.FATAL?.VALOR !== updatedMetric.FATAL?.VALOR ||
      originalMetric.METRICA_RUTA !== updatedMetric.METRICA_RUTA ||
      originalMetric.COMMAND_PROCESS !== updatedMetric.COMMAND_PROCESS ||
      originalMetric.COMMAND_PATH !== updatedMetric.COMMAND_PATH ||
      originalMetric.SERVICIO_ASOCIADO !== updatedMetric.SERVICIO_ASOCIADO ||
      originalMetric.PUERTO !== updatedMetric.PUERTO ||
      originalMetric.PROTOCOLO !== updatedMetric.PROTOCOLO ||
      originalMetric.TABLESPACE_NAME !== updatedMetric.TABLESPACE_NAME ||
      originalMetric.NOMBRE_INSTANCIA !== updatedMetric.NOMBRE_INSTANCIA ||
      originalMetric.NRO_PUERTO_INSTANCIA !== updatedMetric.NRO_PUERTO_INSTANCIA ||
      originalMetric.NOMBRE_DB !== updatedMetric.NOMBRE_DB ||
      originalMetric.NOMBRE_JOB !== updatedMetric.NOMBRE_JOB ||
      originalMetric.DISPONIBILIDAD_PROCESO !== updatedMetric.DISPONIBILIDAD_PROCESO ||
      originalMetric.NOMBRE_INTERFAZ !== updatedMetric.NOMBRE_INTERFAZ ||
      originalMetric.ESTADO_INTERFACE !== updatedMetric.ESTADO_INTERFACE ||
      originalMetric.ALL_REPLICAS !== updatedMetric.ALL_REPLICAS ||
      originalMetric.PRIMARY_REPLICAS !== updatedMetric.PRIMARY_REPLICAS ||
      originalMetric.SOME_REPLICAS !== updatedMetric.SOME_REPLICAS ||
      originalMetric.APP_POOL !== updatedMetric.APP_POOL ||
      originalMetric.NAME_WEB !== updatedMetric.NAME_WEB
    )) {
      updatedMetricstoSend.push({
        id_politica: modalInformation.ID_POLITICA,
        id_detalle_politica: updatedMetric.FATAL.ID_DETALLE_POLITICA,
        command_process: updatedMetric.COMMAND_PROCESS || "",
        command_path: originalMetric.COMMAND_PATH || "",
        estado: 1,
        frecuencia: updatedMetric.FRECUENCIA,
        herramienta_monitoreo: updatedMetric.HERRAMIENTA_MONITOREO,
        id_equipo: updatedMetric.ID_EQUIPO,
        metrica_ruta: updatedMetric.METRICA_RUTA || "",
        metricas: updatedMetric.METRICAS,
        monitoreado_desde: updatedMetric.MONITOREADO_DESDE || "",
        nro_pooleos: updatedMetric.FATAL.NRO_POOLEO || "",
        nro_version: modalInformation.NRO_VERSION,
        observacion: updatedMetric.OBSERVACION || "",
        protocolo: updatedMetric.PROTOCOLO || "",
        puerto: updatedMetric.PUERTO || "",
        servicio_asociado: updatedMetric.SERVICIO_ASOCIADO || "",
        tipo_equipo: updatedMetric.TIPO_EQUIPO || "",
        tipo_monitoreo: updatedMetric.TIPO_MONITOREO || "",
        umbral: updatedMetric.FATAL.VALOR,
        tablespace_name: updatedMetric.TABLESPACE_NAME || "",
        nombre_instancia: updatedMetric.NOMBRE_INSTANCIA || "",
        nro_puerto_instancia: updatedMetric.NRO_PUERTO_INSTANCIA || "",
        nombre_db: updatedMetric.NOMBRE_DB || "",
        nombre_job: updatedMetric.NOMBRE_JOB || "",
        disponibilidad_proceso: updatedMetric.DISPONIBILIDAD_PROCESO || "",
        nombre_interfaz: updatedMetric.NOMBRE_INTERFAZ || "",
        estado_interface: updatedMetric.ESTADO_INTERFACE || "",
        all_replicas: updatedMetric.ALL_REPLICAS || "",
        primary_replicas: updatedMetric.PRIMARY_REPLICAS || "",
        some_replicas: updatedMetric.SOME_REPLICAS || "",
        app_pool: updatedMetric.APP_POOL || "",
        name_web: updatedMetric.NAME_WEB || ""
      })
    }
  }
  return updatedMetricstoSend
}


export const generateRowsOfMetricTodelete = (
  originalMetric: (IListMetricsPolicyVersion & { ID: string }),
  modalInformation: IMonitoringPolicyVersions
) => {
  const updatedMetricstoSend: IUpdateListaPolitica[] = []
  //Si la frecuencia(intervalo) cambia se generaran 1, 2 o 3 registros dependiendo
  if (originalMetric.WARNING?.ID_DETALLE_POLITICA !== undefined) {
    updatedMetricstoSend.push({
      id_politica: modalInformation.ID_POLITICA,
      id_detalle_politica: originalMetric.WARNING.ID_DETALLE_POLITICA,
      command_process: originalMetric.COMMAND_PROCESS || "",
      estado: 0,
      command_path: originalMetric.COMMAND_PATH || "",
      frecuencia: originalMetric.FRECUENCIA,
      herramienta_monitoreo: originalMetric.HERRAMIENTA_MONITOREO,
      id_equipo: originalMetric.ID_EQUIPO,
      metrica_ruta: originalMetric.METRICA_RUTA || "",
      metricas: originalMetric.METRICAS,
      monitoreado_desde: originalMetric.MONITOREADO_DESDE || "",
      nro_pooleos: originalMetric.NRO_POOLEOS,
      nro_version: modalInformation.NRO_VERSION,
      observacion: originalMetric.OBSERVACION || "",
      protocolo: originalMetric.PROTOCOLO || "",
      puerto: originalMetric.PUERTO || "",
      servicio_asociado: originalMetric.SERVICIO_ASOCIADO || "",
      tipo_equipo: originalMetric.TIPO_EQUIPO || "",
      tipo_monitoreo: originalMetric.TIPO_MONITOREO || "",
      umbral: originalMetric.WARNING.VALOR,
      tablespace_name: originalMetric.TABLESPACE_NAME || "",
      nombre_instancia: originalMetric.NOMBRE_INSTANCIA || "",
      nro_puerto_instancia: originalMetric.NRO_PUERTO_INSTANCIA || "",
      nombre_db: originalMetric.NOMBRE_DB || "",
      nombre_job: originalMetric.NOMBRE_JOB || "",
      disponibilidad_proceso: originalMetric.DISPONIBILIDAD_PROCESO || "",
      nombre_interfaz: originalMetric.NOMBRE_INTERFAZ || "",
      estado_interface: originalMetric.ESTADO_INTERFACE || "",
      all_replicas: originalMetric.ALL_REPLICAS || "",
      primary_replicas: originalMetric.PRIMARY_REPLICAS || "",
      some_replicas: originalMetric.SOME_REPLICAS || "",
      app_pool: originalMetric.APP_POOL || "",
      name_web: originalMetric.NAME_WEB || ""
    })
  }
  if (originalMetric.CRITICAL?.ID_DETALLE_POLITICA !== undefined) {
    updatedMetricstoSend.push({
      id_politica: modalInformation.ID_POLITICA,
      id_detalle_politica: originalMetric.CRITICAL.ID_DETALLE_POLITICA,
      command_process: originalMetric.COMMAND_PROCESS || "",
      command_path: originalMetric.COMMAND_PATH || "",
      estado: 0,
      frecuencia: originalMetric.FRECUENCIA,
      herramienta_monitoreo: originalMetric.HERRAMIENTA_MONITOREO,
      id_equipo: originalMetric.ID_EQUIPO,
      metrica_ruta: originalMetric.METRICA_RUTA || "",
      metricas: originalMetric.METRICAS,
      monitoreado_desde: originalMetric.MONITOREADO_DESDE || "",
      nro_pooleos: originalMetric.NRO_POOLEOS,
      nro_version: modalInformation.NRO_VERSION,
      observacion: originalMetric.OBSERVACION || "",
      protocolo: originalMetric.PROTOCOLO || "",
      puerto: originalMetric.PUERTO || "",
      servicio_asociado: originalMetric.SERVICIO_ASOCIADO || "",
      tipo_equipo: originalMetric.TIPO_EQUIPO || "",
      tipo_monitoreo: originalMetric.TIPO_MONITOREO || "",
      umbral: originalMetric.CRITICAL.VALOR,
      tablespace_name: originalMetric.TABLESPACE_NAME || "",
      nombre_instancia: originalMetric.NOMBRE_INSTANCIA || "",
      nro_puerto_instancia: originalMetric.NRO_PUERTO_INSTANCIA || "",
      nombre_db: originalMetric.NOMBRE_DB || "",
      nombre_job: originalMetric.NOMBRE_JOB || "",
      disponibilidad_proceso: originalMetric.DISPONIBILIDAD_PROCESO || "",
      nombre_interfaz: originalMetric.NOMBRE_INTERFAZ || "",
      estado_interface: originalMetric.ESTADO_INTERFACE || "",
      all_replicas: originalMetric.ALL_REPLICAS || "",
      primary_replicas: originalMetric.PRIMARY_REPLICAS || "",
      some_replicas: originalMetric.SOME_REPLICAS || "",
      app_pool: originalMetric.APP_POOL || "",
      name_web: originalMetric.NAME_WEB || ""
    })
  }
  if (originalMetric.FATAL?.ID_DETALLE_POLITICA !== undefined) {
    updatedMetricstoSend.push({
      id_politica: modalInformation.ID_POLITICA,
      id_detalle_politica: originalMetric.FATAL.ID_DETALLE_POLITICA,
      command_process: originalMetric.COMMAND_PROCESS || "",
      command_path: originalMetric.COMMAND_PATH || "",
      estado: 0,
      frecuencia: originalMetric.FRECUENCIA,
      herramienta_monitoreo: originalMetric.HERRAMIENTA_MONITOREO,
      id_equipo: originalMetric.ID_EQUIPO,
      metrica_ruta: originalMetric.METRICA_RUTA || "",
      metricas: originalMetric.METRICAS,
      monitoreado_desde: originalMetric.MONITOREADO_DESDE || "",
      nro_pooleos: originalMetric.NRO_POOLEOS,
      nro_version: modalInformation.NRO_VERSION,
      observacion: originalMetric.OBSERVACION || "",
      protocolo: originalMetric.PROTOCOLO || "",
      puerto: originalMetric.PUERTO || "",
      servicio_asociado: originalMetric.SERVICIO_ASOCIADO || "",
      tipo_equipo: originalMetric.TIPO_EQUIPO || "",
      tipo_monitoreo: originalMetric.TIPO_MONITOREO || "",
      umbral: originalMetric.FATAL.VALOR,
      tablespace_name: originalMetric.TABLESPACE_NAME || "",
      nombre_instancia: originalMetric.NOMBRE_INSTANCIA || "",
      nro_puerto_instancia: originalMetric.NRO_PUERTO_INSTANCIA || "",
      nombre_db: originalMetric.NOMBRE_DB || "",
      nombre_job: originalMetric.NOMBRE_JOB || "",
      disponibilidad_proceso: originalMetric.DISPONIBILIDAD_PROCESO || "",
      nombre_interfaz: originalMetric.NOMBRE_INTERFAZ || "",
      estado_interface: originalMetric.ESTADO_INTERFACE || "",
      all_replicas: originalMetric.ALL_REPLICAS || "",
      primary_replicas: originalMetric.PRIMARY_REPLICAS || "",
      some_replicas: originalMetric.SOME_REPLICAS || "",
      app_pool: originalMetric.APP_POOL || "",
      name_web: originalMetric.NAME_WEB || ""
    })
  }

  return updatedMetricstoSend
}

export const metricas_campos = {
  'Uso de filesystem': ['METRICA_RUTA'],
  'Disponibilidad de servicio': ['SERVICIO_ASOCIADO', 'COMMAND_PROCESS'],
  'Puertos': ['PROTOCOLO', 'PUERTO'],
  'Tablespace utilization': ['TABLESPACE_NAME'],
  'Transaction Log': ['NOMBRE_INSTANCIA', 'NRO_PUERTO_INSTANCIA'],
  'MSSQL DB State': ['NOMBRE_DB'],
  'MSSQL Job: Failed to run' : ['NOMBRE_JOB'],
  'Disponibilidad de proceso' : ['DISPONIBILIDAD_PROCESO', 'COMMAND_PATH'],
  'Disponibilidad de interface' : ['NOMBRE_INTERFAZ'],
  'Estado de Interface' : ['ESTADO_INTERFACE'],
  'MSSQL AG - All replicas unhealthy': ['ALL_REPLICAS'],
  'MSSQL AG - Primary replica recovery health in progress': ['PRIMARY_REPLICAS'],
  'MSSQL AG - Some replicas unhealthy': ['SOME_REPLICAS'],
  'IIS: Application Pool': ['APP_POOL'],
  'Last error message of scenario Availability Web': ['NAME_WEB'],
  'Cert: SSL certificate expires soon': ['NAME_WEB'],
  'Cert: SSL certificate is invalid': ['NAME_WEB'],
  'DEFAULT': ['METRICAS']
}
