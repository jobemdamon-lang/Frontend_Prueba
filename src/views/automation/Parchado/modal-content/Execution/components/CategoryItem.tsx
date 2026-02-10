import { FC } from "react"
import uniqid from "uniqid"
import { ICategories } from "../../../../Types"

type Props = {
  handleCheckCategory: Function,
  category: ICategories
}

const CategoryItem: FC<Props> = ({ handleCheckCategory, category }) => {
  return (
    <label
      className="form-label cursor-pointer text-nowrap"
      key={uniqid()}
    >
      <input
        type="checkbox"
        className="form-check-input"
        checked={category.checked}
        onChange={(event) => {
          handleCheckCategory(event.target.checked, category.categoryName)
        }}
      />
      {" " + category.categoryName}
    </label>
  )
}
export { CategoryItem }