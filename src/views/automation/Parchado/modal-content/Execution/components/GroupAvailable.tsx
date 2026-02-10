import { FC } from "react"
import { IGroupsWithServersWithPatchesFront } from "../../../../Types"
import { UnCheckGroup } from "../transformFormat"

type Props = {
  group: IGroupsWithServersWithPatchesFront,
  setGroupsServersPatchesFront: (value: React.SetStateAction<IGroupsWithServersWithPatchesFront[]>) => void,
  groupIndex: number
}

const GroupAvailable: FC<Props> = ({ group, setGroupsServersPatchesFront, groupIndex }) => {
  return (
    <li key={group.ID_GRUPO} style={{ listStyle: "none" }}>
      <label className="form-label cursor-pointer">
        <input
          type="checkbox"
          className="form-check-input"
          checked={group.CHECK}
          onChange={() => setGroupsServersPatchesFront((prev) => (UnCheckGroup(prev, groupIndex)))}
        />
        {" " + group.NOMBRE}
      </label>
    </li>
  )
}
export { GroupAvailable }