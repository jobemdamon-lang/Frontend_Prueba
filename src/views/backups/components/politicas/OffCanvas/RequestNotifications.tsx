import { RequestNotification } from "./RequestNotification"
import { useRequestChanges } from "../../../hooks/useRequestChanges"
import { useEffect, useState } from "react"
import { IDataRequestChangeByUser } from "../Types"
import SVG from "react-inlinesvg"
import { Spinner } from "react-bootstrap"
import { toAbsoluteUrl } from "../../../../../helpers"
import { shallowEqual, useSelector } from "react-redux"
import { RootState } from "../../../../../store/ConfigStore"
import { IAuthState } from "../../../../../store/auth/Types"
import { SearchInput } from "../../../../../components/SearchInput/SearchInput"
import { ToolTip } from "../../../../../components/tooltip/ToolTip"

const RequestNotifications = () => {

  const { fetchRequestChangesByUser, loadingRequestByUser, requestchangesDataByUser } = useRequestChanges()
  const user: IAuthState = useSelector<RootState>(({ auth }) => auth, shallowEqual) as IAuthState
  const [filteredChangesRequest, setFilteredChangesRequest] = useState<Array<IDataRequestChangeByUser>>(requestchangesDataByUser)
  const [searchedTicket, setSearchedTicket] = useState("")

  useEffect(() => {
    fetchRequestChangesByUser(user.usuario)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const requestFiltered = requestchangesDataByUser.filter((request: IDataRequestChangeByUser) => request.NRO_TICKET?.toString().toLowerCase().includes(searchedTicket.toLowerCase()))
    setFilteredChangesRequest(requestFiltered)
  }, [requestchangesDataByUser, searchedTicket])

  return (
    <>
      {loadingRequestByUser &&
        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
          <Spinner animation="border" role="status">
          </Spinner>
          <br />
          <span><strong> Cargando Solicitudes...</strong></span>
        </div>}
      {requestchangesDataByUser.length === 0 ?
        <div className="h-100 d-flex flex-column justify-content-center align-items-center">
          <SVG src={toAbsoluteUrl("/media/svg/illustrations/easy/empty.svg")} width={180} height={180} />
          <br />
          <span><strong>No se han encontrado Solicitudes.</strong></span>
        </div>
        :
        <div className="d-flex flex-column justify-content-center align-items-center gap-5">
          <ToolTip message="Busqueda por Nro. Ticket" placement="top-start">
            <SearchInput value={searchedTicket} setValue={setSearchedTicket} placeholder="Busqueda por Ticket.."/>
          </ToolTip>

          {
            filteredChangesRequest?.map((request: IDataRequestChangeByUser, index: number) => {
              return <RequestNotification requestInfo={request} key={index} />
            })
          }
        </div>
      }
    </>
  )
}
export { RequestNotifications }