/* import React, { FC } from "react" */
import { useEffect, useContext } from 'react';
import { useClient } from '../../../../../../hooks/useClient';
import { useProjects } from '../../../../hooks/useProjects';
import { Context } from '../../Context';
import { DataList } from '../../../../../../components/Inputs/DataListInput';
import { IGroupPoliciesDataListFormat } from '../../Types';

//Funcion para extraer el ALP del nombre del Proyecto
const getALP = (projectName: string): string => projectName?.split("-")[0] ?? ""

const DataListInputs = (): JSX.Element => {

  const { clientsWithCMDB, getClientsWithCMDBD } = useClient()
  const [projectsData, fetchProjects] = useProjects()
  const { fetchPolitics, fetchRequestChanges, groupPoliticsData, fetchGroupPolitics, groupPoliticsFetchStatus,
    groupPoliticsDataErrorMessage, selectedOwner, setSelectedOwner, selectedGroupPolicies, setSelectedGroupPolicies } = useContext(Context)

  useEffect(() => {
    getClientsWithCMDBD()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='d-flex flex-direction-row justify-content-around flex-wrap gap-3'>
      <div>
        <DataList
          value={selectedOwner.cliente}
          label="CLIENTE"
          onChange={(value) => {
            fetchProjects(value)
            //Se settea el valor del cliente seleccionado, se resetea el valor del proyecto y grupo 
            setSelectedOwner((prev: any) => ({ ...prev, cliente: value }))
            setSelectedOwner((prev: any) => ({ ...prev, proyecto: "" }))
            setSelectedGroupPolicies({ id: 0, value: "" })
          }}
          items={clientsWithCMDB}
        />
      </div>
      <div>
        <DataList
          value={selectedOwner.proyecto}
          label="PROYECTO"
          onChange={(projectValue) => {
            const findedProject = projectsData.find((project: any) => project.value === projectValue)
            if (findedProject) {
              setSelectedOwner((prev: any) => ({ ...prev, proyecto: findedProject.value, id_proyecto: findedProject.id, alp: getALP(findedProject.value) }))
              fetchGroupPolitics(findedProject.id)
            }
          }}
          items={projectsData}
        />
      </div>
      <div>
        <DataList
          value={selectedGroupPolicies.value}
          label="GRUPO DE POLITICA"
          onChange={(groupPolitic) => {
            const groupSelected = groupPoliticsData.find((group: IGroupPoliciesDataListFormat) => group.value === groupPolitic)
            if (groupSelected) {
              //Se hace fetch de las politicas de ese grupo
              fetchPolitics(groupSelected.id.toString())
              //Se hace fetch de solicitudes de cambio de ese grupo
              fetchRequestChanges(groupSelected.id.toString())
              //Se almancena el grupo selecionado en el estado selectedGroupPolicies
              setSelectedGroupPolicies(groupSelected)
            }
          }}
          items={groupPoliticsData}
        />
        {!groupPoliticsFetchStatus && <span style={{ color: "#ff6961", margin: "10px" }}>{groupPoliticsDataErrorMessage}</span>}
      </div>
    </div>


  )

}
export { DataListInputs }