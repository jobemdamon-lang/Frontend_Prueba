import uniqid from "uniqid";
import { IComboData, IDataListFormat, IDataListProject } from "./Types";

//Convierte el tipo Date 2023-10-24 14:53:09 a DD/MM/YYYY
export function convertirFecha(fecha: string) {
  if (fecha === "") return fecha
  const fechaParseada = new Date(fecha);
  const dia = fechaParseada.getDate();
  const mes = fechaParseada.getMonth() + 1;
  const anio = fechaParseada.getFullYear() % 100;
  const fechaFormateada = `${dia}/${mes}/${anio}`;
  return fechaFormateada;
}

//Cambia (SWAP) de orden dos elementos en un array
export function swapPosition(array: any[], indexA: number, indexB: number) {
  // Verificar que los índices estén dentro de los límites del array
  if (indexA < 0 || indexA >= array.length || indexB < 0 || indexB >= array.length) return array

  const newArray = [...array]; // Crear una copia del array para no modificar el original
  const temp = newArray[indexA];
  newArray[indexA] = newArray[indexB];
  newArray[indexB] = temp;
  return newArray;
}

//Inserta un indice de un array en lugar de otro y desplaza los siguientes //TIENE BUG AUN NO USAR
export function insertInSpecificIndex(array: any[], recievedItemIndex: number, originalItemIndex: number) {
  // Verificar que los índices estén dentro de los límites del array
  if (recievedItemIndex < 0 || recievedItemIndex >= array.length || originalItemIndex < 0 || originalItemIndex >= array.length) return array

  const newArray = [...array]; // Crear una copia del array para no modificar el original
  const recievedItemBody = newArray[recievedItemIndex]
  newArray.splice(originalItemIndex, 0, recievedItemBody)
  if (recievedItemIndex < originalItemIndex) {
    console.log("entro aqui")
    newArray.splice(originalItemIndex, 1)
  } else if (recievedItemIndex > originalItemIndex) {
    console.log("entro")
    newArray.splice(originalItemIndex + 1, 1)
  }
  return newArray;
}

//recibe fecha en formato: 2023-12-07 10:00:00 y lo pasa a 2023-12-07T15:00:00-05:00 (ISO 8601 con zona horaria UTC-5))
export function transformDate(date: string | null | undefined) {

  if (date === "" || date === null || date === undefined) return ""
  if (date.endsWith("00:00:00")) return date.split(' ')[0];

  // Crear un objeto Date desde la cadena original
  const fechaObjeto = new Date(date);

  // Obtener la cadena en formato deseado (ISO 8601 con zona horaria UTC-5) sin milisegundos
  const fechaDeseada = fechaObjeto?.toISOString().replace(/\.\d{3}Z$/, "-05:00");

  return fechaDeseada
}

export const filtrarPorFecha = (rango: string) => {
  const fechaFiltro = new Date();

  // Aplicar lógica de filtrado según el rango seleccionado
  switch (rango) {
    case 'ultimoMes':
      fechaFiltro.setMonth(fechaFiltro.getMonth() - 1);
      break;
    case 'ultimos3Meses':
      fechaFiltro.setMonth(fechaFiltro.getMonth() - 3);
      break;
    // Puedes agregar más casos según tus necesidades
    default:
      fechaFiltro.setFullYear(fechaFiltro.getFullYear() - 30);
      // Para el caso 'todos' o cualquier otro, no aplicar filtro de fecha
      break;
  }
  return fechaFiltro
}

//Modificar formato de YYYY/MM/DD a DD-MM-YYYY
export const changeFormatDate = (date: string | null): string => {
  let newDate = date != null ? date.split("/").reverse().join("-") : "";
  return newDate
};

export const dataToUpperCaseInIComboData = (array: IComboData[]) => {
  const upperCaseData: IComboData[] = array.map((value: IComboData) => ({ ...value, nombre: value.nombre.toUpperCase() }))
  return upperCaseData
}

export const formatToDataList = (array: IComboData[]) => {
  const formatedData: IDataListFormat[] = array.map((value: IComboData) => ({ id: value.codigo.toString(), value: value.nombre.toUpperCase() }))
  return formatedData
}

export const formatClientsDataList = (array: IComboData[]) => {
  const seen = new Set<string>()

  const formatedData: IDataListFormat[] = array
    .filter((item) => {
      const upperName = item.nombre.toUpperCase()
      if (seen.has(upperName)) {
        return false
      }
      seen.add(upperName);
      return true
    })
    .map((value: IComboData) => ({
      id: uniqid(),
      value: value.nombre.toUpperCase(),
    }))

  return formatedData
}

export const formatProjectsDataList = (array: IComboData[]) => {

  const formatedData: IDataListProject[] = array.map((value: IComboData) => ({ id: value.codigo, value: value.nombre?.toUpperCase() }))

  return formatedData
}

export const notNull = (value: string | null) => {
  return value ? value : "Sin registro."
}

export const timestampToDate = (timestamp: number) => {

  const date = new Date(timestamp)

  const dia = date.getDate()
  const mes = date.getMonth() + 1
  const año = date.getFullYear()

  const diaFormateado = dia < 10 ? '0' + dia : dia
  const mesFormateado = mes < 10 ? '0' + mes : mes

  return diaFormateado + '/' + mesFormateado + '/' + año

}

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return ""

  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`
  } else {
    return text
  }
}

//Transforma el formato Wed, 15 May 2024 14:14:49 GMT a DD/MM/YYYY
export const textDateToNumericDate = (textDate: string) => {

  // Crear un objeto Date a partir de la cadena
  const date = new Date(textDate);

  // Extraer el día, mes y año del objeto Date
  const day = String(date.getDate()).padStart(2, '0'); // Obtener el día y asegurar que tenga dos dígitos
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1
  const year = date.getFullYear(); // Obtener el año

  // Extraer la hora, minutos y segundos del objeto Date
  const hours = String(date.getHours()).padStart(2, '0'); // Obtener la hora y asegurar que tenga dos dígitos
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Obtener los minutos y asegurar que tengan dos dígitos
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Obtener los segundos y asegurar que tengan dos dígitos

  // Formatear la fecha y la hora en "DD/MM/YYYY HH:MM:SS"
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime
}

export const separateProjectNameAndALP = (project: string) => {

  const pattern = /(\d+)-(.+)/;
  const match = project.match(pattern);

  if (match) {
    const alp = match[1];
    const nameProject = match[2];
    return { alp, nameProject };
  } else {
    return { alp: '', nameProject: '' };
  }

}

//Convierte 2024-05-27 10:15:23.570000 a DD/MM/YY HH:MM
export const formatDate = (dateString: string | null) => {

  if (!dateString) return ''
  // Convertir la cadena a un objeto Date
  const date = new Date(dateString);

  // Obtener los componentes de la fecha
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son 0-indexados
  const year = date.getFullYear();

  // Obtener los componentes de la hora
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Formatear la fecha y hora en el formato deseado
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function downloadTXTFile({ filename, content }: { filename: string, content: string }) {

  const blob = new Blob([content], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

export const filterArrayByFields = <T extends Record<string, any>>(
  array: T[],
  searchedValue: string,
  fields: (keyof T)[]
): T[] => {

  if (!searchedValue.trim()) {
    return array
  }

  return array.filter(item => {
    return fields.some(field => {
      const fieldValue = item[field]
      return (
        fieldValue &&
        fieldValue.toString().toLowerCase().includes(searchedValue.toLowerCase())
      )
    })
  })
}

export function timestampToDateTime(timestamp: number) {
  // Crear un objeto Date usando el timestamp
  const date = new Date(timestamp);
  
  // Obtener los componentes de la fecha y la hora
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Formatear la fecha y la hora en una cadena legible
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
