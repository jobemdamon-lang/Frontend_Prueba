import { CIGroupedMetrics, CIGroupedMetricsInternal, MetricParamChange, MetricParameter, MetricVersion, ParamValue, Urgent, Version } from "./Types";

export const THRESHOLDS = ['WARNING', 'CRITICAL', 'FATAL', 'INFORMATIVO']

export const findNormalParameters = (params: MetricParameter[]): MetricParameter[] => {
    return params.filter(param => {
        return !THRESHOLDS.includes(param.URGENCIA?.toUpperCase() ?? '')
    })
}

export const findThresholdParameters = (params: MetricParameter[]): MetricParameter[] => {
    return params.filter(param => {
        return THRESHOLDS.includes(param.URGENCIA?.toUpperCase() ?? '')
    })
}

export const findUrgent = (params: MetricParameter[], type: Urgent): MetricParameter | undefined => {
    switch (type) {
        case 'WARNING':
            return params.find(param => param.URGENCIA === 'WARNING')
        case 'CRITICAL':
            return params.find(param => param.URGENCIA === 'CRITICAL')
        case 'FATAL':
            return params.find(param => param.URGENCIA === 'FATAL')
        case 'INFORMATIVO':
            return params.find(param => param.URGENCIA === 'INFORMATIVO')
        default:
            return params.find(param => param.URGENCIA === 'WARNING')
    }
}

export const groupByCI = (metrics: MetricVersion[]): CIGroupedMetrics[] => {
    const acc: CIGroupedMetricsInternal[] = []

    metrics.forEach((metric) => {
        const index = acc.findIndex((item) => item.ID_EQUIPO === metric.ID_EQUIPO)

        if (index === -1) {
            acc.push({
                ID_EQUIPO: metric.ID_EQUIPO,
                NOMBRE_CI: metric.NOMBRE_CI,
                CLASE: metric.CLASE,
                FAMILIA: metric.FAMILIA,
                ID_OPCION: metric.ID_FAMILIA_CLASE,
                IP: new Set(metric.NRO_IP !== null ? [metric.NRO_IP] : []),
                METRICAS: [metric]
            })
        } else {
            if (metric.NRO_IP !== null) {
                acc[index].IP.add(metric.NRO_IP)
            }
            acc[index].METRICAS.push(metric)
        }
    })

    return acc.map(item => ({
        ...item,
        IP: Array.from(item.IP)
    }))
}

export const findLastImplementedVersion = (versions: Version[]): Version | undefined => {
    return versions
        .sort((a, b) => b.NRO_VERSION - a.NRO_VERSION)
        .find(version => version.ESTADO_POLITICA?.toUpperCase() === 'IMPLEMENTADO')
}

export const hasMetricChanges = (originalMetric: MetricVersion, formValues: Record<string, string>): boolean => {

    let hasChanges = false
    // Verificar cambios en campos básicos
    if (formValues['frequency']?.trim() !== (originalMetric.FRECUENCIA || '').trim()) hasChanges = true
    if (formValues['ip_select']?.trim() !== (originalMetric.NRO_IP || '').trim()) hasChanges = true
    if (formValues['tool_select']?.toUpperCase().trim() !== (originalMetric.HERRAMIENTA || '').toUpperCase().trim()) hasChanges = true

    // Verificar cambios en umbrales
    const thresholdTypes: ('WARNING' | 'CRITICAL' | 'FATAL' | 'INFORMATIVO')[] = ['WARNING', 'CRITICAL', 'FATAL', 'INFORMATIVO']
    for (const type of thresholdTypes) {
        const lowerType = type.toLowerCase()
        const umbralKey = `${lowerType}_umbral`
        const pooleoKey = `${lowerType}_pooleo`

        const originalThreshold = originalMetric.VALORES_PARAMETROS.find(
            p => p.URGENCIA === type
        )

        const newUmbral = formValues[umbralKey]?.trim() || ''
        const newPooleo = formValues[pooleoKey]?.trim() || ''

        if (originalThreshold) {
            const originalUmbral = (originalThreshold.UMBRAL || '').trim()
            const originalPooleo = (originalThreshold.NRO_POOLEOS || '').trim()
            if (newUmbral !== originalUmbral || newPooleo !== originalPooleo) hasChanges = true
        } else {
            if (newUmbral || newPooleo) hasChanges = true
        }
    }

    // Verificar parámetros de datos
    const dataParameters = originalMetric.VALORES_PARAMETROS.filter(
        p => !THRESHOLDS.includes(p.URGENCIA || '')
    )

    for (const param of dataParameters) {
        const paramKey = param.ID_DETALLE_METRICA_VALOR.toString()
        const originalValue = (param.PARAMETRO_VALOR || '').trim()
        const newValue = (formValues[paramKey] || '').trim()
        if (newValue !== originalValue) hasChanges = true
    }

    return hasChanges
}

export const findUrgentCatalog = (params: ParamValue[], type: Urgent): ParamValue | undefined => {
    switch (type) {
        case 'WARNING':
            return params.find(param => param.URGENCIA === 'WARNING')
        case 'CRITICAL':
            return params.find(param => param.URGENCIA === 'CRITICAL')
        case 'FATAL':
            return params.find(param => param.URGENCIA === 'FATAL')
        case 'INFORMATIVO':
            return params.find(param => param.URGENCIA === 'INFORMATIVO')
        default:
            return params.find(param => param.URGENCIA === 'WARNING')
    }
}

export const findNormalParametersCatalog = (params: ParamValue[]): ParamValue[] => {
    return params.filter(param => {
        return !THRESHOLDS.includes(param.URGENCIA?.toUpperCase() ?? '')
    })
}

export const findThresholdParametersCatalog = (params: ParamValue[]): ParamValue[] => {
    return params.filter(param => {
        return THRESHOLDS.includes(param.URGENCIA?.toUpperCase() ?? '')
    })
}

export const toSQLServerFormat = (date: Date): string => {
    const pad = (n: number, z = 2) => String(n).padStart(z, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.` +
        `${pad(date.getMilliseconds(), 3)}`;
}

export const findUrgentChange = (params: MetricParamChange[], type: Urgent): MetricParamChange | undefined => {
    switch (type) {
        case 'WARNING':
            return params.find(param => param.URGENCIA === 'WARNING')
        case 'CRITICAL':
            return params.find(param => param.URGENCIA === 'CRITICAL')
        case 'FATAL':
            return params.find(param => param.URGENCIA === 'FATAL')
        case 'INFORMATIVO':
            return params.find(param => param.URGENCIA === 'INFORMATIVO')
        default:
            return params.find(param => param.URGENCIA === 'WARNING')
    }
}

export const findNormalParametersChange = (params: MetricParamChange[]): MetricParamChange[] => {
    return params.filter(param => {
        return !THRESHOLDS.includes(param.URGENCIA?.toUpperCase() ?? '')
    })
}

export const getTypeChangeLabel = (tipo: string) => {
    switch (tipo.toUpperCase()) {
        case 'ACTUALIZACION METRICA':
            return 'Actualización Métrica';
        case 'NUEVA METRICA':
            return 'Nueva Métrica';
        case 'BAJA METRICA':
            return 'Baja Métrica';
        case 'NUEVO CI':
            return 'Nuevo CI';
        case 'BAJA CI':
            return 'Baja CI';
        default:
            return tipo;
    }
}

export const getBadgeColor = (urgency: string) => {
    switch (urgency.toUpperCase()) {
        case 'WARNING':
            return 'badge-light-info';
        case 'CRITICAL':
            return 'badge-light-warning';
        case 'FATAL':
            return 'badge-light-danger';
        case 'INFORMATIVO':
            return 'badge-light-primary';
        default:
            return 'badge-light-dark';
    }
}

export const getIconColor = (urgency: string) => {
    switch (urgency.toUpperCase()) {
        case 'WARNING':
            return 'bi-exclamation-triangle-fill text-info';
        case 'CRITICAL':
            return 'bi-exclamation-circle-fill text-warning';
        case 'FATAL':
            return 'bi-exclamation-circle-fill text-danger';
        case 'INFORMATIVO':
            return 'bi-check-circle-fill text-primary';
        default:
            return 'bi-check-circle-fill text-black';
    }
};


export const getBadgeColorTypeChange = (typeChange: string): string => {
    switch (typeChange.toUpperCase()) {
        case 'NUEVA METRICA':
            return 'badge-light-success';
        case 'NUEVO CI':
            return 'badge-light-info';
        case 'BAJA METRICA':
            return 'badge-light-danger';
        case 'BAJA CI':
            return 'badge-light-danger';
        default:
            return 'badge-light-primary';
    }
}

export const isValidTicket = (ticket: string) => {
    const regex = /^(100|200|300|400|500)-\d+$/;
    return regex.test(ticket)
}