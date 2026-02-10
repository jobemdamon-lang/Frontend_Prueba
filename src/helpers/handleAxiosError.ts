import axios from "axios";
import { errorNotification } from "./notifications";

type DataError = {
    status: string;
    statusCode: string;
    message: string;
};

export const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            //Este bloque se ejecuta si la solicitud generó una respuesta del servidor (por ejemplo, un código de estado HTTP 4xx o 5xx)
            const err = error.response.data as DataError
            const statusCode = error.response.status
            if (statusCode !== 401) {
                errorNotification("Ocurrió un problema al procesar la petición", err?.message ?? "")
            }
        } else if (error.request) {
            //Este bloque se ejecuta si la solicitud se envió correctamente al servidor, pero no se recibió ninguna respuesta.
            errorNotification("Ocurrió un problema al realizar la petición")
        } else {
            // Este bloque se ejecuta si ocurrió un error al configurar la solicitud o durante el proceso de solicitud. 
            errorNotification("Ocurrió un error desconocido")
        }
    } else {
        //Si el error no es un error de Axios (es decir, no es una instancia de AxiosError), este bloque se ejecuta
        const error_message = String(error)
        errorNotification("Ocurrió un error inesperado", error_message ?? "")
    }
}

export const isSuccessRequest = (statusCode: number) => {
    return statusCode >= 200 && statusCode < 300
}

export const isSuccessActionInBackend = (resultRequest: string) => {
    return resultRequest.toUpperCase() === "CORRECTO"
}

export const isExcelHeaderContect = (header_content: string) => {
    return header_content === "application/vnd.ms-excel"
}

export const isJsonHeaderContect = (header_content: string) => {
    return header_content === "application/json"
}

