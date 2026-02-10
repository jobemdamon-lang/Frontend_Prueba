import { EnumModules, EnumRoles, Module, Rol } from "../helpers/Types"
import { Role } from "../hooks/Types";

type Props = {
  rol: Rol,
  module: Module,
  allowedRol: Rol,
  children: any
}
export const AccessControler: React.FC<Props> = ({ rol, allowedRol, module, children }) => {
  let allowAccess = false;

  switch (module) {
    case EnumModules.INCIDENTCENTER:
      // Lógica de control de acceso para el Modulo Incident Center
      allowAccess = rol === EnumRoles.ADMINISTRADOR || rol === allowedRol;
      break;
    default:
      // No se reconoce el módulo, por defecto no se permite el acceso
      allowAccess = false;
  }

  if (allowAccess) {
    return <>{children}</>;
  } else {
    return null;
  }
};

/////NUEVOSSS
type ControllerProps = {
  rol: Role,
  allowedRoles?: Role[],
  children: React.ReactNode
}

export const AccessController: React.FC<ControllerProps> = ({ rol, allowedRoles = ['admin'], children }) => {
  const hasAccess = allowedRoles.some(role => role === rol)
  return hasAccess ? <>{children}</> : null

};

export const accessControllerFunction = (rol: Role, allowedRoles: Role[] = ['admin']) => {
  return allowedRoles.some(role => role === rol)
}
