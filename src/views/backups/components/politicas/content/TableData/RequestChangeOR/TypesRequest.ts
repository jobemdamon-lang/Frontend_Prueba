//Formato de la data de la API GET::Listar Solicitudes de Cambio
export interface IDataRowRequestChanges {
  actor_actual?: string | null,
  actor_siguiente?: string | null,
  etapa?: string | null,
  fecha_actualizacion?: string | null,
  fecha_registro?: string | null,
  motivo?: string,
  id_solicitud?: number | null,
  solicitante?: string,
  tipo_sol?: string,
  nro_ticket: number | null
}