import { useConfigurationItemsContext } from "../Context"
import { KTSVG } from "../../../../helpers/components/KTSVG"
import { IConfigurationItem } from "../../Types"
import { Tab, Tabs } from "../../../../components/Tabs"
import { Input } from "../../../../components/Inputs/TextInput"
import { notNull } from "../../../../helpers/general"
import { Simple } from "./DynamicForm/Simple"
import { List } from "./DynamicForm/List"
import { Multiple } from "./DynamicForm/Multiple"
import { useEffect } from "react"
import { useCI } from "../../hooks/useCI"
import { Loading } from "../../../../components/Loading"
import { NoFoundData } from "../../../../components/NoFoundData"
import { LogsTable } from "./LogsTable"

const InformationCI = () => {

    const { modalHook } = useConfigurationItemsContext()
    const modalInformation: IConfigurationItem = modalHook.modalInformation
    const {
        getValuesOfDynamicAttributesByCI,
        loadingListDynamicAttributes,
        dynamicValuesOfAttributes,
        getAuditCILogs,
        loadingAuditCILogs,
        auditCILogs
    } = useCI()

    const handleChangeNothing = () => null

    useEffect(() => {
        if (
            modalInformation &&
            modalInformation.IDOPCION !== undefined &&
            modalInformation.ID_EQUIPO !== undefined
        ) {
            getValuesOfDynamicAttributesByCI(
                modalInformation.IDOPCION.toString(),
                modalInformation.ID_EQUIPO.toString()
            );
            getAuditCILogs(modalInformation.ID_EQUIPO.toString(), {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalInformation]);

    return (
        <>
            <div className='modal-header px-5 py-3'>
                <h2 className="text-dark">Información del CI - {modalInformation.NOMBRE_CI}</h2>
                <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
                    <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
                </div>
            </div>
            <div className='modal-body px-15'>
                <Tabs>
                    <Tab title="GENERAL">
                        <section className="d-flex justify-content-around flex-wrap gap-5">
                            <Input
                                label="FAMILIA"
                                value={notNull(modalInformation.FAMILIA)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="CLASE"
                                value={notNull(modalInformation.CLASE)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="HOSTNAME"
                                value={notNull(modalInformation.NOMBRE)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="IP PRINCIPAL"
                                value={notNull(modalInformation.IPLAN)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="CLIENTE"
                                value={notNull(modalInformation.CLIENTE)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="PROYECTO"
                                value={notNull(modalInformation.PROYECTO)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="ALP"
                                value={notNull(modalInformation.ALP)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="UBICACIÓN"
                                value={notNull(modalInformation.UBICACION)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="SEDE DE CLIENTE"
                                value={notNull(modalInformation.SEDE_CLIENTE)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="NOMBRE VIRTUAL"
                                value={notNull(modalInformation.NOMBRE_VIRTUAL)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="CONSOLA DE ADMINISTRACIÓN"
                                value={notNull(modalInformation.VCENTER)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="ESTADO"
                                value={notNull(modalInformation.EQUIPO_ESTADO)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="AMBIENTE"
                                value={notNull(modalInformation.AMBIENTE)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="ROL DE USO"
                                value={notNull(modalInformation.ROL_USO)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="CRITICIDAD"
                                value={notNull(modalInformation.PRIORIDAD)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="TIPO DE SERVICIO"
                                value={notNull(modalInformation.TIPO_SERVICIO)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="SERVICIO DE NEGOCIO"
                                value={notNull(modalInformation.SERVICIO_NEGOCIO)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="TIPO DE EQUIPO"
                                value={notNull(modalInformation.TIPO_EQUIPO)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="TICKET DE ALTA"
                                value={notNull(modalInformation.CRQ_ALTA)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="TICKET DE BAJA"
                                value={notNull(modalInformation.TICKET_BAJA)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="ADMINISTRADOR TORRE"
                                value={notNull(modalInformation.ADMINISTRADOR)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="TIPO DE ALCANCE"
                                value={notNull(modalInformation.TIPO_ALCANCE)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="BACKUPS"
                                value={notNull(modalInformation.BACKUPS)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="MONITOREO"
                                value={notNull(modalInformation.MONITOREO)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="BACKUPS NUBE"
                                value={notNull(modalInformation.BACKUPS_CLOUD)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                            <Input
                                label="MONITOREO NUBE"
                                value={notNull(modalInformation.MONITOREO_CLOUD)}
                                disabled={true}
                                onChange={handleChangeNothing}
                            />
                        </section>
                    </Tab>
                    <Tab title="ESPECIFICOS">
                        {loadingListDynamicAttributes ?
                            <Loading loadingText="Cargando Información..." />
                            :
                            <section className="d-flex justify-content-center flex-wrap gap-5 align-items-top">
                                {dynamicValuesOfAttributes.map(item => {
                                    return (
                                        <div key={item.ATRIBUTO}>
                                            {item.ATRIBUTO === "SIMPLE" && <Simple attributes={item.HIJOS} disabled={true} />}
                                            {item.ATRIBUTO === "LISTA" && <List attributes={item.HIJOS} disabled={true} />}
                                            {item.ATRIBUTO === "MULTIPLE" && <Multiple attributes={item.HIJOS} disabled={true} />}
                                        </div>
                                    )
                                })}
                            </section>
                        }
                        {!loadingListDynamicAttributes && dynamicValuesOfAttributes.length === 0 &&
                            <NoFoundData message="No se han encontrado atributos personalizados para este CI." />
                        }
                    </Tab>
                    <Tab title="AUDITORÍA">
                        <LogsTable logs={auditCILogs} loading={loadingAuditCILogs} idCI={modalInformation.ID_EQUIPO} />
                    </Tab>
                </Tabs>
                <div className="d-flex justify-content-end align-items-end mt-10">
                    <button
                        onClick={() => modalHook.closeModal()}
                        className="btn btn-danger "
                        type="button">
                        Cancelar
                    </button>
                </div>
            </div>
        </>
    )
}
export { InformationCI }