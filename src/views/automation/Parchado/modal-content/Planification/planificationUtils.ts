import { transformDate } from "../../../../../helpers/general";
import { IGroupPlanification, IPlanification } from "../../../Types";

export const reestructureInformation = (planifications: IPlanification[]): any[] => {
  return planifications?.map((planification: IPlanification) => {
    return {
      id: planification.ID_PLANIFICACION,
      allDay: planification.all_day === 1 ? true : false,
      title: planification.grupo,
      color: planification.ejecutado === 1 ? "#DF826C" : "#8ADAB2",
      idgroup: planification.ID_GRUPO,
      start: transformDate(planification.FECHA_INICIO),
      end: transformDate(planification.FECHA_FIN)
    }
  })
}

export const extractGroups = (planifications: IPlanification[]): IGroupPlanification[] => {
  const groupMap = new Map<number, IGroupPlanification>();

  planifications?.forEach(planification => {
    const groupId = planification.ID_GRUPO

    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, {
        ID_GRUPO: groupId,
        NOMBRE_GRUPO: planification.grupo
      });
    }
  });

  return Array.from(groupMap.values());
};