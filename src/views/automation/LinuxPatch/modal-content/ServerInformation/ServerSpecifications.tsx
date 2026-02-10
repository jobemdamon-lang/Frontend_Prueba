import SVG from 'react-inlinesvg'
import { toAbsoluteUrl } from "../../../../../helpers"
import { IListServerAssignedLinux, IServerInformation } from '../../../Types'
import { FC } from 'react'

type Props = {
  getServersInfoLoading: boolean,
  serverInformationData: IServerInformation,
  modalInformation: IListServerAssignedLinux
}

const ServerSpecifications: FC<Props> = ({
  getServersInfoLoading,
  serverInformationData,
  modalInformation
}) => {

  return (
    <article className="d-flex flex-column justify-content-around flex-wrap gap-5 flex-grow-1">
      <section className="d-flex justify-content-around align-items-center flex-wrap gap-3 shadow-sm p-10 bg-body rounded">
        <p className="d-block m-0 text-center">
          <span className='fw-bold fs-5'>HOSTNAME</span> <br />
          {modalInformation.NOMBRE.toUpperCase()}
        </p>
        <p className="d-block m-0 text-center">
          <span className='fw-bold fs-5'>NOMBRE CI</span> <br />
          {modalInformation.NOMBRE_CI.toUpperCase()}
        </p>
        <p className="d-block m-0 text-center">
          <span className='fw-bold fs-5'>NRO IP</span>  <br />
          {modalInformation.NRO_IP.toUpperCase()}
        </p>
      </section>
      <section className='shadow-sm p-10 bg-body rounded'> 
        <h3 className='mb-10 text-center'>ESPECIFICACIONES DEL SERVIDOR</h3>
        <div className="d-flex justify-content-around align-items-center gap-5">
          <ul className='list-unstyled d-flex flex-column gap-5'>
            <li className='d-flex gap-5'>
              <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/server.svg")} width={50} height={50} />
              <div>
                <span className='fw-bold fs-3'>RAM</span> <br />
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.RAM_ASIGNADO || " Sin Registro"
                }
              </div>
            </li>
            <li className='d-flex gap-5'>
              <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/sistema-operativo.svg")} width={50} height={50} />
              <div>
                <span className='fw-bold fs-3'>SISTEMA OPERATIVO</span> <br />
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.VERSION_SW || " Sin Registro"
                }
              </div>
            </li>
            <li className='d-flex gap-5'>
              <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/almacenamiento.svg")} width={50} height={50} />
              <div>
                <span className='fw-bold fs-3'>ALMACENAMIENTO</span> <br />
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.DISK_ASIGNADO || " Sin Registro"
                }
              </div>
            </li>
          </ul>
          <ul className='list-unstyled d-flex flex-column gap-5'>
            <li className='d-flex gap-5'>
              <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/codificacion.svg")} width={50} height={50} />
              <div>
                <span className='fw-bold fs-3'>IP ADDRESS</span> <br />
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.NRO_IP || " Sin Registro"
                }
              </div>
            </li>
            <li className='d-flex gap-5'>
              <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/monitoreo.svg")} width={50} height={50} />
              <div>
                <span className='fw-bold fs-3'>DIRECCIÓN MAC</span> <br />
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.VERSION_SW || " Sin Registro"
                }
              </div>
            </li>
            <li className='d-flex gap-5'>
              <SVG src={toAbsoluteUrl("/media/icons/duotune/cmdb/services.svg")} width={50} height={50} />
              <div>
                <span className='fw-bold fs-3'>CPU</span> <br />
                {getServersInfoLoading ?
                  "Cargando..." :
                  serverInformationData?.informacion?.CPU_DESCRIPCION || " Sin Registro"
                }
              </div>
            </li>
          </ul>
        </div>
      </section>
    </article>
  )
}
export { ServerSpecifications }