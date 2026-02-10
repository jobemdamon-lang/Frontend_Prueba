import axios, { AxiosInstance } from 'axios'
import configStore from '../store/ConfigStore';
import { actionLogout } from '../store/auth/AuthSlice'

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: { Accept: 'application/json' },
})

Api.interceptors.request.use(
    (config: any) => {
        config.headers.user = 'userdemo'
        config.headers.pwd = 'Inn0v4$$ion.2022'
        config.headers.key = process.env.REACT_APP_API_KEY
        return config
    },
    (err: any) => Promise.reject(err)
)

const ApiManagementCCS = axios.create({
    baseURL: process.env.REACT_APP_ENV === 'DEV' ? process.env.REACT_APP_API_DEVELOP_NGINX : process.env.REACT_APP_MEGA_API,
    headers: { Accept: 'application/json' },
})

const updateAuthorizationHeader = () => {
    const token = configStore.getState().auth.token;
    ApiManagementCCS.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

//Interceptor para las respuestas
ApiManagementCCS.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Llama a la función para redirigir al usuario al login
            configStore.dispatch(actionLogout())
        }
        return Promise.reject(error);
    }
);

const addParamsToExportOrImport = (instance: AxiosInstance) => {
    instance.interceptors.request.use((config) => {

        // Verifica la URL y añade el token correspondiente
        if (!config.url || !config.headers) return config

        const endpoints = ['/backup/exportar', '/inventario/exportar', '/monitoreo/exportar', '/incidente/exportar_all_incidente']
        const endpointsImport = ['/inventario/cargaMasiva']

        const isExport = endpoints.some(endpoint => config.url?.toLowerCase().includes(endpoint.toLowerCase()))
        const isImport = endpointsImport.some(endpoint => config.url?.toLowerCase().includes(endpoint.toLowerCase()))

        if (isExport) {
            config.responseType = "arraybuffer"
        } else if (isImport) {
            config.responseType = "arraybuffer"
            config.headers['content-type'] = 'multipart/form-data'
            config.timeout = 420000
        }

        return config;
    }, (error) => {
        // Maneja el error de la solicitud
        console.error('Ocurrió un error en el interceptor request al añadir Tokens ', error)
    })
}

const addMNGAPISToken = (instance: AxiosInstance) => {
    instance.interceptors.request.use((config) => {

        // Verifica la URL y añade el token correspondiente
        if (!config.url || !config.headers) return config;

        if (config.url.includes('/administracion/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_ADMINISTRACION}`
        } else if (config.url.includes('/backup/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_BACKUP}`
        } else if (config.url.includes('/incidente/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_INCIDENTE}`
        } else if (config.url.includes('/inventario/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_INVENTARIO}`
        } else if (config.url.includes('/itsm/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_ITSM}`
        } else if (config.url.includes('/monitoreo/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_MONITOREO}`
        } else if (config.url.includes('/parchado/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_PARCHADO}`
        } else if (config.url.includes('/aprovisionamiento/')) {
            config.headers['Ocp-Apim-Subscription-Key'] = `${process.env.REACT_APP_APROVISIONAMIENTO}`
        }

        return config;
    }, (error) => {
        // Maneja el error de la solicitud
        console.error('Ocurrió un error en el interceptor request al añadir Tokens ', error)
    })
}

if (process.env.REACT_APP_ENV !== 'DEV') {
    addMNGAPISToken(ApiManagementCCS)
    updateAuthorizationHeader();
}

addParamsToExportOrImport(ApiManagementCCS)
//Cada vez que el estado cambie ejecutara la funcion incluir token
configStore.subscribe(updateAuthorizationHeader)

export { Api, ApiManagementCCS }
