import { useState, useCallback } from "react";
import { BackupService } from "../../../../services/Backup.service";

export const useVersion = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

    const getTasksOfPolicy = useCallback(async (id_politica: string, version: string) => {
        setLoadingTasks(true);
        try {
            const response = await BackupService.listTasksOfPolicyV2(id_politica, version);
            setTasks(response.data.lista || []);
        } catch (e) {
            setTasks([]);
        } finally {
            setLoadingTasks(false);
        }
    }, []);

    return {
        tasks,
        loadingTasks,
        getTasksOfPolicy,
    };
};