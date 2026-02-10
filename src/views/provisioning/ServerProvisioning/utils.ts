import { CreateDisk, CreateRequestVM, Disco, NewDiskPartition, PayloadExecution, StepForm, Template, UpdatedGeneral, UpdatedHardware } from "../Types";

export const clearFieldError = (
    field: string,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
    setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
    })
}

export const validateGeneral = (formData: CreateRequestVM): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (formData.id_criticidad === 0) errors.id_criticidad = "La criticidad es requerida";
    if (formData.hostname.trim() === '') {
        errors.hostname = "El hostname es requerido";
    } else if (!/^[a-zA-Z0-9-]{1,15}$/.test(formData.hostname)) {
        errors.hostname = "El hostname solo puede contener letras, números, guiones (-) y tener un máximo de 15 caracteres";
    }
    if (formData.id_proyecto === 0) errors.id_proyecto = "El proyecto es requerido";
    if (formData.id_ubicacion === 0) errors.id_ubicacion = "La ubicación es requerida";
    if (formData.id_tipo_servicio === 0) errors.id_tipo_servicio = "El tipo de servicio es requerido";
    if (formData.id_so_version === 0) errors.id_so_version = "La versión del SO es requerida";
    if (formData.id_tipo_alcance === 0) errors.id_tipo_alcance = "El tipo de alcance es requerido";
    if (formData.id_ambiente === 0) errors.id_ambiente = "El ambiente es requerido";
    if (formData.id_admin_torre === 0) errors.id_admin_torre = "El administrador es requerido";
    if (formData.rol_uso.trim() === '') errors.rol_uso = "El rol de uso es requerido";
    if (formData.id_ambito === 0) errors.id_ambito = "El ámbito es requerido";
    if (formData.vcpu_cores === 0 || formData.vcpu_cores < 0) errors.vcpu_cores = "Ingrese un numero de núcleos vCPU válido";
    if (formData.ram_gb === 0 || formData.ram_gb < 0) errors.ram_gb = "Ingrese un numero de memoria RAM válido";
    if (formData.swap_gb === 0 || formData.swap_gb < 0) errors.swap_gb = "Ingrese un numero de memoria SWAP válido";

    return errors
}

export const validateStorage = (discos: CreateDisk[], so: string): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (discos.length === 0) {
        errors['discos'] = "Añada almenos un disco para poder continuar."
        return errors
    }

    if (so.toLowerCase() === 'windows') {
        discos.forEach((disco, index) => {
            if (!disco.nombre_unidad?.trim()) {
                errors[`disco-${index}-nombre`] = `El nombre del disco ${index + 1} es requerido`;
            }
            if (!disco.gb_disco || disco.gb_disco <= 0) {
                errors[`disco-${index}-gb`] = `El tamaño del disco ${index + 1} debe ser mayor a 0`;
            }
        });
    }

    if (so.toLowerCase() === 'linux') {
        discos.forEach((disco, discoIndex) => {
            disco.particiones.forEach((particion, particionIndex) => {
                if (!particion.punto_montaje?.trim()) {
                    errors[`disco-${discoIndex}-particion-${particionIndex}-montaje`] =
                        `Punto de montaje requerido en partición ${particionIndex + 1} del disco ${discoIndex + 1}`;
                }
                if (!particion.gb_particion || particion.gb_particion <= 0) {
                    errors[`disco-${discoIndex}-particion-${particionIndex}-gb`] =
                        `Tamaño inválido en partición ${particionIndex + 1} del disco ${discoIndex + 1}`;
                }
            });
        });
    }

    return errors
}

export const getError = (key: string, errors: Record<string, string>) => {
    return errors[key]
}

export const formateDate = (fecha: string) => {

    if (!fecha) return 'N/A'
    const fechaReal = new Date(fecha)
    return Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(fechaReal)
}

export const getBadgeLocation = (criticity: string) => {
    if (criticity.toLowerCase().includes('bajo')) return 'badge-light-success';
    if (criticity.toLowerCase().includes('medio')) return 'badge-light-warning';
    if (criticity.toLowerCase().includes('alto')) return 'badge-light-danger';
}

export const getBadgeService = (typeService: string) => {
    if (typeService.toLowerCase().includes('bronce')) return 'badge-light-dark';
    if (typeService.toLowerCase().includes('silver')) return 'badge-light-primary';
    if (typeService.toLowerCase().includes('gold')) return 'badge-light-warning';
}

export const getBadgeRequestState = (requestState: string) => {
    if (requestState.toLowerCase().includes('registrado')) return 'badge-light-info';
    if (requestState.toLowerCase().includes('pendiente aprobacion')) return 'badge-light-dark';
    if (requestState.toLowerCase().includes('aprobado')) return 'badge-light-primary';
    if (requestState.toLowerCase().includes('aprovisionado')) return 'badge-light-success';
    if (requestState.toLowerCase().includes('cancelado')) return 'badge-light-danger';
    if (requestState.toLowerCase().includes('rechazado')) return 'badge-light-danger';
}

export const getBadgeExecutionState = (requestState: string) => {
    if (requestState.toLowerCase().includes('programado')) return 'badge-light-info';
    if (requestState.toLowerCase().includes('observado')) return 'badge-light-warning';
    if (requestState.toLowerCase().includes('cancelado')) return 'badge-light-danger';
    if (requestState.toLowerCase().includes('en ejecucion')) return 'badge-light-primary';
    if (requestState.toLowerCase().includes('finalizado')) return 'badge-light-success';
    if (requestState.toLowerCase().includes('fallido')) return 'badge-light-danger';
}

export const validateUpdateGeneral = (formData: UpdatedGeneral): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (formData.id_criticidad === 0) errors.id_criticidad = "La criticidad es requerida";
    if (formData.hostname.trim() === '') errors.hostname = "El hostname es requerido";
    if (formData.id_ubicacion === 0) errors.id_ubicacion = "La ubicación es requerida";
    if (formData.id_tipo_servicio === 0) errors.id_tipo_servicio = "El tipo de servicio es requerido";
    if (formData.id_admin_torre === 0) errors.id_admin_torre = "El administrador es requerido";
    if (formData.id_ambito === 0) errors.id_ambito = "El ámbito es requerido";

    return errors
}

export const validateHardware = (formData: UpdatedHardware): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (formData.vcpu_cores === 0 || formData.vcpu_cores < 0) errors.vcpu_cores = "Ingrese un numero de núcleos vCPU válido";
    if (formData.ram_gb === 0 || formData.ram_gb < 0) errors.ram_gb = "Ingrese un numero de memoria RAM válido";
    if (formData.swap_gb === 0 || formData.swap_gb < 0) errors.swap_gb = "Ingrese un numero de memoria SWAP válido";

    return errors
}

export const validateStorageIndividual = (particiones: NewDiskPartition[], so: string): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (so.toLowerCase() === 'linux') {
        particiones.forEach((particion, particionIndex) => {
            if (!particion.punto_montaje?.trim()) {
                errors[`particion-${particionIndex}-montaje`] =
                    `Punto de montaje requerido en partición ${particionIndex + 1}`;
            }
            if (!particion.gb_particion || particion.gb_particion <= 0) {
                errors[`particion-${particionIndex}-gb`] =
                    `Tamaño inválido en partición ${particionIndex + 1}`;
            }
        });

    }

    return errors
}

export const mapTemplateToState = (template: Template): CreateDisk[] => {
    return template.DISCOS.map(diskTemplate => ({
        nombre_unidad: diskTemplate.NOMBRE_UNIDAD ?? '',
        gb_disco: diskTemplate.DISCO_GB ?? 0,
        particiones: diskTemplate.PARTICIONES.map(partition => ({
            punto_montaje: partition.PUNTO_MONTAJE,
            gb_particion: partition.PARTICION_GB
        }))
    }))
};

export const stepsForm: StepForm[] = [
    {
        id: 1,
        title: "General",
        description: "Información de la Maquina Virtual"
    },
    {
        id: 2,
        title: "Storage",
        description: "Layout del disco"
    },
    {
        id: 3,
        title: "Red",
        description: "Seleccion de IP y Vlan"
    },
    {
        id: 4,
        title: "Servicios",
        description: "Selección de servicios requeridos"
    },
    {
        id: 5,
        title: "Validación",
        description: "Confirma los datos de tu solicitud"
    }
];

export const addLinuxSwap = (disks: CreateDisk[], swapGB: number): CreateDisk[] => {
    if (swapGB <= 0) return disks;

    let swapExists = false;

    // Buscar y actualizar swap existente
    const updatedDisks = disks.map(disk => {
        const hasSwap = disk.particiones.some(p => p.punto_montaje === '/swap');

        if (hasSwap) {
            swapExists = true;
            return {
                ...disk,
                particiones: disk.particiones.map(p =>
                    p.punto_montaje === '/swap'
                        ? { ...p, gb_particion: swapGB }
                        : p
                )
            };
        }
        return disk;
    });

    // Añadir swap solo si no existe
    if (!swapExists) {
        return updatedDisks.map((disk, index) =>
            index === 0 ? {
                ...disk,
                particiones: [
                    ...disk.particiones,
                    { punto_montaje: '/swap', gb_particion: swapGB }
                ]
            } : disk
        );
    }

    return updatedDisks;
};

export const addWindowsPageFile = (disks: CreateDisk[], pageFileGB: number): CreateDisk[] => {
    if (pageFileGB <= 0) return disks;

    const pDiskIndex = disks.findIndex(disk => disk.nombre_unidad.toUpperCase().includes('P:'));

    if (pDiskIndex >= 0) {
        return disks.map((disk, index) =>
            index === pDiskIndex ? { ...disk, gb_disco: pageFileGB } : disk
        );
    } else {
        return [
            ...disks,
            { nombre_unidad: 'P:', gb_disco: pageFileGB, particiones: [] }
        ];
    }
};

export const labelNextButton = (step: number) => {
    switch (step) {
        case 1:
            return "Validar y continuar"
        case 2:
            return "Continuar"
        case 3:
            return "Validar y continuar"
        case 4:
            return "Continuar"
        case 5:
            return "Enviar Solicitud"
        default:
            return "Continuar"
    }
}

export const parsePayload = (payloadString: string): PayloadExecution => {
    try {
        const payload = JSON.parse(payloadString)

        if (payload && typeof payload === 'object') {
            return payload
        }

        return { extra_vars: {} }

    } catch (error) {
        return { extra_vars: {} }
    }
}

export const DRIVE_REGEX = /^[A-Za-z]:$/;
export const MOUNT_POINT_REGEX = /^\/[a-zA-Z0-9_\-./]*$/;

export const validateDriveName = (name: string) => {
    return DRIVE_REGEX.test(name)
}

export const extractDriveLetter = (path: string) => {
    if (!path) return null;
    // Extrae solo la letra de unidad (C de C: o C:\path)
    const match = path.toUpperCase().match(/^([A-Z]):/)
    return match ? match[1] : null
}

export const normalizeMountPoint = (value: string): string => {
    const cleanedValue = value.replace(/[^a-zA-Z0-9_\-./]/g, '')
    return cleanedValue.startsWith('/') ? cleanedValue : `/${cleanedValue}`
}

export const calculateDiskSize = (so: 'linux' | 'windows', disks: CreateDisk[]) => {
    if (so === 'linux') {
        return disks.reduce((total, disk) => total + (disk.particiones.reduce((pTotal, partition) => pTotal + (partition.gb_particion || 0), 0) || 0), 0)
    } else {
        return disks.reduce((total, disk) => total + (disk.gb_disco || 0), 0)
    }
}

export const getTotalDiskSpace = (discos: Disco[]): number => {
    if (!discos) return 0;
    return discos.reduce((total, disk) => total + disk.GB_DISCO, 0);
}

export const buildBasePayload = (
    formData: any,
    projectHook: any,
    paramsHook: any,
    selectedSO: string
) => {
    return {
        alp:
            projectHook.projects.find((p: any) => p.id === formData.id_proyecto)?.value
                .split("-")[0]
                .trim() ?? "",
        ambito:
            paramsHook.projectScopes.find(
                (p: any) => p.IDOPCION === formData.id_ambito
            )?.VALOR?.toUpperCase() ?? "",
        rol_uso: formData.rol_uso,
        so: selectedSO.toLowerCase() === "linux" ? "LINUX" : "WINDOWS SERVER",
        tipo_servicio:
            paramsHook.requestParams.find(
                (p: any) => p.IDOPCION === formData.id_tipo_servicio
            )?.VALOR.toUpperCase() ?? "",
        vlan_id: formData.vlan_id,
        ubicacion:
            paramsHook.requestParams.find(
                (p: any) => p.IDOPCION === formData.id_ubicacion
            )?.VALOR.toUpperCase() ?? "",
    }
}
