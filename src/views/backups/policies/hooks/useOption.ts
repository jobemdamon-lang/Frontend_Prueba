import { useCallback, useState } from "react";
import { BackupService } from "../../../../services/Backup.service";
import { IPolicy } from '../Types';

export const useOptions = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [policiesLoading, setPoliciesLoading] = useState(false);

    const [requests, setRequests] = useState<any[]>([]);
    const [requestsLoading, setRequestsLoading] = useState(false);

    const getPolicies = useCallback(async (idGroup: number) => {
        setPoliciesLoading(true);
        try {
            const response = await BackupService.listPolicies(idGroup.toString());
            setPolicies(response.lista || []);
        } catch (e) {
            setPolicies([]);
        } finally {
            setPoliciesLoading(false);
        }
    }, []);

    const getRequests = useCallback(async (idGroup: number) => {
        setRequestsLoading(true);
        try {
            const response = await BackupService.listRequests(idGroup.toString());
            setRequests(response.lista || []);
        } catch (e) {
            setRequests([]);
        } finally {
            setRequestsLoading(false);
        }
    }, []);

    return {
        policies,
        policiesLoading,
        getPolicies,

        requests,
        requestsLoading,
        getRequests,
    };
};