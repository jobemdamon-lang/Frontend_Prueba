import { useCallback, useState } from "react";
import { BackupService } from "../../../../services/Backup.service";
import { IGroupPolicies, IGroupPoliciesDataListFormat, ICreateGroup } from "../Types";

export const useGroupPolicies = () => {
    const [groupPolicies, setGroupPolicies] = useState<IGroupPoliciesDataListFormat[]>([]);
    const [groupPoliciesLoading, setGroupPoliciesLoading] = useState(false);
    const [createGroupPolicyLoading, setCreateGroupPolicyLoading] = useState(false);
    const [groupCreatedSuccessfully, setGroupCreatedSuccessfully] = useState(false);


    const getGroupPolicies = useCallback(async (idProject: number) => {
        setGroupPoliciesLoading(true);
        setGroupPolicies([]);
        try {
            const response = await BackupService.getGroupPolicies(idProject);
            if (response.status === 200) {
                const formatted = (response.data.lista || []).map((g: IGroupPolicies) => ({
                    id: g.codigo,
                    value: g.nombre
                }));
                setGroupPolicies(formatted);
            } else {
                setGroupPolicies([]);
            }
        } catch (e) {
            setGroupPolicies([]);
        } finally {
            setGroupPoliciesLoading(false);
        }
    }, []);

    const createGroupPolicy = useCallback(async (createInformation: ICreateGroup) => {
        setCreateGroupPolicyLoading(true);
        try {
            const response = await BackupService.createGroupPolicy(createInformation);
            if (response.status === 201 || response.status === 200) {
                setGroupCreatedSuccessfully(true); 
            }
        } catch (e) {
            console.error("Error creating group policy:", e);
            //error notification
        } finally {
            setCreateGroupPolicyLoading(false);
        }
    }, []);

    return {
        groupPolicies,
        groupPoliciesLoading,
        getGroupPolicies,
        createGroupPolicy,
        createGroupPolicyLoading,
        groupCreatedSuccessfully,
        setGroupCreatedSuccessfully
    };
};