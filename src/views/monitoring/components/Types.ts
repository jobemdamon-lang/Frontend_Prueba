export interface IAlertDetail {
   alertid: string
   client: string
   alertseverity: string
   itipo: number
   hostip: string
}

export type IAlertModal = {
   fecha: string
   alertstate: string
   tool: string
   description: string
   itipo: number
   threshold: string
   tags: string
   rulename: string
   rulespace: string
   ruletype: string
   hostip: string
   value: string
}

export interface IAlert {
   idmonitor: string,
   alertid: string,
   client: string,
   ticketid: string,
   ticketstate: string,
   ownergroup: string,
   criticidad: string,
   priority: string,
   alertseverity: string,
   description: string,
   hostip: string,
   incidenturl: string,
   ticketurl: string,
   tool: string,
   fecha: string,
   estado: string,
   alertstate: string,
   alertgroup: string,
   reason: string,
   threshold: string,
   tags: string,
   rulename: string,
   rulespace: string,
   value: string,
   ruletype: string,
   itipo: number
}