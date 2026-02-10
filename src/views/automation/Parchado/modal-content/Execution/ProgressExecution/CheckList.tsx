import { FC, useEffect } from "react"
import { useExecution } from "../../../../hooks/useExecution"
import { ICheckList } from "../../../../Types"
import { LogDifference } from "../../../../../../components/LogDifference"

type Props = { parentID: number, idExecution: number }

const CheckList: FC<Props> = ({ parentID, idExecution }) => {

  const { getCheckList, checkListData, loadingChecklist } = useExecution()

  useEffect(() => {
    getCheckList(idExecution, parentID)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LogDifference
      items={convertItemsToString(checkListData)}
      loading={loadingChecklist}
      equalLabel="Sin Cambios"
      diffLabel="Cambios"
    />
  )
}
export { CheckList }

const convertItemsToString = (items: ICheckList[]): string[] => {

  const defaultStatus = (status: string) => status === "" ? "No se encuentra servicio" : status
  return items?.map(objeto => {
    const { post_status, pre_status, service } = objeto;

    // Verificar si el estado post es diferente al estado pre
    const prefijo = post_status !== pre_status ? "-" : "+";

    // Concatenar el nombre del servicio, estado actual y estado anterior
    return `${prefijo}  NOMBRE SERVICIO: ${service} | ESTADO ORIGINAL: ${defaultStatus(pre_status)} | ESTADO ACTUAL: ${defaultStatus(post_status)}`;
  });

}




