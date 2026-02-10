import { FC } from "react"
import { IGroupsWithServersWithPatchesFront, IPatchesInServerFront, IServerInGroupFront } from "../../../../Types"

type Props = { group: IGroupsWithServersWithPatchesFront }

const GroupResume: FC<Props> = ({ group }) => {
  return (
    <div key={group.ID_GRUPO}>
      <h3>{group.NOMBRE}</h3>
      <ul>
        {group.SERVIDORES.map((servidor: IServerInGroupFront) => (
          <li key={servidor.ID_EQUIPO}>
            {servidor.NOMBRE_CI}
            <ul>
              {servidor.PARCHES
                .filter((server: IPatchesInServerFront) => server.CHECK)
                .map((parche) => (
                  <li key={parche.ID_PARCHE}>{parche.TITULO}</li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
export { GroupResume }