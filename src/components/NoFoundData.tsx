import { FC } from "react"
import { toAbsoluteUrl } from "../helpers"
import SVG from "react-inlinesvg"

type ComponenProps = {
    message: string,
    height?: number,
    width?: number
}
const NoFoundData: FC<ComponenProps> = ({ message, width = 180, height = 180 }) => {
    return (
        <div
            style={{ opacity: 0.7 }}
            className="h-100 d-flex flex-column justify-content-center align-items-center"
        >
            <SVG
                src={toAbsoluteUrl("/media/svg/illustrations/easy/empty.svg")}
                width={width}
                height={height}
            />
            <span className="my-10 ">
                <strong className="fw-normal fs-3 mt-5" style={{ color: "#444444" }}>{message}</strong>
            </span>
        </div>
    )
}

export { NoFoundData }