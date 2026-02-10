import { FC } from "react"
import { KTSVG } from "../../../../helpers/components/KTSVG"

type Props = {
  children: any,
  title: string,
  show?: boolean
}

const Accordion: FC<Props> = ({ children, title, show }) => {
  return (
    <div
      className="accordion accordion-icon-toggle"
      id={`kt_accordion_1${title.replace(/ /g, '')}`}
    >
      <div className="mb-5">
        <div
          className="accordion-header p-5 d-flex rounded"
          data-bs-toggle="collapse"
          data-bs-target={`#kt_accordion_${title.replace(/ /g, '')}_item_1`}
          style={{backgroundColor: "#D2E9E9"}}
        >
          <span className="accordion-icon">
            <KTSVG
              className="svg-icon svg-icon-4"
              path="/media/icons/duotune/arrows/arr064.svg"
            />
          </span>
          <h3 className="fs-4 text-gray-800 fw-bold mb-0 ms-4">
            {title}
          </h3>
        </div>
        <div
          id={`kt_accordion_${title.replace(/ /g, '')}_item_1`}
          className={`fs-6 rounded-bottom collapse ps-10 ${show ? "show" : ""}`}
          style={{border: "2px solid #E7F6F2", borderTop: "none"}}
          data-bs-parent={`#kt_accordion_1${title.replace(/ /g, '')}`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
export { Accordion }