import { useWindowsPatchContext } from "../Context"
import { KTSVG } from "../../../../helpers"
import { Tab, Tabs } from "../../../../components/Tabs"
import { TemplateConfiguration } from "./Template/TemplateConfiguration"
import { GroupConfiguration } from "./Group/GroupConfiguration"
import { FC, useEffect } from "react"
import { OPERATE_SYSTEMS } from "../../Types"

type Props = { OPERATE_SYSTEM_ENV: OPERATE_SYSTEMS }

const GroupAndTemplate: FC<Props> = ({ OPERATE_SYSTEM_ENV }) => {

  const { modalHook, templateHook, groupHook } = useWindowsPatchContext()

  useEffect(() => {
    templateHook.getListTemplate(OPERATE_SYSTEM_ENV)
    templateHook.getListAWXRoutines(OPERATE_SYSTEM_ENV === 'LINUX')
    groupHook.getListGroups(OPERATE_SYSTEM_ENV)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className='modal-header py-4'>
        <h2>GRUPOS Y PLANTILLAS</h2>
        <div className='btn btn-sm btn-icon btn-active-color-primary' onClick={() => modalHook.closeModal()}>
          <KTSVG className='svg-icon-1' path='/media/icons/duotune/arrows/arr061.svg' />
        </div>
      </div>
      <div className='modal-body p-8 pt-0'>
        <Tabs>
          <Tab title="Plantillas de Ejecución">
            <TemplateConfiguration OPERATE_SYSTEM_ENV={OPERATE_SYSTEM_ENV} />
          </Tab>
          <Tab title="Grupos">
            <GroupConfiguration OPERATE_SYSTEM_ENV={OPERATE_SYSTEM_ENV} />
          </Tab>
        </Tabs>
      </div>
    </>
  )
}
export { GroupAndTemplate }