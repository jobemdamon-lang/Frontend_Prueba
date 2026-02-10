const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Los dos primeros argumentos suelen ser el .exe de node y la ruta del archivo de donde lo estas ejecutando
const moduleName = process.argv[2];
const submoduleName = process.argv[3];

const modulePath = path.join('./src/views', moduleName);
const subModulePath = path.join(modulePath, submoduleName)
const ContentPath = path.join(modulePath, submoduleName, 'Content')
const ModalPath = path.join(modulePath, submoduleName, 'modal-content')
const HooksPath = path.join(modulePath, submoduleName, 'hooks')

const ContextTemplate = `
import { createContext } from 'react'

export const Context = createContext({} as any)
`

const ProviderTemplate = `
  import { FC } from "react"
  import { Rol } from "../../../helpers/Types"
  import { Context } from "./Context"
  import { Content } from "./Content/Content"

  type Props = { rol: Rol }
  const Provider: FC<Props> = ({ rol }) => {

    return (
      <Context.Provider
        value={{
          rol
        }}
      >
        <Content/>
      </Context.Provider >
    )
  }

  export { Provider }
`

const subModuleTemplate = `
import { FC } from 'react'
import { Rol } from '../../helpers/Types'
import { Provider } from './${submoduleName}/Provider'

type Props = {
  rol: Rol
}

const ${submoduleName}: FC<Props> = ({ rol }) => {
  return (
    <div className='card'>
      <div className='card-header py-0'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Escribe tu titulo AQUI</span>
        </h3>
      </div>
      <div className='card-body py-3 px-6'>
        <Provider rol={rol} />
      </div>
    </div>
  )
}

export { ${submoduleName} }
`;

if (!moduleName || !submoduleName) {
  console.error('Por favor, proporciona un nombre del modulo y submodulo.');
  process.exit(1);
}

if (!fs.existsSync(modulePath)) {
  rl.question('El modulo indicado no existe. ¿Desea crear uno? (sí/no): ', (answer) => {
    if (answer.toLowerCase() === 'si') {

      fs.mkdirSync(modulePath);
      fs.mkdirSync(subModulePath);
      fs.mkdirSync(ContentPath);
      fs.mkdirSync(ModalPath);
      fs.mkdirSync(HooksPath);
      fs.writeFileSync(path.join(modulePath, `${submoduleName}.tsx`), subModuleTemplate);
      fs.writeFileSync(path.join(subModulePath, 'Context.ts'), ContextTemplate);
      fs.writeFileSync(path.join(subModulePath, 'Provider.tsx'), ProviderTemplate);

      console.log(`Submodulo ${submoduleName} creado en ${moduleName}`);
      process.exit(1);
    } else {
      console.log('No se ha creado un nuevo módulo.');
      rl.close();
    }
  });
} else {
  if (fs.existsSync(subModulePath)) {
    console.error('El submodulo ingresado ya existe');
    process.exit(1);
  }
  fs.mkdirSync(subModulePath);
  fs.mkdirSync(ContentPath);
  fs.writeFileSync(path.join(modulePath, `${submoduleName}.tsx`), subModuleTemplate);
  fs.writeFileSync(path.join(subModulePath, 'Context.ts'), ContextTemplate);
  fs.writeFileSync(path.join(subModulePath, 'Provider.tsx'), ProviderTemplate);
  process.exit(1);
}


