import { ComponentProps } from "react";
import { Role } from "../hooks/Types";

export enum EnumRoles {
  ADMINISTRADOR = "admin",
  LECTURA = "lectura",
  SUPERVISOR = "supervisor"
}

export enum EnumModules {
  CMDB = "CMDB",
  BACKUPS = "BACKUPS",
  INCIDENTCENTER = "INCIDENTCENTER"
}

export interface IComboData { codigo: number, nombre: string }
export interface IDataListFormat { id: string, value: string }
export interface IDataListProject { id: number, value: string }
export type Rol = "lectura" | "admin" | "supervisor"
export type Module = "CMDB" | "BACKUPS" | "INCIDENTCENTER"

//Este tipo permite crear un nuevo tipado en base a un elemento HTML, permite agregar atributos personalizados
type OverrideProps<T, TOverridden, OCustomAtt> = Omit<T, keyof TOverridden> & TOverridden & OCustomAtt
export type InputProps = OverrideProps<
  ComponentProps<"input">,
  {
    onChange: (value: string) => void
  },
  {
    label: string,
    loading?: boolean,
    containerClassName?: string
  }
>;

export type InputSelectProps = OverrideProps<
  ComponentProps<"select">,
  {
    onChange: (value: string) => void,
  },
  {
    label: string,
    data: IComboData[],
    dependencyfunction?: Function
    loading?: boolean,
    containerClassName?: string
  }
>;

export type ModuleProps = { rol: Role }

export type ButtonProps = OverrideProps<
  ComponentProps<"button">,
  {},
  {
    loading?: boolean,
    tooltipmssg?: string
  }
>;

export type SwitchInput = OverrideProps<
  ComponentProps<"input">,
  {
    onChange: (value: string) => void
  },
  {
    label: string,
    loading?: boolean,
  }
>;
