import { FC } from "react"

type LoadingProps = {
    loadingText: string
}

const Loading: FC<LoadingProps> = ({ loadingText }) => {
    return (
        <div className=" m-10 d-flex justify-content-center flex-column gap-10 align-items-center" style={{ color: "#747264" }}>
            <div className="spinner-border" role="status"></div>
            <span>{loadingText}</span>
        </div>
    )
}

const Loader: FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`spinner-border ${className}`} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    )
}

export { Loading, Loader }