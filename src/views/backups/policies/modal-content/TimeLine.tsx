import React from 'react';

/* Estos props se van a definir en types dependiendo de la nueva informacion que llegará en el nuevo endpoint */
type Props = {
    modalInformation: {
        estado_actual: string;
        actor_actual: string;
        usuario_registro?: string;
        fecha_registro?: string;
        usuario_aprobacion?: string;
        fecha_aprobacion?: string;
        // Agrega más campos según tu API
    };
};

//Igual con estos roles...
const roles = [
    'Solicitante',
    'Especialista',
    'Aprobador',
    'Adm. Backup',
    'Sin Actor'
];

const steps = [
    { key: 'Elaborar Solicitud', label: 'Elaborar Solicitud', userField: 'usuario_registro' },
    { key: 'Definir Tareas de Backup', label: 'Definir Tareas de Backup', userField: 'usuario_especialista' },
    { key: 'Aprobar Tareas de Backup', label: 'Aprobar Tareas de Backup', userField: 'usuario_aprobador' },
    { key: 'Implementar Tareas de Backup', label: 'Implementar Tareas de Backup', userField: 'usuario_backup' },
    { key: 'Terminado', label: 'Terminado', userField: 'usuario_terminado' }
];

const getCurrentStep = (estado_actual: string) => {
    return steps.findIndex(step => step.key.toLowerCase() === estado_actual.toLowerCase());
};

const TimeLine: React.FC<Props> = ({ modalInformation }) => {
    const currentStep = getCurrentStep(modalInformation.estado_actual);

    return (
        <div className="InfoSection-timeline">
            <section className="pt-3 m-auto px-4">
                <div className="d-flex align-items-center justify-content-between" style={{ position: 'relative' }}>
                    {steps.map((step, idx) => {
                        const isActive = idx <= currentStep;
                        const isLastStep = idx === steps.length - 1;
                        
                        return (
                            <React.Fragment key={step.key}>
                                {/* Contenedor del paso */}
                                <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
                                    {/* Círculo numerado */}
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            background: isActive ? '#009EF7' : '#E4E6EF',
                                            color: isActive ? '#fff' : '#A1A5B7',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            border: isActive ? '3px solid #009EF7' : '3px solid #E4E6EF'
                                        }}
                                    >
                                        {idx + 1}
                                    </div>
                                    
                                    {/* Información del paso */}
                                    <div style={{ minWidth: '150px', maxWidth: '180px' }}>
                                        <h6 className={`fw-bold mb-1 ${isActive ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '0.9rem' }}>
                                            {step.label}
                                        </h6>
                                        <div className="small text-muted" style={{ fontSize: '0.8rem' }}>
                                            {roles[idx]}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Línea conectora (excepto en el último paso) */}
                                {!isLastStep && (
                                    <div 
                                        style={{
                                            flex: 1,
                                            height: '3px',
                                            background: isActive && idx < currentStep ? '#009EF7' : '#E4E6EF',
                                            margin: '0 -20px',
                                            marginBottom: '80px',
                                            zIndex: 1
                                        }}
                                    />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export { TimeLine };