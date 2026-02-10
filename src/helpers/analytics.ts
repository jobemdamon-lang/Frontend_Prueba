import { RootState } from "../store/ConfigStore"

declare global {
    interface Window {
        dataLayer: any[]
        gtag: (...args: any[]) => void
    }
}

export type ModuleNames =
    | "autoticket"
    | "general"
    | "eventos_monitoreo"
    | "politicas_monitoreo"
    | "politicas_monitoreo_v2"
    | "equipments"
    | "politicas_backups"
    | "ejecuciones_backups"
    | "proyectos"
    | "colaborador"
    | "accesos"
    | "incident_center"
    | "parchado"
    | "administrate_cmdb"
    | "aplication_configuration"
    | "parchado_linux"
    | "aprovisionamiento_solicitudes"
    | "monitoreo_administracion"
    | "auth"

export interface AnalyticsEventParams {
    module: ModuleNames,
    metadata?: Record<string, unknown>
}

export class AnalyticsService {
    private static measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID || ""
    private static store: any
    private static isInitialized = false
    private static isGtagReady = false
    private static eventQueue: Array<() => void> = []

    static init(store: any) {
        this.store = store
        this.isInitialized = true

        this.waitForGtag().then(() => {
            this.isGtagReady = true

            if (this.measurementId) {
                window.gtag("config", this.measurementId, {
                    send_page_view: false,
                })
            }

            console.log('✅ GA4 inicializado (sin user_id)')

            this.processEventQueue()
        })
    }

    private static waitForGtag(): Promise<void> {
        return new Promise((resolve) => {
            const checkGtag = () => {
                if (typeof window.gtag !== 'undefined') {
                    resolve()
                } else {
                    setTimeout(checkGtag, 100)
                }
            }
            checkGtag()
        })
    }

    static setUserId(userId: string) {
        if (!this.isGtagReady || !this.measurementId) {
            console.warn('[AnalyticsService] gtag not ready for setUserId')
            return
        }

        window.gtag("config", this.measurementId, {
            user_id: userId,
            send_page_view: false,
        })

        window.gtag("event", "login", {
            method: "form",
            user_id: userId
        })
    }

    private static processEventQueue() {
        while (this.eventQueue.length > 0) {
            const eventFn = this.eventQueue.shift()
            if (eventFn) eventFn()
        }
    }

    private static getUserInfo() {
        if (!this.store) return {}

        try {
            const state: RootState = this.store.getState()
            const auth = state.auth
            return {
                user_id: auth.usuario,
                username: auth.usuario
            }
        } catch (error) {
            console.warn("[AnalyticsService] Error obtain user info")
            return {}
        }
    }

    static pageview(url: string) {
        const sendPageview = () => {
            if (!this.isGtagReady) {
                console.warn("[AnalyticsService] gtag not ready for pageview")
                return
            }

            const userInfo = this.getUserInfo()

            window.gtag("event", "page_view", {
                page_path: url,
                page_location: window.location.origin + url,
                page_title: document.title,
                ...userInfo
            })
        }

        if (this.isGtagReady) {
            sendPageview()
        } else {
            this.eventQueue.push(sendPageview)
        }
    }

    static event(eventName: string, params: AnalyticsEventParams) {
        const sendEvent = () => {
            if (!this.isGtagReady) {
                console.warn("[AnalyticsService] gtag not ready for event")
                return
            }

            const userInfo = this.getUserInfo()

            window.gtag("event", eventName, {
                event_category: params.module,
                module: params.module,
                ...userInfo,
                ...params.metadata,
            })
        }

        if (this.isGtagReady) {
            sendEvent()
        } else {
            this.eventQueue.push(sendEvent)
        }
    }

    static isReady(): boolean {
        return this.isInitialized && this.isGtagReady && !!this.measurementId
    }

    static debug() {
        console.group('🔍 GA4 Debug Info')
        console.log('Initialized:', this.isInitialized)
        console.log('Gtag Ready:', this.isGtagReady)
        console.log('Measurement ID:', this.measurementId)
        console.log('Event Queue Length:', this.eventQueue.length)
        console.log('User Info:', this.getUserInfo())
        console.groupEnd()
    }
}