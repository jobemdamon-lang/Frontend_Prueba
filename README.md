# Iniciar Proyecto con Create React APP

Este proyecto fue iniciado con [Create React App](https://github.com/facebook/create-react-app).

## Scripts Disponibles

En el directorio de este proyecto se puede ejecutar:

### `npm start`

Runs the app in the development mode.\Inicia la aplicación en modo desarrollo en el puerto 3000 por defecto. Se puede modificar
cambiando el puerto en el archivo .env de la aplicación
Abrir [http://localhost:3000](http://localhost:3000) para visualizar en el navegador.

La pagina se autorefrescara antes los cambios.\
Podras ver los errores en la consola.

### `npm test`

Esto ejecuta los test en modo interactivo. El proyecto actualmente no cuenta con Testing\ 
Mas información [running tests](https://facebook.github.io/create-react-app/docs/running-tests)

### `yarn build`

Genera y construye la build de la aplicación.\
Incluye correctamente React en modo de producción y optimiza la compilación para obtener el mejor rendimiento.

Mas información: [deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `Expulsión de hilo`

**Nota: esta es una operación unidireccional. ¡Una vez que lo "expulsas", no podrás regresar!**

Si no está satisfecho con la herramienta de compilación y las opciones de configuración, puede "expulsar" en cualquier momento. Este comando eliminará la dependencia de compilación única de su proyecto.

En su lugar, copiará todos los archivos de configuración y las dependencias transitivas (webpack, Babel, ESLint, etc.) directamente en su proyecto para que tenga control total sobre ellos. Todos los comandos excepto "expulsar" seguirán funcionando, pero apuntarán a los scripts copiados para que puedas modificarlos. En este punto estás solo.

Nunca es necesario utilizar "expulsar". El conjunto de funciones seleccionado es adecuado para implementaciones pequeñas y medianas, y no debería sentirse obligado a utilizar esta función. Sin embargo, entendemos que esta herramienta no sería útil si no pudiera personalizarla cuando esté listo para usarla.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Estructura de Carpetas
* ### src/hooks
    CustomHooks de ambito global tales como:
    * useClients : Estados y funciones sobre la información de los Clientes
    * useProjects : Estados y funciones sobre la información de los Proyectos
* ### src/routing
    Wrapper de todas las rutas publicas y privadas a la aplicación.
* ### src/services
    Servicios y funciones para los distintos endpoints del API [SelfServiceAPI](https://appselfservice.azurewebsites.net/api/)
* ### src/routing
    Estado (Store - Slice) de la aplicación: _El estado global contiene informacion del usuario autenticado y sus permisos para la aplicación_
* ### src/views
    Contiene las vistas, estados y logica de cada modulo:
    _Los modulos con prefijo _ contiene un estado global con useContext y son pertenecientes a la logica de Negocio_
    * Vista de Errores (errors) 
    * _Modulo de Inventarios (inventory) 
    * -Modulo de Monitoreo (monitoring)
    * _Modulo de Backups (backups)
    * Modulo de Inicio (home)
    * Modulo de Login (auth)

