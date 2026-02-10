import { FC } from "react";
import { CreateDisk } from "../../../Types";

interface StorageProps {
    disks: CreateDisk[];
    selectedSO?: string;
}

export const Storage: FC<StorageProps> = ({ disks, selectedSO }) => {
    const isLinux = selectedSO?.toLowerCase() === "linux";

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="mb-5">
                <h2 className="fw-bold text-dark mb-2">
                    <i className={`bi ${isLinux ? 'bi-server' : 'bi-hdd-stack'} me-3`}></i>
                    Configuración de Almacenamiento
                </h2>
                <p className="text-muted fs-5">
                    {isLinux
                        ? "Particiones montadas en el sistema. Esta es una recomendación basada en el rol de uso seleccionado del servidor."
                        : "Discos configurados en el sistema. Esta es una recomendación basada en el rol de uso seleccionado del servidor."}
                </p>
            </div>

            {/* Listado de Discos */}
            <div className="row g-4">
                {disks.map((disk, index) => (
                    <div key={`disk-${index}`} className="col-12">
                        <DiskCard
                            disk={disk}
                            index={index}
                            isLinux={isLinux}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente para mostrar información del disco
const DiskCard: FC<{
    disk: CreateDisk;
    index: number;
    isLinux: boolean;
}> = ({ disk, isLinux }) => (
    <div className="card shadow-sm border-0">
        <div className={`card-header ${isLinux ? 'bg-light' : 'bg-primary-subtle'} border-0 py-3`}>
            <div className="w-100 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                    <i className={`me-5 bi ${isLinux ? 'bi-hdd-network' : 'bi-hdd-fill'} fs-2 text-primary`}></i>
                    <div className="">
                        <h4 className="mb-0 fw-semibold text-dark">
                            {disk.nombre_unidad}
                            {!isLinux && (
                                <span className="text-muted fs-5 ms-2">
                                    ({disk.gb_disco} GB)
                                </span>
                            )}
                        </h4>

                        {isLinux && (
                            <div className="text-muted fs-6 mt-1">
                                {disk.particiones.length} Particiones · {disk.particiones.map(p => p.gb_particion).reduce((a, b) => (a + b))} GB Totales
                            </div>
                        )}
                    </div>
                </div>

                {isLinux && (
                    <span className="badge bg-info fs-6">
                        {disk.particiones.length} Particiones
                    </span>
                )}
            </div>
        </div>

        {isLinux && disk.particiones.length > 0 && (
            <div className="card-body pt-4">
                <div className="row g-3">
                    {disk.particiones.map((partition, pIndex) => (
                        <div key={`partition-${pIndex}`} className="col-md-6">
                            <div className="p-3 rounded d-flex align-items-start gap-5">
                                <i className={`bi bi-folder-fill text-success fs-3`}></i>
                                <div>
                                    <h5 className="mb-1 fw-semibold">
                                        {partition.punto_montaje || <span className="text-muted">Sin montaje</span>}
                                    </h5>
                                    <span className="text-muted">
                                        {partition.gb_particion} GB asignados
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);