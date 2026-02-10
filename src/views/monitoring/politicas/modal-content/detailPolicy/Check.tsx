import { FC } from "react"

type Props = {
  isChecked: boolean
}
const Check: FC<Props> = ({ isChecked }) => {
  return (
    <div className={`form-check form-check-custom form-check-success form-check-solid`}>
      <input className="form-check-input" type="checkbox" value="" defaultChecked={isChecked} />
    </div>
  )
}
export { Check }