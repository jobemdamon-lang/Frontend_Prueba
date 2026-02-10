import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from "../../../../../helpers"
import { IListServerAssigned, IServerInformation } from '../../../Types'
import { FC } from 'react'

type Props = {
  getServersInfoLoading: boolean,
  serverInformationData: IServerInformation,
  modalInformation: IListServerAssigned
}

const ServerSpecifications: FC<Props> = ({ getServersInfoLoading, serverInformationData, modalInformation }) => {
  return (
    <article className="d-flex flex-column justify-content-around flex-wrap">
      <section className='server-information-child '>
        <div>
          <h3 className="mb-5 text-center">GENERAL</h3>
        </div>
        <div className="d-flex justify-content-around align-items-center flex-wrap gap-3">
          <p className="d-block m-0"><strong>HOSTNAME:</strong> {modalInformation.NOMBRE}</p>
          {/*<i className="d-block">Ultima Actualización | 04/10/2023 14:12:23</i>
          <button className="btn btn-sm btn-primary d-block">Actualizar</button>*/}
        </div>
      </section>
      <section className='server-information-child'>
        <div>
          <h3 className='mb-5 text-center'>ESPECIFICACIONES DEL SERVIDOR</h3>
        </div>
        <div className="d-flex justify-content-around align-items-center gap-0 gap-xl-8">
          <div>
            <ul className="list-unstyled specifications_list">
              <li>
                <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/server.svg")} width={20} height={20} />
                <strong> RAM: </strong>
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.RAM_ASIGNADO || " Sin Registro"
                }
              </li>
              <li>
                <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/sistema-operativo.svg")} width={20} height={20} />
                <strong> SISTEMA OPERATIVO: </strong>
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.VERSION_SW || " Sin Registro"
                }
              </li>
              <li>
                <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/almacenamiento.svg")} width={20} height={20} />
                <strong> ALMACENAMIENTO: </strong>
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.DISK_ASIGNADO || " Sin Registro"
                }
              </li>
            </ul>
          </div>
          <div>
            <ul className="list-unstyled specifications_list">
              <li>
                <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/codificacion.svg")} width={20} height={20} />
                <strong> IP ADDRESS: </strong>
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.NRO_IP || " Sin Registro"
                }
              </li>
              <li>
                <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/monitoreo.svg")} width={20} height={20} />
                <strong> DIRECION MAC: </strong>
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.VERSION_SW || " Sin Registro"
                }
              </li>
              <li>
                <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/services.svg")} width={20} height={20} />
                <strong> CPU: </strong>
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.CPU_DESCRIPCION || " Sin Registro"
                }
              </li>
            </ul>
          </div>
        </div>
      </section>
    </article>
  )
}
export { ServerSpecifications }