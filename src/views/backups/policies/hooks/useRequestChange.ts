import { useCallback, useState } from "react";
import { BackupService } from "../../../../services/Backup.service";

export const useRequestChange = () => {
    const [requestChange, setRequestChange] = useState<any>(null);
    const [requestChangeLoading, setRequestChangeLoading] = useState(false);

    // Método para obtener el detalle de una solicitud de cambio por ID
    const getRequestChange = useCallback(async (id: string | number) => {
        setRequestChangeLoading(true);
        try {
            const response = await BackupService.listRequestDetails(id.toString());
            setRequestChange(response.data || null);
        } catch (e) {
            setRequestChange(null);
        } finally {
            setRequestChangeLoading(false);
        }
    }, []);

    return {
        requestChange,
        requestChangeLoading,
        getRequestChange,
    };
};