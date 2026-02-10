import {
  FC, useContext, useEffect, useState
} from 'react'
import { KTSVG } from '../../../helpers'
import { ContextPolitica } from "./ContextPolitica"
import { IListCatalog, IMonitoringPolicyVersions, ModalSize, ModalView } from './Types'
import "../../../assets/sass/components/InventoryFilter/data-list-input-styles.scss"
import { toast } from 'react-toastify'
import { useCatalog } from './hooks/useCatalog'
import { useCatalog as useCatalogV2 } from "../politicas_v2/hooks/useCatalog"
import { AccessController } from '../../../components/AccessControler'
import { warningNotification } from '../../../helpers/notifications'
import { DataList } from '../../../components/Inputs/DataListInput'
import { ProjectMonitored } from '../politicas_v2/Types'

const FilterSection: FC = (): JSX.Element => {

  const { getProjectsMonitoringOldVersion, loadingProjectsOld } = useCatalogV2()
  const [catalogLoading, setCatalogLoading] = useState(false)
  const { fetchListCatalog } = useCatalog()
  const { selectedOwner, setSelectedOwner, openModal, getListPoliciesByProject, policiesByProject, rol } = useContext(ContextPolitica)

  const [projects, setProjects] = useState<ProjectMonitored[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectMonitored[]>([])
  const [clients, setClients] = useState<string[]>([])

  useEffect(() => {
    getProjectsMonitoringOldVersion(0).then(response => {
      if (response) {
        setProjects(response)
        setFilteredProjects(response)

        // Extraer clientes únicos de los proyectos
        const uniqueClients = [...new Set(response.map((p: any) => p.CLIENTE))]
        setClients(uniqueClients.sort())
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClientChange = (clientName: string) => {
    setSelectedOwner((prev: any) => ({ ...prev, cliente: clientName, proyecto: "" }))

    // Filtrar proyectos por cliente seleccionado
    const filtered = clientName
      ? projects.filter((p: any) => p.CLIENTE === clientName)
      : projects

    setFilteredProjects(filtered)
  }

  const onProjectChange = (projectID: any) => {
    const findedProject = projects.find(p => p.ID_PROYECTO === Number(projectID))
    if (!findedProject) return

    setSelectedOwner((prev: any) => ({
      ...prev,
      proyecto: findedProject.NOMBRE_PROYECTO,
      id_proyecto: findedProject.ID_PROYECTO
    }))
    getListPoliciesByProject(findedProject.ID_PROYECTO.toString())
  }

  return (
    <div className='accordion' id='kt_accordion_1'>
      <div className='accordion-item'>
        <h2 className='accordion-header' id='kt_accordion_1_header_1'>
          <button
            className='accordion-button fs-4 fw-bold collapsed bg-dark bg-gradient'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#kt_accordion_1_body_1'
            aria-expanded='false'
            aria-controls='kt_accordion_1_body_1'
          >
            <div className='d-flex flex-row justify-content-around'>
              <div>
                <span className='card-title fw-bolder mb-1 mx-5 text-white'>Filtros</span>
                <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-2' />
              </div>
            </div>
          </button>
        </h2>
        <div
          id='kt_accordion_1_body_1'
          className='accordion-collapse collapse '
          aria-labelledby='kt_accordion_1_header_1'
          data-bs-parent='#kt_accordion_1'
        >
          <div className='d-flex flex-direction-row justify-content-around flex-wrap align-items-end gap-3 p-10'>
            <div className="w-100 mb-4">
              <div className="alert alert-primary d-flex align-items-center p-5">
                <i className="bi bi-exclamation-triangle-fill fs-2 me-4 text-primary"></i>
                <div>
                  <h5 className="fw-bold mb-1">¿No encuentras tu cliente o proyecto?</h5>
                  <p className="mb-0">
                    Si tu cliente o proyecto no aparece en la lista, por favor revisa el
                    <a href="https://canviacloudsuite.azurewebsites.net/monitoring/politicasv2" className="text-primary fw-bold ms-1 me-1">
                      nuevo módulo de monitoreo
                    </a>
                    donde podrás gestionar todas tus políticas actualizadas.
                  </p>
                </div>
              </div>
            </div>
            <DataList
              label="Cliente"
              value={selectedOwner.cliente}
              loading={loadingProjectsOld}
              items={clients.map(client => ({
                id: client,
                value: client,
                node: (
                  <span className="text-gray-800">
                    <i className="bi bi-person-square me-2" />
                    {client}
                  </span>
                ),
              }))}
              onChange={onClientChange}
            />
            <DataList
              label="Proyecto"
              value={selectedOwner.proyecto}
              loading={loadingProjectsOld}
              items={filteredProjects.map(p => ({
                id: p.ID_PROYECTO,
                value: p.ID_PROYECTO?.toString(),
                node: (
                  <span className="text-gray-800">
                    <i className="bi bi-building me-2"></i>
                    {p.NOMBRE_PROYECTO}
                  </span>
                ),
              }))}
              onChange={onProjectChange}
            />
            <div className='d-flex gap-3'>
              {policiesByProject.length === 0 &&
                <button
                  type="button"
                  onClick={() => {
                    if (selectedOwner.proyecto === "") {
                      toast.warn("Debe Seleccionar un Proyecto.", {
                        position: toast.POSITION.TOP_RIGHT
                      })
                    } else {
                      if (['2425', '2451', '3013'].includes(selectedOwner.id_proyecto?.toString())) {
                        warningNotification('Esta politica esta siendo migrada/regularizada por favor realizar el cambio en el excel habitual.')
                        return
                      }
                      setCatalogLoading(true)
                      fetchListCatalog(selectedOwner.id_proyecto.toString()).then((listCatalog: IListCatalog[]) => {
                        setCatalogLoading(false)
                        openModal(ModalView.CREATE_NEW_POLICY_MONITORING, ModalSize.XL, listCatalog)
                      })
                    }
                  }}
                  className="btn btn-success" id='form-filter-btnClean'>
                  {catalogLoading ? "Generando" : "Nuevo"}
                </button>
              }
              {selectedOwner.proyecto !== "" && policiesByProject.length !== 0 &&
                <>
                  <AccessController rol={rol} allowedRoles={['admin', 'ejecutor']}>
                    <button
                      type="button"
                      onClick={() => {
                        if (['2425', '2451', '3013'].includes(selectedOwner.id_proyecto?.toString())) {
                          warningNotification('Esta politica esta siendo migrada/regularizada por favor realizar el cambio en el excel habitual.')
                          return
                        }
                        let forImplementedVersion = []
                        const hasAInProcessChange = policiesByProject.some((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'EN COLA')
                        if (hasAInProcessChange) {
                          forImplementedVersion = policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'EN COLA')[0]
                        } else if (policiesByProject.some((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'POR IMPLEMENTAR')) {
                          forImplementedVersion = policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'POR IMPLEMENTAR')[0]
                        } else if (policiesByProject.some((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'IMPLEMENTADO')) {
                          forImplementedVersion = policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'IMPLEMENTADO')[policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'IMPLEMENTADO').length - 1]
                        }
                        openModal(ModalView.UPDATE_CURRENT_POLICY, ModalSize.XL, forImplementedVersion, true)
                      }}
                      className="btn btn-primary"
                      id='form-filter-btnClean'>
                      Actualizar Politica
                    </button>
                  </AccessController>
                  <AccessController rol={rol} allowedRoles={['admin', 'ejecutor']}>
                    <button
                      type="button"
                      onClick={() => {
                        if (['2425', '2451', '3013'].includes(selectedOwner.id_proyecto?.toString())) {
                          warningNotification('Esta politica esta siendo migrada/regularizada por favorrealizar el cambio en el excel habitual.')
                          return
                        }
                        let forImplementedVersion = []
                        const hasAInProcessChange = policiesByProject.some((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'POR IMPLEMENTAR')
                        if (hasAInProcessChange) {
                          forImplementedVersion = policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'POR IMPLEMENTAR')[0]
                        } else if (policiesByProject.some((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'EN COLA')) {
                          forImplementedVersion = policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'EN COLA')[0]
                        } else if (policiesByProject.some((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'IMPLEMENTADO')) {
                          forImplementedVersion = policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'IMPLEMENTADO')[policiesByProject.filter((version: IMonitoringPolicyVersions) => version.ESTADO_POLITICA === 'IMPLEMENTADO').length - 1]
                        }
                        openModal(ModalView.DELETE_CI_OF_POLICY, ModalSize.XL, forImplementedVersion)
                      }}
                      className="btn btn-danger"
                      id='form-filter-btnClean'>
                      Dar de Baja un CI
                    </button>
                  </AccessController>
                  <button
                    type="button"
                    onClick={() => openModal(ModalView.HISTORIC_CHANGES, ModalSize.LG, { id_politica: policiesByProject[0].ID_POLITICA }, true)}
                    className="btn btn-info"
                    id='form-filter-btnClean'>
                    Historial
                  </button>
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { FilterSection }