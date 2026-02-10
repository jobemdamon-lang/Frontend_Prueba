import { cloneDeep } from "lodash";
import { ICategories, IGroupsWithServersWithPatches, IGroupsWithServersWithPatchesFront, IGroupsWithServersWithPatchesUpdate, IListConfigListaProg, IPatchesInServer, IPatchesInServerFront, IPatchesInServerUpdate, IServerInGroup, IServerInGroupFront, IServerInGroupUpdate } from "../../../Types";

/*Función que te reestructura la data del request /parchado/obtener_grupos_servidor_parche que tiene el formato IGroupsWithServersWithPatches
 al formato IGroupsWithServersWithPatchesFront para su utilización en el Front, se añade check para inputs y razon de uncheck*/
export function transformFormat(originalFormat: IGroupsWithServersWithPatches[]): IGroupsWithServersWithPatchesFront[] {
  return originalFormat.map((group: IGroupsWithServersWithPatches) => {
    return (
      {
        ...group,
        CHECK: false,
        SERVIDORES: group.SERVIDORES.map((server: IServerInGroup) => {
          return (
            {
              ...server,
              PARCHES: server.PARCHES.map((patche: IPatchesInServer) => {
                return (
                  {
                    ...patche,
                    CHECK: patche.CATEGORIES === 'Security Updates' ? true : false,
                    UNCHECK_REASON: ""
                  }
                )
              })
            }
          )
        })
      }
    )
  })
}

//Funcion que fusiona la data de la configuracion con los grupos faltantes en la configuración
export function conciliateInfoGroupAndConfiguration(originalGroupServerPatche: IGroupsWithServersWithPatches[], configuration: IGroupsWithServersWithPatchesUpdate[]): IGroupsWithServersWithPatchesFront[] {
  //Se obtienen los grupos no configurados y se formatean para uso en front
  const groupsNotConfigured: IGroupsWithServersWithPatchesFront[] = originalGroupServerPatche
    .filter((group: IGroupsWithServersWithPatches) => {
      return !configuration.map(cgroup => cgroup.ID_GRUPO).includes(group.ID_GRUPO)
    })
    .map((group: IGroupsWithServersWithPatches) => {
      return (
        {
          ...group,
          CHECK: false,
          SERVIDORES: group.SERVIDORES.map((server: IServerInGroup) => {
            return (
              {
                ...server,
                PARCHES: server.PARCHES.map((patche: IPatchesInServer) => {
                  return (
                    {
                      ...patche,
                      CHECK: true,
                      UNCHECK_REASON: ""
                    }
                  )
                })
              }
            )
          })
        }
      )
    })

  //Se formatean los grupos configurados y se les añade los servidores no configurados
  const configuredGroupsWithFormat: IGroupsWithServersWithPatchesFront[] = configuration.map((group: IGroupsWithServersWithPatchesUpdate) => {
    return (
      {
        ...group,
        CHECK: true,
        SERVIDORES: [
          ...extractServerNotInConfiguration(
            originalGroupServerPatche.find(ogroup => ogroup.ID_GRUPO === group.ID_GRUPO)?.SERVIDORES ?? [], group.SERVIDORES
          ),
          ...group.SERVIDORES.map((server: IServerInGroupUpdate) => {
            //falta agregar los servidores que no estan en la configuracion
            return (
              {
                ...server,
                PARCHES: server.PARCHES.map((patche: IPatchesInServerUpdate) => {
                  return (
                    {
                      ...patche,
                      CHECK: patche.CHECK_INSTALL === 0 ? false : true,
                      //No es necesario establecer su razon original ya que el back se fija si !is_selecionado no lo actualiza
                      UNCHECK_REASON: patche.MOTIVO ?? ""
                    }
                  )
                })
              }
            )
          })]
      }
    )
  })
  return [...groupsNotConfigured, ...configuredGroupsWithFormat]
}

//Funcion usada dentro de conciliateInfoGroupAndConfiguration para extrarer los servidores no conf. en los grupos configurados
function extractServerNotInConfiguration(serversInGroup: IServerInGroup[], serversInConfiguration: IServerInGroupUpdate[]): IServerInGroupFront[] {
  return serversInGroup.filter((server: IServerInGroup) => {
    return !serversInConfiguration.map(cserver => cserver.ID_EQUIPO).includes(server.ID_EQUIPO)
  }).map((server: IServerInGroup) => {
    return (
      {
        ...server,
        PARCHES: server.PARCHES.map((patche: IPatchesInServer) => {
          return (
            {
              ...patche,
              CHECK: true,
              UNCHECK_REASON: ""
            }
          )
        })
      }
    )
  })
}

//Función que cambia el estado del Check del grupo
export function UnCheckGroup(actualState: IGroupsWithServersWithPatchesFront[], groupIndex: number): IGroupsWithServersWithPatchesFront[] {
  const newState = cloneDeep(actualState)
  //Se cambia el estado a uno contrario true <--> false
  newState[groupIndex].CHECK = !newState[groupIndex].CHECK
  //Adicionalmente si se uncheckea se resetea sus parches a true
  if (newState[groupIndex].CHECK === false) {
    newState[groupIndex].SERVIDORES.forEach(server => {
      server.PARCHES.forEach(patch => {
        patch.CHECK = true
        patch.UNCHECK_REASON = ""
      })
    })
  }
  return newState
}

// Función para manejar el cambio de check de un parche
export function unCheckPatche(
  actualState: IGroupsWithServersWithPatchesFront[],
  grupoIndex: number,
  servidorIndex: number,
  parcheIndex: number,
  reason: string = ""
) {
  const newState = cloneDeep(actualState.filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK))

  newState[grupoIndex].SERVIDORES[servidorIndex].PARCHES[parcheIndex].CHECK = !newState[grupoIndex].SERVIDORES[servidorIndex].PARCHES[parcheIndex].CHECK
  newState[grupoIndex].SERVIDORES[servidorIndex].PARCHES[parcheIndex].UNCHECK_REASON = reason
  return newState;
};

//Funcion para extraer las categorias unicas de todos los parches
export function extractUniqueCategories(groupsServersPatchesFront: IGroupsWithServersWithPatchesFront[]): ICategories[] {

  //Aplana el arr de varios niveles a un solo nivel con los parches de todos los servidores de solo los grupos seleccionados
  const allPatches = groupsServersPatchesFront
    .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
    .flatMap(group =>
      group.SERVIDORES.flatMap(server => server.PARCHES)
    );

  const uniqueCategories = allPatches?.reduce((categoriesArr: ICategories[], patch: IPatchesInServerFront) => {
    //Si la categoria del parche no existe se añade al arr de categorias
    console.log(patch.CATEGORIES)
    if (!categoriesArr.some(category => category.categoryName?.includes(patch?.CATEGORIES))) {
      categoriesArr.push({ categoryName: patch.CATEGORIES, checked: patch?.CHECK });
    } else {
      //Caso contrario si ya existe establece su nuevo valor del check en base al valor actual y el que viene
      let idx = categoriesArr.findIndex(ac => ac.categoryName === patch.CATEGORIES) ?? 0
      if (idx !== -1) {
        categoriesArr[idx].checked = [categoriesArr[idx]?.checked ?? true, patch.CHECK]?.some(patch => patch === true) ?? true
      }
    }
    return categoriesArr;
  }, []);

  return uniqueCategories
}

//Funcion para manejar el cambio a check por nombre de categorias 
export function unCheckPatcheByCategory(
  actualState: IGroupsWithServersWithPatchesFront[],
  category_name: string,
  reason: string = "",
  nextChecked: boolean
) {
  return actualState
    .filter((group: IGroupsWithServersWithPatchesFront) => group.CHECK)
    .map((group: IGroupsWithServersWithPatchesFront) => ({
      ...group,
      SERVIDORES: group.SERVIDORES.map((server: IServerInGroupFront) => ({
        ...server,
        PARCHES: server.PARCHES.map((patche: IPatchesInServerFront) => {
          if (patche.CATEGORIES === category_name) {
            return {
              ...patche,
              CHECK: nextChecked,
              UNCHECK_REASON: reason
            };
          }
          return patche;
        })
      }))
    }));
}

export function resumeDataNeccesary(lista_programacion: IGroupsWithServersWithPatchesFront[]): IListConfigListaProg[] {
  return lista_programacion.map(group => (
    {
      id_grupo: group.ID_GRUPO,
      lista_servidores: group.SERVIDORES.map(server => ({
        id_servidor: server.ID_EQUIPO,
        lista_parches: server.PARCHES.map(patche => ({
          id_parche: patche.ID_PARCHE,
          seleccionado: patche.CHECK ? 1 : 0,
          motivo: patche.UNCHECK_REASON ?? ""
        }))
      }))
    }
  ))
}

export function extractOnlyIds(lista_programacion: IGroupsWithServersWithPatchesFront[]): string {
  return lista_programacion.flatMap(element => element.SERVIDORES).map((server) => server.ID_EQUIPO).join(",")
}

