import axios from 'axios'
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

const ApiInventory = axios.create({
   baseURL: process.env.REACT_APP_API_PRODUCTION,
   headers: { Accept: 'application/json' },
})

const ApiInventoryToExport = axios.create({
   baseURL: process.env.REACT_APP_API_PRODUCTION,
   headers: { Accept: 'application/json' },
   responseType: "arraybuffer"
})

const ApiInventoryToImport = axios.create({
   baseURL: process.env.REACT_APP_API_PRODUCTION,
   headers: {
      Accept: 'application/json',
      'content-type': 'multipart/form-data'
   },
   responseType: "arraybuffer",
   timeout: 420000
})

const updateAuthorizationHeader = () => {
   const token = configStore.getState().auth.token;
   //console.log(token);
   ApiInventory.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   ApiInventoryToExport.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   ApiInventoryToImport.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   //ApiInventory.defaults.headers.common['Authorization'] = `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoibXF1aXNwZW0iLCJub21icmUiOiJNaWd1ZWwgQW5nZWwgUXVpc3BlIE1hbWFuaSIsImNhcmdvIjoiRVNQRUNJQUxJU1RBIERFIFNJU1RFTUFTIiwiYXJlYSI6IkNMT1VEIElOTk9WQVRJT04iLCJleHAiOjE2OTI3NDQ1MDd9.3vX5N4y3TbGDCn3YhwXH-t-AVqBAkyOK-IGnwMhT8J0"}`;
   //ApiInventoryToExport.defaults.headers.common['Authorization'] = `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoibXF1aXNwZW0iLCJub21icmUiOiJNaWd1ZWwgQW5nZWwgUXVpc3BlIE1hbWFuaSIsImNhcmdvIjoiRVNQRUNJQUxJU1RBIERFIFNJU1RFTUFTIiwiYXJlYSI6IkNMT1VEIElOTk9WQVRJT04iLCJleHAiOjE2OTI3NDQ1MDd9.3vX5N4y3TbGDCn3YhwXH-t-AVqBAkyOK-IGnwMhT8J0"}`;
   //ApiInventoryToImport.defaults.headers.common['Authorization'] = `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjoibXF1aXNwZW0iLCJub21icmUiOiJNaWd1ZWwgQW5nZWwgUXVpc3BlIE1hbWFuaSIsImNhcmdvIjoiRVNQRUNJQUxJU1RBIERFIFNJU1RFTUFTIiwiYXJlYSI6IkNMT1VEIElOTk9WQVRJT04iLCJleHAiOjE2OTI3NDQ1MDd9.3vX5N4y3TbGDCn3YhwXH-t-AVqBAkyOK-IGnwMhT8J0"}`;
};

updateAuthorizationHeader();
//Cada vez que el estado cambie ejecutara la funcion incluir token
configStore.subscribe(updateAuthorizationHeader)

//Interceptor para las respuestas
ApiInventory.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response && error.response.status === 401) {
         // Llama a la función para redirigir al usuario al login
         configStore.dispatch(actionLogout())
      }
      return Promise.reject(error);
   }
);

ApiInventoryToExport.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response && error.response.status === 401) {
         // Llama a la función para redirigir al usuario al login
         configStore.dispatch(actionLogout())
      }
      return Promise.reject(error);
   }
);

ApiInventoryToImport.interceptors.response.use(
   (response) => response,
   (error) => {
      if (error.response && error.response.status === 401) {
         // Llama a la función para redirigir al usuario al login
         configStore.dispatch(actionLogout())
      }
      return Promise.reject(error);
   }
);

export { Api, ApiInventory as ApiManagementCCS, ApiInventoryToExport, ApiInventoryToImport }