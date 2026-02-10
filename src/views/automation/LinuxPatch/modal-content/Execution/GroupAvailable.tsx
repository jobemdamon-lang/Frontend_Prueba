import { FC } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import uniqid from "uniqid"

type Props = {
    checked: boolean,
    groupName: string,
    onChange: (value: boolean) => void,
    templateSteps?: string[],
    servers?: string[]
}

const GroupAvailable: FC<Props> = ({ checked, groupName, onChange, templateSteps, servers }) => {
    return (
        <li className="d-flex justify-content-between align-items-center pt-2">
            <label className="form-label cursor-pointer m-0 fw-light" htmlFor={groupName}>
                {groupName.toUpperCase()}
            </label>
            <div className="d-flex gap-2 align-items-center">
                <input
                    type="checkbox"
                    checked={checked}
                    id={groupName}
                    onChange={(event) => {
                        onChange(event.target.checked)
                    }}
                    style={{ borderColor: '#C7C8CC' }}
                    className="form-check-input flex-shrink-0"
                />
                <div className="d-flex gap-2">
                    {templateSteps &&
                        <OverlayTrigger placement='right-end' overlay={TemplateInfo(templateSteps)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-square-fill" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                            </svg>
                        </OverlayTrigger>
                    }
                    {servers &&
                        <OverlayTrigger placement='right-end' overlay={ServersInfo(servers)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hdd-rack" viewBox="0 0 16 16">
                                <path d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1M3 4.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m2 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-2.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                                <path d="M2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v2H2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1V7h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm13 2v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1m0 7v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1m-3-4v2H4V7z" />
                            </svg>
                        </OverlayTrigger>
                    }
                </div>
            </div>
        </li>
    )
}


const TemplateInfo = (templateSteps: string[]) => {
    return (
        <Tooltip id="tooltip-actions">
            <h6 className="fs-6 fw-normal">PLANTILLA</h6>
            <ol>
                {templateSteps.map(step => <li key={uniqid()}>{step}</li>)}
            </ol>
        </Tooltip>
    )
}

const ServersInfo = (servers: string[]) => {
    return (
        <Tooltip id="tooltip-actions">
            <h6 className="fs-6 fw-normal">SERVIDORES</h6>
            <ul>
                {servers.map(server => <li key={uniqid()}>{server}</li>)}
            </ul>
        </Tooltip>
    )
}

export { GroupAvailable }