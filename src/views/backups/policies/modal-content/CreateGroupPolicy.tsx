import { useContext } from "react";
import { KTSVG } from "../../../../helpers/components/KTSVG";
import { Context } from "../Context";
import { ICreateGroup } from "../Types";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "../../../../store/ConfigStore";
import { IAuthState } from "../../../../store/auth/Types";
import { useGroupPolicies } from "../hooks/useGroupPolitics";

const CreateGroupPolicy = () => {
  const { 
    globalParams,
    modalHook,
    getGroupPolicies
  } = useContext(Context);

  const { createGroupPolicy, createGroupPolicyLoading } = useGroupPolicies();

  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState;

  const groupToCreate: ICreateGroup = {
    cliente: globalParams.clientName,
    alp: globalParams.alp,
    id_proyecto: globalParams.projectID,
    usuario: user.usuario
  };

  const handleCreate = async() => {
      await createGroupPolicy(groupToCreate);
      if (globalParams.projectID) {
        await getGroupPolicies(globalParams.projectID);
      }
      modalHook.closeModal();
  }

  return (
    <>
      <div className='modal-header py-4'>
        <h2>Creación de Grupo</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
        </div>
      </div>
      <div className='modal-body pt-2 px-lg-10'>
        <p>Se creará un Grupo de Política para:</p>
        <ul>
          <li><strong>Cliente: </strong>{globalParams.clientName}</li>
          <li><strong>Proyecto: </strong>{globalParams.projectName}</li>
          <li><strong>ALP: </strong>{globalParams.alp}</li>
        </ul>
        <strong>¿Desea continuar con la creación?</strong>
        <div className="d-flex gap-5 justify-content-around mt-5">
          <button
            disabled={createGroupPolicyLoading}
            className="btn btn-primary btn-sm"
            onClick={handleCreate}
          >
            {createGroupPolicyLoading ? "Creando..." : "Crear Grupo"}
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => modalHook.closeModal()}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
};
export { CreateGroupPolicy };