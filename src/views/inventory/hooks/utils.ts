import { IComboData, IDataListProject } from "../../../helpers/Types";
import { ICombinedAttribute, IConfigurationItem, IDynamicAttOnSubmit, IDynamicAttribute, IFamiliesCard, IUpdateDynamicAttribute, IUpdateGeneralInformation, IValueOnSubmitDynamicForm, AuditData, IteracionAplanada, Cambio } from "../Types";

export const changeFormatToSendUpdate = (configurationItem: IConfigurationItem, modificatorUser: string): IUpdateGeneralInformation => {
    const formatedData: IUpdateGeneralInformation = {
        id_equipo: configurationItem.ID_EQUIPO,
        tipo_alcance: configurationItem.TIPO_ALCANCE || '',
        nombre: configurationItem.NOMBRE || '',
        familia: configurationItem.FAMILIA_REAL || '',
        clase: configurationItem.CLASE_REAL || '',
        rol_uso: configurationItem.ROL_USO || '',
        vcenter: configurationItem.VCENTER || '',
        administrador: configurationItem.ADMINISTRADOR || '',
        equipo_estado: configurationItem.EQUIPO_ESTADO || '',
        prioridad: configurationItem.PRIORIDAD || '',
        tipo_servicio: configurationItem.TIPO_SERVICIO || '',
        ubicacion: configurationItem.UBICACION || '',
        ambiente: configurationItem.AMBIENTE || '',
        id_proyecto: configurationItem.PROYECTO || '',
        crq_alta: configurationItem.CRQ_ALTA || '',
        nombre_virtual: configurationItem.NOMBRE_VIRTUAL || '',
        tipo_equipo: configurationItem.TIPO_EQUIPO || '',
        backups: configurationItem.BACKUPS || '',
        monitoreo: configurationItem.MONITOREO || '',
        backups_cloud: configurationItem.BACKUPS_CLOUD || '',
        monitoreo_cloud: configurationItem.MONITOREO_CLOUD || '',
        usuario: modificatorUser,
        alp: configurationItem.ALP || "",
        nombre_ci: configurationItem.NOMBRE_CI || "",
        servicio_negocio: configurationItem.SERVICIO_NEGOCIO || "",
        ticket_baja: configurationItem.TICKET_BAJA || "",
        sede_cliente: configurationItem.SEDE_CLIENTE || ""
    };
    return formatedData;
};

export const getNameProjectByID = (data: IDataListProject[], id: string): string => {
    return data.find(project => project.id.toString() === id)?.value ?? ""
}

export const getIdProyectByName = (data: IDataListProject[], nameProject: string): number => {
    return data.find(project => project.value === nameProject)?.id ?? 0
}


export function combinarRegistros(atributos: IDynamicAttribute[]): ICombinedAttribute[] {
    const atributosAgrupados: ICombinedAttribute[] = [];

    // Agrupar los registros por nombre de atributo
    atributos.forEach((atributo) => {
        const { NombreAtributo, ATRIBUTO } = atributo;
        const idx = atributosAgrupados.findIndex(att => att.NombreAtributo === NombreAtributo)
        if (idx === -1) {
            atributosAgrupados.push({
                ATRIBUTO: atributo.ATRIBUTO,
                NombreAtributo: atributo.NombreAtributo,
                HIJOS: [atributo]
            })
        } else {
            if (ATRIBUTO === "MULTIPLE") {
                atributosAgrupados[idx].HIJOS.push(atributo)
            }
        }
    });

    return atributosAgrupados;
}

export const buildAttOfFormFromEventTarget = (formElements: HTMLFormControlsCollection) => {

    const elements: IValueOnSubmitDynamicForm[] = [];

    for (let i = 0; i < formElements.length; i++) {
        const input = formElements[i] as HTMLInputElement;
        // Obtener los atributos data-* del elemento
        const dataAttributes: IDynamicAttOnSubmit = {} as IDynamicAttOnSubmit;

        for (let j = 0; j < input.attributes.length; j++) {
            const attr = input.attributes[j];
            if (attr.name.startsWith("data-")) {
                dataAttributes[attr.name as keyof IDynamicAttOnSubmit] = attr.value;
            }
        }

        // Agregar el nombre, valor y atributos data-* al array
        elements.push({
            name: input.name,
            value: input.value,
            dataAttributes: dataAttributes
        });
    }

    const filteredElements = elements.filter(element => element.name.includes('input-') || element.name.includes('select-'))
    return filteredElements
}

export const makeBodyForDynamicAttUpdate = (modalInformation: IConfigurationItem, dynamicValuesOfAttributes: ICombinedAttribute[], attribute: IValueOnSubmitDynamicForm): IUpdateDynamicAttribute | undefined => {

    const { name: nameAttribute, value: valueAttribute, dataAttributes } = attribute

    //El name del tag input puede ser input-.. o select-..., se extrae solo el nombre del atributo que usa como name.
    const nameAttributeArr = nameAttribute.split("-")
    const nameAttributeCleaned = nameAttributeArr.slice(1).join("-")

    const attributeWithAllInfo = dynamicValuesOfAttributes.find(att => att.NombreAtributo === nameAttributeCleaned)

    if (attributeWithAllInfo) {
        //En el caso de SIMPLE y LISTA, HIJOS solo tendrá un elemento ya que el nombre del atributo es único, MULTIPLE pueden ser varios
        if (attributeWithAllInfo.ATRIBUTO === 'SIMPLE') {
            //const isValueAttDifference = attributeWithAllInfo.HIJOS[0].VALOR_SIMPLE === valueAttribute.toString()
            return {
                id_value_attribute: parseInt(dataAttributes["data-id-value"] ?? "0"),
                value: valueAttribute,
                idoption: 0,
                idmetadata: parseInt(dataAttributes["data-id-attribute"]),
                type_attribute: attributeWithAllInfo.ATRIBUTO,
                state: 1
            }
        } else if (attributeWithAllInfo.ATRIBUTO === 'MULTIPLE') {
            return {
                id_value_attribute: parseInt(dataAttributes["data-id-value"] ?? "0"),
                value: valueAttribute,
                idoption: 0,
                idmetadata: parseInt(dataAttributes["data-id-attribute"]),
                type_attribute: attributeWithAllInfo.ATRIBUTO,
                state: parseInt(dataAttributes["data-state"] ?? "0")
            }

        } else if (attributeWithAllInfo.ATRIBUTO === 'LISTA') {
            //Se busca el id_option del valor que selecciono el usuario, si no lo encuentra por x razón, se envia el original
            const OptionSelected = attributeWithAllInfo.HIJOS[0].LISTA_OPCIONES?.find(valueOption => valueOption.VALOR === valueAttribute)
            return {
                id_value_attribute: parseInt(dataAttributes["data-id-value"] ?? "0"),
                value: "",
                idoption: OptionSelected?.IDOPCION ?? attributeWithAllInfo.HIJOS[0].ID_VALOR_LISTA ?? 0,
                idmetadata: parseInt(dataAttributes["data-id-attribute"]),
                type_attribute: attributeWithAllInfo.ATRIBUTO,
                state: 1
            }
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}



export const getFamilies = (familiesData: IComboData[]) => {

    return familiesData?.map((family: any) => {

        let pathname = ""
        let familyToAdd: IFamiliesCard = {
            title: family.nombre,
            path: "",
            quantity: 0
        }

        switch (familyToAdd.title) {
            case "COMUNICACIONES":
                pathname = "/media/icons/duotune/cmdb/enrutador.svg"
                break;
            case "VIRTUALIZACION":
                pathname = "/media/icons/duotune/cmdb/server.svg"
                break;
            case "BASE DE DATOS":
                pathname = "/media/icons/duotune/cmdb/bases-de-datos.svg"
                break;
            case "CLOUD":
                pathname = "/media/icons/duotune/cmdb/computacion-en-la-nube.svg"
                break;
            case "APLICACION":
                pathname = "/media/icons/duotune/cmdb/codificacion.svg"
                break;
            case "BACKUPS":
                pathname = "/media/icons/duotune/cmdb/recuperacion.svg"
                break;
            case "DISPOSITIVOS":
                pathname = "/media/icons/duotune/cmdb/dispositivos.svg"
                break;
            case "FACILITIES":
                pathname = "/media/icons/duotune/cmdb/centro-de-datos.svg"
                break;
            case "IMPRESORA":
                pathname = "/media/icons/duotune/cmdb/impresora.svg"
                break;
            case "INSTALACIONES":
                pathname = "/media/icons/duotune/cmdb/instalaciones.svg"
                break;
            case "MICROINFORMÁTICA":
                pathname = "/media/icons/duotune/cmdb/desktop.svg"
                break;
            case "MONITOREO":
                pathname = "/media/icons/duotune/cmdb/monitoreo.svg"
                break;
            case "SAP":
                pathname = "/media/icons/duotune/cmdb/sap.svg"
                break;
            case "SEGURIDAD":
                pathname = "/media/icons/duotune/cmdb/seguridad-informatica.svg"
                break;
            case "SERVICIOS":
                pathname = "/media/icons/duotune/cmdb/services.svg"
                break;
            case "SISTEMA DE VIRTUALIZACION":
                pathname = "/media/icons/duotune/cmdb/virtual.svg"
                break;
            case "SISTEMAS OPERATIVOS":
                pathname = "/media/icons/duotune/cmdb/sistema-operativo.svg"
                break;
            case "STORAGE":
                pathname = "/media/icons/duotune/cmdb/almacenamiento.svg"
                break;

        }
        return { ...familyToAdd, path: pathname }
    })
}

export const assignQuantitiesAndSort = (equipmentsData: IConfigurationItem[], families: IFamiliesCard[]) => {

    equipmentsData?.forEach((equipment: IConfigurationItem) => {
        const index = families.findIndex((category) => category.title === equipment.FAMILIA?.toUpperCase())
        if (index === -1) {
            return
        } else {
            families[index].quantity += 1
        }
    })

    families?.sort((x: any, y: any) => y.quantity - x.quantity)

}

export function flattenCIs(items: IConfigurationItem[]): IConfigurationItem[] {
    const resultado: IConfigurationItem[] = [];
    items.forEach(item => {
        resultado.push(item);
        if (item.HIJOS) {
            resultado.push(...flattenCIs(item.HIJOS));
        }
    });
    return resultado;
}

function normalizeFecha(fechaISO: string): string {
    const date = new Date(fechaISO);
    // Resetear segundos y milisegundos a 0
    date.setSeconds(0, 0);
    return date.toISOString();
}

export function formatDate(isoDate: string): string {
    const normalizedDate = normalizeFecha(isoDate);
    const date = new Date(normalizedDate);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function flattenAuditByIteration(auditData: AuditData): IteracionAplanada[] {
    // Validar que auditData tenga la estructura correcta
    if (!auditData) {
        console.warn('auditData es null o undefined:', auditData);
        return [];
    }

    if (!auditData.cambios) {
        console.warn('auditData.cambios no existe:', auditData);
        return [];
    }

    if (!auditData.id_ci && !auditData.nombre_ci) {
        console.warn('Faltan id_ci o nombre_ci:', auditData);
        return [];
    }

    const { id_ci, nombre_ci, cambios } = auditData;
    const iterationsMap = new Map<string, any>();
    
    // Recorrer todos los campos y sus cambios
    for (const [campo, cambiosArray] of Object.entries(cambios)) {
        if (!Array.isArray(cambiosArray)) {
        console.warn(`Cambios para campo ${campo} no es un array:`, cambiosArray);
        continue;
        }

        cambiosArray.forEach((cambio: Cambio) => {
        // Validar que el cambio tenga la estructura esperada
        if (!cambio.fecha || !cambio.usuario) {
            console.warn(`Cambio incompleto para campo ${campo}:`, cambio);
            return;
        }

        // Normalizar la fecha
        const fechaNormalizada = normalizeFecha(cambio.fecha);
        
        // Crear clave única por fecha normalizada + usuario
        const iterationKey = `${fechaNormalizada}|${cambio.usuario}`;
        
        // Si no existe esta iteración, crearla
        if (!iterationsMap.has(iterationKey)) {
            iterationsMap.set(iterationKey, {
            id_ci: id_ci || 0,
            nombre_ci: nombre_ci || '',
            fecha: fechaNormalizada, // Usar la fecha normalizada
            usuario: cambio.usuario,
            accion: cambio.accion,
            fecha_timestamp: new Date(fechaNormalizada).getTime(),
            fecha_formatted: formatDate(fechaNormalizada),
            campos_modificados: {}
            });
        }
        
        // Agregar el campo modificado a esta iteración
        iterationsMap.get(iterationKey).campos_modificados[campo] = cambio.valor;
        });
    }
    
    // Convertir el Map a Array y ordenar por fecha descendente
    const iterations = Array.from(iterationsMap.values())
        .sort((a, b) => b.fecha_timestamp - a.fecha_timestamp);
    
    // Aplanar completamente
    const flattenedIterations: IteracionAplanada[] = iterations.map((iteration) => {
        const { campos_modificados, ...baseData } = iteration;
        
        return {
        ...baseData,
        ...campos_modificados,
        cantidad_campos_modificados: Object.keys(campos_modificados).length,
        lista_campos: Object.keys(campos_modificados).join(', ')
        };
    });

    return flattenedIterations;
}

export function getAllModifiedFields(iterations: IteracionAplanada[]): string[] {
    const fieldsSet = new Set<string>();

    iterations.forEach((iteration) => {
        Object.keys(iteration).forEach((key) => {
            // Excluir campos de metadata
            if (!['id_ci', 'nombre_ci', 'fecha', 'usuario', 'fecha_timestamp', 
                'fecha_formatted', 'cantidad_campos_modificados', 'lista_campos'].includes(key)) {
                fieldsSet.add(key);
            }
        });
    });
    return Array.from(fieldsSet).sort();
}