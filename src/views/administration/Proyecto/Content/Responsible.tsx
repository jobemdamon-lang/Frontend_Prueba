import DataTable from "react-data-table-component"
import { LoadingTable } from "../../../../components/loading/LoadingTable"
import { responsibleColumns } from "./responsible-columns"
import { EmptyData } from "../../../../components/datatable/EmptyData"
import { SearchInput } from "../components/SearchInput"
import { FC, useEffect, useState } from "react"
import { ToolTip } from "../../../../components/tooltip/ToolTip"
import SVG from "react-inlinesvg"
import { toAbsoluteUrl } from "../../../../helpers/AssetHelpers"
import { useProjectSubModuleContext } from "../Context"
import { ICollaborators, IProject, ModalSize, ModalView } from "../../Types"

const paginationComponentOptions = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
}

const customStyles = {
  headRow: {
    style: {
      border: 'none',
      backgroundColor: 'rgb(230, 244, 244)',
    },
  },
  headCells: {
    style: {
      fontSize: '14px',
    },
  },
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: 'rgb(230, 244, 244)',
      borderBottomColor: '#FFFFFF',
      borderRadius: '10px',
      outline: '1px solid #FFFFFF',
    },
  },
  pagination: {
    style: {
      border: 'none',
    },
  },
}

type Props = {
  InfoProjectData: IProject
}

const Responsible: FC<Props> = ({ InfoProjectData }) => {

  const [searchedValue, setSearchedValue] = useState("")
  const [filteredData, setFilteredData] = useState(InfoProjectData.lista_usuarios)
  const { modalHook } = useProjectSubModuleContext()

  useEffect(() => {
    if (searchedValue === "") {
      setFilteredData(InfoProjectData.lista_usuarios)
    } else {
      let newData: ICollaborators[] = filteredData?.filter((user: ICollaborators) => {
        return user.NOMBRE.toLowerCase().includes(searchedValue.toLowerCase())
      })
      setFilteredData(newData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedValue])

  //Si la informacion del listado cambia, actualizar la data en la vista
  useEffect(() => {
    setFilteredData(InfoProjectData.lista_usuarios)
  }, [InfoProjectData])

  return (
    <div className="p-8 ">
      <div className="d-flex gap-5 justify-content-end">
        <SearchInput value={searchedValue} setValue={setSearchedValue} />
        <ToolTip message="Agregar Colaborador" placement="top">
          <button
            onClick={() => modalHook.openModal(ModalView.ADD_COLABORATOR, ModalSize.SM, undefined, {})}
            className="border-0 bg-white">
            <SVG width={40} height={40} src={toAbsoluteUrl('/media/icons/duotune/communication/com005.svg')} />
          </button>
        </ToolTip>
      </div>
      <div style={{ position: 'relative' }} className="p-8">
        <DataTable
          columns={responsibleColumns(modalHook.openModal)}
          persistTableHead
          highlightOnHover
          pagination
          fixedHeader
          customStyles={customStyles}
          noDataComponent={<EmptyData loading={false} />}
          paginationComponentOptions={paginationComponentOptions}
          disabled={false}
          data={filteredData}
        />
        {false && <LoadingTable description='Cargando' />}
      </div>
    </div>
  )
}
export { Responsible }