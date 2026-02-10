import { toast } from "react-toastify"

export const successNotification = (customMessage: string, backendMessage?: string) => {
    toast.success(`${customMessage}. ${backendMessage ?? ""}`, { position: toast.POSITION.TOP_RIGHT })
}

export const errorNotification = (customMessage: string, backendMessage?: string) => {
    toast.error(`${customMessage}. ${backendMessage ?? ""}`, { position: toast.POSITION.TOP_RIGHT })
}

export const warningNotification = (customMessage: string, backendMessage?: string) => {
    toast.warn(`${customMessage}. ${backendMessage ?? ""}`, { position: toast.POSITION.TOP_RIGHT })
}